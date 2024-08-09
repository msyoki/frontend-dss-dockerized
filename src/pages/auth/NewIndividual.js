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

import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import AddCardIcon from '@mui/icons-material/AddCard';
import NativeSelect from '@mui/material/NativeSelect';
import { useNavigate } from 'react-router-dom';
import LoadingMini from '../../components/Loading/LoadingMini';

const NewIndividual = () => {
  registerLicense('Mgo+DSMBPh8sVXJ0S0J+XE9HflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TckVnWHlbcXFWT2NbVA==');
  let[opendialogregcomplete,setCompanyRegCompleteDialog]=useState(false)
  let navigate = useNavigate()
  let[loading, setLoading]=useState(false)
  const location = useLocation()

  const loginlogo = {
    width:"70%",
  }

  let {authTokens,loginUser,alertmsg,alertseverity,openalert,setOpenAlert,setAlertMsg,setAlertSeverity}= useContext(Authcontext)
  const companylink={
    textDecoration:"None",
    color:'white'

  }
  const primaryColor={

    color:"#1C4690"
  }

  let registeruser=async(e)=>{
    e.preventDefault()
    

 
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "email": e.target.email.value,
          "first_name": e.target.fname.value,
          "last_name": e.target.lname.value,
          "phone": e.target.phone.value,
        });
        setLoading(true)
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
     
        let response= await fetch(`${constants.devApiBaseUrl}/api/individual/new/user/`, requestOptions)
        if (response.status === 201){
            setLoading(false)
            setOpenAlert(true)
            setAlertMsg('account created successfully, please check your email !!!')
            setAlertSeverity('success')
            setTimeout(
            function() {
                setOpenAlert(false);
             
                navigate('/')
            }, 12000)
        }
        else if(response.status === 400){
            setLoading(false)
            setOpenAlert(true)
            setAlertMsg('Account with email already exists !!!')
            setAlertSeverity('error')
            setTimeout(
            function() {
                setOpenAlert(false);
            }, 5000)  
        }
        else{
            setLoading(false)
            setOpenAlert(true)
            setAlertMsg('Something went wrong, please try again later or contact admin')
            setAlertSeverity('error')
            setTimeout(
            function() {
                setOpenAlert(false);
            }, 5000)
        }

  
  
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
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center">
          <div className="col-7">
  
          <form onSubmit={registeruser} className=" text-center ">
            <div>
    {/*       
            <p className="text-center  mb-3"  style={{fontSize:'13px',fontFamily:'sans-serif'}}>DIGITAL SIGNATURE SERVICE</p>
             */}
         <img   src={Logo}  alt="Sample image" style={{width:'230px'}}/>
        
           
            <h6 className="text-center  mt-4  p-2 shadow-lg " style={primaryColor} ><span>SIGN UP</span></h6>
    
            
            </div>
            <Alerts alertseverity={alertseverity} alertmsg={alertmsg} openalert={openalert} setOpenAlert={setOpenAlert}/>  
             <div className='row'>
              <div className="form-group my-2 col-md-6 col-sm-12">

  <div className="input-group mt-2">

            <FormControl variant="standard" fullWidth>
    <InputLabel htmlFor="input-with-icon-adornment">
      First Name*
    </InputLabel>
    <Input
      style= {{fontSize: '14px'}}
      id="fname"
      startAdornment={
        <InputAdornment position="start">
          <BadgeIcon />
        </InputAdornment>
      }
      name="fname"
      placeholder="Enter first name"
      type='text'
      required
    />
  </FormControl>
  </div>  
                </div>
                <div className="form-group my-2 col-md-6 col-sm-12">

                <div className="input-group mt-2">

                  <FormControl variant="standard" fullWidth>
                  <InputLabel htmlFor="input-with-icon-adornment">
                    Last Name*
                  </InputLabel>
                  <Input
                  style= {{fontSize: '14px'}}
                    id="lname"
                    startAdornment={
                      <InputAdornment position="start">
                        <BadgeIcon />
                      </InputAdornment>
                    }
                    name="lname"
                    placeholder="Enter last name"
                    type='text'
                    required
                  />
                </FormControl>
                </div>  
                </div>
             </div>
             <div className='row'>
                <div className="form-group my-2 col-md-6 col-sm-12">

<div className="input-group mt-2">

           <FormControl variant="standard" fullWidth>
<InputLabel htmlFor="input-with-icon-adornment">
Phone*
</InputLabel>
<Input
style= {{fontSize: '14px'}}
id="phone"
startAdornment={
<InputAdornment position="start">
  <PhoneIcon />
</InputAdornment>
}
name="phone"
placeholder="e.g. 07xx xxx xxx"
type='phone'
inputProps={{
pattern:'[0]{1}[1-7]{1}[0-9]{2}[0-9]{3}[0-9]{3}',
}}
required
/>
</FormControl>
</div>  
                </div>
                <div className="form-group my-2 col-md-5 col-sm-12">
  
                <div className="input-group mt-2 mb-1">


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
                placeholder="Email address"
                type='email'
                required
                />
                </FormControl>
                  
                </div>

               
                </div>
             </div>
     
             {loading?<LoadingMini/>:
                <div className="form-group my-4">
         
              <div className="input-group mt-2 mb-3">

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
           
     
                <div className="text-center text-lg-start  pt-2 row">
                <div className='col-lg-3 col-md-3 col-sm-3'> </div>

                <div className='col-lg-6 col-md-6 col-sm-6'>

                <ButtonComponent type="submit" cssClass='e-custom-primary' className='mb-2 m-2' style={{textTransform: 'none',fontWeight:'lighter',width:'100%',padding:'10px'}} disabled={false}> Register</ButtonComponent>
                        </div>
                  <div className='col-lg-3 col-md-3 col-sm-3'> </div>

                    <br/>
                    <p className="small  mt-2 pt-1 mb-0">Already have an account? <Link to={'/login'} style={{textDecoration:'none',color:'#1C4690'}}><small  className='m-1'>Login to my account</small></Link></p>
                </div>
            </div>
     
              }
        
          </form>
          </div>
        </div>
      </div>
    </div>
    <div className="bg order-2 auth-form-section">
        <br/><br/><br/><br/><br/><br/><br/>
        <p className=" text-center text-white "> TECHEDGE AFRICA</p>
        <h3 className=" text-center text-white "> DIGITAL SIGNING SERVICE</h3>
        <h5 className=" text-center text-warning "> INDIVIDUAL </h5>
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

export default NewIndividual

