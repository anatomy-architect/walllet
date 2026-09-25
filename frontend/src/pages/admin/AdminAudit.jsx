import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { GlassCard, PageHeader, Spinner, fmtMoney, fmtDate, Table, Td, EmptyState } from '../../components/ui';

export default function AdminAudit() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    api.adminAudit().then((d) => setRows(d.entries)).catch(() => setRows(false));
  }, []);

  if (rows === null) return <Spinner />;
  if (rows === false) return <EmptyState message="Could not load audit log." />;

  return (
    <div>
      <PageHeader title="Audit Log" sub="Immutable trail of admin actions, adjustments, and lifecycle events" />
      <GlassCard>
        <Table
          columns={['Time', 'Actor', 'Action', 'Details']}
          rows={rows}
          empty="No audit entries yet."
          renderRow={(a) => (
            <>
              <Td className="whitespace-nowrap">{fmtDate(a.createdAt)}</Td>
              <Td>
                {a.actor?.email
                  ? <div><p>{a.actor.name || 'Admin'}</p><p className="text-xs text-mist">{a.actor.email}</p></div>
                  : <span className="text-xs text-mist">system</span>}
              </Td>
              <Td><span className="rounded bg-gold/10 px-2 py-0.5 text-xs text-gold">{a.action}</span></Td>
              <Td className="max-w-[320px] truncate text-xs text-mist" title={a.details}>{a.details || '—'}</Td>
            </>
          )}
        />
      </GlassCard>
    </div>
  );
}
