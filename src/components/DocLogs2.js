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
import DocDetailsDialog from './DocDetailsDialog';


function DocLogs2(props) {
    const[opendialogdocdetails,setOpenDialogDocDetails]=useState(false)
    const[document,setDocument]=useState({})
    const[documentsigners,setDocumentSigners]=useState([])
    // Sort the inbox data based on docdate in descending order
    const sortedCompanydocs = [...props.companydocs].sort((a, b) => new Date(b.docdate) - new Date(a.docdate));


    let ontableclick=async(e,active,admin,Id,email,first,last,phone)=>{ 
        await props.setCurrentEditUserActive(`${active}`)
        await props.setCurrentEditUserAdmin(`${admin}`)
        await props.setCurrentEditUser(Id)
        await props.setCurrentEditUserEmail(email)
        await props.setCurrentEditUserLast(last)
        await props.setCurrentEditUserFirst(first)
        await props.setCurrentEditUserPhone(phone)
        await props.setOpenDialogUpdateUser(true)
        // alert('clicked')
    }
     

const columns= [
    { field: 'guid', headerName: 'Document Guid', width: 300  },

      { field: 'owner', headerName: 'Owner', width: 200},
   
      // { field: 'signedcomplete', headerName: 'Complete', width: 100 },
      // { field: 'declined', headerName: 'Voided', width: 100 },
      { field: 'docdate', headerName: 'Created', width: 200 },
      {
        field: 'action2',
        headerName: 'More Details',
        width: 130,
        renderCell: (params) => {
          const handleClick = () => {
            viewDocDetails(params.row,params.row.signers)
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
           className="fas fa-info-circle mx-1"></i> 
   
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

const getRowId = (row) => row.guid;


  return (
    <div >
        <DocDetailsDialog 
            setOpenDialogDocDetails={setOpenDialogDocDetails}
            opendialogdocdetails={opendialogdocdetails}
            document={document}
            documentsigners={documentsigners}
        
        />
     
        <Box sx={{ height: 400, width: '100%' ,fontSize:'10px'}}>
            <DataGrid
                rows={sortedCompanydocs}
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
    </div>
  );
}

export default DocLogs2;