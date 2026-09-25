import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../api/client';
import {
  GlassCard, PageHeader, Spinner, Button, Textarea, StatusBadge,
  fmtMoney, fmtDate, Table, Td, Select, Modal,
} from '../../components/ui';

export default function AdminDeposits() {
  const [status, setStatus] = useState('PENDING');
  const [rows, setRows] = useState(null);
  const [modal, setModal] = useState(null); // { id, action }
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.depositQueue(status).then((d) => setRows(d.deposits)).catch(() => setRows([]));
  useEffect(load, [status]);

  const decide = async () => {
    setBusy(true);
    try {
      if (modal.action === 'approve') await api.approveDeposit(modal.id, note);
      else await api.rejectDeposit(modal.id, note);
      toast.success(`Deposit ${modal.action}d`);
      setModal(null); setNote('');
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!rows) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Deposit Review Queue"
        sub="Verify the TX hash on BscScan, then approve — the turbine activates immediately"
        action={
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-44">
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </Select>
        }
      />
      <GlassCard>
        <Table
          columns={['Submitted', 'User', 'Turbine', 'Amount', 'TX hash', 'Status', 'Decision']}
          rows={rows}
          empty={`No ${status.toLowerCase()} deposits.`}
          renderRow={(d) => (
            <>
              <Td>{fmtDate(d.submittedAt)}</Td>
              <Td><div><p>{d.user?.name}</p><p className="text-xs text-mist">{d.user?.email}</p></div></Td>
              <Td>{d.plan?.name}</Td>
              <Td className="font-semibold">${fmtMoney(d.amount)}</Td>
              <Td className="max-w-[160px]">
                <a
                  href={`https://bscscan.com/tx/${d.txHash}`}
                  target="_blank" rel="noreferrer"
                  className="truncate font-mono text-xs text-aqua hover:underline"
                  title={d.txHash}
                >
                  {d.txHash.slice(0, 12)}…{d.txHash.slice(-8)}
                </a>
              </Td>
              <Td><StatusBadge status={d.status} /></Td>
              <Td>
                {d.status === 'PENDING' ? (
                  <div className="flex gap-2">
                    <Button className="!px-3 !py-1.5 text-xs" onClick={() => setModal({ id: d.id, action: 'approve' })}>Approve</Button>
                    <Button variant="danger" className="!px-3 !py-1.5 text-xs" onClick={() => setModal({ id: d.id, action: 'reject' })}>Reject</Button>
                  </div>
                ) : <span className="text-xs text-mist">{d.adminNote || '—'}</span>}
              </Td>
            </>
          )}
        />
      </GlassCard>

      <Modal open={!!modal} onClose={() => setModal(null)} title={`${modal?.action === 'approve' ? 'Approve' : 'Reject'} deposit`}>
        {modal && (
          <div className="space-y-4">
            <p className="text-sm text-mist">
              {modal.action === 'approve'
                ? 'Approving activates the turbine immediately and starts daily earnings.'
                : 'Rejecting returns nothing to the user — funds never touched the platform. Add a reason below.'}
            </p>
            <Textarea label="Admin note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="flex gap-3">
              <Button variant="subtle" className="flex-1" onClick={() => setModal(null)}>Cancel</Button>
              <Button
                className="flex-1"
                variant={modal.action === 'approve' ? 'primary' : 'danger'}
                onClick={decide} disabled={busy}
              >
                {busy ? 'Working…' : `Confirm ${modal.action}`}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
