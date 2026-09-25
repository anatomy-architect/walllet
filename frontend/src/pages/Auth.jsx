import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../store/useStore';
import { Input, Button } from '../components/ui';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back');
      navigate('/app');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="font-display text-center text-2xl font-bold">Log in</h1>
      <Input label="Email" type="email" required value={form.email} onChange={set('email')} />
      <Input label="Password" type="password" required value={form.password} onChange={set('password')} />
      <Button className="w-full" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</Button>
      <p className="text-center text-sm text-mist">
        New here? <Link to="/register" className="text-aqua hover:underline">Create an account</Link>
      </p>
    </form>
  );
}

export function Register() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    referralCode: params.get('ref') || '', terms: false,
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created — welcome to AquaVault');
      navigate('/app');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="font-display text-center text-2xl font-bold">Create account</h1>
      <Input label="Full name" required value={form.name} onChange={set('name')} />
      <Input label="Email" type="email" required value={form.email} onChange={set('email')} />
      <Input label="Password (min 8 characters)" type="password" required value={form.password} onChange={set('password')} />
      <Input label="Confirm password" type="password" required value={form.confirmPassword} onChange={set('confirmPassword')} />
      <Input label="Referral code (optional)" value={form.referralCode} onChange={set('referralCode')} placeholder="AV-XXXXXX" />
      <label className="flex items-start gap-2 text-xs text-mist">
        <input type="checkbox" checked={form.terms} onChange={set('terms')} className="mt-0.5 accent-cyan-400" required />
        I accept the terms and understand deposits are manual USDT (BEP20) transfers.
      </label>
      <Button className="w-full" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</Button>
      <p className="text-center text-sm text-mist">
        Already have an account? <Link to="/login" className="text-aqua hover:underline">Log in</Link>
      </p>
    </form>
  );
}
