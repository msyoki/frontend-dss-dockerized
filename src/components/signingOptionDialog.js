import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';
import { Tooltip } from '@mui/material';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
  })
  

function SigningOptionDialog(props) {
 
    const handleSignOnePage = (e) => {
        e.preventDefault()
        props.setOpen(false);
        props.signonePage();    
    };

    const handleSignAllPages = (e) => {
        e.preventDefault()
        props.setOpen(false);  
        props.signAllpages() 
    };
    const handleClose = (event, reason) => {
      if (reason !== 'backdropClick') {
        props.setOpen(false);
      }
    };
    return (
        <div>
         
          <Dialog disableEscapeKeyDown open={props.open} onClose={handleClose} TransitionComponent={Transition}>
            <DialogTitle style={{color:"#ffff",backgroundColor:"#1C4690",fontSize:"15px"}} className='text-center'>{props.isStamp?<>Stamp Document</>:<>Sign Document</>}</DialogTitle>
            <DialogContent  >
          <p className='mt-3 text-center' style={{fontSize:'40px'}}>{props.isStamp?<><i className='fas fa-stamp mx-2'></i></>:<><i className='fas fa-signature mx-2'></i></>}</p>
          <p className=' text-center' style={{fontSize:"14px"}}>How would you like you to {props.isStamp?<>stamp</>:<>sign</>} the document ? </p>
             
              <div className='d-flex justify-content-center '>
                 
                 <ButtonComponent 
                   cssClass={props.onepagebtncssclass}
                   className='m-2 p-2' 
                   style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
                   disabled={false} 
                   onClick={handleSignOnePage}
                   > <i className="fas fa-file mx-1" ></i><span className='mx-2'>{props.isStamp?<>Stamp</>:<>Sign</>} current page</span>
                 </ButtonComponent>  
                 <ButtonComponent 
                   cssClass={props.allpagebtncssclass}
                   className='m-2 p-2' 
                   style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
                   disabled={false} 
                   onClick={handleSignAllPages}
                   > <i className="fas  fa-copy mx-1" ></i><span className='mx-2'>{props.isStamp?<>Stamp</>:<>Sign</>} all pages</span> 
                   </ButtonComponent>
               
               </div> 
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              {/* <Button onClick={handleClose}>Ok</Button> */}
            </DialogActions>
          </Dialog>
        </div>
    );
}

export default SigningOptionDialog;
