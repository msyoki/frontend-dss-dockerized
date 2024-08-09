import React, { useState } from 'react';
import Box from '@mui/material/Box';
import DocDetailsDialog2 from '../DocDetailsDialog2';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import logo from '../../images/techedge.png';
import { DataGrid, GridToolbarFilterButton, GridToolbarExport, GridToolbarQuickFilter, GridToolbarContainer } from '@mui/x-data-grid';
import HumanizedDate from '../HumanizeDate';

function MyUploads2(props) {
    const [opendialogdocdetails, setOpenDialogDocDetails] = useState(false);
    const [document, setDocument] = useState({});
    const [documentsigners, setDocumentSigners] = useState([]);
    
    // Sort the inbox data based on docdate in descending order
    const sortedMyuploads = [...props.myuploads].sort((a, b) => new Date(b.docdate) - new Date(a.docdate));

    const columns = [
        { field: 'title', headerName: 'Title', width: 320, cellClassName: 'overflow-cell' },
        {
            field: 'action',
            headerName: 'Sign',
            width: 60,
            renderCell: (params) => {
                const handleClick = () => {
                    props.selfSignSaved(params.row.guid, params.row.title);
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
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#ffff')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                        className="fas fa-pen-nib"
                    ></i>
                );
            },
            filterable: false,
            sortable: false,
        },
        {
            field: 'action1',
            headerName: 'Add Signers',
            width: 80,
            renderCell: (params) => {
                const handleClick = () => {
                    props.sendUploadForSigning(params.row.guid);
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
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#ffff')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                        className="fas fa-user-plus"
                    ></i>
                );
            },
            filterable: false,
            sortable: false,
        },
        {
            field: 'action2',
            headerName: 'Preview',
            width: 60,
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
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#ffff')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                        className="fas fa-eye"
                    ></i>
                );
            },
            filterable: false,
            sortable: false,
        },
        {
            field: 'action3',
            headerName: 'More Details',
            width: 80,
            renderCell: (params) => {
                const handleClick = () => {
                    viewDocDetails(params.row, params.row.signers);
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
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#ffff')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                        className="fas fa-info-circle"
                    ></i>
                );
            },
            filterable: false,
            sortable: false,
        },
        {
            field: 'docdate',
            headerName: 'Created',
            width: 180,
            renderCell: (params) => <HumanizedDate dateStr={params.row.created} />,
            filterable: false,
            sortable: false,
        },
        { field: 'guid', headerName: 'Guid', width: 300 },
    ];

    const visibleColumns = columns.filter((column) => column.field !== 'owner');

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarQuickFilter />
                <GridToolbarFilterButton />
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    };

    const viewDocDetails = (document, signers) => {
        setOpenDialogDocDetails(true);
        setDocument(document);
        setDocumentSigners(signers);
    };

    const getRowId = (row) => row.guid;

    return (
        <div>
            <DocDetailsDialog2
                setOpenDialogDocDetails={setOpenDialogDocDetails}
                opendialogdocdetails={opendialogdocdetails}
                document={document}
                documentsigners={documentsigners}
                refreshdata={props.refreshdata}
                type={'upload'}
            />
            <h6 className='text-dark' style={{ fontSize: '12.5px' }}>
                <i className='fas dot fa-save text-secondary shadow-lg m-1' aria-hidden="true" style={{ fontSize: '11px' }}></i>
                Saved for later <span style={{ fontSize: '13.5px' }}>( {props.myuploads.length} )</span>
            </h6>
            <Box sx={{ height: '75vh', width: '100%', fontSize: '12px' }}>
                <DataGrid
                    rows={sortedMyuploads}
                    columns={columns}
                    density='compact'
                    className="App-header5"
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

export default MyUploads2;
