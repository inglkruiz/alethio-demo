import { configureStore, createSelector } from '@reduxjs/toolkit';

import accountsReducer, { fetchList, selectAccounts } from './accounts/accounts.slice';
import appReducer, { selectAccountId, setAccountId } from './app/app.slice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    accounts: accountsReducer,
  },
});

// Init state
store
  .dispatch(fetchList())
  .then((response) => store.dispatch(setAccountId(response.payload[0].id)));

export type RootState = ReturnType<typeof store.getState>;

export const selectAccount = createSelector(
  [selectAccounts, selectAccountId],
  (accounts, address) => accounts?.find((a) => a.id === address)
);
