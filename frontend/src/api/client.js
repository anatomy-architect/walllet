// Centralized API client. Cookies carry the session; the browser sends them
// automatically (credentials: 'include').
const BASE = '';

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: 'POST', body }),
  patch: (p, body) => request(p, { method: 'PATCH', body }),

  // auth
  register: (d) => request('/api/v1/auth/register', { method: 'POST', body: d }),
  login: (d) => request('/api/v1/auth/login', { method: 'POST', body: d }),
  logout: () => request('/api/v1/auth/logout', { method: 'POST' }),
  me: () => request('/api/v1/auth/me'),
  adminLogin: (d) => request('/api/v1/auth/admin/login', { method: 'POST', body: d }),
  adminLogout: () => request('/api/v1/auth/admin/logout', { method: 'POST' }),
  adminMe: () => request('/api/v1/auth/admin/me'),

  // public
  plans: () => request('/api/v1/plans'),
  appConfig: () => request('/api/v1/config'),

  // user
  dashboard: () => request('/api/v1/user/dashboard'),
  profile: () => request('/api/v1/user/profile'),
  changePassword: (d) => request('/api/v1/user/change-password', { method: 'POST', body: d }),

  deposits: () => request('/api/v1/deposits'),
  submitDeposit: (d) => request('/api/v1/deposits', { method: 'POST', body: d }),

  investments: () => request('/api/v1/investments'),

  withdrawals: () => request('/api/v1/withdrawals'),
  submitWithdrawal: (d) => request('/api/v1/withdrawals', { method: 'POST', body: d }),

  team: () => request('/api/v1/referrals'),
  history: (type) => request('/api/v1/history' + (type ? `?type=${type}` : '')),
  notifications: () => request('/api/v1/notifications'),
  markRead: (id) => request(`/api/v1/notifications/${id}/read`, { method: 'POST' }),
  markAllRead: () => request('/api/v1/notifications/read-all', { method: 'POST' }),

  // admin
  adminDashboard: () => request('/api/v1/admin/dashboard'),
  depositQueue: (status) => request(`/api/v1/deposits/admin/queue${status ? `?status=${status}` : ''}`),
  approveDeposit: (id, adminNote) => request(`/api/v1/deposits/admin/${id}/approve`, { method: 'POST', body: { adminNote } }),
  rejectDeposit: (id, adminNote) => request(`/api/v1/deposits/admin/${id}/reject`, { method: 'POST', body: { adminNote } }),
  withdrawalQueue: (status) => request(`/api/v1/withdrawals/admin/queue${status ? `?status=${status}` : ''}`),
  processWithdrawal: (id) => request(`/api/v1/withdrawals/admin/${id}/process`, { method: 'POST' }),
  completeWithdrawal: (id, txHash) => request(`/api/v1/withdrawals/admin/${id}/complete`, { method: 'POST', body: { txHash } }),
  rejectWithdrawal: (id, adminNote) => request(`/api/v1/withdrawals/admin/${id}/reject`, { method: 'POST', body: { adminNote } }),
  adminUsers: (q) => request(`/api/v1/admin/users${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  adminUserDetail: (id) => request(`/api/v1/admin/users/${id}`),
  suspendUser: (id, reason) => request(`/api/v1/admin/users/${id}/suspend`, { method: 'POST', body: { reason } }),
  restoreUser: (id) => request(`/api/v1/admin/users/${id}/restore`, { method: 'POST' }),
  adjustUser: (id, d) => request(`/api/v1/admin/users/${id}/adjust`, { method: 'POST', body: d }),
  updatePlan: (id, d) => request(`/api/v1/plans/admin/${id}`, { method: 'PATCH', body: d }),
  adminReferrals: (params) => request(`/api/v1/admin/referrals${params ? `?${params}` : ''}`),
  adminAudit: () => request('/api/v1/admin/audit'),
  runEarnings: () => request('/api/v1/admin/jobs/earnings', { method: 'POST' }),
};
