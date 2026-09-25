import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBolt, FaShieldAlt, FaUsers, FaCoins } from 'react-icons/fa';
import { api } from '../api/client';
import { PlanCard } from '../components/PlanCard';
import { GlassCard, Spinner, Input, Select, fmtMoney } from '../components/ui';
import { OceanWaveBackground, TurbineSpin } from '../components/decor';

function RoiCalculator({ plans }) {
  const [planId, setPlanId] = useState('');
  const [amount, setAmount] = useState('');
  const plan = plans.find((p) => p.id === (planId || plans[0]?.id));
  const amt = Math.max(0, Number(amount) || 0);
  const daily = plan ? (amt * Number(plan.dailyRoiPct)) / 100 : 0;
  const profit = plan ? daily * plan.durationDays : 0;

  return (
    <GlassCard bright>
      <h3 className="font-display mb-4 text-lg font-bold">ROI Calculator <span className="text-xs font-sans font-normal text-mist">(estimate only)</span></h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Turbine" value={plan?.id || ''} onChange={(e) => setPlanId(e.target.value)}>
          {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
        <Input label="Investment amount (USD)" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={plan ? `$${fmtMoney(plan.minInvestment)} min` : ''} />
      </div>
      {plan && amt > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-abyss/50 p-3"><p className="text-xs text-mist">Daily</p><p className="font-display font-bold text-aqua">${fmtMoney(daily)}</p></div>
          <div className="rounded-xl bg-abyss/50 p-3"><p className="text-xs text-mist">Cycle profit</p><p className="font-display font-bold text-kelp">${fmtMoney(profit)}</p></div>
          <div className="rounded-xl bg-abyss/50 p-3"><p className="text-xs text-mist">You receive</p><p className="font-display font-bold text-gold">${fmtMoney(amt + profit)}</p></div>
        </div>
      )}
    </GlassCard>
  );
}

export default function Landing() {
  const [plans, setPlans] = useState(null);

  useEffect(() => {
    api.plans().then((d) => setPlans(d.plans)).catch(() => setPlans([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-32 pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-6 flex justify-center"><TurbineSpin size={72} /></div>
          <h1 className="font-display mx-auto max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            Ride the Current.<br /><span className="text-aqua">Harvest the Power.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-mist">
            AquaVault channels ocean energy into five hydro turbine plans with transparent
            daily returns, paid in USDT on BNB Smart Chain.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/register" className="rounded-xl bg-aqua px-8 py-3 font-semibold text-abyss shadow-[0_0_32px_rgba(0,229,255,0.4)] hover:brightness-110">
              Start investing
            </Link>
            <a href="#plans" className="rounded-xl border border-aqua/40 px-8 py-3 font-semibold text-aqua hover:bg-aqua/10">
              View turbines
            </a>
          </div>
        </div>
        <OceanWaveBackground />
      </section>

      {/* Plans */}
      <section id="plans" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display mb-2 text-center text-3xl font-bold">Hydro Turbine Plans</h2>
        <p className="mb-8 text-center text-sm text-mist">Simple daily ROI. No compounding. Principal returned at cycle end.</p>
        {!plans ? <Spinner /> : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((p) => <PlanCard key={p.id} plan={p} />)}
          </div>
        )}
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        {plans?.length > 0 && <RoiCalculator plans={plans} />}
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display mb-8 text-center text-3xl font-bold">How it works</h2>
        <div className="grid gap-5 md:grid-cols-4">
          {[
            { icon: FaBolt, t: '1. Pick a turbine', d: 'Choose one of five plans starting from $20.' },
            { icon: FaCoins, t: '2. Deposit USDT', d: 'Send USDT (BEP20) to the vault address and submit your TX hash.' },
            { icon: FaShieldAlt, t: '3. Get approved', d: 'Admin verifies your transfer and activates your turbine.' },
            { icon: FaUsers, t: '4. Earn daily', d: 'Daily profits credit automatically. Withdraw anytime over $20.' },
          ].map((s, i) => (
            <GlassCard key={i}>
              <s.icon className="mb-3 text-2xl text-aqua" />
              <h3 className="mb-1 font-semibold">{s.t}</h3>
              <p className="text-sm text-mist">{s.d}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Referral */}
      <section id="referral" className="mx-auto max-w-4xl px-4 py-12">
        <GlassCard bright className="text-center">
          <h2 className="font-display mb-2 text-2xl font-bold text-gold">3-Level Referral Rewards</h2>
          <p className="mx-auto mb-6 max-w-lg text-sm text-mist">
            Earn commissions when your network invests: 3% daily for 3 days on direct referrals,
            2% daily for 3 days on level 2, and 0.8% daily for 5 days on level 3.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[['Level 1', '3% / day', '3 days'], ['Level 2', '2% / day', '3 days'], ['Level 3', '0.8% / day', '5 days']].map(([l, r, d]) => (
              <div key={l} className="rounded-xl bg-abyss/50 p-4">
                <p className="text-xs uppercase tracking-wider text-mist">{l}</p>
                <p className="font-display text-xl font-bold text-gold">{r}</p>
                <p className="text-xs text-mist">{d}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
