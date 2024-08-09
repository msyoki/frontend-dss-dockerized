import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import axios from 'axios';
import * as constants from '../components/constants/constants';

import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import Alerts from './Alert';

const ConfirmVoid = (props) => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [alertMsg, setAlertMsg] = useState('');

  const handleClose = () => {
    props.setOpenDialogVoid(false);
  };

  const handleClose2 = () => {
    if (text) {
      addComment(text, props.signerguid);
      props.setOpenDialogVoid(false);
      props.setOpenDialogLoading(true);
      const data = JSON.stringify({
        fileName: `${props.fileurl}`,
        ipAddress: `${props.ip}`,
        signerid:`${props.signerguid}`
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${constants.annotationsurl}/api/Decline`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };
      console.log(config)

      axios
        .request(config)
        .then((response) => {
          props.setOpenDialogLoading(false);
          if (props.user) {
            navigate('/', {
              state: { openAlert: true, alertMsg: `${props.docName} voided successfully`, alertSeverity: 'success' },
            });
          } else {
            navigate('/declined', { state: { docTitle: props.docName, msg: text } });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setOpenAlert(true);
      setAlertMsg('Voiding comment is required');
      setAlertSeverity('error');
      setTimeout(() => {
        setOpenAlert(false);
      }, 4000);
    }
  };

  const addComment = (comment, signer) => {
    const data = JSON.stringify({
      signer: `${signer}`,
      comment: `${comment}`,
    });

    console.log(data)

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${constants.devApiBaseUrl}/api/new/comments/`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setText('');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Dialog open={props.opendialogvoid} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
        <DialogTitle className="text-white text-center" style={{ fontWeight: '400', fontSize: '14px', backgroundColor: '#1C4690' }}>Confirm Voiding</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
      
            <h6 style={{ color: '#1C4690', fontSize: '15px', fontWeight: 'lighter' }} className="text-center my-3">Add Reason for Voiding</h6>
            <Alerts alertseverity={alertSeverity} alertmsg={alertMsg} openalert={openAlert} setOpenAlert={setOpenAlert} />

            <textarea rows="2" cols="50" className="form-control mt-2 mb-2" placeholder="comment here..." onChange={(e) => setText(e.target.value)} />
            <Alerts alertSeverity={alertSeverity} alertMsg={alertMsg} openAlert={openAlert} setOpenAlert={setOpenAlert} />

            <div className="d-flex justify-content-center">
              <ButtonComponent
                cssClass="e-custom-danger"
                className="m-2 p-2"
                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                disabled={false}
                onClick={handleClose2}
              >
                <i className="fas fa-ban mx-1" /><span className="mx-2">Void Document</span>
              </ButtonComponent>
              <ButtonComponent
                cssClass="e-custom-light"
                className="m-2 p-2"
                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                disabled={false}
                onClick={handleClose}
              >
                <i className="fas fa-times-circle mx-1" /><span className="mx-2">Cancel</span>
              </ButtonComponent>
      
            </div>
         
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfirmVoid;
