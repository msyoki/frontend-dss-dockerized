import * as React from 'react';
import  {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Alerts from './Alert'
import axios from 'axios'
import * as constants from '../components/constants/constants'

import { ButtonComponent,CheckBoxComponent  } from '@syncfusion/ej2-react-buttons';

const ConfirmVoid2=(props) =>{
  const [text, setText] = useState('');
  let[openalert,setOpenAlert]=useState(false)
  let[alertseverity,setAlertSeverity]=useState('info')
  let [alertmsg,setAlertMsg]=useState('')

  const handleClose = () => {
    props.setOpenDialogVoid(false);
  };
  let handleClose2 = () => {

    if(text){
      props.setOpenDialogVoid(false);
      props.ownerVoid(props.guid,props.signerguid)
      addComment(text,props.signerguid)

    }
    else{
      setOpenAlert(true)
      setAlertMsg('voiding comment is required')
      setAlertSeverity('error')
      setTimeout(
      function() {
      setOpenAlert(false);
      }, 3000)
    }
    
  


  };
  

  function addComment(comment,signer){
    console.log(`signerguid:${signer}`)
    let data = JSON.stringify({
      "signer": `${signer}`,
      "comment": `${comment}`
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${constants.devApiBaseUrl}/api/new/comments/`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      setText('')
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  return (
    <div >
      <Dialog
        open={props.opendialogvoid}

        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
     
      >
  
        <DialogTitle className='text-white text-center' style={{fontWeight:'400',fontSize:'12px',backgroundColor:'#1C4690'}} >{props.voidtype}</DialogTitle>
        <DialogContent >
          <DialogContentText id="alert-dialog-slide-description">
            <br/>
           
            <Alerts alertseverity={alertseverity} alertmsg={alertmsg} openalert={openalert} setOpenAlert={setOpenAlert}/>
          
            <h6 style={{color:'#1C4690',fontSize:'14px',fontWeight:'lighter'}} className='text-center'>Add Reason for Voiding </h6>
            <textarea  rows="2" cols="50" className='form-control mt-2 mb-2'  onChange={(e) => setText(e.target.value)}>
        
            </textarea>
        
            
          {/* <Button onClick={handleClose2}>Void Document</Button>
          <Button onClick={handleClose}>Cancel</Button> */}
          <div className='d-flex justify-content-center'>
          <ButtonComponent 
            cssClass='e-custom-danger' 
            className='m-2 p-2' 
            style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
            disabled={false}   
            onClick={handleClose2}   
        
          > <i className="fas  fa-ban mx-1" ></i><span className='mx-2'> Void Document</span> </ButtonComponent>
          <ButtonComponent 
            cssClass='e-custom-light' 
            className='m-2 p-2'
            style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
            disabled={false}   
            onClick={handleClose}   
         
            ><i className="fas fa-times-circle mx-1"></i> <span className='mx-2'> Cancel</span>  </ButtonComponent>
          </div>
          </DialogContentText>
        </DialogContent>
        {/* <DialogActions >
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose2}>Confirm</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}


export default  ConfirmVoid2