import React , {useState} from 'react';
import Box from '@mui/material/Box';
import DocDetailsDialog2 from '../DocDetailsDialog2';
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';
import logo from '../../images/techedge.png'

import { 
  DataGrid, 
  GridToolbarFilterButton,
  GridToolbarExport, 
  GridToolbarQuickFilter,
  GridToolbarContainer, 
} from '@mui/x-data-grid';
import HumanizedDate from '../HumanizeDate';


function Voided2(props) {
    const[opendialogdocdetails,setOpenDialogDocDetails]=useState(false)
    const[document,setDocument]=useState({})
    const[documentsigners,setDocumentSigners]=useState([])
    // Sort the inbox data based on docdate in descending order
    const sortedVoided = [...props.voided].sort((a, b) => new Date(b.docdate) - new Date(a.docdate));



const columns= [
    { field: 'title', headerName: 'Title', width: 320 , cellClassName: 'overflow-cell', },


    {
      field: 'action1',
      headerName: 'Preview',
      width: 80,
      renderCell: (params) => {
        const handleClick = () => {
          props.previewFile(params.row.guid,params.row.signedcomplete,params.row.declined,params.row.title)
        };
  
        return (
          // <ButtonComponent cssClass='e-custom-light' onClick={handleClick} style={{textTransform: 'none',fontWeight:'lighter',fontSize:'10.5px',width:'100%',textAlign:'center'}}   disabled={false}> <i className="fas fa-eye mx-1" ></i> Preview</ButtonComponent>
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
          class="fas fa-eye"></i> 
        );
      },
      filterable: false,
        sortable: false
    },
  

    {
        field: 'action2',
        headerName: 'More Details',
        width: 100,
        renderCell: (params) => {
          const handleClick = () => {
            viewDocDetails(params.row,params.row.signers)
            // alert(`ID: ${params.row.signers}`);
          };
    
          return (
            // <ButtonComponent cssClass='e-custom-primary' onClick={handleClick} style={{textTransform: 'none',fontWeight:'lighter',fontSize:'10.5px',width:'100%',textAlign:'center'}}  disabled={false}> <i class="fas fa-info-circle mx-1"></i> More Details </ButtonComponent> 
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
            class="fas fa-info-circle "></i> 
          );
        },
        filterable: false,
        sortable: false
      },

  

      // { field: 'docdate', headerName: 'Created', width: 230,filterable: false,sortable: false},
      {
        field: 'docdate',
        headerName: 'Created',
        width: 180,
        renderCell: (params) => <HumanizedDate dateStr={params.row.created} /> ,
        filterable: false,
        sortable: false,
      },
  
   
      // { field: 'owner', headerName: 'Owner', width: 200 },
   
      { field: 'guid', headerName: 'Guid', width: 300 },

    
    
 
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
            <DocDetailsDialog2 
                setOpenDialogDocDetails={setOpenDialogDocDetails}
                opendialogdocdetails={opendialogdocdetails}
                document={document}
                documentsigners={documentsigners}
                refreshdata={props.refreshdata}
                type={'voided'}
            
            />
              <h6 className=' text-dark' style={{fontSize:'12.5px'}} ><i className='fas dot fa-circle text-secondary shadow-lg  m-1' aria-hidden="true" style={{fontSize:'11px'}}></i> Voided <span style={{fontSize:'13.5px'}}>( {props.voided.length} )</span></h6>
    
        <Box sx={{ height: '75vh', width: '100%' ,fontSize:'12px'}}>
            <DataGrid
                rows={sortedVoided}
                columns={columns}
                density='compact'
                className=" App-header5"
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
                  pageSizeOptions={[15,20,100]}
                // checkboxSelection
                disableRowSelectionOnClick
                style={{ fontSize: '12px',fontWeight:"lighter",backgroundColor:'#f2f2f2'}}
                getRowId={getRowId} 
       
            />
                    <div className=' d-flex justify-content-end card-footer p-1 bg-white mb-0'>
                <a href='https://techedge.co.ke' target="_blank"><img src={logo} style={{width:'150px'}} /></a>
      
              </div>
        </Box>
    </div>
  );
}

export default Voided2;