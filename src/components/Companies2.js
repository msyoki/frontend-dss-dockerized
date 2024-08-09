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


function Companies2(props) {
    const[opendialogdocdetails,setOpenDialogDocDetails]=useState(false)
    const[document,setDocument]=useState({})
    const[documentsigners,setDocumentSigners]=useState([])
    let ontableclick=async(name,email,id,approved,active,registered_date)=>{ 
        // console.log(name)
        await props.setCurrentEditCompanyName(name)
        await props.setCurrentEditCompanyEmail(email)
        await props.setCurrentEditCompany(id)
        await props.setCurrentEditCompanyActive(`${active}`)
        await props.setCurrentEditCompanyApproved(`${approved}`)
        await props.setCurrentEditCompanyRegisteredDate(registered_date)
        await props.setOpenDialogUpdateCompany(true)

    }
     

const columns= [
    { field: 'name', headerName: 'Company Name', width: 200  },

      { field: 'email', headerName: 'Admin Email', width: 250},
    
     
  
      { field: 'approved', headerName: 'Approved', width: 100 },
      { field: 'active', headerName: 'Active', width: 50 },
      {
        field: 'action2',
        headerName: 'Edit Company',
        width: 130,
        renderCell: (params) => {
          const handleClick = () => {
            ontableclick(
                params.row.name,
                params.row.email,
                params.row.id,
                params.row.approved,
                params.row.active,
                params.row.registered_date
            )
          
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
            className="fas fa-building mx-1"></i> 
            );
        },
        filterable: false
      },
      { field: 'registered_date', headerName: 'Registered', width: 200 },
   
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
  
   
  <Box sx={{ height: 400, width: '100%' ,fontSize:'10px'}}>
        <DataGrid
            rows={props.companies}
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

export default Companies2;