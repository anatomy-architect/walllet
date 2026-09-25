import { useEffect, useState } from 'react';
import { api } from '../api/client';
import {
  GlassCard, PageHeader, Spinner, Select, StatusBadge,
  fmtMoney, fmtDate, Table, Td,
} from '../components/ui';

const TYPES = [
  ['', 'All types'],
  ['DEPOSIT', 'Deposits'], ['WITHDRAWAL', 'Withdrawals'],
  ['EARNING_PROFIT', 'Turbine profits'], ['EARNING_COMMISSION', 'Referral commissions'],
  ['PRINCIPAL_RETURN', 'Principal returns'], ['ADJUSTMENT', 'Adjustments'], ['FEE', 'Fees'],
];

export default function History() {
  const [type, setType] = useState('');
  const [rows, setRows] = useState(null);

  useEffect(() => {
    api.history(type).then((d) => setRows(d.entries)).catch(() => setRows([]));
  }, [type]);

  if (!rows) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Transaction History"
        sub="Every balance change is recorded in the vault ledger"
        action={
          <Select value={type} onChange={(e) => setType(e.target.value)} className="w-48">
            {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </Select>
        }
      />
      <GlassCard>
        <Table
          columns={['Date', 'Type', 'Amount', 'Balance after', 'Details']}
          rows={rows}
          empty="No ledger entries yet."
          renderRow={(e) => (
            <>
              <Td>{fmtDate(e.createdAt)}</Td>
              <Td>
                <span className={`rounded px-2 py-0.5 text-xs ${Number(e.amount) >= 0 ? 'bg-kelp/10 text-kelp' : 'bg-coral/10 text-coral'}`}>
                  {e.type.replace(/_/g, ' ')}
                </span>
              </Td>
              <Td className={Number(e.amount) >= 0 ? 'text-kelp font-semibold' : 'text-coral font-semibold'}>
                {Number(e.amount) >= 0 ? '+' : ''}${fmtMoney(e.amount)}
              </Td>
              <Td className="text-mist">${fmtMoney(e.balanceAfter)}</Td>
              <Td className="max-w-[200px] truncate text-xs text-mist" title={e.note}>{e.note || '—'}</Td>
            </>
          )}
        />
      </GlassCard>
    </div>
  );
}
