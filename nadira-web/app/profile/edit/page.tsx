'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/lib/profile-context';

// ── Страница редактирования профиля ──
export default function EditProfilePage() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name,     setName]     = useState(profile.name);
  const [username, setUsername] = useState(profile.username.replace('@', ''));
  const [bio,      setBio]      = useState(profile.bio);
  const [avatar,   setAvatar]   = useState(profile.avatar);
  const [saved,    setSaved]    = useState(false);

  // Обработка выбора фото аватара
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  // Сохранение изменений профиля
  const handleSave = () => {
    updateProfile({
      avatar,
      name:     name.trim()     || profile.name,
      username: '@' + (username.trim().replace('@', '') || profile.username.replace('@', '')),
      bio:      bio.trim(),
    });
    setSaved(true);
    setTimeout(() => router.back(), 1200);
  };

  return (
    <div style={{
      background: '#0f0f13', minHeight: '100svh', color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>

      {/* ── Шапка ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 20px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>Данные профиля</h1>
        <button
          onClick={handleSave}
          style={{ background: 'none', border: 'none', color: '#8B5CF6', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
        >
          Готово
        </button>
      </div>

      {/* ── Аватар ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 32 }}>
        <div
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, overflow: 'hidden',
            boxShadow: '0 0 0 3px rgba(139,92,246,0.3)',
          }}>
            {avatar
              ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : '👤'}
          </div>
          {/* Иконка камеры */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 30, height: 30, borderRadius: '50%',
            background: '#8B5CF6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #0f0f13',
          }}>
            <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
        <p style={{ fontSize: 13, color: '#8B5CF6', marginTop: 10, cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
          Изменить фото
        </p>
      </div>

      {/* ── Форма ── */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>

        {/* Имя */}
        <div style={{ background: '#1a1a28', borderRadius: 14, padding: '0 16px', marginBottom: 8 }}>
          <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', paddingTop: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Имя
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={50}
            style={{
              width: '100%', background: 'none', border: 'none', color: '#fff',
              fontSize: 15, padding: '8px 0 14px', outline: 'none',
            }}
          />
        </div>

        {/* Username */}
        <div style={{ background: '#1a1a28', borderRadius: 14, padding: '0 16px', marginBottom: 8 }}>
          <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', paddingTop: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Имя пользователя
          </label>
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 14 }}>
            <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', paddingTop: 8 }}>@</span>
            <input
              value={username}
              onChange={e => setUsername(e.target.value.replace('@', '').replace(/\s/g, '_'))}
              maxLength={30}
              autoCapitalize="none"
              style={{
                flex: 1, background: 'none', border: 'none', color: '#fff',
                fontSize: 15, padding: '8px 0 0 2px', outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Bio */}
        <div style={{ background: '#1a1a28', borderRadius: 14, padding: '0 16px', marginBottom: 24 }}>
          <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', paddingTop: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            О себе
          </label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={150}
            rows={3}
            style={{
              width: '100%', background: 'none', border: 'none', color: '#fff',
              fontSize: 15, padding: '8px 0 14px', outline: 'none', resize: 'none',
              fontFamily: 'inherit', lineHeight: 1.5,
            }}
            placeholder="Расскажите о себе..."
          />
          <div style={{ textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.3)', paddingBottom: 10 }}>
            {bio.length}/150
          </div>
        </div>

        {/* Кнопка сохранить */}
        <button
          onClick={handleSave}
          style={{
            width: '100%', padding: '15px', borderRadius: 14, border: 'none',
            background: '#8B5CF6', color: '#fff', fontSize: 16, fontWeight: 600,
            cursor: 'pointer', transition: 'opacity 0.2s',
          }}
        >
          {saved ? '✓ Сохранено!' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}
