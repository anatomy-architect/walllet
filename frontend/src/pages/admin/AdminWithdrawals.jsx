import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../api/client';
import {
  GlassCard, PageHeader, Spinner, Button, Input, Textarea, StatusBadge,
  fmtMoney, fmtDate, Table, Td, Select, Modal,
} from '../../components/ui';

export default function AdminWithdrawals() {
  const [status, setStatus] = useState('SUBMITTED');
  const [rows, setRows] = useState(null);
  const [modal, setModal] = useState(null); // { id, action }
  const [txHash, setTxHash] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.withdrawalQueue(status).then((d) => setRows(d.withdrawals)).catch(() => setRows([]));
  useEffect(load, [status]);

  const decide = async () => {
    setBusy(true);
    try {
      if (modal.action === 'process') await api.processWithdrawal(modal.id);
      else if (modal.action === 'complete') {
        if (!/^0x[a-fA-F0-9]{64}$/.test(txHash.trim())) return toast.error('Enter the real payout TX hash (0x + 64 hex)');
        await api.completeWithdrawal(modal.id, txHash.trim());
      }
      else await api.rejectWithdrawal(modal.id, note);
      toast.success(`Withdrawal ${modal.action}d`);
      setModal(null); setTxHash(''); setNote('');
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
        title="Withdrawal Queue"
        sub="SUBMITTED → PROCESSING (you are sending) → SENT (payout hash recorded). Target 12–18h."
        action={
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-44">
            <option value="SUBMITTED">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SENT">Sent</option>
            <option value="REJECTED">Rejected</option>
          </Select>
        }
      />
      <GlassCard>
        <Table
          columns={['Submitted', 'User', 'Amount', 'Fee', 'Net', 'Destination', 'Status', 'Action']}
          rows={rows}
          empty={`No ${status.toLowerCase()} withdrawals.`}
          renderRow={(w) => (
            <>
              <Td>{fmtDate(w.submittedAt)}</Td>
              <Td><div><p>{w.user?.name}</p><p className="text-xs text-mist">{w.user?.email}</p></div></Td>
              <Td className="font-semibold">${fmtMoney(w.amount)}</Td>
              <Td className="text-mist">${fmtMoney(w.feeAmount)} ({w.feeRate}%)</Td>
              <Td className="text-kelp font-semibold">${fmtMoney(w.netAmount)}</Td>
              <Td className="max-w-[150px] truncate font-mono text-xs text-mist" title={w.walletAddress}>{w.walletAddress}</Td>
              <Td><StatusBadge status={w.status} /></Td>
              <Td>
                <div className="flex gap-2">
                  {w.status === 'SUBMITTED' && (
                    <Button className="!px-3 !py-1.5 text-xs" onClick={() => setModal({ id: w.id, action: 'process' })}>Process</Button>
                  )}
                  {w.status === 'PROCESSING' && (
                    <Button className="!px-3 !py-1.5 text-xs" onClick={() => setModal({ id: w.id, action: 'complete' })}>Mark sent</Button>
                  )}
                  {(w.status === 'SUBMITTED' || w.status === 'PROCESSING') && (
                    <Button variant="danger" className="!px-3 !py-1.5 text-xs" onClick={() => setModal({ id: w.id, action: 'reject' })}>Reject</Button>
                  )}
                  {w.status === 'SENT' && <span className="text-xs text-mist font-mono">{w.payoutTxHash?.slice(0, 10)}…</span>}
                </div>
              </Td>
            </>
          )}
        />
      </GlassCard>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.action === 'complete' ? 'Record payout' : modal?.action === 'process' ? 'Start processing' : 'Reject withdrawal'}
      >
        {modal && (
          <div className="space-y-4">
            {modal.action === 'process' && (
              <p className="text-sm text-mist">You are now responsible for sending the USDT manually from the vault wallet. Mark as PROCESSING, send, then come back and mark it sent.</p>
            )}
            {modal.action === 'complete' && (
              <>
                <p className="text-sm text-mist">Paste the <b>real payout transaction hash</b> from the vault wallet. This is permanently recorded.</p>
                <Input label="Payout TX hash" value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="0x…" />
              </>
            )}
            {modal.action === 'reject' && (
              <>
                <p className="text-sm text-mist">Held funds return to the user's balance immediately.</p>
                <Textarea label="Rejection reason" value={note} onChange={(e) => setNote(e.target.value)} />
              </>
            )}
            <div className="flex gap-3">
              <Button variant="subtle" className="flex-1" onClick={() => setModal(null)}>Cancel</Button>
              <Button
                className="flex-1"
                variant={modal.action === 'reject' ? 'danger' : 'primary'}
                onClick={decide} disabled={busy}
              >
                {busy ? 'Working…' : 'Confirm'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
