'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Тип данных видео из базы
interface VideoItem {
  id: number;
  username: string;
  avatar_url: string;
  video_url: string;
  description: string;
  product_url: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
}

// Форматирование числа (1200 → 1.2K)
function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ── SVG иконки ──
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? '#ff2d55' : 'none'} stroke={filled ? '#ff2d55' : '#fff'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CommentIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? '#FFE600' : 'none'} stroke={filled ? '#FFE600' : '#fff'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const ShareIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 17 20 12 15 7" /><path d="M4 18v-2a4 4 0 0 1 4-4h12" />
  </svg>
);
const DotsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
    <circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" />
  </svg>
);
const VolumeOnIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);
const VolumeOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);
const GhostIcon = ({ active }: { active: boolean }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? '#fff' : 'rgba(255,255,255,0.45)'}>
    <path d="M12 2C7.03 2 3 6.03 3 11v8l3-2 2 2 2-2 2 2 2-2 3 2v-8c0-4.97-4.03-9-9-9zm-3 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
  </svg>
);
const SearchIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'rgba(255,255,255,0.45)'} strokeWidth="2.2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const PlusIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const FavIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#fff' : 'none'} stroke={active ? '#fff' : 'rgba(255,255,255,0.45)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'rgba(255,255,255,0.45)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

// Опции контекстного меню
const MENU_OPTIONS = [
  { icon: '🔗', label: 'Скопировать ссылку' },
  { icon: '🚫', label: 'Не интересует' },
  { icon: '⚑',  label: 'Пожаловаться' },
];

