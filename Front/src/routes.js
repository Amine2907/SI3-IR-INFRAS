// Material Dashboard 2 React layouts
import Dashboard from 'layouts/dashboard';
import Tables from 'layouts/tables';
import Billing from 'layouts/billing';
import Notifications from 'layouts/notifications';
import Profile from 'layouts/profile';
// import AuthPage from 'layouts/authentification/AuthPage';
// @mui icons
import Icon from '@mui/material/Icon';

const routes = [
  {
    type: 'collapse',
    name: 'Tableau de Bord',
    key: 'dashboard',
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
    name: 'Profile',
    key: 'profile',
    icon: <Icon fontSize="small">person</Icon>,
    route: '/profile',
    component: <Profile />,
  },
  // {
  //   type: 'collapse',
  //   name: 'Auth',
  //   key: 'Auth',
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: '/Authentification',
  //   component: <AuthPage />,
  // },
];
export default routes;
