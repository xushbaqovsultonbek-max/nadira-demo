'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile, formatNum } from '@/lib/profile-context';

// Иконки навигации (те же что в main feed)
function HomeIcon()    { return <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function SearchIcon()  { return <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function PlusIcon()    { return <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function HeartIcon()   { return <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function BellIcon()    { return <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function ShareIcon()   { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>; }

// Макет видео для сетки профиля
const MOCK_VIBES = [
  { id: 1, views: '23K', bg: '#1e1a2e' },
  { id: 2, views: '8.2K', bg: '#1a1e2e' },
  { id: 3, views: '45K', bg: '#2e1a1e' },
  { id: 4, views: '12K', bg: '#1a2e1e' },
  { id: 5, views: '67K', bg: '#2e2a1a' },
  { id: 6, views: '3.1K', bg: '#1e2e2a' },
];

// Нижняя навигация профиля
function BottomNav() {
  const router = useRouter();
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(15,15,19,0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 100,
    }}>
      <button onClick={() => router.push('/')} style={navBtnStyle}><HomeIcon /></button>
      <button style={navBtnStyle}><SearchIcon /></button>
      <button
        onClick={() => router.push('/upload')}
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 60, background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <div style={{
          width: 44, height: 30, borderRadius: 8,
          background: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#000',
        }}>
          <PlusIcon />
        </div>
      </button>
      <button style={navBtnStyle}><HeartIcon /></button>
      <button style={{ ...navBtnStyle, color: '#8B5CF6' }}><svg width="22" height="22" fill="#8B5CF6" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></button>
    </nav>
  );
}

const navBtnStyle: React.CSSProperties = {
  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
  height: 60, background: 'none', border: 'none', cursor: 'pointer',
  color: 'rgba(255,255,255,0.45)',
};

// ── Главная страница профиля ──
export default function ProfilePage() {
  const router = useRouter();
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState<'vibes' | 'articles' | 'saved'>('vibes');

  return (
    <div style={{ background: '#0f0f13', minHeight: '100svh', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', overflowY: 'auto', paddingBottom: 80 }}>

      {/* ── Шапка ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 20px 12px', position: 'relative' }}>
        <span style={{ fontSize: 16, fontWeight: 600 }}>{profile.username}</span>
        <button style={{ position: 'absolute', right: 20, background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 4 }}>
          <BellIcon />
        </button>
      </div>

      {/* ── Аватар + имя + bio ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 20px 16px' }}>
        <div style={{
          width: 84, height: 84, borderRadius: '50%',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, marginBottom: 12, overflow: 'hidden',
          boxShadow: '0 0 0 3px rgba(139,92,246,0.3)',
        }}>
          {profile.avatar
            ? <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : '👤'}
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{profile.name}</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 240, lineHeight: 1.5 }}>{profile.bio}</p>
      </div>

      {/* ── Статистика ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center', padding: '0 12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { value: formatNum(profile.stats.following), label: 'Подписки' },
          { value: formatNum(profile.stats.followers), label: 'Подписчики' },
          { value: formatNum(profile.stats.likes),     label: 'Лайки' },
          { value: formatNum(profile.stats.views),     label: 'Просмотры' },
        ].map(stat => (
          <div key={stat.label} style={{ padding: '8px 4px' }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Кнопки действий ── */}
      <div style={{ display: 'flex', gap: 8, padding: '16px 16px 20px', alignItems: 'center' }}>
        <button
          onClick={() => router.push('/profile/settings')}
          style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.18)', background: 'transparent', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Настройки
        </button>
        <button
          style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: 'none', background: '#8B5CF6', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Монетизация
        </button>
        <button style={{
          width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,0.18)',
          background: 'transparent', color: '#fff', display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
        }}>
          <ShareIcon />
        </button>
      </div>

      {/* ── Вкладки ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {(['vibes', 'articles', 'saved'] as const).map((tab, i) => {
          const labels = { vibes: 'Вайбы', articles: 'Статьи', saved: 'Избранное' };
          const isActive = activeTab === tab;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '13px 0', background: 'none', border: 'none',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              borderBottom: isActive ? '2px solid #8B5CF6' : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* ── Сетка вайбов ── */}
      {activeTab === 'vibes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          {MOCK_VIBES.map(v => (
            <div key={v.id} style={{
              aspectRatio: '9/16', background: v.bg,
              position: 'relative', overflow: 'hidden', cursor: 'pointer',
            }}>
              {/* Плашка просмотров */}
              <div style={{
                position: 'absolute', bottom: 8, left: 8,
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 11, color: 'rgba(255,255,255,0.85)',
              }}>
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                {v.views}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Статьи / Избранное — пустое состояние */}
      {activeTab !== 'vibes' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{activeTab === 'saved' ? '🔖' : '📝'}</div>
          <p style={{ fontSize: 14 }}>{activeTab === 'saved' ? 'Нет сохранённых видео' : 'Нет статей'}</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
