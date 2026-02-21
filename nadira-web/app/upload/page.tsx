'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Допустимые форматы и размер
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_SIZE_MB = 100;

// Регулярное выражение для извлечения URL из текста
const URL_REGEX = /(https?:\/\/[^\s]+)/;

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [urlCleaned, setUrlCleaned] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Очистка URL превью при размонтировании
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  // Обработка выбранного файла
  const handleFile = useCallback((selected: File) => {
    setError(null);
    const isValidType = ALLOWED_TYPES.includes(selected.type) || /\.(mp4|mov|webm)$/i.test(selected.name);
    if (!isValidType) { setError('Неверный формат. Поддерживаются: MP4, MOV, WebM'); return; }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) { setError(`Файл слишком большой (максимум ${MAX_SIZE_MB} МБ)`); return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }, [previewUrl]);

  // Drag & Drop
  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleRemove = () => {
    setFile(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Авто-очистка ссылки: извлекает только URL из вставленного текста
  const handleProductUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const match = raw.match(URL_REGEX);
    if (match && match[1] !== raw.trim()) {
      setProductUrl(match[1]);
      setUrlCleaned(true);
    } else {
      setProductUrl(raw);
      setUrlCleaned(false);
    }
  };

  // Загрузка на сервер через XHR (для прогресс-бара)
  const handleUpload = () => {
    if (!file) return;
    if (!username.trim()) { setError('Введите имя пользователя'); return; }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('description', description.trim());
    formData.append('username', username.trim());
    formData.append('product_url', productUrl.trim());

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status === 200 && res.success) {
          setSuccess(true);
          setUploading(false);
          setTimeout(() => router.push('/'), 2000);
        } else {
          setError(res.error || 'Ошибка при загрузке');
          setUploading(false);
        }
      } catch {
        setError('Ошибка ответа сервера');
        setUploading(false);
      }
    };

    xhr.onerror = () => { setError('Ошибка соединения с сервером'); setUploading(false); };

    xhr.open('POST', '/api/videos/upload');
    xhr.send(formData);
    setUploading(true);
    setProgress(0);
    setError(null);
  };

  const canUpload = !!file && !!username.trim() && !uploading;

  // ── Экран успеха ──
  if (success) {
    return (
      <div className="upload-success">
        <div className="upload-success-icon">✓</div>
        <p style={{ color: '#fff', fontSize: 'var(--font-xl)', fontWeight: 700 }}>Видео опубликовано!</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--font-md)' }}>Перенаправление на главную…</p>
        <div style={{ width: 40, height: 3, borderRadius: 2, background: '#333', overflow: 'hidden', marginTop: 8 }}>
          <div style={{ height: '100%', background: '#FFE600', animation: 'progressGo 2s linear forwards', width: '0%' }} />
        </div>
        <style>{`@keyframes progressGo { to { width: 100%; } }`}</style>
      </div>
    );
  }

  return (
    <div className="upload-page">
      <div className="upload-inner">

        {/* ── Шапка ── */}
        <div className="upload-header">
          <button className="upload-back-btn" onClick={() => router.push('/')}>‹</button>
          <h1 className="upload-title">Новый обзор</h1>
        </div>

        {/* ── Скроллируемый контент ── */}
        <div className="upload-scroll">

          {/* Зона загрузки / превью */}
          {previewUrl ? (
            <div className="upload-preview">
              <video src={previewUrl} controls playsInline />
              <button className="upload-preview-remove" onClick={handleRemove}>✕</button>
              <div className="upload-preview-meta">
                {file?.name} · {(file!.size / 1024 / 1024).toFixed(1)} МБ
              </div>
            </div>
          ) : (
            <div
              className={`drop-zone${dragOver ? ' drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="drop-zone-icon">⬆</div>
              <p className="drop-zone-title">Загрузить видео</p>
              <p className="drop-zone-sub">Перетащите или нажмите для выбора</p>
              <p className="drop-zone-hint">MP4, MOV, WebM · до {MAX_SIZE_MB} МБ</p>
              <input ref={fileInputRef} type="file"
                accept="video/mp4,video/webm,.mov,.mp4,.webm"
                onChange={handleInputChange} style={{ display: 'none' }} />
            </div>
          )}

          {/* Форма */}
          <div className="upload-form">

            {/* Имя пользователя */}
            <div className="upload-field">
              <label className="upload-label">Имя пользователя</label>
              <input
                className="upload-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ваше имя или @username"
                maxLength={50}
              />
            </div>

            {/* Описание */}
            <div className="upload-field">
              <label className="upload-label">Описание</label>
              <textarea
                className="upload-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Расскажите о товаре..."
                maxLength={300}
              />
              <span className="upload-char-count">{description.length}/300</span>
            </div>

            {/* Ссылка на товар */}
            <div className="upload-field">
              <label className="upload-label">
                Ссылка на товар{' '}
                <span className="upload-label-opt">(необязательно)</span>
              </label>
              <div className="upload-input-icon-wrap">
                <span className="upload-input-icon">🛒</span>
                <input
                  className="upload-input"
                  value={productUrl}
                  onChange={handleProductUrlChange}
                  placeholder="https://uzum.uz/..."
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
              {urlCleaned && (
                <p className="upload-url-cleaned">✓ Ссылка очищена автоматически</p>
              )}
            </div>
          </div>

          {/* Ошибка */}
          {error && <div className="upload-error">{error}</div>}

          {/* Прогресс загрузки */}
          {uploading && (
            <div className="upload-progress-wrap">
              <div className="upload-progress-header">
                <span className="upload-progress-label">Загрузка…</span>
                <span className="upload-progress-pct">{progress}%</span>
              </div>
              <div className="upload-progress-bar">
                <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Кнопка публикации */}
          <button
            className={`upload-submit-btn ${canUpload ? 'active' : 'disabled'}`}
            onClick={handleUpload}
            disabled={!canUpload}
          >
            {uploading ? (
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: '3px solid rgba(0,0,0,0.2)', borderTopColor: '#000', animation: 'spin 0.7s linear infinite' }} />
            ) : (
              <>✓ Опубликовать</>
            )}
          </button>

        </div>
      </div>

      <style>{`@keyframes progressGo { to { width: 100%; } }`}</style>
    </div>
  );
}