export default function FeedPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [subscribedIds, setSubscribedIds] = useState<Set<number>>(new Set());
  const [unmutedId, setUnmutedId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [menuVideoId, setMenuVideoId] = useState<number | null>(null);

  const videoEls    = useRef<Map<number, HTMLVideoElement>>(new Map());
  const cardEls     = useRef<Map<number, HTMLDivElement>>(new Map());
  const progressEls = useRef<Map<number, HTMLDivElement>>(new Map());
  const viewedIds   = useRef<Set<number>>(new Set());

  // Показать уведомление
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Загрузка видео из API
  useEffect(() => {
    fetch('/api/videos')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: VideoItem[]) => { setVideos(data); setLoading(false); })
      .catch(() => { showToast('Не удалось загрузить видео'); setLoading(false); });
  }, [showToast]);

  // IntersectionObserver — автовоспроизведение при скролле
  useEffect(() => {
    if (videos.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = Number(entry.target.getAttribute('data-vid'));
        const video = videoEls.current.get(id);
        if (!video) return;

        if (entry.isIntersecting) {
          videoEls.current.forEach((v, vid) => {
            if (vid !== id) { v.pause(); v.currentTime = 0; }
          });
          video.muted = true;
          setUnmutedId(null);
          setMenuVideoId(null);
          video.play().catch(() => {});

          if (!viewedIds.current.has(id)) {
            viewedIds.current.add(id);
            fetch(`/api/videos/${id}/view`, { method: 'POST' });
            setVideos((p) => p.map((v) => v.id === id ? { ...v, views_count: v.views_count + 1 } : v));
          }
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    }, { threshold: 0.8 });

    cardEls.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [videos]);

  // Лайк с оптимистичным обновлением
  const handleLike = useCallback(async (id: number) => {
    const wasLiked = likedIds.has(id);
    setLikedIds((p) => { const n = new Set(p); wasLiked ? n.delete(id) : n.add(id); return n; });
    setVideos((p) => p.map((v) => v.id === id ? { ...v, likes_count: v.likes_count + (wasLiked ? -1 : 1) } : v));
    if (!wasLiked) fetch(`/api/videos/${id}/like`, { method: 'POST' });
  }, [likedIds]);

  // Переключение звука
  const handleMute = useCallback((id: number) => {
    const video = videoEls.current.get(id);
    if (!video) return;
    video.muted = !video.muted;
    setUnmutedId(video.muted ? null : id);
  }, []);

  // Открыть/закрыть контекстное меню — stopPropagation чтобы не сработал mute
  const handleOpenMenu = useCallback((e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setMenuVideoId((prev) => (prev === id ? null : id));
  }, []);

  const handleCloseMenu = useCallback(() => setMenuVideoId(null), []);

  // Действие из меню
  const handleMenuAction = useCallback((label: string) => {
    setMenuVideoId(null);
    if (label === 'Скопировать ссылку') {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      showToast('Ссылка скопирована');
    } else if (label === 'Не интересует') {
      showToast('Видео скрыто');
    } else if (label === 'Пожаловаться') {
      showToast('Жалоба отправлена');
    }
  }, [showToast]);

  // Прогресс-бар видео
  const attachProgressListener = useCallback((id: number, el: HTMLVideoElement) => {
    el.addEventListener('timeupdate', () => {
      const bar = progressEls.current.get(id);
      if (bar && el.duration) {
        bar.style.width = `${(el.currentTime / el.duration) * 100}%`;
      }
    });
  }, []);

  // ── Экран загрузки ──
  if (loading) {
    return (
      <div style={{ height: '100svh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  // ── Пустая лента ──
  if (videos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-emoji">📹</span>
        <p className="empty-state-title">Нет видео</p>
        <p className="empty-state-sub">Будьте первым, кто опубликует обзор!</p>
        <button className="empty-state-btn" onClick={() => router.push('/upload')}>
          Загрузить видео
        </button>
        <BottomNav current="home" onUpload={() => router.push('/upload')} />
      </div>
    );
  }

  // ── Основная лента ──
  return (
    <div style={{ position: 'relative', background: '#000' }}>

      <div className="feed-container" style={{ paddingBottom: 60 }}>
        {videos.map((video) => {
          const isLiked      = likedIds.has(video.id);
          const isSaved      = savedIds.has(video.id);
          const isSubscribed = subscribedIds.has(video.id);
          const isUnmuted    = unmutedId === video.id;
          const isMenuOpen   = menuVideoId === video.id;

          return (
            <div key={video.id} className="video-card" data-vid={video.id}
              ref={(el) => { if (el) cardEls.current.set(video.id, el); }}>

              {/* ── Видео ── */}
              <video
                ref={(el) => {
                  if (el) {
                    videoEls.current.set(video.id, el);
                    attachProgressListener(video.id, el);
                  }
                }}
                src={video.video_url}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loop playsInline muted
                onClick={() => handleMute(video.id)}
              />

              {/* Фиолетовое свечение сверху */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '18%', maxHeight: 120, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(139,92,246,0.28) 0%, transparent 100%)' }} />

              {/* Нижний градиент */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', maxHeight: 480, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 65%, transparent 100%)' }} />

              {/* ── Правые кнопки действий ── */}
              <div className="feed-right-actions">

                <button className="feed-action-btn" onClick={() => handleLike(video.id)}>
                  <HeartIcon filled={isLiked} />
                  <span className="feed-action-count">{fmt(video.likes_count)}</span>
                </button>

                <button className="feed-action-btn">
                  <CommentIcon />
                  <span className="feed-action-count">{fmt(video.comments_count)}</span>
                </button>

                <button className="feed-action-btn"
                  onClick={() => setSavedIds((p) => { const n = new Set(p); n.has(video.id) ? n.delete(video.id) : n.add(video.id); return n; })}>
                  <BookmarkIcon filled={isSaved} />
                  <span className="feed-action-count">{fmt(isSaved ? 988 : 987)}</span>
                </button>

                <button className="feed-action-btn"><ShareIcon /></button>

                {/* Три точки — открывает меню, stopPropagation предотвращает mute */}
                <button className="feed-action-btn" onClick={(e) => handleOpenMenu(e, video.id)}>
                  <DotsIcon />
                </button>

                <button className="feed-action-btn" onClick={() => handleMute(video.id)}>
                  {isUnmuted ? <VolumeOnIcon /> : <VolumeOffIcon />}
                </button>
              </div>

              {/* ── Нижний левый: пользователь ── */}
              <div className="feed-bottom-left">

                <div className="feed-user-row">
                  {/* Аватар */}
                  <div className="feed-avatar">
                    {video.avatar_url
                      ? <img src={video.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : video.username.slice(0, 1).toUpperCase()}
                  </div>

                  <span className="feed-username">@{video.username}</span>

                  <button
                    className="feed-subscribe-btn"
                    style={isSubscribed ? { borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.12)' } : undefined}
                    onClick={() => setSubscribedIds((p) => { const n = new Set(p); n.has(video.id) ? n.delete(video.id) : n.add(video.id); return n; })}>
                    {isSubscribed ? 'Вы подписаны' : 'Подписаться'}
                  </button>
                </div>

                <span className="feed-views">{fmt(video.views_count)} просмотров</span>

                {video.description && (
                  <p className="feed-description">{video.description}</p>
                )}
              </div>

              {/* ── Баннер ссылки на товар ── */}
              {video.product_url && (
                <a className="feed-product-banner"
                  href={video.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}>
                  <span style={{ fontSize: '1em' }}>🛒</span>
                  <span className="feed-product-text">Купить товар</span>
                  <span style={{ color: 'rgba(255,230,0,0.6)', fontSize: '0.85em' }}>→</span>
                </a>
              )}

              {/* ── Прогресс-бар ── */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.18)', zIndex: 20 }}>
                <div ref={(el) => { if (el) progressEls.current.set(video.id, el); }}
                  style={{ height: '100%', background: 'rgba(255,255,255,0.75)', width: '0%', transition: 'width 0.25s linear' }} />
              </div>

              {/* ── Контекстное меню ── */}
              {isMenuOpen && (
                <>
                  <div className="context-backdrop" onClick={handleCloseMenu} />
                  <div className="context-sheet" onClick={(e) => e.stopPropagation()}>
                    <div className="context-handle" />

                    {MENU_OPTIONS.map((opt) => (
                      <button key={opt.label} className="context-menu-btn"
                        onClick={() => handleMenuAction(opt.label)}>
                        <span className="context-menu-icon">{opt.icon}</span>
                        {opt.label}
                      </button>
                    ))}

                    <button className="context-menu-btn close" onClick={handleCloseMenu}>
                      <span className="context-menu-icon">✕</span>
                      Закрыть
                    </button>
                  </div>
                </>
              )}

            </div>
          );
        })}
      </div>

      <BottomNav current="home" onUpload={() => router.push('/upload')} />

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ── Нижняя навигация ──
function BottomNav({ current, onUpload }: { current: string; onUpload: () => void }) {
  return (
    <nav className="bottom-nav">
      <button className="nav-btn"><GhostIcon active={current === 'home'} /></button>
      <button className="nav-btn"><SearchIcon active={current === 'search'} /></button>
      <button className="nav-upload-btn" onClick={onUpload}><PlusIcon /></button>
      <button className="nav-btn"><FavIcon active={current === 'likes'} /></button>
      <button className="nav-btn"><ProfileIcon active={current === 'profile'} /></button>
    </nav>
  );
}
