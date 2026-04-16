'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { AREAS, tokens } from '@/lib/content';
import { iconMap } from './icons';
import { TopBar } from './TopBar';
import type { View } from '@/app/page';

export function Reflect({
  userId,
  userName,
  setView,
}: {
  userId: string;
  userName: string;
  setView: (v: View) => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [prayerNotes, setPrayerNotes] = useState<Record<string, string>>({});
  const [shareFlags, setShareFlags] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [allResponses, setAllResponses] = useState<any[]>([]);

  const area = AREAS[step];
  const isLast = step === AREAS.length - 1;
  const canProceed = !!answers[area.id];
  const Icon = iconMap[area.iconName];

  const submit = async () => {
    const payload = {
      userId,
      userName,
      answers,
      prayerNotes,
      shareFlags,
      timestamp: Date.now(),
    };
    try {
      await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res = await fetch('/api/reflect', { cache: 'no-store' });
      const data = await res.json();
      setAllResponses(data.responses || []);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <ReflectResults allResponses={allResponses} setView={setView} myId={userId} />;
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 80px' }}>
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
          Part One · A Quiet Check-in
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
          {AREAS.map((a, i) => (
            <div
              key={a.id}
              style={{
                height: 3,
                flex: 1,
                background: i <= step ? a.color : 'rgba(90,78,69,0.15)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      <div key={area.id} className="fade-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: area.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#faf5e8',
            }}
          >
            <Icon size={22} />
          </div>
          <h2 className="display" style={{ fontSize: 36, margin: 0, fontWeight: 600 }}>
            {area.label}
          </h2>
        </div>

        <p style={{ fontSize: 16, color: tokens.inkSoft, marginBottom: 28, fontStyle: 'italic' }}>
          Which of these sounds most like you right now? There&rsquo;s no wrong answer — just be honest.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {area.cards.map((card, i) => {
            const picked = answers[area.id] === card.id;
            return (
              <button
                key={card.id}
                onClick={() => setAnswers({ ...answers, [area.id]: card.id })}
                className="paper-card fade-up"
                style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: 16,
                  lineHeight: 1.5,
                  borderLeft: picked ? `4px solid ${area.color}` : '4px solid transparent',
                  background: picked ? '#fffaed' : '#faf5e8',
                  transform: picked ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'all 0.2s',
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {card.text}
              </button>
            );
          })}
        </div>

        {canProceed && (
          <div className="fade-up paper-card" style={{ padding: 20, marginBottom: 24 }}>
            <label
              style={{
                fontSize: 12,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: tokens.inkSoft,
              }}
            >
              One sentence — what can the group pray for you in this?
            </label>
            <textarea
              value={prayerNotes[area.id] || ''}
              onChange={(e) => setPrayerNotes({ ...prayerNotes, [area.id]: e.target.value })}
              placeholder="(optional)"
              style={{ marginTop: 8 }}
            />
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 16,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={!!shareFlags[area.id]}
                onChange={(e) => setShareFlags({ ...shareFlags, [area.id]: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: area.color }}
              />
              <span style={{ color: tokens.inkSoft }}>
                {shareFlags[area.id] ? (
                  <Eye size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                ) : (
                  <EyeOff size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                )}
                &nbsp; Share this with the group
              </span>
            </label>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : setView('home'))}
            className="ghost-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            onClick={() => (isLast ? submit() : setStep(step + 1))}
            disabled={!canProceed}
            className="ink-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {isLast ? 'Finish' : 'Next'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReflectResults({
  allResponses,
  setView,
  myId,
}: {
  allResponses: any[];
  setView: (v: View) => void;
  myId: string;
}) {
  const myResp = allResponses.find((r) => r.userId === myId);

  const aggregate: Record<string, Record<string, number>> = {};
  AREAS.forEach((a) => {
    aggregate[a.id] = {};
    a.cards.forEach((c) => {
      aggregate[a.id][c.id] = 0;
    });
  });
  allResponses.forEach((r) => {
    Object.entries(r.answers || {}).forEach(([areaId, cardId]) => {
      if (aggregate[areaId]?.[cardId as string] !== undefined) {
        aggregate[areaId][cardId as string]++;
      }
    });
  });

  const sharedNotes: { name: string; area: string; note: string }[] = [];
  allResponses.forEach((r) => {
    Object.entries(r.shareFlags || {}).forEach(([areaId, shared]) => {
      if (shared && r.prayerNotes?.[areaId]) {
        sharedNotes.push({ name: r.userName, area: areaId, note: r.prayerNotes[areaId] });
      }
    });
  });

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>
      <TopBar onHome={() => setView('home')} />

      <div className="fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: tokens.inkSoft,
            marginBottom: 8,
          }}
        >
          Received
        </div>
        <h2 className="display" style={{ fontSize: 40, margin: '0 0 12px', fontWeight: 600 }}>
          Thank you, {myResp?.userName || 'friend'}
        </h2>
        <p style={{ fontStyle: 'italic', color: tokens.inkSoft }}>
          {allResponses.length} {allResponses.length === 1 ? 'person has' : 'people have'} shared so far.
        </p>
      </div>

      <h3 className="display" style={{ fontSize: 22, marginBottom: 16 }}>
        Where the group stands
      </h3>
      {AREAS.map((a) => {
        const Icon = iconMap[a.iconName];
        const total = Object.values(aggregate[a.id]).reduce((s, n) => s + n, 0);
        if (total === 0) return null;
        return (
          <div key={a.id} className="paper-card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Icon size={18} style={{ color: a.color }} />
              <div className="display" style={{ fontSize: 18, fontWeight: 600 }}>
                {a.label}
              </div>
            </div>
            {a.cards.map((c) => {
              const count = aggregate[a.id][c.id];
              const pct = total ? (count / total) * 100 : 0;
              return (
                <div key={c.id} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    <span>{c.text}</span>
                    <span style={{ color: tokens.inkSoft, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(90,78,69,0.1)', borderRadius: 3 }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: a.color,
                        borderRadius: 3,
                        transition: 'width 0.6s',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {sharedNotes.length > 0 && (
        <>
          <h3 className="display" style={{ fontSize: 22, marginTop: 40, marginBottom: 16 }}>
            Shared prayer asks
          </h3>
          {sharedNotes.map((n, i) => {
            const area = AREAS.find((a) => a.id === n.area);
            return (
              <div
                key={i}
                className="paper-card"
                style={{ padding: 18, marginBottom: 12, borderLeft: `4px solid ${area?.color}` }}
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
                  {n.name} · {area?.label}
                </div>
                <div style={{ fontStyle: 'italic', fontSize: 15 }}>&ldquo;{n.note}&rdquo;</div>
              </div>
            );
          })}
        </>
      )}

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <button onClick={() => setView('bingo')} className="ink-btn">
          Next → Dream Bingo
        </button>
      </div>
    </div>
  );
}
