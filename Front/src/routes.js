// Material Dashboard 2 React layouts
import Dashboard from 'layouts/dashboard';
import Tables from 'layouts/tables';
import Billing from 'layouts/billing';
import Notifications from 'layouts/notifications';
import Profile from 'layouts/profile';
// @mui icons
import Icon from '@mui/material/Icon';

const routes = [
  {
    type: 'collapse',
    name: 'Tableau de Bord',
    key: 'Tableau de Bord',
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: '/dashboard',
    component: <Dashboard />,
  },
  {
    type: 'collapse',
    name: 'Site',
    key: 'tables',
    icon: <Icon fontSize="small">table_view</Icon>,
    route: '/tables',
    component: <Tables />,
  },
  {
    type: 'collapse',
    name: 'Site Info',
    key: 'billing',
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: '/billing',
    component: <Billing />,
  },
  {
    type: 'collapse',
    name: 'Contacts',
    key: 'notifications',
    icon: <Icon fontSize="small">notifications</Icon>,
    route: '/notifications',
    component: <Notifications />,
  },
  {
    type: 'collapse',
    name: 'Entités',
    key: 'Entités',
    icon: <Icon fontSize="small">person</Icon>,
    route: '/profile',
    component: <Profile />,
  },
  {
    type: 'collapse',
    name: 'Paramètres',
    key: 'Paramètres',
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: '/dashboard',
    component: <Dashboard />,
  },
];
export default routes;
