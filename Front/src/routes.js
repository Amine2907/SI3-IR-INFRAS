/**
 * This file defines the routes of the application.
 *
 */
import Dashboard from 'layouts/dashboard';
import Sites from 'layouts/sites';
import Contacts from 'layouts/contacts';
import Profile from 'layouts/profile';
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
    route: '/sites',
    component: <Sites />,
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
    route: '/profile',
    component: <Profile />,
  },
];
export default routes;
