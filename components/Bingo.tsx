'use client';

import { useState } from 'react';
import { Check, ChevronLeft, Sparkles } from 'lucide-react';
import { BINGO_TILES, tokens } from '@/lib/content';
import { TopBar } from './TopBar';
import type { View } from '@/app/page';

const MAX_PICKS = 7;

export function Bingo({
  userId,
  userName,
  setView,
}: {
  userId: string;
  userName: string;
  setView: (v: View) => void;
}) {
  const [picks, setPicks] = useState<Set<string>>(new Set());
  const [wildcard, setWildcard] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [allPicks, setAllPicks] = useState<any[]>([]);

  const toggle = (id: string) => {
    const next = new Set(picks);
    if (next.has(id)) next.delete(id);
    else if (next.size < MAX_PICKS) next.add(id);
    setPicks(next);
  };

  const submit = async () => {
    const payload = {
      userId,
      userName,
      picks: [...picks],
      wildcard,
      timestamp: Date.now(),
    };
    try {
      await fetch('/api/bingo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res = await fetch('/api/bingo', { cache: 'no-store' });
      const data = await res.json();
      setAllPicks(data.votes || []);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <BingoResults allPicks={allPicks} setView={setView} />;
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 24px 80px' }}>
      <TopBar onHome={() => setView('home')} />

      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: tokens.inkSoft,
            marginBottom: 8,
          }}
        >
          Part Two · Dream Bingo
        </div>
        <h2 className="display" style={{ fontSize: 36, margin: '0 0 8px', fontWeight: 600 }}>
          What should we do{' '}
          <span className="italic-display" style={{ color: tokens.sage, fontWeight: 400 }}>
            together
          </span>
          ?
        </h2>
        <p style={{ color: tokens.inkSoft, fontStyle: 'italic' }}>
          Pick up to <strong>{MAX_PICKS}</strong> things you&rsquo;d most want our lifegroup to do. Limited picks means real priority.
        </p>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 13, color: tokens.inkSoft }}>Selected:</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: MAX_PICKS }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: i < picks.size ? tokens.sage : 'transparent',
                  border: `1.5px solid ${tokens.sage}`,
                  transition: 'background 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 10,
          marginBottom: 24,
        }}
      >
        {BINGO_TILES.map((tile, i) => {
          const picked = picks.has(tile.id);
          const isWildcard = tile.id === 'b24';
          return (
            <button
              key={tile.id}
              onClick={() => toggle(tile.id)}
              className="paper-card fade-up"
              style={{
                padding: 14,
                textAlign: 'center',
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 6,
                background: picked ? tokens.sage : '#faf5e8',
                color: picked ? '#faf5e8' : tokens.ink,
                transform: picked ? 'scale(0.96)' : 'scale(1)',
                transition: 'all 0.2s',
                opacity: !picked && picks.size >= MAX_PICKS ? 0.4 : 1,
                animationDelay: `${i * 0.02}s`,
                border: isWildcard ? `2px dashed ${picked ? '#faf5e8' : tokens.gold}` : undefined,
              }}
            >
              <div style={{ fontSize: 28 }}>{tile.icon}</div>
              <div style={{ fontSize: 12, lineHeight: 1.3, fontWeight: 500 }}>{tile.label}</div>
              {picked && <Check size={14} style={{ position: 'absolute', top: 8, right: 8 }} />}
            </button>
          );
        })}
      </div>

      {picks.has('b24') && (
        <div className="paper-card fade-up" style={{ padding: 20, marginBottom: 24 }}>
          <label
            style={{
              fontSize: 12,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: tokens.inkSoft,
            }}
          >
            Your wildcard idea
          </label>
          <input
            value={wildcard}
            onChange={(e) => setWildcard(e.target.value)}
            placeholder="What would you dream up for us?"
            style={{ marginTop: 8 }}
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setView('home')} className="ghost-btn">
          <ChevronLeft size={16} style={{ verticalAlign: 'middle' }} /> Back
        </button>
        <button onClick={submit} disabled={picks.size === 0} className="ink-btn">
          Cast my vote →
        </button>
      </div>
    </div>
  );
}

function BingoResults({ allPicks, setView }: { allPicks: any[]; setView: (v: View) => void }) {
  const counts: Record<string, number> = {};
  BINGO_TILES.forEach((t) => {
    counts[t.id] = 0;
  });
  const wildcards: { name: string; text: string }[] = [];
  allPicks.forEach((p) => {
    (p.picks || []).forEach((id: string) => {
      if (counts[id] !== undefined) counts[id]++;
    });
    if (p.wildcard?.trim()) wildcards.push({ name: p.userName, text: p.wildcard });
  });

  const sorted = BINGO_TILES.filter((t) => t.id !== 'b24')
    .map((t) => ({ ...t, count: counts[t.id] }))
    .sort((a, b) => b.count - a.count);

  const max = Math.max(...sorted.map((s) => s.count), 1);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>
      <TopBar onHome={() => setView('home')} />

      <div className="fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: tokens.inkSoft,
            marginBottom: 8,
          }}
        >
          The group dreams
        </div>
        <h2 className="display" style={{ fontSize: 36, margin: '0 0 8px', fontWeight: 600 }}>
          What&rsquo;s{' '}
          <span className="italic-display" style={{ color: tokens.sage, fontWeight: 400 }}>
            rising to the top
          </span>
        </h2>
        <p style={{ fontStyle: 'italic', color: tokens.inkSoft }}>
          {allPicks.length} {allPicks.length === 1 ? 'vote' : 'votes'} in
        </p>
      </div>

      <div style={{ marginBottom: 40 }}>
        {sorted.map((t, i) => (
          <div key={t.id} style={{ marginBottom: 10, opacity: t.count === 0 ? 0.35 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span style={{ flex: 1, fontSize: 14 }}>{t.label}</span>
              <span style={{ fontSize: 13, color: tokens.inkSoft, fontVariantNumeric: 'tabular-nums' }}>{t.count}</span>
            </div>
            <div style={{ height: 8, background: 'rgba(90,78,69,0.1)', borderRadius: 4 }}>
              <div
                style={{
                  height: '100%',
                  width: `${(t.count / max) * 100}%`,
                  background: i < 3 ? tokens.accent : tokens.sage,
                  borderRadius: 4,
                  transition: 'width 0.8s',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {wildcards.length > 0 && (
        <>
          <h3 className="display" style={{ fontSize: 22, marginBottom: 16 }}>
            Wildcard dreams <Sparkles size={18} style={{ display: 'inline', color: tokens.gold }} />
          </h3>
          {wildcards.map((w, i) => (
            <div
              key={i}
              className="paper-card"
              style={{ padding: 18, marginBottom: 10, borderLeft: `4px solid ${tokens.gold}` }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: tokens.inkSoft,
                  marginBottom: 6,
                }}
              >
                {w.name}
              </div>
              <div style={{ fontStyle: 'italic', fontSize: 15 }}>&ldquo;{w.text}&rdquo;</div>
            </div>
          ))}
        </>
      )}

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={() => setView('prayer')} className="ink-btn">
          Next → Prayer Pass
        </button>
      </div>
    </div>
  );
}
