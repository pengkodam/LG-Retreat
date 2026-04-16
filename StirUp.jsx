import React, { useState, useEffect, useRef } from 'react';
import { Heart, BookOpen, Users, Globe, HandHeart, Check, X, ChevronRight, ChevronLeft, Sparkles, Send, Eye, EyeOff, Palette, Undo2, Home } from 'lucide-react';

// ============ DESIGN TOKENS ============
const styles = {
  bg: '#f4ede0',
  bgDeep: '#ebe0cc',
  ink: '#2a2320',
  inkSoft: '#5a4e45',
  accent: '#b84a2f',
  accentDeep: '#8a3322',
  gold: '#c89a3e',
  sage: '#6b8562',
  sky: '#7a98a8',
  plum: '#8a5a78',
};

// ============ PICK-A-CARD CONTENT ============
const AREAS = [
  {
    id: 'prayer',
    label: 'Prayer',
    icon: HandHeart,
    color: styles.accent,
    cards: [
      { id: 'p1', text: 'I pray daily and it feels alive' },
      { id: 'p2', text: 'I pray, but it feels like a monologue' },
      { id: 'p3', text: 'I mostly pray in crisis mode' },
      { id: 'p4', text: "I've been dry lately" },
      { id: 'p5', text: 'I want to start again' },
    ],
  },
  {
    id: 'word',
    label: "God's Word",
    icon: BookOpen,
    color: styles.sage,
    cards: [
      { id: 'w1', text: "I'm in the Word most days and it's feeding me" },
      { id: 'w2', text: 'I read it, but it feels like homework' },
      { id: 'w3', text: 'I read it on Sundays, rarely otherwise' },
      { id: 'w4', text: "I haven't opened it in a while" },
      { id: 'w5', text: 'I want to rebuild the habit' },
    ],
  },
  {
    id: 'service',
    label: 'Church Service',
    icon: Users,
    color: styles.sky,
    cards: [
      { id: 's1', text: "I'm there nearly every week, fully present" },
      { id: 's2', text: 'I show up, but my mind wanders' },
      { id: 's3', text: 'I come when I can' },
      { id: 's4', text: "I've been drifting away" },
      { id: 's5', text: 'I want to recommit to being there' },
    ],
  },
  {
    id: 'missions',
    label: 'Missions',
    icon: Globe,
    color: styles.gold,
    cards: [
      { id: 'm1', text: "I'm actively involved in mission work" },
      { id: 'm2', text: 'I support missions from a distance' },
      { id: 'm3', text: "I care, but I don't really do anything" },
      { id: 'm4', text: "I haven't thought much about it" },
      { id: 'm5', text: 'I want to explore what my part could be' },
    ],
  },
  {
    id: 'serving',
    label: 'Serving Others',
    icon: Heart,
    color: styles.plum,
    cards: [
      { id: 'sv1', text: "I'm serving regularly and it brings me joy" },
      { id: 'sv2', text: 'I serve, but sometimes out of obligation' },
      { id: 'sv3', text: 'I serve when asked' },
      { id: 'sv4', text: "I've stepped back from serving" },
      { id: 'sv5', text: 'I want to find my place to serve' },
    ],
  },
];

// ============ BINGO TILES ============
const BINGO_TILES = [
  { id: 'b1', icon: '🍲', label: 'Combined lifegroup potluck' },
  { id: 'b2', icon: '⛰️', label: 'Hiking retreat together' },
  { id: 'b3', icon: '🙏', label: 'Prayer walk in the neighbourhood' },
  { id: 'b4', icon: '🏠', label: 'Serve at a shelter' },
  { id: 'b5', icon: '✝️', label: 'Testimony night' },
  { id: 'b6', icon: '🍞', label: 'Cook for a widow / elderly' },
  { id: 'b7', icon: '📖', label: 'Book study together' },
  { id: 'b8', icon: '🎶', label: 'Worship night at home' },
  { id: 'b9', icon: '🌏', label: 'Short mission trip' },
  { id: 'b10', icon: '👶', label: 'Family-inclusive gathering' },
  { id: 'b11', icon: '☕', label: 'Coffee + deep talk pairs' },
  { id: 'b12', icon: '🧒', label: 'Serve a children\'s home' },
  { id: 'b13', icon: '💌', label: 'Write encouragement letters' },
  { id: 'b14', icon: '🌊', label: 'Baptism celebration trip' },
  { id: 'b15', icon: '🎨', label: 'Creative/arts night' },
  { id: 'b16', icon: '🏃', label: 'Fitness + devotion combo' },
  { id: 'b17', icon: '🍳', label: 'Breakfast before church' },
  { id: 'b18', icon: '📱', label: 'Digital fast weekend' },
  { id: 'b19', icon: '🚗', label: 'Visit another lifegroup' },
  { id: 'b20', icon: '🌱', label: 'Plant something together' },
  { id: 'b21', icon: '🎁', label: 'Secret blessing exchange' },
  { id: 'b22', icon: '🍽️', label: 'Host a seeker dinner' },
  { id: 'b23', icon: '💭', label: 'Vision-casting retreat' },
  { id: 'b24', icon: '✍️', label: 'Wildcard — write your own' },
];

