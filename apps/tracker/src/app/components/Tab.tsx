import React from 'react';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import MuiTab, { TabProps as MuiTabProps } from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';

export type TabPanelKey = 'history' | 'tracked';

interface TabProps extends MuiTabProps {
  value: TabPanelKey;
  tooltip: string;
}

const Tab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 120,
    },
  })
)(({ tooltip, ...rest }: TabProps) => (
  <Tooltip title={tooltip ?? ''} enterDelay={750}>
    <MuiTab {...rest}></MuiTab>
  </Tooltip>
));

export default Tab;
