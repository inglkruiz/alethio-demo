import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAccount, getAccounts, toggleAccountIsTracked } from '../../api';

import type { RootState } from '../../state/store';

const initialState = {
  data: null,
};

export const fetchList = createAsyncThunk(
  'accounts/fetchAccounts',
  async () => {
    const axiosResponse = await getAccounts();
    if (axiosResponse?.data) {
      return axiosResponse.data.data as [];
    }
  }
);

export const toggleIsTracked = createAsyncThunk(
  'accounts/toggleIsTracked',
  async (address: string) => {
    const axiosResponse = await toggleAccountIsTracked(address);
    if (axiosResponse?.data) {
      return axiosResponse.data.data as { id: string; isTracked: boolean };
    }
  }
);

export const search = createAsyncThunk(
  'accounts/search',
  async (address: string) => {
    const axiosResponse = await getAccount(address);
    if (axiosResponse?.data) {
      return axiosResponse.data.data as { id: string; isTracked: boolean };
    }
  }
);

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchList.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(toggleIsTracked.fulfilled, (state, action) => {
      const account = state.data.find((a) => a.id === action.payload.id);

      account.isTracked = action.payload.isTracked;
    });

    builder.addCase(search.fulfilled, (state, action) => {
      state.data.unshift(action.payload);
    });
  },
});

export const selectAccounts = (state: RootState) => state.accounts.data;

export default accountsSlice.reducer;
