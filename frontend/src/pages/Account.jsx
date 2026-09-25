import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import {
  GlassCard, PageHeader, Spinner, EmptyState, Button, Input,
  fmtMoney, fmtDate, Table, Td, StatusBadge, ProgressBar,
} from '../components/ui';

export function Notifications() {
  const [notes, setNotes] = useState(null);

  const load = () => api.notifications().then((d) => setNotes(d.notifications)).catch(() => setNotes([]));
  useEffect(load, []);

  const readOne = async (id) => {
    await api.markRead(id).catch(() => {});
    setNotes((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
  };

  if (!notes) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Notifications"
        action={notes.length > 0 && (
          <Button variant="subtle" onClick={async () => { await api.markAllRead(); load(); }}>
            Mark all read
          </Button>
        )}
      />
      {notes.length === 0 ? <EmptyState message="No notifications yet." /> : (
        <div className="space-y-3">
          {notes.map((n) => (
            <GlassCard key={n.id} className={!n.read ? 'border-aqua/40' : ''}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-mist">{n.message}</p>
                  <p className="mt-1 text-[11px] text-mist/70">{fmtDate(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <button onClick={() => readOne(n.id)} className="shrink-0 text-xs text-aqua hover:underline">
                    Mark read
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

export function Profile() {
  const [data, setData] = useState(null);
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmNew: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.profile().then((d) => setData(d)).catch(() => setData(false));
  }, []);

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirmNew) return toast.error('New passwords do not match');
    setLoading(true);
    try {
      await api.changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      toast.success('Password updated');
      setPwd({ currentPassword: '', newPassword: '', confirmNew: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (data === null) return <Spinner />;
  if (data === false) return <EmptyState message="Could not load profile." />;
  const { user, stats } = data;

  return (
    <div>
      <PageHeader title="Profile" />
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-4 font-semibold">Account</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-mist">Name</dt><dd>{user.name}</dd></div>
            <div className="flex justify-between"><dt className="text-mist">Email</dt><dd>{user.email}</dd></div>
            <div className="flex justify-between"><dt className="text-mist">Referral code</dt><dd className="font-mono text-aqua">{user.referralCode}</dd></div>
            <div className="flex justify-between"><dt className="text-mist">Member since</dt><dd>{fmtDate(user.createdAt)}</dd></div>
            <div className="flex justify-between"><dt className="text-mist">Status</dt><dd><StatusBadge status={user.status} /></dd></div>
          </dl>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-abyss/50 p-3"><p className="text-xs text-mist">Lifetime deposits</p><p className="font-display font-bold text-aqua">${fmtMoney(stats.lifetimeDeposits)}</p></div>
            <div className="rounded-xl bg-abyss/50 p-3"><p className="text-xs text-mist">Lifetime withdrawn</p><p className="font-display font-bold text-foam">${fmtMoney(stats.lifetimeWithdrawn)}</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="mb-4 font-semibold">Change password</h3>
          <form onSubmit={changePassword} className="space-y-4">
            <Input label="Current password" type="password" required value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} />
            <Input label="New password (min 8)" type="password" required value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} />
            <Input label="Confirm new password" type="password" required value={pwd.confirmNew} onChange={(e) => setPwd({ ...pwd, confirmNew: e.target.value })} />
            <Button className="w-full" disabled={loading}>{loading ? 'Updating…' : 'Update password'}</Button>
          </form>
        </GlassCard>
      </div>

      <h3 className="font-display mb-3 mt-8 text-lg font-bold">All investments</h3>
      <GlassCard>
        <Table
          columns={['Turbine', 'Amount', 'Daily rate', 'Progress', 'Accrued', 'Ends', 'Status']}
          rows={stats.investments}
          empty="No investments yet."
          renderRow={(i) => {
            const pct = Math.max(0, Math.min(100, ((Date.now() - new Date(i.startDate).getTime()) / (new Date(i.endDate).getTime() - new Date(i.startDate).getTime())) * 100));
            return (
              <>
                <Td>{i.plan?.name}</Td>
                <Td>${fmtMoney(i.amount)}</Td>
                <Td className="text-aqua">{i.dailyRateSnapshot}%</Td>
                <Td><ProgressBar pct={pct} className="w-24" /></Td>
                <Td className="text-kelp">+${fmtMoney(i.accruedProfit)}</Td>
                <Td>{fmtDate(i.endDate)}</Td>
                <Td><StatusBadge status={i.status} /></Td>
              </>
            );
          }}
        />
      </GlassCard>
    </div>
  );
}
