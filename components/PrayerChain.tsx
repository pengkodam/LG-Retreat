'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Send } from 'lucide-react';
import { tokens } from '@/lib/content';
import { TopBar } from './TopBar';
import type { View } from '@/app/page';

type PrayerPayload = {
  userId: string;
  userName: string;
  text: string;
  anonymous: boolean;
  timestamp: number;
  prayedCount: number;
};

export function PrayerChain({
  userId,
  userName,
  setView,
}: {
  userId: string;
  userName: string;
  setView: (v: View) => void;
}) {
  const [mode, setMode] = useState<'write' | 'receive'>('write');
  const [prayerText, setPrayerText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [assigned, setAssigned] = useState<PrayerPayload | null>(null);
  const [mine, setMine] = useState<PrayerPayload | null>(null);
  const [prayed, setPrayed] = useState(false);

  const refresh = async () => {
    try {
      const res = await fetch(`/api/prayer?userId=${encodeURIComponent(userId)}`, { cache: 'no-store' });
      const data = await res.json();
      setMine(data.mine);
      if (!assigned && data.assigned) setAssigned(data.assigned);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Refresh 'mine' periodically so the user sees live prayedCount updates
    if (mode === 'receive') {
      const interval = setInterval(refresh, 5000);
      return () => clearInterval(interval);
    }
  }, [mode, userId]);

  const submit = async () => {
    const payload = {
      userId,
      userName,
      text: prayerText,
      anonymous,
      timestamp: Date.now(),
      prayedCount: 0,
    };
    try {
      await fetch('/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // Fetch + assign
      const res = await fetch(`/api/prayer?userId=${encodeURIComponent(userId)}`, { cache: 'no-store' });
      const data = await res.json();
      setAssigned(data.assigned);
      setMine(data.mine);
      setMode('receive');
    } catch (e) {
      console.error(e);
    }
  };

  const markPrayed = async () => {
    if (!assigned) return;
    try {
      await fetch('/api/prayer/pray', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerUserId: assigned.userId }),
      });
      setPrayed(true);
    } catch (e) {
      console.error(e);
      setPrayed(true);
    }
  };

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '32px 24px 80px' }}>
      <TopBar onHome={() => setView('home')} />

      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: tokens.inkSoft,
            marginBottom: 8,
          }}
        >
          Part Three · Prayer Pass
        </div>
        <h2 className="display" style={{ fontSize: 36, margin: 0, fontWeight: 600 }}>
          Carry{' '}
          <span className="italic-display" style={{ color: tokens.plum, fontWeight: 400 }}>
            someone else&rsquo;s
          </span>
        </h2>
      </div>

      {mode === 'write' && (
        <div className="fade-up">
          <div className="paper-card" style={{ padding: 28, marginBottom: 20 }}>
            <label
              style={{
                fontSize: 12,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: tokens.inkSoft,
                display: 'block',
                marginBottom: 12,
              }}
            >
              Write a prayer request to pass on
            </label>
            <textarea
              value={prayerText}
              onChange={(e) => setPrayerText(e.target.value)}
              placeholder="What's weighing on you? What are you hoping for?"
              style={{ minHeight: 140, fontSize: 16, lineHeight: 1.6 }}
            />
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 20,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: tokens.plum }}
              />
              <span style={{ color: tokens.inkSoft }}>Pass this on anonymously</span>
            </label>
          </div>

          <p
            style={{
              fontSize: 13,
              color: tokens.inkSoft,
              fontStyle: 'italic',
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            When you submit, you&rsquo;ll receive someone else&rsquo;s prayer to carry.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setView('home')} className="ghost-btn">
              <ChevronLeft size={16} style={{ verticalAlign: 'middle' }} /> Back
            </button>
            <button onClick={submit} disabled={!prayerText.trim()} className="ink-btn">
              Pass it on <Send size={14} style={{ verticalAlign: 'middle' }} />
            </button>
          </div>
        </div>
      )}

      {mode === 'receive' && (
        <div className="fade-up">
          <p
            style={{
              textAlign: 'center',
              fontStyle: 'italic',
              color: tokens.inkSoft,
              marginBottom: 24,
            }}
          >
            You&rsquo;ve been entrusted with this…
          </p>

          {assigned ? (
            <div
              className="paper-card"
              style={{
                padding: 36,
                marginBottom: 24,
                background: '#fffaed',
                borderLeft: `4px solid ${tokens.plum}`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: tokens.inkSoft,
                  marginBottom: 16,
                }}
              >
                {assigned.anonymous ? 'Anonymous' : `From ${assigned.userName}`}
              </div>
              <div className="display" style={{ fontSize: 20, lineHeight: 1.6, fontStyle: 'italic' }}>
                &ldquo;{assigned.text}&rdquo;
              </div>
            </div>
          ) : (
            <div className="paper-card" style={{ padding: 28, marginBottom: 24, textAlign: 'center' }}>
              <p style={{ fontStyle: 'italic' }}>
                You&rsquo;re the first one here. Your prayer is waiting to be picked up.
              </p>
              <button onClick={refresh} className="ghost-btn" style={{ marginTop: 16 }}>
                Check again
              </button>
            </div>
          )}

          {assigned && !prayed && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: tokens.inkSoft, marginBottom: 16 }}>
                Take a moment now. Pray for them — silently or aloud.
              </p>
              <button onClick={markPrayed} className="ink-btn" style={{ background: tokens.plum }}>
                🙏 &nbsp; I&rsquo;ve prayed
              </button>
            </div>
          )}

          {prayed && (
            <div
              className="paper-card fade-up"
              style={{ padding: 24, textAlign: 'center', background: '#fffaed' }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>🙏</div>
              <p style={{ fontStyle: 'italic', fontSize: 16 }}>Your prayer was received.</p>
              <p style={{ fontSize: 13, color: tokens.inkSoft, marginTop: 8 }}>
                They&rsquo;ll see that someone carried it for them today.
              </p>
            </div>
          )}

          {mine && (mine.prayedCount || 0) > 0 && (
            <div
              className="fade-up"
              style={{
                marginTop: 24,
                textAlign: 'center',
                padding: 20,
                borderTop: `1px dashed ${tokens.inkSoft}`,
              }}
            >
              <p style={{ fontSize: 14, color: tokens.inkSoft }}>
                <Heart
                  size={14}
                  style={{ display: 'inline', color: tokens.accent, verticalAlign: 'middle' }}
                />{' '}
                &nbsp;
                {mine.prayedCount} {mine.prayedCount === 1 ? 'person has' : 'people have'} prayed for you today.
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button onClick={() => setView('kids')} className="ghost-btn">
              Next → Kids&rsquo; Zone <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
