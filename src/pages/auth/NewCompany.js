import React, {useState} from 'react'
import { Link ,useLocation} from "react-router-dom";
import Authcontext from '../../context/Authcontext'
import Logo from '../../images/techedge.png'
import {useContext, useEffect} from 'react'
import "../../styles/App.css";
import "../../styles/Login.css";
import Alerts from '../../components/Alert';
import axios from 'axios'
import RegistrationCompleteDialog from '../../components/RegistrationCompleteDialog';
import { registerLicense } from '@syncfusion/ej2-base';
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';
import * as constants from '../../components/constants/constants'


import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';

import EmailIcon from '@mui/icons-material/Email';

import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AddCardIcon from '@mui/icons-material/AddCard';
import NativeSelect from '@mui/material/NativeSelect';

const NewCompany = () => {
  registerLicense('Mgo+DSMBPh8sVXJ0S0J+XE9HflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TckVnWHlbcXFWT2NbVA==');
  let[opendialogregcomplete,setCompanyRegCompleteDialog]=useState(false)
  const location = useLocation()


  let {alertmsg,alertseverity,openalert,setOpenAlert,setAlertMsg,setAlertSeverity}= useContext(Authcontext)

  const primaryColor={

    color:"#1C4690"
  }

  let register_company=(e)=>{
    e.preventDefault()
    var user_email="useridhere@sitename.com"
    var user_ind=user_email.indexOf("@");
    var admin_domain=user_email.slice((user_ind+1),user_email.length);

    
    var data = JSON.stringify({
      "name": e.target.name.value,
      "email": e.target.email.value
    });

    var config = {
      method: 'post',
    maxBodyLength: Infinity,
      url: `${constants.devApiBaseUrl}/api/company/register/`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      setCompanyRegCompleteDialog(true)
    })
    .catch(function (error) {
      console.log(error);
      setOpenAlert(true)
      setAlertMsg("company with this name/email already registered.")
      setAlertSeverity("error")
      setTimeout(
      function() {
      setOpenAlert(false);
      }, 6000)
    });
    
  }
  
 
    useEffect(()=>{

      try {
          setOpenAlert(location.state.openalert)
          setAlertMsg(location.state.alertmsg)
          setAlertSeverity(location.state.alertseverity)
          setTimeout(
          function() {
          setOpenAlert(false);
          }, 3000)
      }
        catch(err) {  
      }
   
    }, [])

  return (
  <>
    <RegistrationCompleteDialog
      opendialogregcomplete={opendialogregcomplete} 
      setCompanyRegCompleteDialog={setCompanyRegCompleteDialog}
      alertmsg={alertmsg}
    />
    <div className="d-lg-flex half ">
    <div className="contents order-1 order-md-1 auth-form-section">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-7">
  
          <form onSubmit={register_company} className=" text-center ">
            <div>

         <img   src={Logo}  alt="Sample image" style={{width:'230px'}}/>
        
           
            <h6 className="text-center  mt-4 mb-3  p-2 shadow-lg " style={primaryColor} ><span>SIGN UP</span></h6>
    
            
            </div>
            <Alerts alertseverity={alertseverity} alertmsg={alertmsg} openalert={openalert} setOpenAlert={setOpenAlert}/>  
            <div className="form-group my-4">

              <div className="input-group mt-2">
                   <FormControl variant="standard" fullWidth>
                <InputLabel htmlFor="input-with-icon-adornment">
                  Organization name*
                </InputLabel>
                <Input
                 style= {{fontSize: '14px'}}
                  id="name"
                  startAdornment={
                    <InputAdornment position="start">
                      <CorporateFareIcon />
                    </InputAdornment>
                  }
                  name="name"
                  placeholder="Enter organization name"
                  type='text'
                  required
                />
              </FormControl>
              </div>  
            </div>
            <div className="form-group my-4">
  
              <div className="input-group mt-2">

                  <FormControl variant="standard" fullWidth>
                <InputLabel htmlFor="input-with-icon-adornment">
                  Email*
                </InputLabel>
                <Input
                 style= {{fontSize: '14px'}}
                  id="email"
                  startAdornment={
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  }
                  name="email"
                  placeholder="Admin Email"
                  type='email'
                  required
                />
              </FormControl>
              </div>  
            </div>
         
            <div className="form-group my-4">
                <div className="form-group mb-2">
        
                  <div className="input-group mt-2 mb-1">

                        <FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                      Package Plan*
                    </InputLabel>
                    <NativeSelect
                     style= {{fontSize: '14px'}}
                      defaultValue={30}
                      inputProps={{
                        name: 'plan',
                        id: 'plan',
                      }}
                      startAdornment={
                        <InputAdornment position="start">
                          <AddCardIcon />
                        </InputAdornment>
                      }
                    >
                      <option value={"Free trial"} >Free trial</option>
                      <option value={"Advanced"}>Advanced</option>
                    
                    </NativeSelect>
                  </FormControl>
              
                      
                  </div>
                
                </div>
     
                <div className="text-center text-lg-start mt-4 pt-2 mb-5 row">
                <div className='col-lg-3 col-md-3 col-sm-3'> </div>
                  <div className='col-lg-6 col-md-6 col-sm-6'>

                  <ButtonComponent type="submit" cssClass='e-custom-primary' className='mb-4 m-2' style={{textTransform: 'none',fontWeight:'lighter',width:'100%',padding:'10px'}} disabled={false}> Register</ButtonComponent>
                   </div>
                  <div className='col-lg-3 col-md-3 col-sm-3'> </div>
            
                
                    <br/>
                    <p className="small  mt-2 pt-1 mb-0">Already have an account? <Link to={'/login'} style={{textDecoration:'none',color:'#1C4690'}}><small  className='m-1'>Login to my account</small></Link></p>
                </div>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
    <div className="bg order-2 auth-form-section">
        <br/><br/><br/><br/><br/><br/><br/>
        <p className=" text-center text-white "> TECHEDGE AFRICA</p>
        <h3 className=" text-center text-white "> DIGITAL SIGNING SERVICE</h3>
        <h5 className=" text-center text-warning "> CORPORATE </h5>
        <br/><br/>
        <div className="container text-dark">
        <h6 className=" text-center mt-4 text-white">Sign Document | Request Signatures | Create Workflows</h6>
          <p className=" text-center font-weight-italic responsive-font mb-5">
            <a href="https://techedge.co.ke" className="text-dark" target="_blank" style={{textDecoration: 'none', color: 'white',}}>
              <small className="text-white">Techedge Africa © 2023 - Document Management Solutions</small>
            </a>
          
          </p>
        </div>
      </div>
  
    </div>
  </>

  )
}

export default NewCompany

