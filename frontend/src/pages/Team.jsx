import { useEffect, useState } from 'react';
import { api } from '../api/client';
import {
  GlassCard, PageHeader, Spinner, EmptyState, StatusBadge,
  fmtMoney, fmtDate, Table, Td,
} from '../components/ui';

export default function Team() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.team().then((d) => setData(d)).catch(() => setData(false));
  }, []);

  if (data === null) return <Spinner />;
  if (data === false) return <EmptyState message="Could not load team." />;

  const refLink = `${window.location.origin}/register?ref=${data.referralCode}`;

  return (
    <div>
      <PageHeader title="Your Team" sub="3 levels deep · commissions credit daily from your network's investments" />

      <GlassCard className="mb-6">
        <h3 className="mb-1 font-semibold">Invite link</h3>
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 truncate rounded-lg bg-abyss/60 px-3 py-2 font-mono text-xs text-aqua">{refLink}</code>
          <button
            onClick={() => { navigator.clipboard.writeText(refLink).catch(() => {}); }}
            className="rounded-xl border border-aqua/40 px-4 py-2 text-sm text-aqua hover:bg-aqua/10"
          >
            Copy
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[['Level 1', '3%/day', '3 days', data.team.level1.length],
            ['Level 2', '2%/day', '3 days', data.team.level2.length],
            ['Level 3', '0.8%/day', '5 days', data.team.level3.length]].map(([l, r, d, c]) => (
            <div key={l} className="rounded-xl bg-abyss/50 p-3">
              <p className="text-xs uppercase tracking-wider text-mist">{l} · {c} members</p>
              <p className="font-display font-bold text-gold">{r}</p>
              <p className="text-xs text-mist">{d}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {[['Direct (Level 1)', data.team.level1], ['Level 2', data.team.level2], ['Level 3', data.team.level3]].map(([title, members]) => (
        <div key={title} className="mb-6">
          <h3 className="mb-3 font-semibold">{title}</h3>
          <GlassCard>
            <Table
              columns={['Member', 'Joined', 'Active turbines', 'Earned for you', 'Status']}
              rows={members}
              empty="Nobody here yet — share your invite link."
              renderRow={(m) => (
                <>
                  <Td>{m.name}</Td>
                  <Td>{fmtDate(m.joinedAt)}</Td>
                  <Td>{m.activeInvestments}</Td>
                  <Td className="text-kelp">${fmtMoney(m.totalEarnedForYou)}</Td>
                  <Td><StatusBadge status={m.status} /></Td>
                </>
              )}
            />
          </GlassCard>
        </div>
      ))}
    </div>
  );
}