// ============ KIDS MISSION CARDS ============
const KID_MISSIONS = [
  { id: 'k1', icon: '🤗', text: 'Give someone in lifegroup a big hug tonight' },
  { id: 'k2', icon: '💬', text: 'Tell someone one thing you love about them' },
  { id: 'k3', icon: '🙏', text: 'Pray out loud for one person here' },
  { id: 'k4', icon: '😄', text: 'Make someone laugh with a joke' },
  { id: 'k5', icon: '🎨', text: 'Draw a picture for a friend' },
  { id: 'k6', icon: '👂', text: 'Listen to someone without talking for 1 min' },
  { id: 'k7', icon: '🎁', text: 'Find something nice to say to an adult' },
  { id: 'k8', icon: '🤝', text: 'Help tidy up after the meeting' },
  { id: 'k9', icon: '🌟', text: 'Tell someone you are thankful for them' },
  { id: 'k10', icon: '📖', text: 'Share your favourite Bible story with someone' },
];

// ============ MAIN APP ============
export default function StirUpApp() {
  const [view, setView] = useState('home');
  const [userId] = useState(() => {
    const existing = sessionStorage.getItem('stirup_uid');
    if (existing) return existing;
    const fresh = 'u_' + Math.random().toString(36).slice(2, 9);
    sessionStorage.setItem('stirup_uid', fresh);
    return fresh;
  });
  const [userName, setUserName] = useState(() => sessionStorage.getItem('stirup_name') || '');

  useEffect(() => {
    if (userName) sessionStorage.setItem('stirup_name', userName);
  }, [userName]);

  return (
    <div style={{
      minHeight: '100vh',
      background: styles.bg,
      color: styles.ink,
      fontFamily: '"Lora", Georgia, serif',
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(200,154,62,0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(184,74,47,0.06) 0%, transparent 50%),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(90,78,69,0.015) 2px, rgba(90,78,69,0.015) 4px)
      `,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.02em; }
        .italic-display { font-family: 'Fraunces', Georgia, serif; font-style: italic; }
        button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
        .paper-card {
          background: #faf5e8;
          border: 1px solid rgba(90,78,69,0.15);
          border-radius: 4px;
          box-shadow: 0 1px 0 rgba(90,78,69,0.08), 0 8px 24px -12px rgba(42,35,32,0.2);
          position: relative;
        }
        .ink-btn {
          background: ${styles.ink};
          color: ${styles.bg};
          padding: 14px 28px;
          border-radius: 2px;
          font-weight: 600;
          letter-spacing: 0.02em;
          font-size: 15px;
          transition: transform 0.15s, background 0.15s;
        }
        .ink-btn:hover { background: ${styles.accent}; transform: translateY(-1px); }
        .ink-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; background: ${styles.ink}; }
        .ghost-btn {
          border: 1px solid ${styles.ink};
          padding: 10px 20px;
          border-radius: 2px;
          font-weight: 500;
          transition: background 0.15s;
        }
        .ghost-btn:hover { background: ${styles.ink}; color: ${styles.bg}; }
        .sparkle-underline {
          background-image: linear-gradient(transparent 60%, ${styles.gold}55 60%, ${styles.gold}55 90%, transparent 90%);
        }
        input, textarea {
          font-family: inherit;
          background: transparent;
          border: none;
          border-bottom: 1px solid ${styles.inkSoft};
          padding: 8px 0;
          font-size: 16px;
          color: ${styles.ink};
          width: 100%;
          outline: none;
        }
        input:focus, textarea:focus { border-bottom-color: ${styles.accent}; }
        textarea { resize: vertical; min-height: 80px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease-out backwards; }
        @keyframes flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .flicker { animation: flicker 3s ease-in-out infinite; }
      `}</style>

      {view === 'home' && <Home1 setView={setView} userName={userName} setUserName={setUserName} />}
      {view === 'reflect' && <Reflect userId={userId} userName={userName} setView={setView} />}
      {view === 'bingo' && <Bingo userId={userId} userName={userName} setView={setView} />}
      {view === 'prayer' && <PrayerChain userId={userId} userName={userName} setView={setView} />}
      {view === 'kids' && <KidsZone userId={userId} userName={userName} setView={setView} />}
    </div>
  );
}

