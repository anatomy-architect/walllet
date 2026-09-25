import { Link } from 'react-router-dom';
import { GlassCard, fmtMoney } from './ui';
import { TurbineSpin } from './decor';

// Five turbine cards: name, minimum, daily ROI, duration, cycle ROI, withdrawal fee.
// ROI calculator on the landing page is presentation-only.
export function PlanCard({ plan, action }) {
  const min = Number(plan.minInvestment);
  const roi = Number(plan.dailyRoiPct);
  const days = plan.durationDays;
  const daily = (min * roi) / 100;
  const cycleProfit = daily * days;
  const cycleRoi = (cycleProfit / min) * 100;
  const premium = Number(plan.withdrawalFeePct) === 0;

  return (
    <GlassCard className={`relative flex flex-col ${premium ? 'border-gold/40' : ''}`}>
      {premium && (
        <span className="absolute -top-3 right-4 rounded-full bg-gold px-3 py-0.5 text-[11px] font-bold uppercase text-abyss">
          0% fee
        </span>
      )}
      <div className="mb-4 flex items-center gap-4">
        <TurbineSpin />
        <div>
          <h3 className="font-display text-base font-bold text-foam">{plan.name}</h3>
          <p className="text-xs text-mist">{days} day cycle</p>
        </div>
      </div>
      <dl className="mb-4 space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-mist">Minimum</dt><dd className="font-semibold text-foam">${fmtMoney(min)}</dd></div>
        <div className="flex justify-between"><dt className="text-mist">Daily ROI</dt><dd className="font-semibold text-aqua">{roi}%</dd></div>
        <div className="flex justify-between"><dt className="text-mist">Daily earning (at min)</dt><dd className="font-semibold text-foam">${fmtMoney(daily)}</dd></div>
        <div className="flex justify-between"><dt className="text-mist">Cycle profit (at min)</dt><dd className="font-semibold text-kelp">${fmtMoney(cycleProfit)}</dd></div>
        <div className="flex justify-between"><dt className="text-mist">Cycle ROI</dt><dd className="font-semibold text-gold">{cycleRoi.toFixed(1)}%</dd></div>
        <div className="flex justify-between"><dt className="text-mist">Withdrawal fee</dt><dd className="font-semibold text-foam">{Number(plan.withdrawalFeePct)}%</dd></div>
      </dl>
      <div className="mt-auto">
        {action || (
          <Link
            to={`/register`}
            className="block rounded-xl bg-aqua px-5 py-2.5 text-center text-sm font-semibold text-abyss hover:brightness-110"
          >
            Start earning
          </Link>
        )}
      </div>
    </GlassCard>
  );
}
