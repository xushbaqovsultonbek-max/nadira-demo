import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { db, initDB } from '@/lib/db';

// Увеличиваем таймаут для больших файлов
export const maxDuration = 60;

// POST /api/videos/upload — загрузка видео на сервер
export async function POST(request: NextRequest) {
  try {
    await initDB();

    const formData = await request.formData();
    const videoFile = formData.get('video') as File | null;
    const description = (formData.get('description') as string | null) ?? '';
    const username    = (formData.get('username')    as string | null) ?? 'anonymous';
    const productUrl  = (formData.get('product_url') as string | null) ?? '';

    // Проверка наличия файла
    if (!videoFile || videoFile.size === 0) {
      return NextResponse.json(
        { error: 'Видео файл не найден' },
        { status: 400 }
      );
    }

    // Проверка размера (максимум 100 МБ)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (videoFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Файл слишком большой (максимум 100 МБ)' },
        { status: 400 }
      );
    }

    // Проверка формата файла
    const isValidType =
      ['video/mp4', 'video/webm', 'video/quicktime'].includes(videoFile.type) ||
      /\.(mp4|mov|webm)$/i.test(videoFile.name);

    if (!isValidType) {
      return NextResponse.json(
        { error: 'Неверный формат. Поддерживаются: MP4, MOV, WebM' },
        { status: 400 }
      );
    }

    // Создание папки для загрузок если не существует
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    await mkdir(uploadDir, { recursive: true });

    // Генерация уникального имени файла
    const ext = videoFile.name.split('.').pop()?.toLowerCase() ?? 'mp4';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Запись файла на диск
    const bytes = await videoFile.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const videoUrl = `/uploads/videos/${filename}`;

    // Сохранение записи в базу данных (включая ссылку на товар)
    const result = await db.query(
      `INSERT INTO videos (username, video_url, description, product_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        username.trim()   || 'anonymous',
        videoUrl,
        description.trim(),
        productUrl.trim(),
      ]
    );

    return NextResponse.json({ success: true, video: result.rows[0] });
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке видео' },
      { status: 500 }
    );
  }
}
