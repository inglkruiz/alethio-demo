import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../../state/store';

const initialState = {
  accountId: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAccountId: (state, action) => {
      state.accountId = action.payload;
    },
  },
});

export const { setAccountId } = appSlice.actions;

export const selectAccountId = (state: RootState) => state.app.accountId;

export default appSlice.reducer;
