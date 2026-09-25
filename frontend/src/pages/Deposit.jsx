import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../api/client';
import {
  GlassCard, PageHeader, Spinner, Input, Select, Button,
  StatusBadge, EmptyState, Copyable, fmtMoney, fmtDate, Table, Td,
} from '../components/ui';

export default function Deposit() {
  const [params] = useSearchParams();
  const [plans, setPlans] = useState(null);
  const [cfg, setCfg] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ planId: params.get('plan') || '', amount: '', txHash: '' });
  const [loading, setLoading] = useState(false);

  const load = () => {
    api.plans().then((d) => {
      setPlans(d.plans);
      if (!form.planId && d.plans[0]) setForm((f) => ({ ...f, planId: d.plans[0].id }));
    }).catch(() => setPlans([]));
    api.appConfig().then((d) => setCfg(d.config)).catch(() => {});
    api.deposits().then((d) => setDeposits(d.deposits)).catch(() => {});
  };
  useEffect(load, []);

  const plan = plans?.find((p) => p.id === form.planId);
  const amount = Number(form.amount);

  const submit = async (e) => {
    e.preventDefault();
    if (!plan) return toast.error('Select a turbine');
    if (!(amount >= Number(plan.minInvestment))) {
      return toast.error(`Minimum for ${plan.name} is $${fmtMoney(plan.minInvestment)}`);
    }
    setLoading(true);
    try {
      await api.submitDeposit({ planId: form.planId, amount: amount.toFixed(2), txHash: form.txHash.trim() });
      toast.success('Deposit submitted — awaiting admin approval');
      setForm({ planId: plans[0]?.id || '', amount: '', txHash: '' });
      setStep(1);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!plans) return <Spinner />;

  return (
    <div>
      <PageHeader title="Deposit USDT" sub="Manual BEP20 transfer — an admin verifies your TX hash" />

      {step === 1 && (
        <GlassCard className="mb-6 max-w-xl">
          <h3 className="mb-4 font-semibold">Step 1 — Choose turbine & amount</h3>
          <div className="space-y-4">
            <Select label="Turbine" value={form.planId} onChange={(e) => setForm({ ...form, planId: e.target.value })}>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — min ${fmtMoney(p.minInvestment)} · {p.dailyRoiPct}%/day · {p.durationDays}d
                </option>
              ))}
            </Select>
            <Input
              label={`Amount (USD) — minimum $${plan ? fmtMoney(plan.minInvestment) : '—'}`}
              type="number" min="0" step="0.01" value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="e.g. 100.00"
            />
            <Button className="w-full" onClick={() => {
              if (!plan) return toast.error('Select a turbine');
              if (!(amount >= Number(plan.minInvestment))) return toast.error(`Minimum is $${fmtMoney(plan.minInvestment)}`);
              setStep(2);
            }}>
              Continue to payment →
            </Button>
          </div>
        </GlassCard>
      )}

      {step === 2 && (
        <GlassCard bright className="mb-6 max-w-xl">
          <h3 className="mb-4 font-semibold">Step 2 — Send ${fmtMoney(amount)} USDT (BEP20)</h3>
          <div className="mb-4 flex justify-center rounded-2xl bg-white p-4">
            {cfg && <QRCodeSVG value={cfg.bep20ReceivingAddress} size={180} />}
          </div>
          <p className="mb-2 text-xs text-mist">Vault receiving address (BEP20 network only):</p>
          {cfg && <Copyable value={cfg.bep20ReceivingAddress} label="Copy address" />}
          <div className="mt-4 rounded-xl bg-amber/10 border border-amber/30 p-3 text-xs text-amber">
            Send exactly <b>${fmtMoney(amount)} USDT</b> on <b>BNB Smart Chain (BEP20)</b> from your own wallet.
            TRC20 / ERC20 transfers cannot be detected.
          </div>
          <form onSubmit={submit} className="mt-4 space-y-4">
            <Input
              label="Step 3 — Paste the transaction hash after sending"
              value={form.txHash} onChange={(e) => setForm({ ...form, txHash: e.target.value })}
              placeholder="0x…" required
            />
            <div className="flex gap-3">
              <Button variant="subtle" type="button" onClick={() => setStep(1)}>← Back</Button>
              <Button className="flex-1" disabled={loading}>{loading ? 'Submitting…' : 'Submit deposit proof'}</Button>
            </div>
          </form>
        </GlassCard>
      )}

      <h3 className="font-display mb-3 text-lg font-bold">Your deposits</h3>
      <GlassCard>
        <Table
          columns={['Date', 'Turbine', 'Amount', 'Network', 'TX hash', 'Status']}
          rows={deposits}
          empty="No deposits yet."
          renderRow={(d) => (
            <>
              <Td>{fmtDate(d.submittedAt)}</Td>
              <Td>{d.plan?.name}</Td>
              <Td className="font-semibold">${fmtMoney(d.amount)}</Td>
              <Td><span className="rounded bg-aqua/10 px-2 py-0.5 text-xs text-aqua">{d.network}</span></Td>
              <Td className="max-w-[160px] truncate font-mono text-xs text-mist" title={d.txHash}>{d.txHash}</Td>
              <Td><StatusBadge status={d.status} /></Td>
            </>
          )}
        />
      </GlassCard>
    </div>
  );
}
