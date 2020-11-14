import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import HistoryIcon from '@material-ui/icons/History';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import { createSelector } from '@reduxjs/toolkit';

import { selectAccounts } from '../state/accounts/accounts.slice';
import Tab from './Tab';
import TabPanel from './TabPanel';

import type { TabPanelKey } from './Tab';
const selectTrackedAccounts = createSelector([selectAccounts], (accounts) =>
  accounts?.filter((account) => account.isTracked)
);

const LeftDrawerTabs = () => {
  const accounts = useSelector(selectAccounts);
  const accountsTracked = useSelector(selectTrackedAccounts);
  const [tab, setTab] = useState<TabPanelKey>('history');

  const handleTabChange = (event: React.ChangeEvent, newValue: TabPanelKey) => {
    setTab(newValue);
  };

  return (
    <TabContext value={tab}>
      <TabList
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab value="history" icon={<HistoryIcon />} tooltip="History"></Tab>
        <Tab
          value="tracked"
          icon={<TrackChangesIcon />}
          tooltip="Tracked"
        ></Tab>
      </TabList>
      <TabPanel value="history" accounts={accounts} />
      <TabPanel value="tracked" accounts={accountsTracked} />
    </TabContext>
  );
};

export default LeftDrawerTabs;
