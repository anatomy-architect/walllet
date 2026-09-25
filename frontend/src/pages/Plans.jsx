import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { PlanCard } from '../components/PlanCard';
import { PageHeader, Spinner, EmptyState, Button } from '../components/ui';

export default function Plans() {
  const [plans, setPlans] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.plans().then((d) => setPlans(d.plans)).catch(() => setPlans([]));
  }, []);

  if (!plans) return <Spinner />;

  return (
    <div>
      <PageHeader title="Hydro Turbine Plans" sub="Simple daily ROI · no compounding · principal returned at cycle end" />
      {plans.length === 0 ? <EmptyState message="No plans available right now." /> : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((p) => (
            <PlanCard
              key={p.id}
              plan={p}
              action={
                <Button className="w-full" onClick={() => navigate(`/app/deposit?plan=${p.id}`)}>
                  Invest in this turbine
                </Button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
