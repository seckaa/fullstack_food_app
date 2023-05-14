import React from 'react';
import MaterialTable from 'material-table';
import {ThemeProvider, createTheme} from '@mui/material';

const DataTable = ({columns, data, title, actions}) => {
    const defaultMaterialTheme = createTheme();
  return (
    <div className='flex items-center justify-center gap-4 pt-6 w-full'>
        <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
        columns={columns}
        data={data}
        title={title}
        actions={actions}/>
      </ThemeProvider>

    </div>
  );
};

export default DataTable;