import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import * as constants from './constants/constants';
import HumanizedDate from './HumanizeDate';

const DocDetailsDialog = (props) => {
    const handleClose = () => {
        props.setOpenDialogDocDetails(false);
    };

    const {
        title = 'N/A',
        owner = 'N/A',
        docdate = 'N/A',
        signedcomplete = 'False',
        declined = 'False',
        guid = 'N/A'
    } = props.document || {};

    const documentSigners = props.documentsigners || [];

    return (
        <Dialog
            open={props.opendialogdocdetails}
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle className='text-white' style={{ fontWeight: '400', fontSize: '12px', backgroundColor: '#1C4690' }}>Document Details</DialogTitle>
            <DialogContent className='p-4' style={{ fontSize: "13px" }}>
                <div className='m-0 p-2 text-center'>
                    <small style={{ fontWeight: "580" }}>
                        <span style={{ color: '#1C4690' }} className="mt-2">Title:</span> {title}
                    </small>
                    <br /><br />
                    <small>
                        <span style={{ color: '#1C4690' }} className="mt-2">Owner:</span> <HumanizedDate datestr={owner} />
                    </small>
                    <br />
                    <small>
                        <span style={{ color: '#1C4690' }} className="mt-2">Created:</span> {docdate}
                    </small>
                    <br />
                    <small>
                        <span style={{ color: '#1C4690' }} className="mt-2">Status:</span> {signedcomplete === 'True' ?
                            <span className='text-dark'><i className="fas dot fa-circle text-success shadow-lg m-1" aria-hidden="true"></i>Signing Completed</span> :
                            declined === 'True' ?
                                <span className='text-dark'><i className="fas dot fa-circle text-danger shadow-lg m-1" aria-hidden="true"></i>Voided</span> :
                                <span className='text-dark'><i className="fas dot fa-circle text-warning shadow-lg m-1" aria-hidden="true"></i>Pending Signing</span>
                        }
                    </small>
                    <br /><br />
                    <small>
                        <span style={{ color: "#1C4690", fontSize: '16.5px', fontWeight: "580" }} className="mt-2">Signers ({documentSigners.length})</span><br /><br />
                        {documentSigners ?
                            documentSigners.map((s, index) =>
                                <span key={index} style={{ fontSize: '13px' }}>
                                    {s.signed === 'True' ?
                                        `${s.email} - signed : ${s.signed_time_stamp}` :
                                        `${s.email} ${s.current_signer === 'True' ? ' - current signer' : ' - queued'}`
                                    }
                                    <br />
                                </span>
                            ) :
                            null
                        }
                    </small>
                    <br /><br />
                </div>
                <div className='text-center'>
                    <ButtonComponent
                        cssClass='e-custom-warning'
                        className='m-2 p-2'
                        style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                        disabled={false}
                        onClick={handleClose}
                    >
                        <span className='mx-2'>Close</span>
                    </ButtonComponent>

                    {signedcomplete === 'True' &&
                        <ButtonComponent
                            cssClass='e-custom-primary'
                            className='m-2 p-2'
                            style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                            disabled={false}
                            onClick={() => window.open(`${constants.devApi2BaseUrl}/api/Doc/FileDownload/${guid}`)}
                        >
                            <i className="fas fa-download mx-1"></i>
                            <span className='mx-2'>Download</span>
                        </ButtonComponent>
                    }
                </div>
            </DialogContent>
            <span className="text-muted text-center p-4" style={{ fontSize: '11px' }}>GUID: {guid}</span>
        </Dialog>
    );
}

export default DocDetailsDialog;
