'use client';

import { useEffect, useState } from 'react';
import { Home } from '@/components/Home';
import { Reflect } from '@/components/Reflect';
import { Bingo } from '@/components/Bingo';
import { PrayerChain } from '@/components/PrayerChain';
import { KidsZone } from '@/components/KidsZone';

export type View = 'home' | 'reflect' | 'bingo' | 'prayer' | 'kids';

export default function Page() {
  const [view, setView] = useState<View>('home');
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  // Initialize user ID + name from sessionStorage after mount
  // (avoids SSR hydration mismatch).
  useEffect(() => {
    let uid = sessionStorage.getItem('stirup_uid');
    if (!uid) {
      uid = 'u_' + Math.random().toString(36).slice(2, 9);
      sessionStorage.setItem('stirup_uid', uid);
    }
    setUserId(uid);

    const name = sessionStorage.getItem('stirup_name') || '';
    setUserName(name);
  }, []);

  const persistName = (n: string) => {
    setUserName(n);
    if (n) sessionStorage.setItem('stirup_name', n);
  };

  // Wait for userId before rendering — prevents a flash of unassigned state
  if (!userId) {
    return null;
  }

  return (
    <>
      {view === 'home' && <Home setView={setView} userName={userName} setUserName={persistName} />}
      {view === 'reflect' && <Reflect userId={userId} userName={userName} setView={setView} />}
      {view === 'bingo' && <Bingo userId={userId} userName={userName} setView={setView} />}
      {view === 'prayer' && <PrayerChain userId={userId} userName={userName} setView={setView} />}
      {view === 'kids' && <KidsZone userId={userId} userName={userName} setView={setView} />}
    </>
  );
}
