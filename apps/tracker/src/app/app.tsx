import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from './components/AppBar';
import LeftDrawerTabs from './components/LeftDrawerTabs';
import TxnDataGrid from './components/TxnDataGrid';

const drawerWidthMd = 240;
const drawerWidthLg = 360;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      position: 'fixed',
      height: '100%',
      width: '100%',
    },
    drawer: {
      width: drawerWidthMd,
      flexShrink: 0,
      [theme.breakpoints.up('lg')]: {
        width: drawerWidthLg,
      },
    },
    drawerPaper: {
      width: drawerWidthMd,
      paddingTop: theme.spacing(8),
      [theme.breakpoints.up('lg')]: {
        width: drawerWidthLg,
      },
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(1),
      paddingTop: theme.spacing(9),
      backgroundColor: theme.palette.background.paper,
      height: '100%',
    },
  })
);

export const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <LeftDrawerTabs />
      </Drawer>
      <main className={classes.content}>
        <TxnDataGrid />
      </main>
    </div>
  );
};

export default App;
