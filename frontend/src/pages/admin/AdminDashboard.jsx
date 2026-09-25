import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../api/client';
import {
  GlassCard, StatCard, PageHeader, Spinner, Button, StatusBadge,
  fmtMoney, fmtDate, Table, Td,
} from '../../components/ui';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [running, setRunning] = useState(false);

  const load = () => api.adminDashboard().then((d) => setData(d.dashboard)).catch(() => setData(false));
  useEffect(load, []);

  const runEarnings = async () => {
    setRunning(true);
    try {
      const r = await api.runEarnings();
      toast.success(`Earnings posted: ${r.summary.investmentsProcessed} turbines, ${r.summary.earningDaysCredited} earning days`);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRunning(false);
    }
  };

  if (data === null) return <Spinner />;
  if (data === false) return <p className="text-coral">Could not load dashboard.</p>;

  return (
    <div>
      <PageHeader
        title="Overview"
        sub="System health at a glance"
        action={<Button variant="gold" onClick={runEarnings} disabled={running}>{running ? 'Running…' : '⚙ Run earnings job now'}</Button>}
      />
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total users" value={data.users.total} sub={`${data.users.active} active`} accent="text-foam" />
        <StatCard label="Pending deposits" value={data.queues.pendingDeposits} sub="awaiting review" accent="text-amber" />
        <StatCard label="Pending withdrawals" value={data.queues.pendingWithdrawals} sub="awaiting review" accent="text-amber" />
        <StatCard label="Held funds" value={`$${fmtMoney(data.finance.held)}`} sub="locked in processing" />
        <StatCard label="Deposits (30d)" value={`$${fmtMoney(data.finance.deposits30d)}`} sub="approved" />
        <StatCard label="Withdrawals (30d)" value={`$${fmtMoney(data.finance.withdrawals30d)}`} sub="completed" accent="text-coral" />
        <StatCard label="Profits paid (30d)" value={`$${fmtMoney(data.finance.profits30d)}`} sub="turbine earnings" accent="text-kelp" />
        <StatCard label="Commissions (30d)" value={`$${fmtMoney(data.finance.commissions30d)}`} sub="referral earnings" accent="text-gold" />
      </div>

      <h3 className="font-display mb-3 text-lg font-bold">Recent signups</h3>
      <GlassCard>
        <Table
          columns={['Name', 'Email', 'Referral code', 'Joined', 'Status']}
          rows={data.recentSignups}
          empty="No users yet."
          renderRow={(u) => (
            <>
              <Td>{u.name}</Td>
              <Td className="text-mist">{u.email}</Td>
              <Td className="font-mono text-xs text-aqua">{u.referralCode}</Td>
              <Td>{fmtDate(u.createdAt)}</Td>
              <Td><StatusBadge status={u.status} /></Td>
            </>
          )}
        />
      </GlassCard>
    </div>
  );
}
