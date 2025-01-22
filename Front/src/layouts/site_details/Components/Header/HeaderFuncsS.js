/**
 * HeaderFunctions component is responsible for rendering the header, which contains
 * tabs with the routes to Settings, Users, and Companies. It also handles the
 * orientation of the tabs based on the screen size, and renders the appropriate
 * component based on the selected tab.
 *
 * @returns {Object} An object containing the state values and functions:
 *   - tabsOrientation: The orientation of the tabs ('horizontal' or 'vertical')
 *   - tabValue: The currently selected tab (0, 1, or 2)
 *   - handleSetTabValue: A function to set the currently selected tab
 *   - userData: The user data object
 *   - renderTabContent: A function to render the appropriate component based on the
 *     selected tab
 */
import { useState, useEffect } from 'react';
import breakpoints from 'assets/theme/base/breakpoints';
import Prospect from '../Propect';
import DR from '../DR';
import PreEtude from '../PreEtude';
import Reglement from '../Reglement';
import Traveaux from '../Traveaux';
import MES from '../MES';
import Devis from '../Devis';
import Fatcure from '../Facture';

function HeaderFunctions() {
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);

  // Adjust the orientation of tabs based on screen size
  useEffect(() => {
    function handleTabsOrientation() {
      setTabsOrientation(window.innerWidth < breakpoints.values.sm ? 'vertical' : 'horizontal');
    }
    window.addEventListener('resize', handleTabsOrientation);
    handleTabsOrientation();
    return () => window.removeEventListener('resize', handleTabsOrientation);
  }, []);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  // Function to render the appropriate component based on tabValue
  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return <Prospect />;
      case 1:
        return <PreEtude />;
      case 2:
        return <DR />;
      case 3:
        return <Devis />;
      case 4:
        return <Reglement />;
      case 5:
        return <Traveaux />;
      case 6:
        return <MES />;
      case 7:
        return <Fatcure />;
      default:
        return null;
    }
  };
  return {
    tabsOrientation,
    tabValue,
    handleSetTabValue,
    renderTabContent,
  };
}
export default HeaderFunctions;
