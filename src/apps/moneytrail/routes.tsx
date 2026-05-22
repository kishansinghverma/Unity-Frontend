import Dashboard from './pages/dashboard/Dashboard';
import Import from './pages/import';
import Review from './pages/review';

export const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/review',
    component: Review,
  },
  {
    path: '/import',
    component: Import,
  },
];
