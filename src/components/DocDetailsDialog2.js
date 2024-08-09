import React, { useState, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import AuthContext from '../context/Authcontext';
import ConfirmVoid2 from './ConfirmVoid2';
import * as constants from '../components/constants/constants';
import HumanizedDate from './HumanizeDate';

const DocDetailsDialog2 = (props) => {
    const { user } = useContext(AuthContext);

    const handleClose = () => {
        props.setOpenDialogDocDetails(false);
    };

    const handleVoiding = async (guid) => {
        try {
            const response = await axios.post(
              `${constants.devApi2BaseUrl}/api/SendSigning/OwnerDecline`,
              {
                fileGuid: guid
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'accept': '*/*'
                }
              }
            );
            console.log('Response:', response.data);
            props.setOpenDialogDocDetails(false)
            props.refreshdata()
            // Handle the response data as needed
        } catch (error) {
        console.error('Error:', error);
        // Handle errors here
        }   
    };

    const downloadReport = (e, guid) => {
        e.preventDefault();
        const data = JSON.stringify({
            "fileGuid": `${guid}`
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${constants.devApi2BaseUrl}/api/SigningReports`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                const yourBlob = new Blob(response.data);
                const link = document.createElement("a");
                const blobUrl = window.URL.createObjectURL(yourBlob);
                link.href = blobUrl;
                link.download = 'filename.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Dialog
                open={props.opendialogdocdetails}
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
              
            >
                <DialogTitle className='text-white text-center' style={{ fontWeight: '400', fontSize: '12px', backgroundColor: '#1C4690' }}>Document Details</DialogTitle>
                <DialogContent className='p-4' style={{ fontSize: "14px" }}>


                    <div className='m-0 text-center'>
                        <small style={{ fontWeight: "580" }}>
                            <span style={{ color: '#174291' }}>Title <br /></span>{props.document.title}
                        </small>
                        <br /> <br />
                        <small>
                            <span style={{ color: '#174291' }} className="mt-2">Owner:</span> {props.document.owner}
                        </small>
                        <br />
                        <small>
                            <span style={{ color: '#174291' }} className="mt-2">Created:</span> <HumanizedDate datestr={props.document.owner}/>
                        </small>
                        <br />
                        <small>
                            <span style={{ color: '#174291' }} className="mt-2">Status:</span> {props.document.signedcomplete === 'True' ?
                                <span className='text-dark'><i className="fas dot fa-circle text-success shadow-lg m-1" aria-hidden="true"></i>Signing Completed</span> :
                                props.document.declined === 'True' ?
                                    <span className='text-dark'><i className="fas dot fa-circle text-danger shadow-lg m-1" aria-hidden="true"></i>Voided</span> :
                                    <span className='text-dark'><i className="fas dot fa-circle text-warning shadow-lg m-1" aria-hidden="true"></i>Pending Signing</span>
                            }
                          
                        </small>
                        <br /><br />
                        <small style={{ color: '#174291', fontWeight: "580" }} className='mb-1'>
                            
                            Signers ({props.documentsigners.length})
                        </small>
                        <br /><br />
                        {props.documentsigners.length > 0 ?
                            props.documentsigners.map((s, index) =>
                                <span key={index} style={{ fontSize: '13.5px' }}>
                                    {s.signed === 'True' ?
                                        `${s.email} - signed : ${s.signed_time_stamp}` :
                                        `${s.email} ${s.current_signer === 'True' ? ' - current signer' : ' - queued'}`
                                    }
                                    <br />
                                </span>
                            ) :
                            null
                        }
                    </div>
                    <div className='d-flex justify-content-center my-3'>
    <ButtonComponent
        cssClass='e-custom-warning'
        className='m-2 p-2'
        style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
        disabled={false}
        onClick={handleClose}
    >
        <span className='mx-2'>Close</span>
    </ButtonComponent>

    {props.document.owner === user.email && (props.type === 'inbox' || props.type === 'outbox') && (
        <>
            <ButtonComponent
                cssClass='e-custom-danger'
                className='m-2 p-2'
                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                disabled={false}
                onClick={() => handleVoiding(props.document.guid)}
            >
                <i className="fas fa-ban mx-1"></i>
                <span className='mx-2'>{props.type === 'outbox' ? 'Recall document' : 'Void document'}</span>
            </ButtonComponent>
        </>
    )}

    <ButtonComponent
        cssClass='e-custom-primary'
        className='m-2 p-2'
        style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
        disabled={false}
        onClick={() => window.open(`${constants.devApi2BaseUrl}/api/Doc/FileDownload/${props.document.guid}`)}
    >
        <i className="fas fa-download mx-1"></i>
        <span className='mx-2'>Download</span>
    </ButtonComponent>
</div>


                </DialogContent>
                <span className="text-muted text-center p-4" style={{ fontSize: '11px' }}>GUID: {props.document.guid}</span>
            </Dialog>
        </>
    );
}

export default DocDetailsDialog2;
