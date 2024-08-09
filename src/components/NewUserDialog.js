import * as React from 'react';
import {useNavigate, Link} from 'react-router-dom'
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
import * as constants from '../components/constants/constants'
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';


const NewUserDialog=(props) =>{


    const theme = useTheme();
    
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');
  

    const primaryColor={
  
      color:"#174291"
    }

    
    //  Toggle passwords
    let togglep1=()=>{
      let input_type=document.getElementById('password1').type;
      if(input_type === 'password'){
        document.getElementById('password1').type='text'
        document.getElementById('togglePassword1').className='fas fa-eye ml-2'
      }
      else{
        document.getElementById('password1').type='password'
        document.getElementById('togglePassword1').className='fas fa-eye-slash ml-2'
      }
    }

    let togglep2=()=>{
      let input_type=document.getElementById('password2').type;
      if(input_type === 'password'){
        document.getElementById('password2').type='text'
        document.getElementById('togglePassword2').className='fas fa-eye ml-2'
      }
      else{
        document.getElementById('password2').type='password'
        document.getElementById('togglePassword2').className='fas fa-eye-slash ml-2'
      }
    }


    

    let registeruser=async(e)=>{
        e.preventDefault()

        //   get admin domain
        var admin_email=props.user.email
        var admin_ind=admin_email.indexOf("@");
        var admin_domain=admin_email.slice((admin_ind+1),admin_email.length);
      

        //   get user domain
        var user_email=e.target.email.value
        var user_ind=user_email.indexOf("@");
        var user_domain=user_email.slice((user_ind+1),user_email.length);
     

        if(user_domain == admin_domain){
            // if (e.target.password1.value != e.target.password2.value){
            //     props.setOpenAlert(true)
            //     props.setAlertMsg('Password do not match !!!')
            //     props.setAlertSeverity('error')
            //     setTimeout(
            //       function() {
            //         props.setOpenAlert(false);
            //     }, 5000)
                
            // }
            // else{
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization",`Bearer ${props.authTokens.access}`);
    
            var raw = JSON.stringify({
              "email": e.target.email.value,
              "first_name": e.target.fname.value,
              "last_name": e.target.lname.value,
              "phone": e.target.phone.value,
            });
    
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            
            let response= await fetch(`${constants.devApiBaseUrl}/api/new/user/${props.user.id}/`, requestOptions)
            if (response.status === 201){
                props.setOpenAlert(true)
                props.setAlertMsg('account created successfully !!!')
                props.setAlertSeverity('success')
                props.setOpenDialogNewUser(false);
                setTimeout(
                function() {
                    props.setOpenAlert(false);
                    props.getusers()
                    document.getElementById('new-user-form').reset()
                }, 4000)
            }
            else if(response.status === 400){
                props.setOpenAlert(true)
                props.setAlertMsg('Account with email already exists !!!')
                props.setAlertSeverity('error')
                setTimeout(
                function() {
                    props.setOpenAlert(false);
                
                }, 5000)  
            }
            else{
                props.setOpenAlert(true)
                props.setAlertMsg('Something went wrong, please try again later or contact admin')
                props.setAlertSeverity('error')
                setTimeout(
                function() {
                    props.setOpenAlert(false);
                }, 5000)
            }
    
          // }
        }
        else{
           
            props.setOpenAlert(true)
            props.setAlertMsg(`Invalid domain used on email, please use - "${admin_domain}" `)
            props.setAlertSeverity('error')
            setTimeout(
                function() {
                    props.setOpenAlert(false);
            
            }, 5000)
        }
      
    }

  const handleClose = () => {
    props.setOpenDialogNewUser(false);
  };

  
  return (
    <div >
     
      <Dialog

        open={props.opendialognewuser}
        // fullWidth={fullWidth}
        // maxWidth={maxWidth}
        keepMounted
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        // className='App-header'
      >
        <DialogTitle style={{backgroundColor:'#1C4690',fontSize:'14px'}} className='shadow-lg text-white text center'><i className="fas fa-user-plus m-1"></i> Add New Account 
          
        </DialogTitle>
        <br/>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" >
            <Alerts alertseverity={props.alertseverity} alertmsg={props.alertmsg} openalert={props.openalert} setOpenAlert={props.setOpenAlert}/>  
            <form onSubmit={registeruser} id='new-user-form'  style={{fontSize:'14px'}}> 
            <div className="form-group mb-2 ">
                <label htmlFor="email" ><small>Email Address</small></label>
                <div className="input-group mt-2">
                    <span className="input-group-text " id="basic-addon2">
                    <span className=" fas fa-envelope" ></span>
                    </span>
                    <input type="email" className="form-control form-control-sm"   name="email" placeholder='Email' required/>
                </div> 
            </div>
            <div className="form-group">
            <div className="form-group mb-2">
                    <label htmlFor="password"><small>First Name</small></label>
                    <div className="input-group mt-2">
                        <span className="input-group-text" id="basic-addon2">
                            <span className="fas fa-user-edit"></span>   
                        </span>
                        <input type="text" className="form-control form-control-sm" name="fname" placeholder='First Name' required/>
                    </div>  
            </div>
                <div className="form-group mb-2">
                    <label htmlFor="lname"><small>Last Name</small></label>
                    <div className="input-group mt-2">
                        <span className="input-group-text" id="basic-addon2">
                            <span className="fas fa-user-edit"></span>
                        </span>
                        <input type="text" className="form-control form-control-sm" name="lname" placeholder='Last Name' required/>
                    </div>  
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="phone"><small>Mobile Number</small></label>
                    <div className="input-group mt-2">
                        <span className="input-group-text" id="basic-addon2">
                            <span className="fas fa-phone" ></span>
                        </span>
                        <input className="form-control form-control-sm" type="phone" id="phone" pattern='[0]{1}[1-7]{1}[0-9]{2}[0-9]{3}[0-9]{3}' placeholder='e.g. 07xx xxx xxx' required />  
                    </div>  
                </div>

                <br/>
                <DialogActions>
                <ButtonComponent 
                  cssClass='e-custom-warning' 
                  onClick={handleClose} 
                  className='m-2 p-2' 
                  style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
                  disabled={false} 
                  > <i className="fas fa-times mx-1" ></i> <span className='mx-2'>Cancel</span>  
                </ButtonComponent>
                <ButtonComponent 
                  cssClass='e-custom-primary' 
                  type='submit'
                  className='m-2 p-2' 
                  style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
                  disabled={false} 
                  > <i className="fas fa-check mx-1" ></i> <span className='mx-2'>Register New User </span>  
                </ButtonComponent>
           
                </DialogActions>
            </div>
            </form>
      
          </DialogContentText>
        </DialogContent>
    
      </Dialog>
 
    </div>
  );
}


export default  NewUserDialog