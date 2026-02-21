import { NextResponse } from 'next/server';
import { db, initDB, VideoRow } from '@/lib/db';

// GET /api/videos — получение всех видео, новые первыми
export async function GET() {
  try {
    await initDB();
    const result = await db.query<VideoRow>(
      'SELECT * FROM videos ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения видео:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить видео' },
      { status: 500 }
    );
  }
}
