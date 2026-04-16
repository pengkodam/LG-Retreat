'use client';

import { useState } from 'react';
import { HandHeart, Sparkles, Heart, Users } from 'lucide-react';
import { tokens } from '@/lib/content';
import type { View } from '@/app/page';

const sections = [
  { id: 'reflect' as View, label: 'How am I doing?', sub: 'A quiet check-in', icon: HandHeart, color: tokens.accent },
  { id: 'bingo' as View, label: 'Dream Bingo', sub: 'What should we do together?', icon: Sparkles, color: tokens.sage },
  { id: 'prayer' as View, label: 'Prayer Pass', sub: "Carry someone else's", icon: Heart, color: tokens.plum },
  { id: 'kids' as View, label: "Kids' Zone", sub: 'Missions for the little ones', icon: Users, color: tokens.gold },
];

export function Home({
  setView,
  userName,
  setUserName,
}: {
  setView: (v: View) => void;
  userName: string;
  setUserName: (n: string) => void;
}) {
  const [nameInput, setNameInput] = useState(userName);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: tokens.inkSoft, marginBottom: 24 }}>
          Hebrews 10 · 24—25
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(40px, 7vw, 64px)', lineHeight: 1.05, margin: '0 0 24px', fontWeight: 800 }}>
          Stir <span className="italic-display" style={{ color: tokens.accent, fontWeight: 400 }}>one another</span> up
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: tokens.inkSoft, maxWidth: 480, margin: '0 auto', fontStyle: 'italic' }}>
          &ldquo;…to love and good works, not neglecting to meet together, but encouraging one another,
          and all the more as you see the Day drawing near.&rdquo;
        </p>
      </div>

      <div className="paper-card fade-up" style={{ padding: 28, marginBottom: 32, animationDelay: '0.15s' }}>
        <label style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.inkSoft }}>
          Your name (for the group)
        </label>
        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onBlur={() => setUserName(nameInput)}
          placeholder="e.g. Peter"
          style={{ marginTop: 8 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {sections.map((s, i) => {
          const Icon = s.icon;
          const enabled = nameInput.trim().length > 0;
          return (
            <button
              key={s.id}
              onClick={() => enabled && (setUserName(nameInput), setView(s.id))}
              disabled={!enabled}
              className="paper-card fade-up"
              style={{
                padding: 24,
                textAlign: 'left',
                opacity: enabled ? 1 : 0.5,
                cursor: enabled ? 'pointer' : 'not-allowed',
                animationDelay: `${0.2 + i * 0.08}s`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                if (enabled) e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: s.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#faf5e8',
                  }}
                >
                  <Icon size={20} />
                </div>
                <div className="display" style={{ fontSize: 22, fontWeight: 600 }}>
                  {s.label}
                </div>
              </div>
              <div style={{ fontSize: 14, color: tokens.inkSoft, fontStyle: 'italic' }}>{s.sub}</div>
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 64, fontSize: 12, color: tokens.inkSoft, letterSpacing: '0.1em' }}>
        <span className="flicker">✦</span> &nbsp; put the phone down often &nbsp; <span className="flicker">✦</span>
      </div>
    </div>
  );
}
