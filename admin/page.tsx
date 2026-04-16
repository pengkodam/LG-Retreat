'use client';

import { useEffect, useState } from 'react';
import { HandHeart, Sparkles, Heart, Palette, AlertTriangle, Lock, RefreshCw, Trash2, Check, ArrowLeft } from 'lucide-react';
import { tokens } from '@/lib/content';

type Counts = { reflect: number; bingo: number; prayer: number; drawing: number };

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [groupId, setGroupId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<string | null>(null);
  const [justDeleted, setJustDeleted] = useState<{ kind: string; count: number } | null>(null);

  // Restore secret from sessionStorage for convenience during a session
  useEffect(() => {
    const saved = sessionStorage.getItem('stirup_admin_secret');
    if (saved) {
      setSecret(saved);
      tryAuth(saved);
    }
  }, []);

  const tryAuth = async (s: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-secret': s },
        cache: 'no-store',
      });
      if (res.status === 401) {
        setError('Wrong passphrase');
        setAuthed(false);
        sessionStorage.removeItem('stirup_admin_secret');
        return;
      }
      if (!res.ok) {
        setError('Server error — check ADMIN_SECRET env var is set');
        return;
      }
      const data = await res.json();
      setCounts(data.counts);
      setGroupId(data.groupId);
      setAuthed(true);
      sessionStorage.setItem('stirup_admin_secret', s);
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (!authed) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-secret': secret },
        cache: 'no-store',
      });
      const data = await res.json();
      setCounts(data.counts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const doReset = async (kind: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: {
          'x-admin-secret': secret,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kind }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Reset failed');
        return;
      }
      const data = await res.json();
      setJustDeleted({ kind, count: data.deleted });
      setConfirm(null);
      await refresh();
      setTimeout(() => setJustDeleted(null), 4000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthed(false);
    setSecret('');
    setCounts(null);
    sessionStorage.removeItem('stirup_admin_secret');
  };

  // ============ GATE ============
  if (!authed) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#1a1715',
          color: '#e8dfc9',
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        }}
      >
        <div style={{ maxWidth: 380, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, color: '#c89a3e' }}>
            <Lock size={18} />
            <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Admin · Stir One Another Up
            </div>
          </div>

          <div style={{ fontSize: 13, lineHeight: 1.6, color: '#a89a80', marginBottom: 24 }}>
            Enter the admin passphrase. This is the <code style={codeStyle}>ADMIN_SECRET</code> environment variable configured in Vercel.
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              tryAuth(secret);
            }}
          >
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="passphrase"
              autoFocus
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#25201d',
                border: '1px solid #3a332e',
                borderRadius: 3,
                color: '#e8dfc9',
                fontFamily: 'inherit',
                fontSize: 14,
                outline: 'none',
                marginBottom: 16,
              }}
            />
            <button
              type="submit"
              disabled={loading || !secret}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: loading || !secret ? '#3a332e' : '#c89a3e',
                color: loading || !secret ? '#6a5f50' : '#1a1715',
                border: 'none',
                borderRadius: 3,
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: loading || !secret ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Checking…' : 'Enter'}
            </button>
          </form>

          {error && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: '#3a1f1a',
                borderLeft: '3px solid #b84a2f',
                color: '#e8a998',
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginTop: 32, fontSize: 11, color: '#6a5f50' }}>
            <a href="/" style={{ color: '#a89a80', textDecoration: 'none' }}>
              ← back to app
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ============ DASHBOARD ============
  const rows = [
    { key: 'reflect', label: 'Reflections', icon: HandHeart, desc: 'Pick-a-card self-reflection responses', color: tokens.accent },
    { key: 'bingo', label: 'Bingo votes', icon: Sparkles, desc: 'Dream Bingo tile picks + wildcards', color: tokens.sage },
    { key: 'prayer', label: 'Prayers', icon: Heart, desc: 'Prayer requests in the chain', color: tokens.plum },
    { key: 'drawing', label: 'Drawings', icon: Palette, desc: 'Kids Draw-a-Friend canvases', color: tokens.gold },
  ];

  const total = counts ? counts.reflect + counts.bingo + counts.prayer + counts.drawing : 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1a1715',
        color: '#e8dfc9',
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        padding: '32px 24px 80px',
      }}
    >
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#c89a3e' }}>
            <Lock size={16} />
            <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Admin
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href="/"
              style={{
                fontSize: 11,
                color: '#a89a80',
                textDecoration: 'none',
                padding: '6px 12px',
                border: '1px solid #3a332e',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <ArrowLeft size={12} /> App
            </a>
            <button
              onClick={logout}
              style={{
                fontSize: 11,
                color: '#a89a80',
                padding: '6px 12px',
                border: '1px solid #3a332e',
                borderRadius: 3,
                background: 'transparent',
                fontFamily: 'inherit',
              }}
            >
              Lock
            </button>
          </div>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '16px 0 4px', letterSpacing: '-0.02em' }}>
          Control panel
        </h1>
        <div style={{ fontSize: 13, color: '#a89a80', marginBottom: 32 }}>
          Group: <code style={codeStyle}>{groupId}</code> · {total} total records
        </div>

        {/* Stats + reset grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {rows.map((row) => {
            const Icon = row.icon;
            const count = counts?.[row.key as keyof Counts] ?? 0;
            const isConfirming = confirm === row.key;
            return (
              <div
                key={row.key}
                style={{
                  background: '#25201d',
                  border: '1px solid #3a332e',
                  borderRadius: 4,
                  padding: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 3,
                      background: row.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1a1715',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{row.label}</div>
                    <div style={{ fontSize: 11, color: '#6a5f50', marginTop: 2 }}>{row.desc}</div>
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: count > 0 ? '#e8dfc9' : '#6a5f50',
                      fontVariantNumeric: 'tabular-nums',
                      minWidth: 40,
                      textAlign: 'right',
                    }}
                  >
                    {count}
                  </div>
                  <button
                    onClick={() => (isConfirming ? setConfirm(null) : setConfirm(row.key))}
                    disabled={count === 0 || loading}
                    style={{
                      padding: '8px 12px',
                      background: isConfirming ? '#b84a2f' : 'transparent',
                      color: isConfirming ? '#fff' : count === 0 ? '#4a423c' : '#e8a998',
                      border: `1px solid ${isConfirming ? '#b84a2f' : count === 0 ? '#2a2522' : '#8a3322'}`,
                      borderRadius: 3,
                      fontFamily: 'inherit',
                      fontSize: 11,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: count === 0 || loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Trash2 size={11} />
                    {isConfirming ? 'Cancel' : 'Reset'}
                  </button>
                </div>

                {isConfirming && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: 12,
                      background: '#3a1f1a',
                      borderLeft: '3px solid #b84a2f',
                      borderRadius: 2,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                      <AlertTriangle size={14} style={{ color: '#e8a998', marginTop: 1, flexShrink: 0 }} />
                      <div style={{ color: '#e8a998', lineHeight: 1.5 }}>
                        Delete all {count} {row.label.toLowerCase()}? This cannot be undone.
                      </div>
                    </div>
                    <button
                      onClick={() => doReset(row.key)}
                      disabled={loading}
                      style={{
                        padding: '8px 14px',
                        background: '#b84a2f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 3,
                        fontFamily: 'inherit',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: loading ? 'wait' : 'pointer',
                      }}
                    >
                      {loading ? 'Deleting…' : `Yes, delete ${count}`}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Refresh + nuke row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <button
            onClick={refresh}
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'transparent',
              color: '#a89a80',
              border: '1px solid #3a332e',
              borderRadius: 3,
              fontFamily: 'inherit',
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : undefined }} />
            Refresh counts
          </button>
          <button
            onClick={() => (confirm === 'all' ? setConfirm(null) : setConfirm('all'))}
            disabled={total === 0 || loading}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: confirm === 'all' ? '#b84a2f' : 'transparent',
              color: confirm === 'all' ? '#fff' : total === 0 ? '#4a423c' : '#e8a998',
              border: `1px solid ${confirm === 'all' ? '#b84a2f' : total === 0 ? '#2a2522' : '#8a3322'}`,
              borderRadius: 3,
              fontFamily: 'inherit',
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: total === 0 || loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Trash2 size={12} />
            {confirm === 'all' ? 'Cancel' : 'Reset everything'}
          </button>
        </div>

        {confirm === 'all' && (
          <div
            style={{
              padding: 16,
              background: '#3a1f1a',
              borderLeft: '3px solid #b84a2f',
              borderRadius: 2,
              fontSize: 13,
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
              <AlertTriangle size={16} style={{ color: '#e8a998', marginTop: 2, flexShrink: 0 }} />
              <div style={{ color: '#e8a998', lineHeight: 1.6 }}>
                This will delete <strong>everything</strong> in group <code style={codeStyle}>{groupId}</code>: all {total} records. Use this for a full reset between meetings.
              </div>
            </div>
            <button
              onClick={() => doReset('all')}
              disabled={loading}
              style={{
                padding: '10px 16px',
                background: '#b84a2f',
                color: '#fff',
                border: 'none',
                borderRadius: 3,
                fontFamily: 'inherit',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: loading ? 'wait' : 'pointer',
              }}
            >
              {loading ? 'Deleting…' : `Yes, wipe all ${total}`}
            </button>
          </div>
        )}

        {justDeleted && (
          <div
            style={{
              padding: 14,
              background: '#1f2f1a',
              borderLeft: '3px solid #6b8562',
              borderRadius: 2,
              fontSize: 13,
              color: '#b8d1a8',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 24,
            }}
          >
            <Check size={16} />
            Deleted {justDeleted.count} {justDeleted.kind === 'all' ? 'records' : `${justDeleted.kind} records`}.
          </div>
        )}

        {error && (
          <div
            style={{
              padding: 14,
              background: '#3a1f1a',
              borderLeft: '3px solid #b84a2f',
              borderRadius: 2,
              fontSize: 13,
              color: '#e8a998',
              marginBottom: 24,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ fontSize: 11, color: '#6a5f50', lineHeight: 1.7, marginTop: 32 }}>
          <div style={{ marginBottom: 6, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a89a80' }}>
            Notes
          </div>
          Resets only affect the current group (<code style={codeStyle}>{groupId}</code>). To switch groups, change <code style={codeStyle}>NEXT_PUBLIC_GROUP_ID</code> in Vercel and redeploy.
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const codeStyle: React.CSSProperties = {
  background: '#0f0d0c',
  padding: '2px 6px',
  borderRadius: 2,
  fontSize: '0.9em',
  color: '#c89a3e',
};
