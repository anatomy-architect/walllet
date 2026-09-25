import { useState } from 'react';

export function Button({ children, variant = 'primary', className = '', disabled, ...rest }) {
  const styles = {
    primary:
      'bg-aqua text-abyss font-semibold hover:brightness-110 shadow-[0_0_24px_rgba(0,229,255,0.35)]',
    gold: 'bg-gold text-abyss font-semibold hover:brightness-110 shadow-[0_0_24px_rgba(255,215,0,0.3)]',
    ghost: 'border border-aqua/40 text-aqua hover:bg-aqua/10',
    danger: 'bg-coral/15 border border-coral/50 text-coral hover:bg-coral/25',
    subtle: 'bg-white/5 border border-white/10 text-foam hover:bg-white/10',
  }[variant];
  return (
    <button
      className={`rounded-xl px-5 py-2.5 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${styles} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, className = '', ...rest }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-sm font-medium text-mist">{label}</span>}
      <input
        className="w-full rounded-xl border border-white/10 bg-abyss/60 px-4 py-2.5 text-sm text-foam placeholder:text-mist/50 focus:border-aqua/60 focus:outline-none"
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-coral">{error}</span>}
    </label>
  );
}

export function Select({ label, children, className = '', ...rest }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-sm font-medium text-mist">{label}</span>}
      <select
        className="w-full rounded-xl border border-white/10 bg-abyss/60 px-4 py-2.5 text-sm text-foam focus:border-aqua/60 focus:outline-none"
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}

export function Textarea({ label, className = '', ...rest }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-sm font-medium text-mist">{label}</span>}
      <textarea
        className="w-full rounded-xl border border-white/10 bg-abyss/60 px-4 py-2.5 text-sm text-foam placeholder:text-mist/50 focus:border-aqua/60 focus:outline-none"
        rows={3}
        {...rest}
      />
    </label>
  );
}

export function GlassCard({ children, className = '', bright = false }) {
  return <div className={`${bright ? 'glass-bright' : 'glass'} p-5 ${className}`}>{children}</div>;
}

export function StatCard({ label, value, sub, accent = 'text-aqua' }) {
  return (
    <GlassCard>
      <p className="text-xs uppercase tracking-wider text-mist">{label}</p>
      <p className={`font-display mt-1 text-2xl font-bold ${accent}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-mist">{sub}</p>}
    </GlassCard>
  );
}

const badgeStyles = {
  PENDING: 'bg-amber/15 text-amber border-amber/40',
  SUBMITTED: 'bg-amber/15 text-amber border-amber/40',
  PROCESSING: 'bg-amber/15 text-amber border-amber/40',
  SENT: 'bg-aqua/15 text-aqua border-aqua/40',
  ACTIVE: 'bg-kelp/15 text-kelp border-kelp/40',
  APPROVED: 'bg-kelp/15 text-kelp border-kelp/40',
  COMPLETED: 'bg-kelp/15 text-kelp border-kelp/40',
  REJECTED: 'bg-coral/15 text-coral border-coral/40',
  CANCELLED: 'bg-white/10 text-mist border-white/20',
  SUSPENDED: 'bg-coral/15 text-coral border-coral/40',
};

export function StatusBadge({ status }) {
  const s = badgeStyles[status] || 'bg-white/10 text-mist border-white/20';
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${s}`}>
      {String(status).replace(/_/g, ' ')}
    </span>
  );
}

export function Table({ columns, rows, renderRow, empty = 'Nothing here yet.' }) {
  if (!rows?.length) return <EmptyState message={empty} />;
  return (
    <div className="overflow-x-auto rounded-2xl">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-mist">
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 font-medium">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

export function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 px-6 py-10 text-center text-sm text-mist">
      {message}
    </div>
  );
}

export function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-10 ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-aqua/30 border-t-aqua" />
    </div>
  );
}

export function PageHeader({ title, sub, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-foam md:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-mist">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  const [closing] = useState(false);
  if (!open || closing) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="glass-bright w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-mist hover:text-foam" aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ProgressBar({ pct, className = '' }) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-aqua to-gold transition-all"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}

export function Copyable({ value, label }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <button
      onClick={copy}
      title={label || 'Copy'}
      className="group flex max-w-full items-center gap-2 rounded-lg bg-abyss/60 px-3 py-2 text-left font-mono text-xs text-foam hover:border-aqua/40 border border-transparent"
    >
      <span className="truncate">{value}</span>
      <span className="shrink-0 text-mist group-hover:text-aqua">{copied ? '✓' : '⧉'}</span>
    </button>
  );
}

export const fmtMoney = (v) => {
  const n = Number(v ?? 0);
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const fmtDate = (v) => {
  if (!v) return '—';
  return new Date(v).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};
