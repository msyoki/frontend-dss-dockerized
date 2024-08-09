import React , {useState} from 'react';
import Box from '@mui/material/Box';
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';

import { 
  DataGrid, 
  GridToolbarFilterButton,
  GridToolbarExport, 
  GridToolbarQuickFilter,
  GridToolbarContainer, 
} from '@mui/x-data-grid';


function Users2(props) {
    const[opendialogdocdetails,setOpenDialogDocDetails]=useState(false)
    const[document,setDocument]=useState({})
    const[documentsigners,setDocumentSigners]=useState([])

    let ontableclick=(active,admin,Id,email,first,last,phone)=>{ 
         props.setCurrentEditUserActive(`${active}`)
         props.setCurrentEditUserAdmin(`${admin}`)
         props.setCurrentEditUser(Id)
         props.setCurrentEditUserEmail(email)
         props.setCurrentEditUserLast(last)
         props.setCurrentEditUserFirst(first)
         props.setCurrentEditUserPhone(phone)
         props.setOpenDialogUpdateUser(true)
        // alert('clicked')
    }
     

const columns= [
    { field: 'first_name', headerName: 'First', width: 150  },

      { field: 'last_name', headerName: 'Last', width: 150},
      { field: 'email', headerName: 'Email', width: 200 },
   
      { field: 'phone', headerName: 'Phone', width: 200 },
      // { field: 'is_active', headerName: 'Active', width: 200 },
      {
        field: 'action2',
        headerName: 'Edit User',
        width: 130,
        renderCell: (params) => {
          const handleClick = () => {
            ontableclick(params.row.is_active,params.row.is_admin,params.row.id,params.row.email,params.row.first_name,params.row.last_name,params.row.phone)
            // alert(`ID: ${params.row.signers}`);
          };
    
          return (
          <i  onClick={handleClick} 
            style={{
              fontSize: '13.5px',
              color:'#403d39',
              borderRadius: '50%', // Making the button rounded
              cursor: 'pointer', // Adding pointer cursor for better UX
              padding: '8px', // Adding padding for better touch target
              backgroundColor: '#f0f0f0', // You can customize the background color
              transition: 'background-color 0.3s ease', // Adding transition for smooth hover effect
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#ffff')} // Change background on hover
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')} // Reset background on mouse out
            class="fas fa-user-edit mx-1"></i> 
    
          );
        },
        filterable: false
      },
   
    
    
 
  ];
  const visibleColumns = columns.filter((column) => column.field !== 'owner'); 
 

  let  CustomToolbar=()=> {
    return (
      <GridToolbarContainer>
        <GridToolbarQuickFilter
  
        />
        <GridToolbarFilterButton

        />
        {/* <GridToolbarDensitySelector /> */}
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
  let viewDocDetails=(document,signers)=>{
    setOpenDialogDocDetails(true)
    setDocument(document)
    setDocumentSigners(signers)
}

const getRowId = (row) => row.id;


  return (
  <>

        <Box sx={{ height: 400, width: '100%' ,fontSize:'10px'}} >
            <DataGrid
                rows={props.users}
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
                style={{ fontSize: '12px',fontWeight:"lighter"}}
                getRowId={getRowId} 
                className='bg-light '
       
            />
        </Box>
 
  </>
  );
}

export default Users2;