import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import {
  GlassCard, PageHeader, Spinner, Select, fmtMoney, fmtDate, Table, Td, EmptyState,
} from '../../components/ui';

export default function AdminReferrals() {
  const [params, setParams] = useState({ level: '', page: 1 });
  const [data, setData] = useState(null);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (params.level) qs.set('level', params.level);
    qs.set('page', params.page);
    api.adminReferrals(qs.toString()).then((d) => setData(d)).catch(() => setData(false));
  }, [params.level, params.page]);

  if (data === null) return <Spinner />;
  if (data === false) return <EmptyState message="Could not load referrals." />;

  return (
    <div>
      <PageHeader
        title="Referral Commissions"
        sub="Every commission credited from the referral tree"
        action={
          <Select value={params.level} onChange={(e) => setParams({ ...params, level: e.target.value, page: 1 })} className="w-40">
            <option value="">All levels</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </Select>
        }
      />
      <GlassCard>
        <Table
          columns={['Date', 'Earner', 'Investor', 'Level', 'Rate', 'Commission']}
          rows={data.referrals}
          empty="No commissions yet."
          renderRow={(r) => (
            <>
              <Td>{fmtDate(r.createdAt)}</Td>
              <Td><div><p>{r.earner?.name}</p><p className="text-xs text-mist">{r.earner?.email}</p></div></Td>
              <Td><div><p>{r.investor?.name}</p><p className="text-xs text-mist">{r.investor?.email}</p></div></Td>
              <Td className="text-gold font-semibold">L{r.level}</Td>
              <Td>{r.rate}%</Td>
              <Td className="text-kelp font-semibold">+${fmtMoney(r.amount)}</Td>
            </>
          )}
        />
        <div className="mt-4 flex items-center justify-between text-sm text-mist">
          <span>Page {data.pagination.page} of {data.pagination.pages} · {data.pagination.total} total</span>
          <div className="flex gap-2">
            <button disabled={data.pagination.page <= 1} onClick={() => setParams({ ...params, page: params.page - 1 })} className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-40">← Prev</button>
            <button disabled={data.pagination.page >= data.pagination.pages} onClick={() => setParams({ ...params, page: params.page + 1 })} className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-40">Next →</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