// ============ HOME ============
function Home1({ setView, userName, setUserName }) {
  const [nameInput, setNameInput] = useState(userName);

  const sections = [
    { id: 'reflect', label: 'How am I doing?', sub: 'A quiet check-in', icon: HandHeart, color: styles.accent },
    { id: 'bingo', label: 'Dream Bingo', sub: 'What should we do together?', icon: Sparkles, color: styles.sage },
    { id: 'prayer', label: 'Prayer Pass', sub: 'Carry someone else\'s', icon: Heart, color: styles.plum },
    { id: 'kids', label: "Kids' Zone", sub: 'Missions for the little ones', icon: Users, color: styles.gold },
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: styles.inkSoft, marginBottom: 24 }}>
          Hebrews 10 · 24—25
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(40px, 7vw, 64px)', lineHeight: 1.05, margin: '0 0 24px', fontWeight: 800 }}>
          Stir <span className="italic-display" style={{ color: styles.accent, fontWeight: 400 }}>one another</span> up
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: styles.inkSoft, maxWidth: 480, margin: '0 auto', fontStyle: 'italic' }}>
          "…to love and good works, not neglecting to meet together, but encouraging one another,
          and all the more as you see the Day drawing near."
        </p>
      </div>

      <div className="paper-card fade-up" style={{ padding: 28, marginBottom: 32, animationDelay: '0.15s' }}>
        <label style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: styles.inkSoft }}>
          Your name (for the group)
        </label>
        <input
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          onBlur={() => setUserName(nameInput)}
          placeholder="e.g. Peter"
          style={{ marginTop: 8 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => nameInput.trim() && (setUserName(nameInput), setView(s.id))}
              disabled={!nameInput.trim()}
              className="paper-card fade-up"
              style={{
                padding: 24,
                textAlign: 'left',
                opacity: nameInput.trim() ? 1 : 0.5,
                cursor: nameInput.trim() ? 'pointer' : 'not-allowed',
                animationDelay: `${0.2 + i * 0.08}s`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { if (nameInput.trim()) e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#faf5e8',
                }}>
                  <Icon size={20} />
                </div>
                <div className="display" style={{ fontSize: 22, fontWeight: 600 }}>{s.label}</div>
              </div>
              <div style={{ fontSize: 14, color: styles.inkSoft, fontStyle: 'italic' }}>{s.sub}</div>
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 64, fontSize: 12, color: styles.inkSoft, letterSpacing: '0.1em' }}>
        <span className="flicker">✦</span> &nbsp; put the phone down often &nbsp; <span className="flicker">✦</span>
      </div>
    </div>
  );
}

