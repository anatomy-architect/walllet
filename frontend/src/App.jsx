import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './store/useStore';
import { Spinner } from './components/ui';
import { PublicLayout, AuthLayout, AppLayout, AdminLayout } from './components/Layout';

import Landing from './pages/Landing';
import { Login, Register } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Team from './pages/Team';
import History from './pages/History';
import { Notifications, Profile } from './pages/Account';
import { AdminLogin } from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDeposits from './pages/admin/AdminDeposits';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReferrals from './pages/admin/AdminReferrals';
import AdminPlans from './pages/admin/AdminPlans';
import AdminAudit from './pages/admin/AdminAudit';

function RequireUser({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <Spinner className="min-h-screen" />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { admin, ready } = useAuth();
  if (!ready) return <Spinner className="min-h-screen" />;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-abyss">
      <h1 className="font-display text-6xl font-bold text-aqua">404</h1>
      <p className="text-mist">Lost at sea.</p>
      <a href="/" className="text-aqua hover:underline">← Back to shore</a>
    </div>
  );
}

export default function App() {
  const init = useAuth((s) => s.init);
  useEffect(() => { init(); }, [init]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#0D1B4B', color: '#E8F4FD', border: '1px solid rgba(0,229,255,0.25)' },
        }}
      />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        <Route path="/app" element={<RequireUser><AppLayout /></RequireUser>}>
          <Route index element={<Dashboard />} />
          <Route path="plans" element={<Plans />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="team" element={<Team />} />
          <Route path="history" element={<History />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<AdminDashboard />} />
          <Route path="deposits" element={<AdminDeposits />} />
          <Route path="withdrawals" element={<AdminWithdrawals />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="referrals" element={<AdminReferrals />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="audit" element={<AdminAudit />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
