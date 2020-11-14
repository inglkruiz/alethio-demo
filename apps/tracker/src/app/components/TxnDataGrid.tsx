import numbro from 'numbro';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { fromWei } from 'web3-utils';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { ColDef, DataGrid as MuiDataGrid, DataGridProps, RowData } from '@material-ui/data-grid';
import { createSelector } from '@reduxjs/toolkit';

import { selectAccount } from '../state/store';

const selectTransactions = createSelector(
  [selectAccount],
  (account) => account?.transactions
);

const selectTransactionsData = createSelector<any, any, RowData[]>(
  [selectTransactions],
  (transactions) =>
    (transactions?.data ?? []).map((txn) => {
      const { id, relationships, attributes } = txn;

      return {
        id: id,
        block: attributes.globalRank[0],
        from: relationships.from.data.id,
        to: relationships.to.data.id,
        value: attributes.value,
        fee: attributes.fee,
      };
    })
);

const DataGrid = withStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: 13,
    },
  })
)((props: { classes: any } & DataGridProps) => {
  return <MuiDataGrid {...props} className={props.classes.root} />;
});

const formatGas = (value: string) =>
  numbro(fromWei(value)).format({
    mantissa: 7,
    trimMantissa: true,
  });

const formatEtherCurrency = (value: string) =>
  numbro(fromWei(value)).formatCurrency({
    currencyPosition: 'postfix',
    spaceSeparated: true,
    currencySymbol: 'Ether',
    mantissa: 7,
    trimMantissa: true,
  });

export const TxnDataGrid = () => {
  const transactionsData = useSelector(selectTransactionsData);

  const columns: ColDef[] = [
    { field: 'id', headerName: 'Txn Hash', width: 180 },
    { field: 'from', headerName: 'From', width: 180 },
    { field: 'to', headerName: 'To', width: 180 },
    {
      field: 'block',
      headerName: 'Block',
      width: 100,
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 160,
      valueFormatter: ({ value }) => formatEtherCurrency(String(value)),
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'fee',
      headerName: 'Txn Fee',
      width: 120,
      valueFormatter: ({ value }) => formatGas(String(value)),
      align: 'right',
      headerAlign: 'right',
    },
  ];

  const Grid = useCallback(() => {
    return (
      <DataGrid
        hideFooter
        pagination
        rowHeight={36}
        columns={columns}
        rows={transactionsData}
      />
    );
  }, [transactionsData, columns]);

  if (transactionsData.length === 0) return null;

  return <Grid />;
};

export default TxnDataGrid;
