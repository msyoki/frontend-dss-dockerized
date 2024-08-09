import * as React from 'react';
import Box from '@mui/material/Box';
import { 
  DataGrid, 
  GridToolbarFilterButton,
  GridToolbarExport, 
  GridToolbarQuickFilter,
  GridToolbarContainer, 
} from '@mui/x-data-grid';


function Logs2(props) {
      

const columns= [
  
    { field: 'activity', headerName: 'Activity', width: 100 },
    { field: 'user', headerName: 'User', width: 150 },
    { field: 'ip', headerName: 'IP', width: 130 },
    { field: 'created', headerName: 'TimeStatmp', width: 160 ,filterable: false,sortable: false},
    { field: 'description', headerName: 'Description', width: 500 },
    { field: 'guid', headerName: 'Document Guid', width: 300 },
    { field: 'otpnumber', headerName: 'OTP Number', width: 200 },

    
 
  ];
  

  let  CustomToolbar=()=> {
    return (
      <GridToolbarContainer>
        <GridToolbarQuickFilter/>
        <GridToolbarFilterButton  />
        {/* <GridToolbarDensitySelector /> */}
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (

        <Box sx={{ height: 400, width: '100%' ,fontSize:'10px'}}>
            <DataGrid
                rows={props.logs}
                columns={columns}
                density='compact'
                components={{
                    Toolbar: CustomToolbar,
                }}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 15,
                    },
                },
                }}
                pageSizeOptions={[5,15,20,100]}
                // checkboxSelection
                disableRowSelectionOnClick
                style={{ fontSize: '12px' }}
                className='bg-light '
       
            />
        </Box>
  
  );
}

export default Logs2;