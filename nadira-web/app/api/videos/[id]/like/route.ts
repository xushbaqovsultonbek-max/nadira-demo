import { NextRequest, NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';

// POST /api/videos/[id]/like — лайк видео
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDB();

    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Неверный ID' }, { status: 400 });
    }

    const result = await db.query<{ likes_count: number }>(
      `UPDATE videos
       SET likes_count = likes_count + 1
       WHERE id = $1
       RETURNING likes_count`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Видео не найдено' }, { status: 404 });
    }

    return NextResponse.json({ likes_count: result.rows[0].likes_count });
  } catch (error) {
    console.error('Ошибка лайка:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
