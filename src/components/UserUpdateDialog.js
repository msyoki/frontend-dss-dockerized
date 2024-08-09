import * as React from 'react';
import {useNavigate} from 'react-router-dom'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import '../styles/App.css'
import useMediaQuery from '@mui/material/useMediaQuery';

import { useTheme } from '@mui/material/styles';
import Alerts from './Alert';
import axios from 'axios'
import * as constants from '../components/constants/constants'

import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';

const UserUpdateDialog=(props) =>{
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [fullWidth, setFullWidth] = React.useState(true);
    const primaryColor={
      color:"#1C4690"
    }


  let updateUser=(e)=>{
    e.preventDefault()

    var FormData = require('form-data');
    var data = new FormData();
    if(e.target.fname.value){
      data.append('first_name', e.target.fname.value)
    }
    if(e.target.lname.value){
      data.append('last_name', e.target.lname.value)
    }
    if(e.target.phone.value){
      data.append('phone', e.target.phone.value)
    }
    if(e.target.is_active.value){
      data.append('is_active', e.target.is_active.value)
    }
    // if(e.target.is_admin.value){
    //   data.append('is_admin', e.target.is_admin.value)
    // }

    var config = {
    method: 'patch',
    url: `${constants.devApiBaseUrl}/api/user/${props.userid}`,
    headers: { 
    },
    data : data
    };

    axios(config)
    .then(function (response) {
    props.setOpenAlert(true)
    props.setAlertMsg('updated successfully !!!')
    props.setAlertSeverity('success')
    props.setOpenDialogUpdateUser(false);
    setTimeout(
    function() {
        props.setOpenAlert(false);
        props.getusers()
        document.getElementById('user-update-form').reset()
    }, 2000)
    // console.log(e.target.is_active.value)


    })
    .catch(function (error) {
      props.setOpenAlert(true)
      props.setAlertMsg(`${error.response.data['message']}`)
      props.setAlertSeverity('error')
      setTimeout(
      function() {
          props.setOpenAlert(false);
          props.getusers()
          props.setOpenDialogUpdateUser(false);
      }, 4000)
  
    });

  }

  const handleClose = () => {
    props.setOpenDialogUpdateUser(false);
  };
  
  return (
    <div >
     
      <Dialog
      
        open={props.opendialogupdateuser}

        keepMounted
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        // className='App-header'
      >
        <DialogTitle style={{backgroundColor:'#1C4690',fontSize:'14px'}} className='shadow-lg text-white text-center'><i className="fas fa-user-edit m-1"></i> {"Edit User "} 
            
        </DialogTitle>
   
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" >
            <Alerts alertseverity={props.alertseverity} alertmsg={props.alertmsg} openalert={props.openalert} setOpenAlert={props.setOpenAlert}/>  

            <form onSubmit={updateUser} id='user-update-form'> 
            <div className="form-group">
            <div className="form-group mb-2 mt-2">
                    <label htmlFor="mail"><small>Email</small></label>
                    <div className="input-group mt-1">
                        <span className="input-group-text" id="basic-addon2">
                            <span className="fas fa-envelope" style={primaryColor}></span>   
                        </span>
                        <input type="email" className="form-control form-control-sm" disabled placeholder={props.useremail} />
                    </div>  
            </div>
            <div className="form-group mb-2">
                    <label htmlFor="password"><small>First Name</small></label>
                    <div className="input-group mt-1">
                        <span className="input-group-text" id="basic-addon2">
                            <span className="fas fa-user-edit" style={primaryColor}></span>   
                        </span>
                        <input type="text" className="form-control form-control-sm" name="fname" placeholder={props.userfirst} />
                    </div>  
            </div>
                <div className="form-group mb-2">
                    <label htmlFor="lname"><small>Last Name</small></label>
                    <div className="input-group mt-1">
                        <span className="input-group-text" id="basic-addon2">
                            <span className="fas fa-user-edit" style={primaryColor}></span>
                        </span>
                        <input type="text" className="form-control form-control-sm" name="lname" placeholder={props.userlast} />
                    </div>  
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="phone"><small>Mobile Number</small></label>
                    <div className="input-group mt-1">
                        <span className="input-group-text" id="basic-addon2">
                            <span className="fas fa-phone" style={primaryColor}></span>
                        </span>
                        <input className="form-control form-control-sm" type="phone" id="phone" pattern='[0]{1}[1-7]{1}[0-9]{2}[0-9]{3}[0-9]{3}' placeholder={props.userphone}  />  
                    </div>  
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="phone"><small>Active</small></label>
                    <div className="input-group mt-1">
                        <span className="input-group-text" id="basic-addon2">
                            <span className="fas fa-plug" style={primaryColor}></span>
                        </span>
                        <select className='form-control form-control-sm' name="is_active" id="is_active">
                        
                          {props.useractive == 'True'?(
                             <>
                             <option value="true" selected>Active</option>
                             <option value="false">Disabled</option>
                           </>
                          
                          ):(
                            <>
                            <option value="false" selected>Disabled</option>
                            <option value="true" >Active</option>
                          </>
                          )}
                          {/* {props.useractive == 'True'?(
                            <>
                              <option value="false">Disabled</option>
                            </>
                          ):(
                            <>
                              <option value="true">Active</option>
                            </>
                          )} */}
                        </select>
                    </div>  
                </div>
                <br/>
                <DialogActions>
                {/* <Button onClick={handleClose}>CANCEL</Button> */}
                
                <ButtonComponent 
                      cssClass='e-custom-warning' 
                      className='m-2 p-2' 
                      style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
                      disabled={false}    
                      onClick={handleClose}  
                    
                      ><span className='mx-2'>Cancel </span>  </ButtonComponent>

                <ButtonComponent 
                      cssClass='e-custom-primary' 
                      className='m-2 p-2' 
                      type='submit' 
                      style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
                      disabled={false}    

                      ><span className='mx-2'>Sumbit </span>  </ButtonComponent>

                {/* <Button type='submit'  >SUBMIT</Button> */}
                </DialogActions>
            </div>
            </form>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}


export default  UserUpdateDialog