'use client';

import { useRouter } from 'next/navigation';
import { useProfile } from '@/lib/profile-context';

// Иконка стрелки вправо
function ChevronRight() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// Строка меню с иконкой и стрелкой
function MenuRow({ icon, label, sublabel, onClick, danger }: {
  icon: string; label: string; sublabel?: string; onClick?: () => void; danger?: boolean;
}) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 20px', background: 'none', border: 'none',
      cursor: onClick ? 'pointer' : 'default', textAlign: 'left',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: danger ? '#FF4B4B' : '#fff' }}>{label}</div>
        {sublabel && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{sublabel}</div>}
      </div>
      {onClick && <span style={{ color: 'rgba(255,255,255,0.3)' }}><ChevronRight /></span>}
    </button>
  );
}

// Карточка монетизации
function EarningsCard({ icon, label, amount, color }: {
  icon: string; label: string; amount: string; color: string;
}) {
  return (
    <div style={{
      flex: 1, background: '#1a1a28', borderRadius: 14, padding: '16px 14px',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{amount}</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>сум</div>
    </div>
  );
}

// ── Страница настроек ──
export default function SettingsPage() {
  const router = useRouter();
  const { profile } = useProfile();

  return (
    <div style={{
      background: '#0f0f13', minHeight: '100svh', color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflowY: 'auto', paddingBottom: 40,
    }}>

      {/* ── Шапка ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 12px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 600 }}>{profile.username}</h1>
      </div>

      {/* ── Данные профиля ── */}
      <div style={{ background: '#1a1a28', borderRadius: 16, margin: '8px 16px 12px' }}>
        <MenuRow icon="👤" label="Данные профиля" sublabel="Имя, фото, bio" onClick={() => router.push('/profile/edit')} />
      </div>

      {/* ── Прогресс профиля ── */}
      <div style={{ margin: '0 16px 12px' }}>
        <div style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Заполненность профиля</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Добавьте фото и bio</div>
            </div>
            <div style={{
              width: 52, height: 52,
              borderRadius: '50%', border: '3px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700,
            }}>50%</div>
          </div>
          {/* Прогресс бар */}
          <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: '50%', height: '100%', background: '#fff', borderRadius: 3 }} />
          </div>
        </div>
      </div>

      {/* ── Монетизация ── */}
      <div style={{ margin: '0 16px 12px' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', padding: '0 4px 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Монетизация</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <EarningsCard icon="👁" label="За просмотры" amount="0" color="#8B5CF6" />
          <EarningsCard icon="🛒" label="За продажи" amount="0" color="#10B981" />
        </div>
      </div>

      {/* ── Контент ── */}
      <div style={{ background: '#1a1a28', borderRadius: 16, margin: '0 16px 12px', overflow: 'hidden' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', padding: '12px 20px 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Контент</div>
        <MenuRow icon="📥" label="Перенос видео" sublabel="Импорт из других платформ" onClick={() => {}} />
        <MenuRow icon="🎬" label="Вайбы" sublabel="Мои публикации" onClick={() => {}} />
        <MenuRow icon="📝" label="Статьи" sublabel="Мои публикации" onClick={() => {}} />
      </div>

      {/* ── Аккаунт ── */}
      <div style={{ background: '#1a1a28', borderRadius: 16, margin: '0 16px 12px', overflow: 'hidden' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', padding: '12px 20px 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Аккаунт</div>
        <MenuRow icon="🔔" label="Уведомления" onClick={() => router.push('/profile/notifications')} />
        <MenuRow icon="🔒" label="Приватность" onClick={() => router.push('/profile/privacy')} />
        <MenuRow icon="❓" label="Помощь" onClick={() => {}} />
        <MenuRow icon="ℹ️" label="О приложении" sublabel="Версия 1.0.0" onClick={() => {}} />
      </div>

      {/* ── Социальные кнопки ── */}
      <div style={{ display: 'flex', gap: 10, margin: '0 16px 12px' }}>
        <button style={{
          flex: 1, padding: '13px', borderRadius: 14, border: 'none',
          background: '#229ED9', color: '#fff', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span>✈️</span> Telegram
        </button>
        <button style={{
          flex: 1, padding: '13px', borderRadius: 14, border: 'none',
          background: '#0077FF', color: '#fff', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span>💙</span> VK
        </button>
      </div>

      {/* ── Выйти ── */}
      <div style={{ margin: '0 16px' }}>
        <button style={{
          width: '100%', padding: '14px', borderRadius: 14, border: 'none',
          background: 'rgba(255,75,75,0.12)', color: '#FF4B4B',
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>
          Выйти
        </button>
      </div>
    </div>
  );
}
