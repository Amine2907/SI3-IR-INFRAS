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
import Settings from '../Settings';
import Users from '../Users';
import Companies from '../Companies';

function HeaderFunctions() {
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState({ firstName: '', lastName: '' });

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
        return <Settings setUserData={setUserData} />;
      case 1:
        return <Users />;
      case 2:
        return <Companies />;
      default:
        return null;
    }
  };

  return {
    tabsOrientation,
    tabValue,
    handleSetTabValue,
    userData,
    renderTabContent,
  };
}
export default HeaderFunctions;
