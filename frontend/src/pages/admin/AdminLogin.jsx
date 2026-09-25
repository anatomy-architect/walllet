import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../store/useStore';
import { Input, Button } from '../../components/ui';

export function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(form);
      toast.success('Admin session started');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="font-display text-center text-2xl font-bold text-gold">Admin Console</h1>
      <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <Button variant="gold" className="w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
    </form>
  );
}
