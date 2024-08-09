






import {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios'
import Alert from '../components/Alert'
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';
import * as constants from '../components/constants/constants'

import * as React from 'react';
import PropTypes from 'prop-types';
import { Input as BaseInput } from '@mui/base/Input';
import { Box, styled } from '@mui/system';
import LoadingMini from './Loading/LoadingMini';


const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const InputElement = styled('input')(
  ({ theme }) => `
  width: 40px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 0px;
  border-radius: 8px;
  text-align: center;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

function OTP({ separator, length, value, onChange ,props}) {
  const inputRefs = React.useRef(new Array(length).fill(null));
 
  const focusInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.focus();
  };

  const selectInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.select();
  };

  const handleKeyDown = (event, currentIndex) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case ' ':
        event.preventDefault();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case 'Delete':
        event.preventDefault();
        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });

        break;
      case 'Backspace':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }

        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });
        break;

      default:
        break;
    }
  };

  const handleChange = (event, currentIndex) => {
    const currentValue = event.target.value;
    let indexToEnter = 0;

    while (indexToEnter <= currentIndex) {
      if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
        indexToEnter += 1;
      } else {
        break;
      }
    }
    onChange((prev) => {
      const otpArray = prev.split('');
      const lastValue = currentValue[currentValue.length - 1];
      otpArray[indexToEnter] = lastValue;
      return otpArray.join('');
    });
    if (currentValue !== '') {
      if (currentIndex < length - 1) {
        focusInput(currentIndex + 1);
      }
    }
  };

  const handleClick = (event, currentIndex) => {
    selectInput(currentIndex);
  };

  const handlePaste = (event, currentIndex) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;

    // Check if there is text data in the clipboard
    if (clipboardData.types.includes('text/plain')) {
      let pastedText = clipboardData.getData('text/plain');
      pastedText = pastedText.substring(0, length).trim();
      let indexToEnter = 0;

      while (indexToEnter <= currentIndex) {
        if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
          indexToEnter += 1;
        } else {
          break;
        }
      }

      const otpArray = value.split('');

      for (let i = indexToEnter; i < length; i += 1) {
        const lastValue = pastedText[i - indexToEnter] ?? ' ';
        otpArray[i] = lastValue;
      }

      onChange(otpArray.join(''));
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {new Array(length).fill(null).map((_, index) => (
        <React.Fragment key={index}>
          <BaseInput
            slots={{
              input: InputElement,
            }}
            aria-label={`Digit ${index + 1} of OTP`}
            slotProps={{
              input: {
                ref: (ele) => {
                  inputRefs.current[index] = ele;
                },
                onKeyDown: (event) => handleKeyDown(event, index),
                onChange: (event) => handleChange(event, index),
                onClick: (event) => handleClick(event, index),
                onPaste: (event) => handlePaste(event, index),
                value: value[index] ?? '',
              },
            }}
          />
          {index === length - 1 ? null : separator}
        </React.Fragment>
      ))}
    </Box>
  );
}

OTP.propTypes = {
  length: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  separator: PropTypes.node,
  value: PropTypes.string.isRequired,
};
const OtpDialog=(props) =>{
  const [otp, setOtp] = React.useState('')
  let [locked,setLocked]=React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const minutes = Math.floor(props.time / 60);
  const seconds = props.time % 60;

  function getmakedOtpPhone(){
    if(props.otpphone){
      const last3 = props.otpphone.slice(-3);
      return `***** *** ${last3}`
    }
    else{
      return `*** *** ***`
    }
   
  }

  // const handleChange = (newValue) => {
  //   setOtp(newValue)
  // }
    const [maxWidth, setMaxWidth] = React.useState('sm');
  


  let resendOtp=()=>{
    props.setResetTimer(true)
    if(props.trialcount<3){
      let data = JSON.stringify({
        "phone": props.otpphone
      });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${constants.devApiBaseUrl}/api/sms/otp/`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
    
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        props.setTime(600)
        props.timerClock()
        props.setTrialCount(props.trialcount+1)
        props.setOpenAlert(true)
        props.setAlertMsg('Otp was sent successfully!!')
        props.setAlertSeverity('success')
        setTimeout(
          function() {
          props.setOpenAlert(false);
        }, 3000)
  
      })
      .catch(function (error) {
        // console.log(error);
      });
    }
    else if( props.trialcount === 3){
      // console.log('maximum trials reached try later')
      props.setOpenAlert(true)
      props.setAlertMsg('Maximum trials reached, try later!!')
      props.setAlertSeverity('error')
      setTimeout(
        function() {
          props.setOpenAlert(false);
      }, 3000)
    }
  }




  let validateOTP=async(e)=>{
    e.preventDefault()
    // console.log(`otp is: ${otp.length}`)
    if(!otp.length === 6){
    
      // console.log(`otp: ${newotp}`)
      // console.log('invalid otp please try again or resend otp if trial are less than 3')
      props.setOpenAlert(true);
      props.setAlertMsg('Please enter the complete 6 digit OTP')
      props.setAlertSeverity('error')
      setTimeout(
        function() {
          props.setOpenAlert(false);
      }, 3000)
     
    }
    else{
      const data =JSON.stringify({
        "otp":otp,
        "phone":props.otpphone
      })
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${constants.devApiBaseUrl}/api/verify/otp/`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };


      await axios.request(config)
      .then((response) => {
        setLocked(false)
        // setOTP(response.data)
        setTimeout(
          function() {
            props.setOpenDialogOtp(false);
        }, 3000)
        
      })
      .catch((error) => {
        // console.log(error);
        props.setOpenAlert(true)
        props.setAlertMsg('Invalid OTP Code !!')
        props.setAlertSeverity('error')
        setLocked(true)
        setTimeout(
          function() {
            props.setOpenAlert(false)
        }, 3000)
      });
 
    }

  }

  // let  elts = document.getElementsByClassName('otp-input')
  //   Array.from(elts).forEach(function(elt){
  //     elt.addEventListener("keyup", function(event) {
  //     // Number 13 is the "Enter" key on the keyboard
  //     if (event.keyCode === 13 || elt.value.length == 1) {
  //       // Focus on the next sibling
  //       if(elt.nextElementSibling){
  //         elt.nextElementSibling.focus()
  //       }
  //     }
  //   });
  // })



  
  return (
    <div>
    <Dialog
      open={props.opendialogotp}
      maxWidth={maxWidth}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      style={{ backgroundColor: '#1C4690' }}
    >
      {/* <DialogTitle style={{ color: '#174291', textAlign: 'center', fontSize: '16px' }}>
        <i className="fas fa-lock" style={{ color: '#174291', fontSize: '25px' }}></i>
        
      </DialogTitle> */}
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description" className='text-center'>
          {locked?<i className="fas fa-lock " style={{ color: '#174291', fontSize: '25px' }}></i>:<i className="fas fa-unlock-alt" style={{ color: '#174291', fontSize: '25px' }}></i>}
        <Alert alertseverity={props.alertseverity} alertmsg={props.alertmsg} openalert={props.openalert} setOpenAlert={props.setOpenAlert} />
         {locked?
         <>
                {loading?
          <div>
            <p style={{ color: '#174291', textAlign: 'center', fontSize: '15px' }}>Document {locked?<>Locked</>:<>Ulocked</>}</p>
          
            <p style={{  textAlign: 'center', fontSize: '13px' }}>Validating OTP</p>
            <LoadingMini/>
          </div>
        :
            <div style={{ fontSize: '12px' ,height:'100%'}}>
              <div className="text-center row">
                <div className="content">
                  <p style={{ color: '#174291', textAlign: 'center', fontSize: '15px' }}>Document Locked</p>
                  
                  {props.time === 0 ? <></>:
                  <>
       
                    <p>Please enter the 6 digits OTP code sent to your number</p>
                 
                    <p>OTP Phone Number : {getmakedOtpPhone()}</p>
               
                  </>}
               
                  <Box
                    className="d-flex justify-content-center align-items-center my-2 "
                    sx={{
                      gap: 2,
                    }}
                  >
                    {props.time === 0 ? <p style={{  textAlign: 'center', fontSize: '15px' }} className='text-dark'>Session Expired Re-send OTP</p>:  <OTP className="shadow-lg" separator={<span>-</span>} value={otp} onChange={setOtp} length={6} />}
                  
                  </Box>
                  {props.time === 0 ?
                  <></>:
                  <div className='text-center p-2'>
                  <p style={{ fontSize: '13px' }}><span  style={{ color: '#174291'}}>Expiration Timer :</span> {minutes < 10 ? '0' : ''}{minutes}:{seconds < 10 ? '0' : ''}{seconds}  <span className='text-dark'>( Trial: {props.trialcount} of 3 )</span></p>
                   
                   </div>
                  }
                 
                  
                </div>
              </div>
              <div className="row text-center">
                <div className="content d-flex justify-content-center align-items-center my-2">
                  <p><span className='text-dark mx-2'>Didn't receive the OTP SMS? <ButtonComponent onClick={resendOtp} cssClass='e-custom-warning' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} disabled={false}><i className="fas fa-share mx-1"></i><span className='mx-2'>Click to Resend</span></ButtonComponent></span></p>
                </div>
               
              </div>
              {props.time === 0 ?<></>:
              <div className="text-center">
                <ButtonComponent size='sm' onClick={validateOTP} cssClass='e-custom-primary' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} disabled={false}>
                  <i className="fas fa-check mx-1"></i><span className='mx-2'>Validate OTP</span>
                </ButtonComponent>
              </div>
              }   
            </div>
          }
         </>
        :<>
         <p style={{ color: '#174291', textAlign: 'center', fontSize: '15px' }} className='my-3'>Document Unlocked Successfully</p>
          <div className='d-flex justify-content-center my-4'>
            <i className="fas fa-check-circle " style={{ color: '#7cb518', fontSize: '100px' }}></i>
          </div>
        </>
        }

         
        </DialogContentText>
      </DialogContent>
    </Dialog>
  </div>
  
  );
}


export default  OtpDialog








