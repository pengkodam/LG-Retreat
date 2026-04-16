'use client';

import { Home } from 'lucide-react';
import { tokens } from '@/lib/content';

export function TopBar({ onHome }: { onHome: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
      <button
        onClick={onHome}
        style={{
          fontSize: 12,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: tokens.inkSoft,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Home size={14} /> Home
      </button>
    </div>
  );
}
