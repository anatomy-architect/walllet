import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import {
  GlassCard, PageHeader, Spinner, Input, Button,
  StatusBadge, EmptyState, fmtMoney, fmtDate, Table, Td, Modal,
} from '../components/ui';

export default function Withdraw() {
  const [withdrawals, setWithdrawals] = useState(null);
  const [balance, setBalance] = useState('0');
  const [form, setForm] = useState({ amount: '', walletAddress: '' });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    api.withdrawals().then((d) => setWithdrawals(d.withdrawals)).catch(() => setWithdrawals([]));
    api.dashboard().then((d) => setBalance(d.dashboard.availableBalance)).catch(() => {});
  };
  useEffect(load, []);

  const doPreview = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!(amount >= 20)) return toast.error('Minimum withdrawal is $20');
    if (amount > Number(balance)) return toast.error('Amount exceeds available balance');
    if (!/^0x[a-fA-F0-9]{40}$/.test(form.walletAddress.trim())) {
      return toast.error('Enter a valid BEP20 address (0x + 40 hex chars)');
    }
    setPreview({ amount, walletAddress: form.walletAddress.trim() });
  };

  const confirm = async () => {
    setLoading(true);
    try {
      const { withdrawal, feeTier } = await api.submitWithdrawal({
        amount: Number(preview.amount).toFixed(2),
        walletAddress: preview.walletAddress,
      });
      toast.success(`Submitted — ${feeTier} fee ${withdrawal.feeRate}%, net $${fmtMoney(withdrawal.netAmount)}`);
      setPreview(null);
      setForm({ amount: '', walletAddress: '' });
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!withdrawals) return <Spinner />;

  return (
    <div>
      <PageHeader title="Withdraw USDT" sub="Minimum $20 · BEP20 only · target processing 12–18 hours" />

      <div className="mb-6 grid gap-5 lg:grid-cols-2">
        <GlassCard className="max-w-xl">
          <p className="mb-4 text-sm text-mist">Available balance: <span className="font-display text-lg font-bold text-aqua">${fmtMoney(balance)}</span></p>
          <form onSubmit={doPreview} className="space-y-4">
            <Input label="Amount (USD)" type="number" min="0" step="0.01" required
              value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="20.00" />
            <Input label="Destination BEP20 address" required
              value={form.walletAddress} onChange={(e) => setForm({ ...form, walletAddress: e.target.value })}
              placeholder="0x…" />
            <Button className="w-full">Preview withdrawal</Button>
          </form>
          <p className="mt-3 text-[11px] text-mist">
            Fee tier: your most recent turbine's withdrawal fee (10% default if you never invested).
            Funds are held as soon as you confirm.
          </p>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 font-semibold">Your withdrawals</h3>
          <Table
            columns={['Date', 'Amount', 'Fee', 'Net', 'Status']}
            rows={withdrawals}
            empty="No withdrawals yet."
            renderRow={(w) => (
              <>
                <Td>{fmtDate(w.submittedAt)}</Td>
                <Td className="font-semibold">${fmtMoney(w.amount)}</Td>
                <Td className="text-mist">${fmtMoney(w.feeAmount)} ({w.feeRate}%)</Td>
                <Td className="text-kelp">${fmtMoney(w.netAmount)}</Td>
                <Td><StatusBadge status={w.status} /></Td>
              </>
            )}
          />
        </GlassCard>
      </div>

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Confirm withdrawal">
        {preview && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-mist">Amount</span><b>${fmtMoney(preview.amount)}</b></div>
            <div className="flex justify-between"><span className="text-mist">Destination</span><code className="max-w-[220px] truncate font-mono text-xs">{preview.walletAddress}</code></div>
            <div className="flex justify-between"><span className="text-mist">Network</span><b>BEP20</b></div>
            <p className="rounded-xl bg-amber/10 border border-amber/30 p-3 text-xs text-amber">
              Funds will be held immediately. An admin sends USDT manually within 12–18 hours.
              Only one pending withdrawal at a time.
            </p>
            <div className="flex gap-3 pt-2">
              <Button variant="subtle" className="flex-1" onClick={() => setPreview(null)}>Cancel</Button>
              <Button className="flex-1" onClick={confirm} disabled={loading}>{loading ? 'Submitting…' : 'Confirm & hold funds'}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
