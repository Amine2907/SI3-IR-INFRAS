/**
 * This file defines the routes of the application.
 *
 */
// Material Dashboard 2 React layouts
import Dashboard from 'layouts/dashboard';
import Billing from 'layouts/billing';
import Contacts from 'layouts/contacts';
import Profile from 'layouts/settings';
// @mui icons
import Icon from '@mui/material/Icon';
import Entites from 'layouts/entites';

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
    key: 'billing',
    icon: <Icon fontSize="small">construction</Icon>,
    route: '/billing',
    component: <Billing />,
  },
  {
    type: 'collapse',
    name: 'Contacts',
    key: 'notifications',
    icon: <Icon fontSize="small">contacts</Icon>,
    route: '/contacts',
    component: <Contacts />,
  },
  {
    type: 'collapse',
    name: 'Entités',
    key: 'Entités',
    icon: <Icon fontSize="small">person</Icon>,
    route: '/entites',
    component: <Entites />,
  },
  {
    type: 'collapse',
    name: 'Paramètres',
    key: 'Paramètres',
    icon: <Icon fontSize="small">settings</Icon>,
    route: '/settings',
    component: <Profile />,
  },
];
export default routes;
