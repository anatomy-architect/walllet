import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../store/useStore';
import { GlassCard, StatCard, PageHeader, Spinner, StatusBadge, ProgressBar, EmptyState, fmtMoney, fmtDate } from '../components/ui';
import { TurbineSpin } from '../components/decor';

function ActiveTurbineCard({ inv }) {
  const start = new Date(inv.startDate).getTime();
  const end = new Date(inv.endDate).getTime();
  const now = Date.now();
  const pct = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
  const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
  const daily = (Number(inv.amount) * Number(inv.dailyRateSnapshot)) / 100;

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <TurbineSpin size={40} />
        <div className="min-w-0">
          <p className="truncate font-semibold">{inv.plan?.name}</p>
          <p className="text-xs text-mist">${fmtMoney(inv.amount)} · {inv.dailyRateSnapshot}% daily</p>
        </div>
        <div className="ml-auto"><StatusBadge status={inv.status} /></div>
      </div>
      <ProgressBar pct={pct} />
      <div className="flex justify-between text-xs text-mist">
        <span>{daysLeft} days remaining</span>
        <span>~${fmtMoney(daily)}/day</span>
        <span className="text-kelp">+${fmtMoney(inv.accruedProfit)} earned</span>
      </div>
      <p className="text-[11px] text-mist">Ends {fmtDate(inv.endDate)}</p>
    </GlassCard>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.dashboard().then((d) => setData(d.dashboard)).catch(() => setData(false));
  }, []);

  if (data === null) return <Spinner />;
  if (data === false) return <EmptyState message="Could not load dashboard." />;

  const refLink = `${window.location.origin}/register?ref=${data.referralCode}`;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'diver'}`}
        sub="Your turbines are spinning. Here's the state of your vault."
        action={<Link to="/app/plans" className="rounded-xl bg-aqua px-5 py-2.5 text-sm font-semibold text-abyss hover:brightness-110">New investment</Link>}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Available balance" value={`$${fmtMoney(data.availableBalance)}`} sub={data.heldBalance > 0 ? `$${fmtMoney(data.heldBalance)} held in pending withdrawals` : 'Ready to withdraw'} />
        <StatCard label="Active turbines" value={data.activeInvestments.length} sub={`${data.pendingDeposits} deposits pending`} />
        <StatCard label="Turbine profits" value={`$${fmtMoney(data.totalProfit)}`} sub="All-time credited" accent="text-kelp" />
        <StatCard label="Referral earnings" value={`$${fmtMoney(data.totalCommission)}`} sub="All-time credited" accent="text-gold" />
      </div>

      <h2 className="font-display mb-3 text-lg font-bold">Active turbines</h2>
      {data.activeInvestments.length === 0 ? (
        <EmptyState message="No active turbines yet. Pick a plan to start earning daily." />
      ) : (
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {data.activeInvestments.map((inv) => <ActiveTurbineCard key={inv.id} inv={inv} />)}
        </div>
      )}

      <GlassCard>
        <h3 className="mb-1 font-semibold">Your referral link</h3>
        <p className="mb-3 text-xs text-mist">Share it — you earn 3%/2%/0.8% daily on your network's investments.</p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 truncate rounded-lg bg-abyss/60 px-3 py-2 font-mono text-xs text-aqua">{refLink}</code>
          <button
            onClick={() => { navigator.clipboard.writeText(refLink).catch(() => {}); }}
            className="rounded-xl border border-aqua/40 px-4 py-2 text-sm text-aqua hover:bg-aqua/10"
          >
            Copy
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
