import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import DocDetailsDialog2 from '../DocDetailsDialog2';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import logo from '../../images/techedge.png';
import * as constants from '../constants/constants';
import axios from 'axios';
import AuthContext from '../../context/Authcontext';
import {
  DataGrid,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import DocExpiryDate from '../GetExpiryDate';

function Inbox2(props) {
  const [opendialogdocdetails, setOpenDialogDocDetails] = useState(false);
  const [document, setDocument] = useState({});
  const [documentsigners, setDocumentSigners] = useState([]);
  let { authTokens, logoutUser, user } = useContext(AuthContext);

  // Sort the inbox data based on docdate in descending order
  const sortedInbox = [...props.inbox].sort((a, b) => new Date(b.docdate) - new Date(a.docdate));

  const trachDocument = async (row) => {
    let data = JSON.stringify({
      "docGuid": `${row.guid}`,
      "signer_uid": `${row.uid}`
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${constants.devApiBaseUrl}/api/trash/document/`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    await axios.request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        props.refreshdata()
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const columns = [
    { field: 'title', headerName: 'Title', width: 320, cellClassName: 'overflow-cell' },
    {
      field: 'action',
      headerName: 'Sign',
      width: 80,
      textAlign: 'center',
      renderCell: (params) => {
        const handleClick = () => {
          props.signFromInbox(params.row);
        };

        return (
          <i onClick={handleClick}
            style={{
              fontSize: '13.5px',
              color: '#403d39',
              borderRadius: '50%',
              cursor: 'pointer',
              padding: '8px',
              backgroundColor: '#f0f0f0',
              transition: 'background-color 0.3s ease',
            }}
            className="fas fa-pen-nib"
            onMouseOver={(e) => (e.target.style.backgroundColor = '#ffff')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
          ></i>
        );
      },
      filterable: false,
      sortable: false
    },
    {
      field: 'action1',
      headerName: 'Preview',
      width: 80,
      textAlign: 'center',
      renderCell: (params) => {
        const handleClick = () => {
          props.previewFile(params.row.guid, params.row.signedcomplete, params.row.declined, params.row.title);
        };

        return (
          <i onClick={handleClick}
            style={{
              fontSize: '13.5px',
              color: '#403d39',
              borderRadius: '50%',
              cursor: 'pointer',
              padding: '8px',
              backgroundColor: '#f0f0f0',
              transition: 'background-color 0.3s ease',
            }}
            className="fas fa-eye"
            onMouseOver={(e) => (e.target.style.backgroundColor = '#ffff')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
          ></i>
        );
      },
      filterable: false,
      sortable: false
    },
    {
      field: 'action2',
      headerName: 'More Details',
      width: 100,
      className: 'text-center',
      renderCell: (params) => {
        const handleClick = () => {
          viewDocDetails(params.row, params.row.signers);
        };

        return (
          <i
            onClick={handleClick}
            style={{
              fontSize: '13.5px',
              color: '#403d39',
              borderRadius: '50%',
              cursor: 'pointer',
              padding: '8px',
              backgroundColor: '#f0f0f0',
              transition: 'background-color 0.3s ease',
            }}
            className="fas fa-info-circle"
            onMouseOver={(e) => (e.target.style.backgroundColor = '#ffff')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
          ></i>
        );
      },
      filterable: false,
      sortable: false
    },
    {
      field: 'action3',
      headerName: 'Trash',
      width: 80,
      className: 'text-center',
      renderCell: (params) => {
        const handleClick = () => {
          props.setInbox(prevInbox => prevInbox.filter(item => item.guid !== params.row.guid));
          trachDocument(params.row);
          props.refreshdata();
          props.setOpenAlert(true);
          props.setAlertMsg("Document trashed successfully ");
          props.setAlertSeverity('success');
          setTimeout(() => {
            props.setOpenAlert(false);
          }, 3000);
        };

        return (
          <i
            onClick={handleClick}
            style={{
              fontSize: '13.5px',
              color: '#403d39',
              borderRadius: '50%',
              cursor: 'pointer',
              padding: '8px',
              backgroundColor: '#f0f0f0',
              transition: 'background-color 0.3s ease',
            }}
            className="fas fa-trash-alt"
            onMouseOver={(e) => (e.target.style.backgroundColor = '#ffff')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
          ></i>
        );
      },
      filterable: false,
      sortable: false
    },
    {
      field: 'docdate',
      headerName: 'Days to expiry',
      width: 120,
      renderCell: (params) => <DocExpiryDate expirydate={params.row.expirydate} />,
      filterable: false,
      sortable: false,
    },
    { field: 'guid', headerName: 'Guid', width: 300 },
  ];

  const visibleColumns = columns.filter((column) => column.field !== 'owner');

  let CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarQuickFilter />
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  let viewDocDetails = (document, signers) => {
    setOpenDialogDocDetails(true);
    setDocument(document);
    setDocumentSigners(signers);
  }

  const getRowId = (row) => row.guid;

  return (
    <div>
      <DocDetailsDialog2
        setOpenDialogDocDetails={setOpenDialogDocDetails}
        opendialogdocdetails={opendialogdocdetails}
        document={document}
        documentsigners={documentsigners}
        refreshdata={props.refreshdata}
        getSignerUid={props.getSignerUid}
        type={'inbox'}
      />
      <h6 className='text-dark' style={{ fontSize: '12.5px' }}>
        <i className='fas dot fa-circle text-danger shadow-lg m-1' aria-hidden="true" style={{ fontSize: '11px' }}></i>
        Inbox <span style={{ fontSize: '13.5px' }}>( {props.inbox.length} )</span>
      </h6>
      <Box sx={{ height: '75vh', width: '100%', fontSize: '12px' }}>
        <DataGrid
          rows={sortedInbox}
          columns={columns}
          className="App-header5"
          density='compact'
          components={{
            Toolbar: CustomToolbar,
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          pageSizeOptions={[15, 20, 100]}
          disableRowSelectionOnClick
          style={{ fontSize: '12px', fontWeight: "lighter", backgroundColor: '#f2f2f2' }}
          getRowId={getRowId}
        />
        <div className='d-flex justify-content-end card-footer p-1 bg-white mb-0'>
          <a href='https://techedge.co.ke' target="_blank"><img src={logo} style={{ width: '150px' }} /></a>
        </div>
      </Box>
    </div>
  );
}

export default Inbox2;
