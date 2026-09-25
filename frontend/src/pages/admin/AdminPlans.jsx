import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../api/client';
import {
  GlassCard, PageHeader, Spinner, Button, Input, StatusBadge, fmtMoney, Table, Td,
} from '../../components/ui';

export default function AdminPlans() {
  const [plans, setPlans] = useState(null);
  const [editing, setEditing] = useState(null); // { id, name, ... }
  const [busy, setBusy] = useState(false);

  const load = () => api.plans().then((d) => setPlans(d.plans)).catch(() => setPlans([]));
  useEffect(load, []);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.updatePlan(editing.id, {
        name: editing.name,
        dailyRoiPct: Number(editing.dailyRoiPct),
        withdrawalFeePct: Number(editing.withdrawalFeePct),
        isActive: editing.isActive,
      });
      toast.success('Plan updated — existing investments keep their locked rates');
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!plans) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Turbine Plans"
        sub="Name, daily rate, withdrawal fee, and visibility are editable. Duration and minimum are locked — they define active investment snapshots."
      />
      <GlassCard>
        <Table
          columns={['Name', 'Minimum', 'Daily ROI', 'Duration', 'Withdrawal fee', 'Status', '']}
          rows={plans}
          empty="No plans."
          renderRow={(p) => (
            <>
              <Td>{p.name}</Td>
              <Td>${fmtMoney(p.minInvestment)}</Td>
              <Td className="text-aqua">{p.dailyRoiPct}%</Td>
              <Td>{p.durationDays} days</Td>
              <Td>{p.withdrawalFeePct}%</Td>
              <Td><StatusBadge status={p.isActive ? 'ACTIVE' : 'CANCELLED'} /></Td>
              <Td>
                <Button variant="subtle" className="!px-3 !py-1.5 text-xs" onClick={() => setEditing({ ...p, dailyRoiPct: String(p.dailyRoiPct), withdrawalFeePct: String(p.withdrawalFeePct) })}>
                  Edit
                </Button>
              </Td>
            </>
          )}
        />
      </GlassCard>

      {editing && (
        <GlassCard bright className="mt-6 max-w-xl">
          <h3 className="mb-4 font-semibold">Edit {editing.name}</h3>
          <form onSubmit={save} className="space-y-4">
            <Input label="Name" required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Daily ROI %" type="number" step="0.01" min="0" max="100" required value={editing.dailyRoiPct} onChange={(e) => setEditing({ ...editing, dailyRoiPct: e.target.value })} />
              <Input label="Withdrawal fee %" type="number" step="0.01" min="0" max="100" required value={editing.withdrawalFeePct} onChange={(e) => setEditing({ ...editing, withdrawalFeePct: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.isActive} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} className="accent-cyan-400" />
              Visible to users
            </label>
            <div className="flex gap-3">
              <Button variant="subtle" type="button" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button>
              <Button className="flex-1" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Button>
            </div>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
