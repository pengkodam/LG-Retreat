'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Palette, Undo2 } from 'lucide-react';
import { KID_MISSIONS, tokens } from '@/lib/content';
import { TopBar } from './TopBar';
import type { View } from '@/app/page';

export function KidsZone({
  userId,
  userName,
  setView,
}: {
  userId: string;
  userName: string;
  setView: (v: View) => void;
}) {
  const [sub, setSub] = useState<'menu' | 'mission' | 'draw'>('menu');

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>
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
          Part Four · Kids&rsquo; Zone
        </div>
        <h2 className="display" style={{ fontSize: 36, margin: 0, fontWeight: 600 }}>
          For the{' '}
          <span className="italic-display" style={{ color: tokens.gold, fontWeight: 400 }}>
            little ones
          </span>
        </h2>
      </div>

      {sub === 'menu' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <button
            onClick={() => setSub('mission')}
            className="paper-card fade-up"
            style={{ padding: 32, textAlign: 'center', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎯</div>
            <div className="display" style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>
              Mission Card
            </div>
            <div style={{ fontSize: 14, color: tokens.inkSoft, fontStyle: 'italic' }}>
              Get a kindness mission to do tonight
            </div>
          </button>
          <button
            onClick={() => setSub('draw')}
            className="paper-card fade-up"
            style={{ padding: 32, textAlign: 'center', animationDelay: '0.1s', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎨</div>
            <div className="display" style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>
              Draw-a-Friend
            </div>
            <div style={{ fontSize: 14, color: tokens.inkSoft, fontStyle: 'italic' }}>
              Draw a picture for someone in the group
            </div>
          </button>
        </div>
      )}

      {sub === 'mission' && <MissionCard onBack={() => setSub('menu')} />}
      {sub === 'draw' && <DrawAFriend userId={userId} userName={userName} onBack={() => setSub('menu')} />}
    </div>
  );
}

function MissionCard({ onBack }: { onBack: () => void }) {
  const [mission, setMission] = useState<typeof KID_MISSIONS[number] | null>(null);
  const [done, setDone] = useState(false);

  const draw = () => {
    const pick = KID_MISSIONS[Math.floor(Math.random() * KID_MISSIONS.length)];
    setMission(pick);
    setDone(false);
  };

  return (
    <div className="fade-up" style={{ textAlign: 'center', padding: '40px 0' }}>
      {!mission && (
        <>
          <p style={{ fontSize: 18, marginBottom: 32, color: tokens.inkSoft }}>Ready to get a mission?</p>
          <button
            onClick={draw}
            className="ink-btn"
            style={{ background: tokens.gold, color: tokens.ink, fontSize: 18, padding: '16px 40px' }}
          >
            🎴 &nbsp; Draw a card
          </button>
        </>
      )}

      {mission && (
        <div className="fade-up">
          <div
            className="paper-card"
            style={{
              padding: 48,
              maxWidth: 420,
              margin: '0 auto 24px',
              background: '#fffaed',
              transform: 'rotate(-1deg)',
              boxShadow: '0 8px 30px -10px rgba(42,35,32,0.3)',
            }}
          >
            <div style={{ fontSize: 72, marginBottom: 20 }}>{mission.icon}</div>
            <div className="display" style={{ fontSize: 22, lineHeight: 1.4, fontWeight: 600 }}>
              {mission.text}
            </div>
          </div>

          {!done && (
            <button
              onClick={() => setDone(true)}
              className="ink-btn"
              style={{ background: tokens.gold, color: tokens.ink }}
            >
              ✓ &nbsp; I did it!
            </button>
          )}
          {done && (
            <div className="fade-up" style={{ fontSize: 20, color: tokens.accent, marginTop: 16 }}>
              🌟 You&rsquo;re a stirrer-upper! 🌟
            </div>
          )}

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button onClick={draw} className="ghost-btn">
              Another mission
            </button>
            <button onClick={onBack} className="ghost-btn">
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DrawAFriend({
  userId,
  userName,
  onBack,
}: {
  userId: string;
  userName: string;
  onBack: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(tokens.accent);
  const [drawing, setDrawing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [allDrawings, setAllDrawings] = useState<any[]>([]);
  const [friendFor, setFriendFor] = useState('');

  const COLORS = [tokens.accent, tokens.sage, tokens.sky, tokens.gold, tokens.plum, tokens.ink];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fffaed';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    try {
      const res = await fetch('/api/drawings', { cache: 'no-store' });
      const data = await res.json();
      setAllDrawings(data.drawings || []);
    } catch (e) {
      console.error(e);
    }
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touch = 'touches' in e ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : (e as React.MouseEvent).clientX;
    const clientY = touch ? touch.clientY : (e as React.MouseEvent).clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDrawing(true);
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fffaed';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSaved(false);
  };

  const save = async () => {
    const canvas = canvasRef.current!;
    // Compress to JPEG at 0.7 quality to stay well under Redis limits
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    const payload = {
      userId,
      userName,
      friendFor,
      image: dataUrl,
      timestamp: Date.now(),
    };
    try {
      await fetch('/api/drawings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSaved(true);
      loadDrawings();
    } catch (e) {
      console.error(e);
      setSaved(true);
    }
  };

  return (
    <div className="fade-up">
      <p style={{ fontSize: 15, color: tokens.inkSoft, marginBottom: 16, textAlign: 'center' }}>
        Draw a picture for someone in the lifegroup!
      </p>

      <div className="paper-card" style={{ padding: 12, marginBottom: 16 }}>
        <label
          style={{
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: tokens.inkSoft,
          }}
        >
          Who is it for?
        </label>
        <input
          value={friendFor}
          onChange={(e) => setFriendFor(e.target.value)}
          placeholder="Auntie May, Uncle Peter, my best friend…"
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Palette size={16} style={{ color: tokens.inkSoft }} />
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: c,
              border: color === c ? `3px solid ${tokens.ink}` : '2px solid rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
          />
        ))}
        <button
          onClick={clear}
          className="ghost-btn"
          style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: 13 }}
        >
          <Undo2 size={14} style={{ verticalAlign: 'middle' }} /> Clear
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        style={{
          width: '100%',
          aspectRatio: '3/2',
          background: '#fffaed',
          border: `1px solid ${tokens.inkSoft}`,
          borderRadius: 4,
          touchAction: 'none',
          cursor: 'crosshair',
          display: 'block',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={onBack} className="ghost-btn">
          <ChevronLeft size={14} style={{ verticalAlign: 'middle' }} /> Back
        </button>
        <button
          onClick={save}
          disabled={!friendFor.trim()}
          className="ink-btn"
          style={{ background: tokens.gold, color: tokens.ink }}
        >
          {saved ? '✓ Saved!' : 'Save drawing'}
        </button>
      </div>

      {allDrawings.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3 className="display" style={{ fontSize: 20, marginBottom: 12 }}>
            The gallery{' '}
            <span style={{ fontSize: 14, color: tokens.inkSoft, fontWeight: 400 }}>· {allDrawings.length}</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {allDrawings.slice(0, 12).map((d, i) => (
              <div
                key={i}
                className="paper-card"
                style={{ padding: 6, transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.image} alt="" style={{ width: '100%', display: 'block', borderRadius: 2 }} />
                <div
                  style={{
                    padding: '6px 4px 2px',
                    fontSize: 11,
                    color: tokens.inkSoft,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 600 }}>For {d.friendFor}</div>
                  <div>by {d.userName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
