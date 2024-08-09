import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';
import axios from "axios";
import {devApi2BaseUrl} from "./constants/constants"
import { Link, useNavigate } from "react-router-dom";
import Authcontext from '../context/Authcontext';
import * as constants from "../components/constants/constants"
// import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})
  
function ConfirmCompleteDialog(props) { 
  
  if(props.openconfirmcompletedialog === true && props.annotationList.length < 1){
    props.setOpenDialogLoading(false)
    props.setOpenConfirmCompleteDialog(false);
   
  }
  // const [fullWidth, setFullWidth] = React.useState(true);
  // const [maxWidth, setMaxWidth] = React.useState('sm');
  let {user}= React.useContext(Authcontext)
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  let navigate = useNavigate();

  const handleClose = () => {
    props.setOpenConfirmCompleteDialog(false);
  };

  
  async function appendAnnotations(){
    let payload = JSON.stringify({
      "fileName":`${props.fileurl}`,
      "ipAddress":`${props.ip}`,
      "signersGuid": `${props.signerguid}`,
      "imageAnnotations":props.annotationList,
      "textAnnotations":props.textAnnotation
    });

  
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${constants.annotationsurl}/api/Values`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : payload
    };
  

    await axios.request(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      props.setOpenDialogLoading(false)
      // console.log("success")
     
    })
    .catch((error) => {
      // props.setOpenDialogLoading(false)
      // alert("Something went wrong, please contact admin or try later")
      // console.log(error);

    });


  }

  const handleCloseAgree=()=>{
    props.setOpenConfirmCompleteDialog(false);
    props.setOpenDialogLoading(true)

    appendAnnotations()
    props.setOpenDialogLoading(false)
    if(props.pagetype === "redirectsign"){
      if(user){
        navigate('/',{state:{openalert:true,alertmsg:` ${props.docname} signed successfully`,alertseverity:'success'}} )  
      }
      else{
          navigate('/complete',{state:{doctitle:props.docname}} )
      }
    }else{
      props.setOpenDialogLoading(false)
      navigate('/selfsign/otheractions',{state:{user:user,voided:false,signed:true,fileurl:props.fileurl,docguid:props.guid,doctitle:props.docname}} )  
    } 
  }

  return (
    <div>
  
      <Dialog
        open={props.openconfirmcompletedialog}
        TransitionComponent={Transition}
        // fullWidth={fullWidth}
        // maxWidth={maxWidth}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className='text-center' style={{color:"#ffff",backgroundColor:"#1C4690",fontSize:"14px"}}><i className="fas fa-signature mx-1"></i> {"Complete Signing"}</DialogTitle>
        <DialogContent className=''>
          <DialogContentText id="alert-dialog-slide-description" className='text-center'>
         
          <p className='m-4 text-dark' style={{fontSize:"14px"}}>I confirm the placed signature is in order. Let's proceed. </p>
          </DialogContentText>
          <div className='d-flex justify-content-center'>
                 
            <ButtonComponent 
              cssClass="e-custom-warning"  
              className='m-2 p-2' 
              style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
              disabled={false} 
              onClick={handleClose}
              ><i className="fas fa-times mx-1"></i> <span className='mx-2'>Cancel </span>
            </ButtonComponent>  
            <ButtonComponent 
              cssClass="e-custom-primary" 
              className='m-2 p-2' 
              style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
              disabled={false} 
              onClick={handleCloseAgree}
              ><i className="fas fa-check mx-1"></i><span className='mx-2'>Proceed </span>  
              </ButtonComponent>
          
          </div> 
        </DialogContent>
      
      </Dialog>
    </div>
  );
}
export default ConfirmCompleteDialog