import React from 'react'
import { Link ,useLocation} from "react-router-dom";
import Authcontext from '../../context/Authcontext'
import Logo from '../../images/techedge.png'
import {useContext, useEffect} from 'react'
import "../../styles/App.css";
import "../../styles/Login.css";
import Alerts from '../../components/Alert';
import TermsAndConditionsDialog from '../../components/TermsAndConditionsDialog';
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';

import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import KeyIcon from '@mui/icons-material/Key';
import EmailIcon from '@mui/icons-material/Email';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import * as constants from "../../components/constants/constants"
import { Email } from '@mui/icons-material';

const Login = () => {

  const [opentandcdialog, setOpenTAndCDialog] = React.useState(false);

  const location = useLocation()

  const loginlogo = {
    width:"5%",
  }
  const handleClickOpenTC = () => {
    setOpenTAndCDialog(true);
  };

  let {loginUser,alertmsg,alertseverity,openalert,setOpenAlert,setAlertMsg,setAlertSeverity}= useContext(Authcontext)
  const companylink={
    textDecoration:"None",
    color:'white'

  }
  const primaryColor={

    color:"#1C4690"
  }
  
    // Toggle password
    let togglep=()=>{
      let input_type=document.getElementById('password').type;
      if(input_type === 'password'){
        document.getElementById('password').type='text'
        document.getElementById('togglePassword').className='fas fa-eye ml-2'
      }
      else{
        document.getElementById('password').type='password'
        document.getElementById('togglePassword').className='fas fa-eye-slash ml-2'
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
    <TermsAndConditionsDialog
      opentandcdialog={opentandcdialog}
      setOpenTAndCDialog={setOpenTAndCDialog}
    />
    
    <div className="d-lg-flex half">
      {/* Left Section: Form */}
      <div className="contents order-1 order-md-1 auth-form-section">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-7">
              <form onSubmit={loginUser} className="text-center">
                <div>
                  <img src={Logo} alt="Sample image" style={{ width: '170px' }} />
                  <h6 className="text-center mt-4 mb-3 p-2 shadow-lg" style={primaryColor}>
                    <span>SIGN IN</span>
                  </h6>
                </div>
                <Alerts
                  alertseverity={alertseverity}
                  alertmsg={alertmsg}
                  openalert={openalert}
                  setOpenAlert={setOpenAlert}
                />
                <div className="form-group">
                  <FormControl variant="standard" fullWidth className="my-2">
                    <InputLabel htmlFor="email">Email*</InputLabel>
                    <Input
                      style={{ fontSize: '14px' }}
                      id="email"
                      startAdornment={
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      }
                      name="email"
                      placeholder="User email address"
                      type="email"
                      required
                    />
                  </FormControl>
                  <FormControl variant="standard" fullWidth className="my-2">
                    <InputLabel htmlFor="password">Password*</InputLabel>
                    <Input
                      style={{ fontSize: '14px' }}
                      id="password"
                      type="password"
                      placeholder="User password"
                      name="password"
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <KeyIcon />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <i onClick={togglep} className="fas fa-eye-slash" id="togglePassword"></i>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </div>
                <div className="form-group my-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check mb-0"></div>
                    <p className="small">
                      <small>
                     
                        <Link to={'/password-reset'} style={{ textDecoration: 'none', color: '#1C4690' }}>
                          <span className="mx-1">Forgot password?</span>
                        </Link>
                          
                      
                      </small>
                    </p>
                  </div>
                  <div className="form-check mt-1">
                    <input className="form-check-input" type="checkbox" id="flexCheckDisabled" required />
                    <label className="form-check-label" htmlFor="flexCheckDisabled">
                      <small>
                        I have read and agreed to the{' '}
                        <a onClick={handleClickOpenTC} className="small" style={{ color: '#1C4690', textDecoration: 'none' }}>
                          Terms and Conditions
                        </a>
                      </small>
                    </label>
                  </div>
                  <div className="text-center text-lg-start mt-1 row">
                    <div className="col-lg-3 col-md-3 col-xsm-3"></div>
                    <div className="col-lg-6 col-md-6 col-xsm-6">
                      
                      <ButtonComponent
                        type="submit"
                        cssClass="e-custom-primary"
                        className="mb-3 m-2"
                        style={{ textTransform: 'none', fontWeight: 'lighter', width: '100%', padding: '10px' }}
                        disabled={false}
                      >
                        Login
                      </ButtonComponent>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-3"></div>
                    <small className="small mb-0">
                      <small>
                        Don't have an account?
                        <br />
                        Register your
                      </small>
                      <small>
                        <Link to={'/company/register'} style={{ textDecoration: 'none', color: '#1C4690' }}>
                          <span className="mx-1">Organization account</span>
                        </Link>{' '}
                        OR{' '}
                        <Link to={'/individual/register'} style={{ textDecoration: 'none', color: '#1C4690' }}>
                          <span className="mx-1">Individual account</span>
                        </Link>
                      </small>
                    </small>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Right Section: Information */}
      <div className="bg order-2 auth-form-section">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <p className="text-center text-white">TECHEDGE AFRICA</p>
        <h3 className="text-center text-white">DIGITAL SIGNING SERVICE</h3>
        <h5 className="text-center text-warning">CORPORATE</h5>
        <br />
        <br />
        <div className="container text-dark">
          <h6 className="text-center mt-4 text-white">Sign Document | Request Signatures | Create Workflows</h6>
          <p className="text-center font-weight-italic responsive-font mb-5">
            <a href="https://techedge.co.ke" className="text-dark" target="_blank" style={{ textDecoration: 'none', color: 'white' }}>
              <small className="text-white">Techedge Africa © 2023 - Document Management Solutions</small>
            </a>
          </p>
        </div>
      </div>
    </div>
  </>



  )
}

export default Login

