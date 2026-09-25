import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../api/client';
import {
  GlassCard, PageHeader, Spinner, Button, Input, Select, Textarea,
  StatusBadge, fmtMoney, fmtDate, Table, Td, Modal, ProgressBar,
} from '../../components/ui';

function UserDetail({ id, onClose, reload }) {
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);
  const [adj, setAdj] = useState({ amount: '', type: 'CREDIT', note: '' });

  useEffect(() => {
    api.adminUserDetail(id).then((d) => setUser(d.user)).catch(() => setUser(false));
  }, [id]);

  const act = async (fn, msg) => {
    setBusy(true);
    try { await fn(); toast.success(msg); reload(); const d = await api.adminUserDetail(id); setUser(d.user); }
    catch (err) { toast.error(err.message); }
    finally { setBusy(false); }
  };

  const adjust = async (e) => {
    e.preventDefault();
    const amount = Number(adj.amount);
    if (!(amount > 0)) return toast.error('Amount must be positive');
    await act(() => api.adjustUser(id, { amount: amount.toFixed(2), direction: adj.type, reason: adj.note }), 'Balance adjusted');
    setAdj({ amount: '', type: 'CREDIT', note: '' });
  };

  return (
    <Modal open onClose={onClose} title="User detail">
      {!user ? <Spinner /> : user === false ? <p className="text-coral">Not found.</p> : (
        <div className="max-h-[70vh] space-y-5 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs text-mist">Name</p><p>{user.name}</p></div>
            <div><p className="text-xs text-mist">Email</p><p>{user.email}</p></div>
            <div><p className="text-xs text-mist">Referral code</p><p className="font-mono text-aqua">{user.referralCode}</p></div>
            <div><p className="text-xs text-mist">Status</p><StatusBadge status={user.status} /></div>
            <div><p className="text-xs text-mist">Available</p><p className="font-bold text-aqua">${fmtMoney(user.balance)}</p></div>
            <div><p className="text-xs text-mist">Held</p><p>${fmtMoney(user.heldBalance)}</p></div>
          </div>

          <div className="flex gap-2">
            {user.status === 'ACTIVE'
              ? <Button variant="danger" className="text-xs" disabled={busy} onClick={() => act(() => api.suspendUser(id, 'Suspended from console'), 'User suspended')}>Suspend</Button>
              : <Button className="text-xs" disabled={busy} onClick={() => act(() => api.restoreUser(id), 'User restored')}>Restore</Button>}
          </div>

          <form onSubmit={adjust} className="rounded-xl border border-white/10 p-4">
            <h4 className="mb-3 text-sm font-semibold">Manual balance adjustment (audited)</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Amount" type="number" min="0" step="0.01" required value={adj.amount} onChange={(e) => setAdj({ ...adj, amount: e.target.value })} />
              <Select label="Direction" value={adj.type} onChange={(e) => setAdj({ ...adj, type: e.target.value })}>
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
              </Select>
            </div>
            <Input label="Reason (required)" required value={adj.note} onChange={(e) => setAdj({ ...adj, note: e.target.value })} className="mt-3" />
            <Button className="mt-3 w-full" disabled={busy}>Apply adjustment</Button>
          </form>

          <div>
            <h4 className="mb-2 text-sm font-semibold">Investments</h4>
            <Table
              columns={['Turbine', 'Amount', 'Accrued', 'Ends', 'Status']}
              rows={user.investments}
              empty="None."
              renderRow={(i) => (
                <>
                  <Td>{i.plan?.name}</Td>
                  <Td>${fmtMoney(i.amount)}</Td>
                  <Td className="text-kelp">+${fmtMoney(i.accruedProfit)}</Td>
                  <Td>{fmtDate(i.endDate)}</Td>
                  <Td><StatusBadge status={i.status} /></Td>
                </>
              )}
            />
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">Ledger (recent)</h4>
            <div className="space-y-1 text-xs">
              {user.ledgerEntries.map((l) => (
                <div key={l.id} className="flex justify-between rounded bg-abyss/50 px-2 py-1.5">
                  <span className="text-mist">{l.type.replace(/_/g, ' ')} · {fmtDate(l.createdAt)}</span>
                  <span className={Number(l.amount) >= 0 ? 'text-kelp' : 'text-coral'}>
                    {Number(l.amount) >= 0 ? '+' : ''}${fmtMoney(l.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function AdminUsers() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [timer, setTimer] = useState(null);

  const load = (term = q) => api.adminUsers(term).then((d) => setRows(d.users)).catch(() => setRows([]));
  useEffect(() => { load(''); }, []);

  const search = (v) => {
    setQ(v);
    clearTimeout(timer);
    setTimer(setTimeout(() => load(v), 400));
  };

  if (!rows) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Users"
        sub="Click a user for full detail, audit trail, and manual adjustments"
        action={<Input placeholder="Search name, email, referral code…" value={q} onChange={(e) => search(e.target.value)} className="!w-64" />}
      />
      <GlassCard>
        <Table
          columns={['Name', 'Email', 'Code', 'Balance', 'Joined', 'Status', '']}
          rows={rows}
          empty="No users."
          renderRow={(u) => (
            <>
              <Td>{u.name}</Td>
              <Td className="text-mist">{u.email}</Td>
              <Td className="font-mono text-xs text-aqua">{u.referralCode}</Td>
              <Td className="font-semibold">${fmtMoney(u.balance)}</Td>
              <Td>{fmtDate(u.createdAt)}</Td>
              <Td><StatusBadge status={u.status} /></Td>
              <Td><Button variant="subtle" className="!px-3 !py-1.5 text-xs" onClick={() => setDetailId(u.id)}>Open</Button></Td>
            </>
          )}
        />
      </GlassCard>
      {detailId && <UserDetail id={detailId} onClose={() => setDetailId(null)} reload={() => load(q)} />}
    </div>
  );
}
