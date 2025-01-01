/* eslint-disable */
import { useState, useEffect } from 'react';
import breakpoints from 'assets/theme/base/breakpoints';
import ProspectList from '../Lists/Prospect/prospectList';
import DeclPreaList from '../Lists/DeclPreal/dpList';
function HeaderListFunctions() {
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
        return <ProspectList />;
      case 1:
        return <DeclPreaList />;
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
export default HeaderListFunctions;
