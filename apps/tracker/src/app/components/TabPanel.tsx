import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createStyles, Theme, withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import PortableWifiOffIcon from '@material-ui/icons/PortableWifiOff';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import MiuTabPanel, { TabPanelProps as MuiTabPanelProps } from '@material-ui/lab/TabPanel';

import { toggleIsTracked } from '../state/accounts/accounts.slice';
import { selectAccountId, setAccountId } from '../state/app/app.slice';

import type { TabPanelKey } from './Tab';
interface TabPanelProps extends MuiTabPanelProps {
  value: TabPanelKey;
  accounts: any[];
}

const TabPanel = withStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0),
    },
  })
)(({ accounts, ...rest }: TabPanelProps) => {
  const accountId = useSelector(selectAccountId);
  const dispatch = useDispatch();

  const toggleAccountIsTracked = (address: string) => {
    dispatch(toggleIsTracked(address));
  };

  const selectAccount = (event: React.MouseEvent, address: string) => {
    dispatch(setAccountId(address));
  };

  return (
    <MiuTabPanel {...rest}>
      <List component="nav">
        {accounts
          ? accounts.map(({ id, isTracked }) => (
              <ListItem
                button
                key={id}
                selected={id === accountId}
                onClick={(event) => selectAccount(event, id)}
              >
                <Tooltip title={id} placement="left" enterDelay={750}>
                  <ListItemText
                    primary={id}
                    primaryTypographyProps={{
                      noWrap: true,
                    }}
                  />
                </Tooltip>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => toggleAccountIsTracked(id)}
                  >
                    {isTracked ? (
                      <PortableWifiOffIcon fontSize="small" />
                    ) : (
                      <TrackChangesIcon fontSize="small" />
                    )}
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          : null}
      </List>
    </MiuTabPanel>
  );
});

export default TabPanel;