// ============ PART 1: REFLECT ============
function Reflect({ userId, userName, setView }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [prayerNotes, setPrayerNotes] = useState({});
  const [shareFlags, setShareFlags] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [allResponses, setAllResponses] = useState([]);

  const area = AREAS[step];
  const isLast = step === AREAS.length - 1;
  const canProceed = answers[area?.id];

  const submit = async () => {
    const payload = {
      userId, userName, answers, prayerNotes, shareFlags,
      timestamp: Date.now(),
    };
    try {
      await window.storage.set(`reflect:${userId}`, JSON.stringify(payload), true);
      await loadAll();
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setSubmitted(true);
    }
  };

  const loadAll = async () => {
    try {
      const list = await window.storage.list('reflect:', true);
      if (!list?.keys) return;
      const all = [];
      for (const k of list.keys) {
        try {
          const r = await window.storage.get(k, true);
          if (r) all.push(JSON.parse(r.value));
        } catch {}
      }
      setAllResponses(all);
    } catch (e) { console.error(e); }
  };

  if (submitted) {
    return <ReflectResults allResponses={allResponses} setView={setView} myId={userId} />;
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 80px' }}>
      <TopBar setView={setView} />

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: styles.inkSoft, marginBottom: 8 }}>
          Part One · A Quiet Check-in
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
          {AREAS.map((a, i) => (
            <div key={a.id} style={{
              height: 3, flex: 1,
              background: i <= step ? a.color : 'rgba(90,78,69,0.15)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>

      <div key={area.id} className="fade-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: area.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#faf5e8',
          }}>
            <area.icon size={22} />
          </div>
          <h2 className="display" style={{ fontSize: 36, margin: 0, fontWeight: 600 }}>
            {area.label}
          </h2>
        </div>

        <p style={{ fontSize: 16, color: styles.inkSoft, marginBottom: 28, fontStyle: 'italic' }}>
          Which of these sounds most like you right now? There's no wrong answer — just be honest.
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
            <label style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: styles.inkSoft }}>
              One sentence — what can the group pray for you in this?
            </label>
            <textarea
              value={prayerNotes[area.id] || ''}
              onChange={e => setPrayerNotes({ ...prayerNotes, [area.id]: e.target.value })}
              placeholder="(optional)"
              style={{ marginTop: 8 }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, fontSize: 14, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!shareFlags[area.id]}
                onChange={e => setShareFlags({ ...shareFlags, [area.id]: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: area.color }}
              />
              <span style={{ color: styles.inkSoft }}>
                {shareFlags[area.id] ? <Eye size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> : <EyeOff size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                &nbsp; Share this with the group
              </span>
            </label>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button
            onClick={() => step > 0 ? setStep(step - 1) : setView('home')}
            className="ghost-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            onClick={() => isLast ? submit() : setStep(step + 1)}
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

function ReflectResults({ allResponses, setView, myId }) {
  const myResp = allResponses.find(r => r.userId === myId);

  const aggregate = {};
  AREAS.forEach(a => {
    aggregate[a.id] = {};
    a.cards.forEach(c => { aggregate[a.id][c.id] = 0; });
  });
  allResponses.forEach(r => {
    Object.entries(r.answers || {}).forEach(([areaId, cardId]) => {
      if (aggregate[areaId]?.[cardId] !== undefined) aggregate[areaId][cardId]++;
    });
  });

  const sharedNotes = [];
  allResponses.forEach(r => {
    Object.entries(r.shareFlags || {}).forEach(([areaId, shared]) => {
      if (shared && r.prayerNotes?.[areaId]) {
        sharedNotes.push({ name: r.userName, area: areaId, note: r.prayerNotes[areaId] });
      }
    });
  });

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>
      <TopBar setView={setView} />

      <div className="fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: styles.inkSoft, marginBottom: 8 }}>
          Received
        </div>
        <h2 className="display" style={{ fontSize: 40, margin: '0 0 12px', fontWeight: 600 }}>
          Thank you, {myResp?.userName || 'friend'}
        </h2>
        <p style={{ fontStyle: 'italic', color: styles.inkSoft }}>
          {allResponses.length} {allResponses.length === 1 ? 'person has' : 'people have'} shared so far.
        </p>
      </div>

      <h3 className="display" style={{ fontSize: 22, marginBottom: 16 }}>Where the group stands</h3>
      {AREAS.map(a => {
        const total = Object.values(aggregate[a.id]).reduce((s, n) => s + n, 0);
        if (total === 0) return null;
        return (
          <div key={a.id} className="paper-card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <a.icon size={18} style={{ color: a.color }} />
              <div className="display" style={{ fontSize: 18, fontWeight: 600 }}>{a.label}</div>
            </div>
            {a.cards.map(c => {
              const count = aggregate[a.id][c.id];
              const pct = total ? (count / total) * 100 : 0;
              return (
                <div key={c.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span>{c.text}</span>
                    <span style={{ color: styles.inkSoft, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(90,78,69,0.1)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: a.color, borderRadius: 3, transition: 'width 0.6s' }} />
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
            const area = AREAS.find(a => a.id === n.area);
            return (
              <div key={i} className="paper-card" style={{ padding: 18, marginBottom: 12, borderLeft: `4px solid ${area?.color}` }}>
                <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: styles.inkSoft, marginBottom: 6 }}>
                  {n.name} · {area?.label}
                </div>
                <div style={{ fontStyle: 'italic', fontSize: 15 }}>"{n.note}"</div>
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

// ============ PART 2: BINGO ============
function Bingo({ userId, userName, setView }) {
  const [picks, setPicks] = useState(new Set());
  const [wildcard, setWildcard] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [allPicks, setAllPicks] = useState([]);

  const MAX_PICKS = 7;

  const toggle = (id) => {
    const next = new Set(picks);
    if (next.has(id)) next.delete(id);
    else if (next.size < MAX_PICKS) next.add(id);
    setPicks(next);
  };

  const submit = async () => {
    const payload = { userId, userName, picks: [...picks], wildcard, timestamp: Date.now() };
    try {
      await window.storage.set(`bingo:${userId}`, JSON.stringify(payload), true);
      await loadAll();
      setSubmitted(true);
    } catch (e) { console.error(e); setSubmitted(true); }
  };

  const loadAll = async () => {
    try {
      const list = await window.storage.list('bingo:', true);
      if (!list?.keys) return;
      const all = [];
      for (const k of list.keys) {
        try {
          const r = await window.storage.get(k, true);
          if (r) all.push(JSON.parse(r.value));
        } catch {}
      }
      setAllPicks(all);
    } catch (e) { console.error(e); }
  };

  if (submitted) {
    return <BingoResults allPicks={allPicks} setView={setView} />;
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 24px 80px' }}>
      <TopBar setView={setView} />

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: styles.inkSoft, marginBottom: 8 }}>
          Part Two · Dream Bingo
        </div>
        <h2 className="display" style={{ fontSize: 36, margin: '0 0 8px', fontWeight: 600 }}>
          What should we do <span className="italic-display" style={{ color: styles.sage, fontWeight: 400 }}>together</span>?
        </h2>
        <p style={{ color: styles.inkSoft, fontStyle: 'italic' }}>
          Pick up to <strong>{MAX_PICKS}</strong> things you'd most want our lifegroup to do. Limited picks means real priority.
        </p>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 13, color: styles.inkSoft }}>Selected:</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: MAX_PICKS }).map((_, i) => (
              <div key={i} style={{
                width: 16, height: 16, borderRadius: '50%',
                background: i < picks.size ? styles.sage : 'transparent',
                border: `1.5px solid ${styles.sage}`,
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 10,
        marginBottom: 24,
      }}>
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
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6,
                background: picked ? styles.sage : '#faf5e8',
                color: picked ? '#faf5e8' : styles.ink,
                transform: picked ? 'scale(0.96)' : 'scale(1)',
                transition: 'all 0.2s',
                opacity: !picked && picks.size >= MAX_PICKS ? 0.4 : 1,
                animationDelay: `${i * 0.02}s`,
                border: isWildcard ? `2px dashed ${picked ? '#faf5e8' : styles.gold}` : undefined,
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
          <label style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: styles.inkSoft }}>
            Your wildcard idea
          </label>
          <input
            value={wildcard}
            onChange={e => setWildcard(e.target.value)}
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

function BingoResults({ allPicks, setView }) {
  const counts = {};
  BINGO_TILES.forEach(t => { counts[t.id] = 0; });
  const wildcards = [];
  allPicks.forEach(p => {
    (p.picks || []).forEach(id => { if (counts[id] !== undefined) counts[id]++; });
    if (p.wildcard?.trim()) wildcards.push({ name: p.userName, text: p.wildcard });
  });

  const sorted = BINGO_TILES
    .filter(t => t.id !== 'b24')
    .map(t => ({ ...t, count: counts[t.id] }))
    .sort((a, b) => b.count - a.count);

  const max = Math.max(...sorted.map(s => s.count), 1);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>
      <TopBar setView={setView} />

      <div className="fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: styles.inkSoft, marginBottom: 8 }}>
          The group dreams
        </div>
        <h2 className="display" style={{ fontSize: 36, margin: '0 0 8px', fontWeight: 600 }}>
          What's <span className="italic-display" style={{ color: styles.sage, fontWeight: 400 }}>rising to the top</span>
        </h2>
        <p style={{ fontStyle: 'italic', color: styles.inkSoft }}>
          {allPicks.length} {allPicks.length === 1 ? 'vote' : 'votes'} in
        </p>
      </div>

      <div style={{ marginBottom: 40 }}>
        {sorted.map((t, i) => (
          <div key={t.id} style={{ marginBottom: 10, opacity: t.count === 0 ? 0.35 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span style={{ flex: 1, fontSize: 14 }}>{t.label}</span>
              <span style={{ fontSize: 13, color: styles.inkSoft, fontVariantNumeric: 'tabular-nums' }}>
                {t.count}
              </span>
            </div>
            <div style={{ height: 8, background: 'rgba(90,78,69,0.1)', borderRadius: 4 }}>
              <div style={{
                height: '100%',
                width: `${(t.count / max) * 100}%`,
                background: i < 3 ? styles.accent : styles.sage,
                borderRadius: 4,
                transition: 'width 0.8s',
              }} />
            </div>
          </div>
        ))}
      </div>

      {wildcards.length > 0 && (
        <>
          <h3 className="display" style={{ fontSize: 22, marginBottom: 16 }}>
            Wildcard dreams <Sparkles size={18} style={{ display: 'inline', color: styles.gold }} />
          </h3>
          {wildcards.map((w, i) => (
            <div key={i} className="paper-card" style={{ padding: 18, marginBottom: 10, borderLeft: `4px solid ${styles.gold}` }}>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: styles.inkSoft, marginBottom: 6 }}>
                {w.name}
              </div>
              <div style={{ fontStyle: 'italic', fontSize: 15 }}>"{w.text}"</div>
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

// ============ PART 3: PRAYER CHAIN ============
function PrayerChain({ userId, userName, setView }) {
  const [mode, setMode] = useState('write'); // write | receive | done
  const [prayerText, setPrayerText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [myReceived, setMyReceived] = useState(null);
  const [allPrayers, setAllPrayers] = useState([]);
  const [prayed, setPrayed] = useState(false);

  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = async () => {
    try {
      const list = await window.storage.list('prayer:', true);
      if (!list?.keys) return;
      const all = [];
      for (const k of list.keys) {
        try {
          const r = await window.storage.get(k, true);
          if (r) all.push(JSON.parse(r.value));
        } catch {}
      }
      setAllPrayers(all);
    } catch (e) { console.error(e); }
  };

  const submit = async () => {
    const payload = {
      userId, userName, text: prayerText, anonymous,
      timestamp: Date.now(), prayedCount: 0,
    };
    try {
      await window.storage.set(`prayer:${userId}`, JSON.stringify(payload), true);
      await loadPrayers();
      setMode('receive');
      assignPrayer();
    } catch (e) { console.error(e); }
  };

  const assignPrayer = async () => {
    try {
      const list = await window.storage.list('prayer:', true);
      const all = [];
      for (const k of list.keys || []) {
        try {
          const r = await window.storage.get(k, true);
          if (r) all.push({ ...JSON.parse(r.value), _key: k });
        } catch {}
      }
      const others = all.filter(p => p.userId !== userId);
      if (others.length === 0) {
        setMyReceived(null);
        return;
      }
      const pick = others[Math.floor(Math.random() * others.length)];
      setMyReceived(pick);
    } catch (e) { console.error(e); }
  };

  const markPrayed = async () => {
    if (!myReceived) return;
    try {
      const r = await window.storage.get(`prayer:${myReceived.userId}`, true);
      if (r) {
        const data = JSON.parse(r.value);
        data.prayedCount = (data.prayedCount || 0) + 1;
        await window.storage.set(`prayer:${myReceived.userId}`, JSON.stringify(data), true);
      }
      setPrayed(true);
    } catch (e) { console.error(e); setPrayed(true); }
  };

  const myPrayer = allPrayers.find(p => p.userId === userId);

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '32px 24px 80px' }}>
      <TopBar setView={setView} />

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: styles.inkSoft, marginBottom: 8 }}>
          Part Three · Prayer Pass
        </div>
        <h2 className="display" style={{ fontSize: 36, margin: 0, fontWeight: 600 }}>
          Carry <span className="italic-display" style={{ color: styles.plum, fontWeight: 400 }}>someone else's</span>
        </h2>
      </div>

      {mode === 'write' && (
        <div className="fade-up">
          <div className="paper-card" style={{ padding: 28, marginBottom: 20 }}>
            <label style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: styles.inkSoft, display: 'block', marginBottom: 12 }}>
              Write a prayer request to pass on
            </label>
            <textarea
              value={prayerText}
              onChange={e => setPrayerText(e.target.value)}
              placeholder="What's weighing on you? What are you hoping for?"
              style={{ minHeight: 140, fontSize: 16, lineHeight: 1.6 }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, fontSize: 14, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={e => setAnonymous(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: styles.plum }}
              />
              <span style={{ color: styles.inkSoft }}>Pass this on anonymously</span>
            </label>
          </div>

          <p style={{ fontSize: 13, color: styles.inkSoft, fontStyle: 'italic', marginBottom: 24, textAlign: 'center' }}>
            When you submit, you'll receive someone else's prayer to carry.
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
          <p style={{ textAlign: 'center', fontStyle: 'italic', color: styles.inkSoft, marginBottom: 24 }}>
            You've been entrusted with this…
          </p>

          {myReceived ? (
            <div className="paper-card" style={{
              padding: 36,
              marginBottom: 24,
              background: '#fffaed',
              borderLeft: `4px solid ${styles.plum}`,
            }}>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: styles.inkSoft, marginBottom: 16 }}>
                {myReceived.anonymous ? 'Anonymous' : `From ${myReceived.userName}`}
              </div>
              <div className="display" style={{ fontSize: 20, lineHeight: 1.6, fontStyle: 'italic' }}>
                "{myReceived.text}"
              </div>
            </div>
          ) : (
            <div className="paper-card" style={{ padding: 28, marginBottom: 24, textAlign: 'center' }}>
              <p style={{ fontStyle: 'italic' }}>You're the first one here. Your prayer is waiting to be picked up.</p>
            </div>
          )}

          {myReceived && !prayed && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: styles.inkSoft, marginBottom: 16 }}>
                Take a moment now. Pray for them — silently or aloud.
              </p>
              <button onClick={markPrayed} className="ink-btn" style={{ background: styles.plum }}>
                🙏 &nbsp; I've prayed
              </button>
            </div>
          )}

          {prayed && (
            <div className="paper-card fade-up" style={{ padding: 24, textAlign: 'center', background: '#fffaed' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🙏</div>
              <p style={{ fontStyle: 'italic', fontSize: 16 }}>Your prayer was received.</p>
              <p style={{ fontSize: 13, color: styles.inkSoft, marginTop: 8 }}>
                They'll see that someone carried it for them today.
              </p>
            </div>
          )}

          {myPrayer && (myPrayer.prayedCount || 0) > 0 && (
            <div className="fade-up" style={{ marginTop: 24, textAlign: 'center', padding: 20, borderTop: `1px dashed ${styles.inkSoft}` }}>
              <p style={{ fontSize: 14, color: styles.inkSoft }}>
                <Heart size={14} style={{ display: 'inline', color: styles.accent, verticalAlign: 'middle' }} /> &nbsp;
                {myPrayer.prayedCount} {myPrayer.prayedCount === 1 ? 'person has' : 'people have'} prayed for you today.
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button onClick={() => setView('kids')} className="ghost-btn">
              Next → Kids' Zone <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ PART 4: KIDS ZONE ============
function KidsZone({ userId, userName, setView }) {
  const [sub, setSub] = useState('menu'); // menu | mission | draw

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>
      <TopBar setView={setView} />

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: styles.inkSoft, marginBottom: 8 }}>
          Part Four · Kids' Zone
        </div>
        <h2 className="display" style={{ fontSize: 36, margin: 0, fontWeight: 600 }}>
          For the <span className="italic-display" style={{ color: styles.gold, fontWeight: 400 }}>little ones</span>
        </h2>
      </div>

      {sub === 'menu' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <button
            onClick={() => setSub('mission')}
            className="paper-card fade-up"
            style={{ padding: 32, textAlign: 'center', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎯</div>
            <div className="display" style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Mission Card</div>
            <div style={{ fontSize: 14, color: styles.inkSoft, fontStyle: 'italic' }}>Get a kindness mission to do tonight</div>
          </button>
          <button
            onClick={() => setSub('draw')}
            className="paper-card fade-up"
            style={{ padding: 32, textAlign: 'center', animationDelay: '0.1s', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎨</div>
            <div className="display" style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Draw-a-Friend</div>
            <div style={{ fontSize: 14, color: styles.inkSoft, fontStyle: 'italic' }}>Draw a picture for someone in the group</div>
          </button>
        </div>
      )}

      {sub === 'mission' && <MissionCard onBack={() => setSub('menu')} />}
      {sub === 'draw' && <DrawAFriend userId={userId} userName={userName} onBack={() => setSub('menu')} />}
    </div>
  );
}

function MissionCard({ onBack }) {
  const [mission, setMission] = useState(null);
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
          <p style={{ fontSize: 18, marginBottom: 32, color: styles.inkSoft }}>
            Ready to get a mission?
          </p>
          <button onClick={draw} className="ink-btn" style={{ background: styles.gold, color: styles.ink, fontSize: 18, padding: '16px 40px' }}>
            🎴 &nbsp; Draw a card
          </button>
        </>
      )}

      {mission && (
        <div className="fade-up">
          <div className="paper-card" style={{
            padding: 48,
            maxWidth: 420,
            margin: '0 auto 24px',
            background: '#fffaed',
            transform: 'rotate(-1deg)',
            boxShadow: '0 8px 30px -10px rgba(42,35,32,0.3)',
          }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>{mission.icon}</div>
            <div className="display" style={{ fontSize: 22, lineHeight: 1.4, fontWeight: 600 }}>
              {mission.text}
            </div>
          </div>

          {!done && (
            <button onClick={() => setDone(true)} className="ink-btn" style={{ background: styles.gold, color: styles.ink }}>
              ✓ &nbsp; I did it!
            </button>
          )}
          {done && (
            <div className="fade-up" style={{ fontSize: 20, color: styles.accent, marginTop: 16 }}>
              🌟 You're a stirrer-upper! 🌟
            </div>
          )}

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button onClick={draw} className="ghost-btn">Another mission</button>
            <button onClick={onBack} className="ghost-btn">Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DrawAFriend({ userId, userName, onBack }) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState(styles.accent);
  const [drawing, setDrawing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [allDrawings, setAllDrawings] = useState([]);
  const [friendFor, setFriendFor] = useState('');

  const COLORS = [styles.accent, styles.sage, styles.sky, styles.gold, styles.plum, styles.ink];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fffaed';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touch = e.touches?.[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const start = (e) => {
    e.preventDefault();
    setDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fffaed';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSaved(false);
  };

  const save = async () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const payload = {
      userId, userName, friendFor,
      image: dataUrl, timestamp: Date.now(),
    };
    try {
      await window.storage.set(`drawing:${userId}:${Date.now()}`, JSON.stringify(payload), true);
      setSaved(true);
      loadDrawings();
    } catch (e) { console.error(e); setSaved(true); }
  };

  const loadDrawings = async () => {
    try {
      const list = await window.storage.list('drawing:', true);
      if (!list?.keys) return;
      const all = [];
      for (const k of list.keys) {
        try {
          const r = await window.storage.get(k, true);
          if (r) all.push(JSON.parse(r.value));
        } catch {}
      }
      setAllDrawings(all.sort((a, b) => b.timestamp - a.timestamp));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadDrawings(); }, []);

  return (
    <div className="fade-up">
      <p style={{ fontSize: 15, color: styles.inkSoft, marginBottom: 16, textAlign: 'center' }}>
        Draw a picture for someone in the lifegroup!
      </p>

      <div className="paper-card" style={{ padding: 12, marginBottom: 16 }}>
        <label style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: styles.inkSoft }}>
          Who is it for?
        </label>
        <input
          value={friendFor}
          onChange={e => setFriendFor(e.target.value)}
          placeholder="Auntie May, Uncle Peter, my best friend…"
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Palette size={16} style={{ color: styles.inkSoft }} />
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: c,
              border: color === c ? `3px solid ${styles.ink}` : '2px solid rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
          />
        ))}
        <button onClick={clear} className="ghost-btn" style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: 13 }}>
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
          border: `1px solid ${styles.inkSoft}`,
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
        <button onClick={save} disabled={!friendFor.trim()} className="ink-btn" style={{ background: styles.gold, color: styles.ink }}>
          {saved ? '✓ Saved!' : 'Save drawing'}
        </button>
      </div>

      {allDrawings.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3 className="display" style={{ fontSize: 20, marginBottom: 12 }}>
            The gallery <span style={{ fontSize: 14, color: styles.inkSoft, fontWeight: 400 }}>· {allDrawings.length}</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {allDrawings.slice(0, 12).map((d, i) => (
              <div key={i} className="paper-card" style={{ padding: 6, transform: `rotate(${(i % 2 ? 1 : -1) * (Math.random() * 2)}deg)` }}>
                <img src={d.image} alt="" style={{ width: '100%', display: 'block', borderRadius: 2 }} />
                <div style={{ padding: '6px 4px 2px', fontSize: 11, color: styles.inkSoft, textAlign: 'center' }}>
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

// ============ SHARED: TOP BAR ============
function TopBar({ setView }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
      <button
        onClick={() => setView('home')}
        style={{
          fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
          color: styles.inkSoft, display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <Home size={14} /> Home
      </button>
    </div>
  );
}
