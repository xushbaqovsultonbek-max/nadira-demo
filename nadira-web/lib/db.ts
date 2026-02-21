import { Pool } from 'pg';

// Пул соединений с PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// SQL миграция — создание таблицы videos при первом запуске
const MIGRATION_SQL = `
  CREATE TABLE IF NOT EXISTS videos (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER DEFAULT 1,
    username       VARCHAR(50)  NOT NULL DEFAULT 'anonymous',
    avatar_url     TEXT         NOT NULL DEFAULT '',
    video_url      TEXT         NOT NULL,
    thumbnail_url  TEXT         NOT NULL DEFAULT '',
    description    TEXT         NOT NULL DEFAULT '',
    product_url    TEXT         NOT NULL DEFAULT '',
    views_count    INTEGER      NOT NULL DEFAULT 0,
    likes_count    INTEGER      NOT NULL DEFAULT 0,
    comments_count INTEGER      NOT NULL DEFAULT 0,
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW()
  );
  ALTER TABLE videos ADD COLUMN IF NOT EXISTS product_url TEXT NOT NULL DEFAULT '';
`;

// Флаг — миграция уже выполнена в этом процессе
let dbInitialized = false;

// Автоматическая инициализация БД при первом обращении
export async function initDB(): Promise<void> {
  if (dbInitialized) return;
  await pool.query(MIGRATION_SQL);
  dbInitialized = true;
  console.log('✓ База данных инициализирована');
}

// Тип строки таблицы videos
export interface VideoRow {
  id: number;
  user_id: number;
  username: string;
  avatar_url: string;
  video_url: string;
  thumbnail_url: string;
  description: string;
  product_url: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

// Обёртка для выполнения запросов
export const db = {
  query: <T = unknown>(text: string, params?: unknown[]) =>
    pool.query(text, params) as Promise<{ rows: T[] }>,
};
