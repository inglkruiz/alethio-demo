import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MuiAppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import { createStyles, fade, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';

import { search } from '../state/accounts/accounts.slice';
import { setAccountId } from '../state/app/app.slice';

import type { RootState } from '../state/store';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

export const AppBar = () => {
  const dispatch = useDispatch();
  const accounts = useSelector((state: RootState) => state.accounts.data);
  const classes = useStyles();

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const searchInput = form.elements.namedItem('search') as HTMLInputElement;

    const address = searchInput.value;
    if (address) {
      const existingAccoun = accounts.find((a) => a.id === address);

      if (!existingAccoun) {
        dispatch(search(address));
      }

      dispatch(setAccountId(address));
      searchInput.value = '';
    }
  };

  return (
    <MuiAppBar position="fixed" className={classes.appBar}>
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
    </MuiAppBar>
  );
};

export default AppBar;
