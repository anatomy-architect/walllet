import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome, FaWater, FaWallet, FaUsers, FaHistory, FaUser, FaBell,
  FaShieldAlt, FaSignOutAlt, FaBars, FaTimes,
} from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../store/useStore';
import { OceanWaveBackground } from './decor';

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-aqua/15 text-xl text-aqua">🌊</span>
      <span className="font-display text-lg font-bold tracking-wide text-foam">
        AQUA<span className="text-aqua">VAULT</span>
      </span>
    </Link>
  );
}

// ---------- Public site ----------

export function PublicLayout() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex min-h-screen flex-col bg-abyss">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-abyss/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-mist md:flex">
            <a href="#plans" className="hover:text-aqua">Turbines</a>
            <a href="#how" className="hover:text-aqua">How it works</a>
            <a href="#referral" className="hover:text-aqua">Referrals</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <Link to="/app" className="rounded-xl bg-aqua px-5 py-2 text-sm font-semibold text-abyss hover:brightness-110">
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-mist hover:text-aqua">Log in</Link>
                <Link to="/register" className="rounded-xl bg-aqua px-5 py-2 text-sm font-semibold text-abyss hover:brightness-110">
                  Get started
                </Link>
              </>
            )}
          </div>
          <button className="text-foam md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        {open && (
          <div className="border-t border-white/10 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-3 text-sm">
              <a href="#plans" onClick={() => setOpen(false)} className="text-mist">Turbines</a>
              <a href="#how" onClick={() => setOpen(false)} className="text-mist">How it works</a>
              {user ? (
                <Link to="/app" className="text-aqua">Open Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="text-mist">Log in</Link>
                  <Link to="/register" className="text-aqua">Get started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-white/10 bg-abyss px-4 py-8 text-center text-xs text-mist">
        <p className="font-display mb-2 text-sm font-bold text-foam">AQUA<span className="text-aqua">VAULT</span></p>
        <p>Hydro turbine investment platform · USDT (BEP20) only</p>
      </footer>
      <OceanWaveBackground />
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-abyss px-4 py-10">
      <div className="glass w-full max-w-md p-8">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <Outlet />
      </div>
      <OceanWaveBackground />
    </div>
  );
}

// ---------- Member app ----------

const appLinks = [
  { to: '/app', label: 'Dashboard', icon: FaHome, end: true },
  { to: '/app/plans', label: 'Turbines', icon: FaWater },
  { to: '/app/deposit', label: 'Deposit', icon: FaWallet },
  { to: '/app/withdraw', label: 'Withdraw', icon: FaWallet },
  { to: '/app/team', label: 'Team', icon: FaUsers },
  { to: '/app/history', label: 'History', icon: FaHistory },
  { to: '/app/notifications', label: 'Alerts', icon: FaBell },
  { to: '/app/profile', label: 'Profile', icon: FaUser },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const doLogout = async () => {
    await logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${
      isActive ? 'bg-aqua/15 text-aqua' : 'text-mist hover:bg-white/5 hover:text-foam'
    }`;

  return (
    <div className="flex min-h-screen bg-abyss">
      {/* Sidebar — desktop */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-deep/40 p-4 lg:flex">
        <div className="mb-8 px-2"><Logo /></div>
        <nav className="flex flex-1 flex-col gap-1">
          {appLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={navClass}>
              <l.icon /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4">
          <p className="truncate px-2 text-xs text-mist">{user?.name}</p>
          <button onClick={doLogout} className="mt-1 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-mist hover:text-coral">
            <FaSignOutAlt /> Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — mobile */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-abyss/85 px-4 py-3 backdrop-blur-md lg:hidden">
          <Logo />
          <button onClick={() => setOpen(!open)} className="text-foam" aria-label="Menu">
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </header>
        {open && (
          <nav className="grid grid-cols-2 gap-2 border-b border-white/10 bg-deep/60 p-4 lg:hidden">
            {appLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)} className={navClass}>
                <l.icon /> {l.label}
              </NavLink>
            ))}
            <button onClick={doLogout} className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-mist">
              <FaSignOutAlt /> Log out
            </button>
          </nav>
        )}

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 lg:pb-10">
          <Outlet />
        </main>

        {/* Bottom nav — mobile */}
        <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-white/10 bg-abyss/95 px-2 py-2 backdrop-blur-md lg:hidden">
          {appLinks.slice(0, 5).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] ${
                  isActive ? 'text-aqua' : 'text-mist'
                }`
              }
            >
              <l.icon size={18} />
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
  void location;
}

// ---------- Admin console ----------

const adminLinks = [
  { to: '/admin', label: 'Overview', icon: FaHome, end: true },
  { to: '/admin/deposits', label: 'Deposits', icon: FaWallet },
  { to: '/admin/withdrawals', label: 'Withdrawals', icon: FaWallet },
  { to: '/admin/users', label: 'Users', icon: FaUsers },
  { to: '/admin/referrals', label: 'Referrals', icon: FaUsers },
  { to: '/admin/plans', label: 'Plans', icon: FaWater },
  { to: '/admin/audit', label: 'Audit log', icon: FaShieldAlt },
];

export function AdminLayout() {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();

  const doLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-abyss">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-deep/40 p-4 md:flex">
        <div className="mb-2 px-2"><Logo /></div>
        <p className="mb-6 px-2 text-[11px] uppercase tracking-widest text-gold">Admin console</p>
        <nav className="flex flex-1 flex-col gap-1">
          {adminLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${
                  isActive ? 'bg-gold/15 text-gold' : 'text-mist hover:bg-white/5 hover:text-foam'
                }`
              }
            >
              <l.icon /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4">
          <p className="truncate px-2 text-xs text-mist">{admin?.email}</p>
          <button onClick={doLogout} className="mt-1 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-mist hover:text-coral">
            <FaSignOutAlt /> Log out
          </button>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div className="mb-4 flex flex-wrap gap-2 md:hidden">
          {adminLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-xs ${isActive ? 'bg-gold/15 text-gold' : 'bg-white/5 text-mist'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <Outlet />
      </main>
    </div>
  );
}
