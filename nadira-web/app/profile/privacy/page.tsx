'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Переключатель
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!enabled)}
      style={{
        width: 48, height: 28, borderRadius: 14,
        background: enabled ? '#8B5CF6' : 'rgba(255,255,255,0.15)',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.25s',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: enabled ? 23 : 3,
        width: 22, height: 22, borderRadius: '50%', background: '#fff',
        transition: 'left 0.25s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </div>
  );
}

// Строка настройки с переключателем
function SettingRow({ icon, label, sublabel, enabled, onChange }: {
  icon: string; label: string; sublabel?: string; enabled: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{sublabel}</div>}
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

// ── Страница приватности ──
export default function PrivacyPage() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    privateAccount:  false,
    showActivity:    true,
    allowComments:   true,
    allowDuet:       true,
    allowDownloads:  false,
    showLikes:       true,
    allowMessages:   true,
    hideViews:       false,
  });

  const toggle = (key: keyof typeof settings) => (v: boolean) =>
    setSettings(prev => ({ ...prev, [key]: v }));

  return (
    <div style={{
      background: '#0f0f13', minHeight: '100svh', color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflowY: 'auto',
    }}>

      {/* ── Шапка ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 20px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 600 }}>Приватность</h1>
      </div>

      {/* ── Аккаунт ── */}
      <div style={{ background: '#1a1a28', borderRadius: 16, margin: '0 16px 12px', overflow: 'hidden' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', padding: '12px 20px 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Аккаунт
        </div>
        <SettingRow icon="🔒" label="Закрытый аккаунт" sublabel="Только подписчики видят контент" enabled={settings.privateAccount} onChange={toggle('privateAccount')} />
        <SettingRow icon="🟢" label="Статус активности" sublabel="Показывать когда вы онлайн" enabled={settings.showActivity} onChange={toggle('showActivity')} />
        <SettingRow icon="👁" label="Скрыть просмотры" sublabel="Не показывать счётчик просмотров" enabled={settings.hideViews} onChange={toggle('hideViews')} />
        <SettingRow icon="❤️" label="Публичные лайки" sublabel="Кто видит ваши лайки" enabled={settings.showLikes} onChange={toggle('showLikes')} />
      </div>

      {/* ── Видео ── */}
      <div style={{ background: '#1a1a28', borderRadius: 16, margin: '0 16px 12px', overflow: 'hidden' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', padding: '12px 20px 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Видео
        </div>
        <SettingRow icon="💬" label="Комментарии" sublabel="Разрешить оставлять комментарии" enabled={settings.allowComments} onChange={toggle('allowComments')} />
        <SettingRow icon="🎭" label="Дуэт" sublabel="Разрешить снимать дуэт с вашим видео" enabled={settings.allowDuet} onChange={toggle('allowDuet')} />
        <SettingRow icon="⬇️" label="Скачивание" sublabel="Разрешить скачивать видео" enabled={settings.allowDownloads} onChange={toggle('allowDownloads')} />
      </div>

      {/* ── Общение ── */}
      <div style={{ background: '#1a1a28', borderRadius: 16, margin: '0 16px 16px', overflow: 'hidden' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', padding: '12px 20px 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Общение
        </div>
        <SettingRow icon="✉️" label="Личные сообщения" sublabel="Кто может написать вам" enabled={settings.allowMessages} onChange={toggle('allowMessages')} />
      </div>
    </div>
  );
}
