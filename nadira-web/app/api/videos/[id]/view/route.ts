import { NextRequest, NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';

// POST /api/videos/[id]/view — засчитать просмотр
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

    await db.query(
      'UPDATE videos SET views_count = views_count + 1 WHERE id = $1',
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка просмотра:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
