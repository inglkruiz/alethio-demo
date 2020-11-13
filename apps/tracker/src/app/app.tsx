import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import InputBase from '@material-ui/core/InputBase';
import { createStyles, fade, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import MuiTab, { TabProps as MuiTabProps } from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import HistoryIcon from '@material-ui/icons/History';
import SearchIcon from '@material-ui/icons/Search';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import MiuTabPanel, { TabPanelProps as MuiTabPanelProps } from '@material-ui/lab/TabPanel';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      position: 'fixed',
      height: '100%',
      width: '100%',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    title: {
      flexGrow: 1,
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '20ch',
      '&:focus': {
        width: '42ch',
      },
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      paddingTop: theme.spacing(8),
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      paddingTop: theme.spacing(8),
      backgroundColor: theme.palette.background.paper,
      height: '100%',
    },
  })
);

//#region Tabs

type TabPanelKey = 'history' | 'tracked';

interface TabPanelProps extends MuiTabPanelProps {
  value: TabPanelKey;
}

function TabPanel(props: TabPanelProps) {
  return <MiuTabPanel {...props}></MiuTabPanel>;
}

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
  <Tooltip title={tooltip ?? ''}>
    <MuiTab {...rest}></MuiTab>
  </Tooltip>
));

//#endregion

export const App = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState<TabPanelKey>('history');

  const handleTabChange = (event: React.ChangeEvent, newValue: TabPanelKey) => {
    setTabValue(newValue);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const searchInput = form.elements.namedItem('search') as HTMLInputElement;

    if (searchInput.value) {
      console.debug(searchInput.value);
      searchInput.value = '';
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            Alethio demo
          </Typography>
          <form
            className={classes.search}
            onSubmit={handleSearchSubmit}
            noValidate
            autoComplete="off"
          >
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              id="search"
              placeholder="Search by Address"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </form>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <TabContext value={tabValue}>
          <TabList
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab value="history" icon={<HistoryIcon />} tooltip="History"></Tab>
            <Tab
              value="tracked"
              icon={<TrackChangesIcon />}
              tooltip="Tracked"
            ></Tab>
          </TabList>
          <TabPanel value="history">History tab</TabPanel>
          <TabPanel value="tracked">Tracked tab</TabPanel>
        </TabContext>
      </Drawer>
      <main className={classes.content}></main>
    </div>
  );
};

export default App;
