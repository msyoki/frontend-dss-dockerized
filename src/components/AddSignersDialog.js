import React, { useRef } from 'react';
import { useContext, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import AuthContext from '../context/Authcontext'
import ConfirmVoid2 from './ConfirmVoid2';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import Switch from '@mui/material/Switch';
import Alerts from './Alert';
import LoadingMini from './Loading/LoadingMini';
import { jsonPhoneCodesData } from '../data/country-phone-codes'


import Tooltip from '@mui/material/Tooltip';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as constants from '../components/constants/constants'

const AddSignersDialog = (props) => {

  const selectRef = useRef();

  const [workflow, setWorkflow] = React.useState('');
  const [selectedworkflowtitle, setSelectedWorkflowTitle] = React.useState('');


  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');

  const textcolor = {
    color: '#1C4690'
  }
  const handleClose = () => {
    props.setOpenDialogAddSigners(false);
  };



  const location = useLocation()
  let navigate = useNavigate();
  // let [loading,setLoading]=useState(true);
  let [emailexists, setEmailExists] = useState(false);
  let [avatar, setAvatar] = useState('')
  var [signers, setSigners] = useState([])
  let { authTokens, logoutUser, user } = useContext(AuthContext)

  let [checked, setChecked] = useState(false);
  let [checked2, setChecked2] = useState(false);
  let [checked3, setChecked3] = useState(false);
  let [openalert, setOpenAlert] = useState(false)
  let [alertseverity, setAlertSeverity] = useState('')
  let [alertmsg, setAlertMsg] = useState('')

  let changeForm = (e) => {
    setChecked(e.target.checked);

  }

  let changeForm2 = (e) => {
    setChecked2(e.target.checked);

  }
  let changeForm3 = (e) => {
    setChecked3(e.target.checked);

  }



  let AddWorkflow = (e, selectedValue) => {
    // document.getElementById("savewfForm").style.display='none'
    setWorkflow(e.target.value);
    const str = selectedValue;
    const intValue = +str;
    // console.log(typeof(intValue))
    const selectedWorkflow = props.workflows.find((wf) => wf.id === intValue);
    if (selectedWorkflow) {
      // console.log(selectedWorkflow.title);
      setSelectedWorkflowTitle(selectedWorkflow.title)
      setSigners([])
      for (const object of selectedWorkflow.signers) {
        // Perform action with each object
        setSigners(signers => [...signers, object])
        // console.log(object);
      }
    }
  }

  let saveWorkflow = () => {
    // console.log("clicked")
    let title = document.getElementById('wftitle').value
    // console.log(title)
    let data = JSON.stringify({
      "wftitle": `${title}`,
      "wfsigners": signers
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${constants.devApiBaseUrl}/api/new/workflow/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        props.getWorkflows()
        document.getElementById('wftitle').value = ""
        setChecked2(false)
        // console.log(JSON.stringify(response.data));
        setSelectedWorkflowTitle(response.data.title)
        setWorkflow(response.data.id);
        const str = response.data.id;
        const intValue = +str;
        // console.log(typeof(intValue))
        const selectedWorkflow = props.workflows.find((wf) => wf.id === intValue);
        if (selectedWorkflow) {
          // console.log(selectedWorkflow.title);
          setSelectedWorkflowTitle(selectedWorkflow.title)
          setSigners([])
          for (const object of selectedWorkflow.signers) {
            // Perform action with each object
            setSigners(signers => [...signers, object])
            // console.log(object);
          }
        }
        setOpenAlert(true)
        setAlertMsg(` ${response.data.title} was save successfully`)
        setAlertSeverity('success')
        setTimeout(
          function () {
            setOpenAlert(false);
          }, 3000)


      })
      .catch((error) => {
        // console.log(error);
      });

  }

  let addMailList = (e) => {
    e.preventDefault()

    selectRef.current.value = ''; // Reset the value to empty
    setWorkflow('');
    setSelectedWorkflowTitle('')
    setEmailExists(false)
    var email = document.getElementById('to').value
    if (checked === true && !e.target.phoneNumber.value || checked === true && !e.target.phoneCode.value) {
      setOpenAlert(true)
      setAlertMsg('phone number is required for otp 157')
      setAlertSeverity('error')
      setTimeout(
        function () {
          setOpenAlert(false);
        }, 3000)
    }
    else {
      if (validateEmail(email)) {
        var authenticate = checked3
        var otp = checked
        let phoneNumber = otp ? e.target.phoneNumber.value : '';
        let phoneCode = otp ? e.target.phoneCode.value : '';

        let signer = {
          email: email,
          phone: otp ? `${phoneCode}${phoneNumber}` : undefined,
          authenticate: authenticate ? true : undefined,
        };

        // Remove undefined properties
        if (!signer.phone) delete signer.phone;
        if (signer.authenticate === undefined) delete signer.authenticate;

        // let signer = otp  ? {
        //   "email": email,
        //   "phone": `${phoneCode}${phoneNumber}`
        // } : {
        //   "email": email
        // };

        if (signers.length < 1) {
          // console.log(signers.length)
          setSigners(signers => [...signers, signer])
          document.getElementById('to').value = ''
          // document.getElementById('otp').value = false
          if (checked) {
            document.getElementById('phone').value = ''
          }
          setChecked(false)
          setChecked3(false)
        }
        else {
          var emailexists = false
          signers.forEach(function (item) {
            if (item.email == email) {
              emailexists = true
            }
          })
          if (emailexists == false) {
            setSigners(signers => [...signers, signer])
            document.getElementById('to').value = ''
            if (checked) {
              document.getElementById('phone').value = ''
            }
            setChecked(false)
            setChecked3(false)
          }
          else {
            setOpenAlert(true)
            setAlertMsg('email already exists, enter another signer or send to signers')
            setAlertSeverity('error')
            setTimeout(
              function () {
                setOpenAlert(false);
              }, 3000)

          }

        }

      }


      else if (!email) {
        setOpenAlert(true)
        setAlertMsg('Email is required')
        setAlertSeverity('error')
        setTimeout(
          function () {
            setOpenAlert(false);
          }, 3000)

      }

      else {
        setOpenAlert(true)
        setAlertMsg(`email ${email} is invalid, enter a valid email address`)
        setAlertSeverity('error')
        setTimeout(
          function () {
            setOpenAlert(false);
          }, 3000)

      }
    }

  }
  let removeSigner = (e, email) => {
    setSigners(signers.filter(item => item.email !== email));
    // console.log(signers.length)
    if (signers.length === 1) {
      selectRef.current.value = ''; // Reset the value to empty
      setWorkflow('');
      setSelectedWorkflowTitle('')
      setChecked2(false)
    }
    // console.log(signers)
  }
  let validateEmail = (email) => {
    const res = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    return res.test(email);
  }

  let handleClose2 = () => {
    props.setOpenDialogAddSigners(false)
    selectRef.current.value = ''; // Reset the value to empty
    setWorkflow('');
    setSelectedWorkflowTitle('')
    setSigners([])
  }




  let sendForSigning = (e) => {

    let assignmentDescription = document.getElementById('ad').value

    if (checked2 === true && document.getElementById('wftitle').value === '') {
      setOpenAlert(true)
      setAlertMsg('new workflow title is required !!!')
      setAlertSeverity('error')
      setTimeout(
        function () {
          setOpenAlert(false);
        }, 3000)
    }

    else {
      const filename = props.fileurl
      if (checked2) {
        saveWorkflow()
      }

      if (!signers) {
        setOpenAlert(true)
        setAlertMsg('atleast one signer is required')
        setAlertSeverity('error')
        setTimeout(
          function () {
            setOpenAlert(false);
          }, 3000)

      }
      else {
        props.setLoading(true)
        const url = `${constants.devApiBaseUrl}/api/othersigners/`;
        if (assignmentDescription) {
          var mydata = JSON.stringify({
            "documentid": filename,
            "signers": signers,
            "assignmentd": assignmentDescription
          });
        }
        else {
          var mydata = JSON.stringify({
            "documentid": filename,
            "signers": signers
          });
        }

        // console.log(mydata)

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`
          },
        };

        axios.post(url, mydata, config)
          .then((response) => {
            if (response.status === 200) {
              props.setLoading(false)
              props.refreshdata()
              props.setOpenDialogAddSigners(false)
              props.setUploadedFile('')

              document.getElementById('sign-type').style.display = 'none';

              document.getElementById('file-upload-form').style.display = 'block';

              props.setOpenAlert(true)
              props.setAlertMsg('successfully sent to signers')
              props.setAlertSeverity('success')
              setTimeout(
                function () {
                  props.setOpenAlert(false);
                }, 6000)

            } else if (response.statusText === 'Unauthorized') {
              logoutUser()
            }
            else {
              setOpenAlert(true)
              setAlertMsg('Something went wrong, try again')
              setAlertSeverity('error')
              setTimeout(
                function () {
                  setOpenAlert(false);
                }, 3000)

            }
          });
      }

    }





  }




  return (
    <>

      <Dialog
        open={props.opendialogaddsigners}

        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >

        <div className='row m-0' style={{ width: '100%' }} >

          <div className=' shadow-lg col-md-12 col-lg-5' style={{ backgroundColor: '#1C4690', color: 'white' }}>
            {/* <p className='text-white text-center  mb-4 '><i className="fas fa-mail-bulk"></i> Request e-signatures </p> */}
            <label className=' my-3 text-white input-group' style={{ fontSize: '14px' }}>
              <div>
                <i className="fas fa-network-wired mx-1"></i> Saved Workflows :
              </div>

              <FormControl variant="filled" style={{ width: "100%" }} className='bg-white' size='small'>
                <InputLabel id="demo-simple-select-filled-label" style={{ fontSize: "14px", color: "black" }} >Select Worflow</InputLabel>
                <Select
                  ref={selectRef}
                  labelId="wf"
                  id="wf"
                  value={workflow}
                  onChange={(e) => AddWorkflow(e, e.target.value)}
                  name="wf"
                  size="small"

                >
                  <MenuItem value="" style={{ fontSize: "12.5px" }} >
                    <span style={{ color: '#1C4690' }}> {props.workflows ? <>Total saved ({props.workflows.length})</> : <>No Results Found</>}</span>
                  </MenuItem>
                  {props.workflows.map((wf) => (

                    <MenuItem value={wf.id} style={{ fontSize: "12.5px" }}>{wf.title} </MenuItem>
                  ))}

                </Select>
              </FormControl>

            </label>


            <p className=' text-white text-center  my-1' style={{ fontSize: '12px', fontWeight: '550' }}> OR </p>

        
            <form onSubmit={addMailList} className='shadow-lg p-2'>
            <h5 className=' text-white text-center my-2' style={{ fontSize: '15px' }}>Add signers ( one by one )</h5>
            <p style={{ fontSize: '12px' }}> Check for account / OTP (specify phone number) verification if required and add the signers email.</p>

              <div style={{ backgroundColor: "#e5e5e5" }} className='p-2'>
              
                <Tooltip title="If the switch is turned on, the added signer will be required to enter their account password to access the document." placement="top-start"><label className='text-dark m-2' style={{ fontSize: '12.5px', }}> <i className="fas fa-shield-alt mx-1" style={{ color: "#1C4690" }}></i> Verify account? </label></Tooltip>

                <Switch
                  checked={checked3}
                  onChange={changeForm3}
                  inputProps={{ 'aria-label': 'controlled' }}
                />

                <Tooltip title="If the switch is turned on, the added signer will be requested enter an otp received on the provided phone number to access the document." placement="top-start"><label className=' m-1 text-dark m-2' style={{ fontSize: '12.5px', }}><i className="fas fa-key mx-1" style={{ color: "#1C4690" }}></i> Verify via sms OTP? </label></Tooltip>
                <Switch
                  checked={checked}
                  onChange={changeForm}
                  inputProps={{ 'aria-label': 'controlled' }}
                />

                {checked.toString() === "true" ?

                  <>
                    {/* < input className="form-control form-control-sm" type="phone" id="phone" name='phone' pattern='[0]{1}[1-7]{1}[0-9]{2}[0-9]{3}[0-9]{3}' placeholder='e.g. 07xx xxx xxx' required />   */}
                    <div className='input-group'>

                      <select className="form-control form-control-sm" id="phoneCode" name='phoneCode'>
                        <option value="+254">Kenya (+254)</option>
                        {jsonPhoneCodesData.map((item, index) =>
                          <option key={index} value={item.dial_code}>{item.name}  ({item.dial_code})</option>
                        )}
                      </select>
                      {/* <input
                        type="tel"
                        style={{ width: '80px' }}
                        className="form-control form-control-sm"
                        maxLength={15} // Adjust maximum length as needed
                        id="phoneNumber"
                        name='phoneNumber'
                        placeholder="Phone e.g 722XXXXXX"
                        pattern="[1-9][0-9]*" // Pattern to ensure the first number is not zero
                        title="Please enter a valid phone number" // Optional: Error message for invalid pattern
                      /> */}
                      <input
                        type="tel"
                        style={{ width: '80px' }}
                        className="form-control form-control-sm"
                        maxLength={15} // Adjust maximum length as needed
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Phone e.g. 722XXXXXX"
                        pattern="[1-9][0-9]{6,14}" // Ensures the first digit is not zero and allows for 7 to 15 digits
                        title="Please enter a valid phone number without the country code" // Optional: Error message for invalid pattern
                      />

                    </div>

                  </>

                  :

                  <></>
                }
              </div>
              <label className='mt-3  text-white' style={{ fontSize: '12px', }}><i className="fas fa-envelope mx-1" ></i >Add new signer's email * :</label>
              <div className='input-group '>
                <input className=' form-control form-control-sm ' type="email" id="to" name="to" placeholder='e.g example@gmail.com' required />
                <button type='submit' className='btn btn-primary' disabled={false}> <i className="fas fa-plus-circle"></i> <small>Add Signer</small></button>
              </div>




            </form>

            <div className='row d-flex justify-content-center my-2'>

              <ButtonComponent cssClass='e-custom-warning' onClick={handleClose2} style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '14px', width: "50%" }} className='m-2 p-2' disabled={false}>  Cancel/ Back home</ButtonComponent>

            </div>




          </div>
          <div className='col-md-12 col-lg-7 shadow-lg text-center ' id='maillist'>

          
            <span style={{ height: 'auto', maxHeight: '160px', overflow: 'auto', }} className=" bg-white text-center">
              {signers.length < 1 ?
                <>

                  <div className="row d-flex justify-content-center mt-5">


                    <div className="col-md-6">

                      <h6 className='mt-2  mb-4' style={textcolor}><i className="fas fa-envelope-open-text mx-1"></i> No signers added</h6>

                    </div>


                  </div>

                </>
                :

                <>
                  <br />
                  {workflow ?
                    <>
                      <h6 className='mt-2  mb-4' style={textcolor}>Selected Workflow - {selectedworkflowtitle}</h6>

                    </>
                    : <></>}

                  {signers.length > 0 ? (
                    <>
                      <h6 className='mt-2  mb-4' style={textcolor}><i className="fas fa-users mx-1"></i> Signers ( <small>{signers.length}</small> )</h6>
                    </>
                  ) : (
                    <>
                    </>
                  )}

                  <ul style={{ listStyle: 'none', height: '20vh', overflowY: 'scroll' }} className='mt-4'>


                  <Alerts alertseverity={alertseverity} alertmsg={alertmsg} openalert={openalert} setOpenAlert={setOpenAlert} />
                    {signers.map((item, index) => (
                      <li key={index} >
                        <small className='  btn  m-1 shadow-lg' style={{ fontSize: '12.5px', borderRadius: '25px', backgroundColor: 'white' }}><i className="fas fa-user-circle m-1" style={textcolor}></i>  <small className='mx-1'>{item.email}</small>{item.phone ? <Tooltip title="Otp authentication: True" placement="top-start"><i className="fas fa-mobile text-primary mx-1"></i> <small>{item.phone}</small></Tooltip> : <></>}{item.authenticate ? <Tooltip title="Authenticate user via account: True" placement="top-start"><i className='fas fa-user-shield mx-1 text-primary'></i></Tooltip> : <></>} <span className='text-danger ' > <i className='fas fa-trash-alt mx-2' onClick={e => removeSigner(e, item.email)}></i></span></small>
                      </li>
                    ))}
                  </ul>
                  {signers.length > 0 ? (
                    <>
                      {!workflow ?
                        <>

                          <div className='input-group mt-4' style={{ backgroundColor: "#e5e5e5" }}>
                            <label className=' m-1 text-dark m-2' style={{ fontSize: '12.5px' }}><i className="fas fa-network-wired mx-1" style={{ color: "#1C4690" }}></i> Save as workflow? </label>

                            <Switch
                              checked={checked2}
                              onChange={changeForm2}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
                            {checked2.toString() === "true" ?

                              < input className="form-control form-control-sm" type="text" id="wftitle" placeholder='Type workflow title here' required />

                              :

                              <></>
                            }
                          </div>
                        </>
                        : <></>}




                    </>
                  ) : (
                    <>
                    </>
                  )}
                </>

              }
            </span>

            <div className='row '>

              {signers.length > 0 ? (

                <div className='text-center'>
                  <label className=' m-3' style={{ fontSize: '14px', }}>Assignment Description :</label>
                  <div className='input-group'>
                    <textarea className='form-control form-control-sm' id="ad" name="ad" rows="3" cols="50">
                    </textarea>
                  </div>

                  <div className='my-3 mb-3'>
                    <ButtonComponent
                      cssClass='e-custom-success'
                      className='m-2 p-2'
                      style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                      onClick={sendForSigning}
                      disabled={false}
                    > <i className="fas fa-mail-bulk mx-1" ></i> <span className='mx-2'>Send to Signers</span>
                    </ButtonComponent>

                  </div>



                </div>
              ) : (
                <>
                </>
              )}

            </div>

          </div>


        </div>
      </Dialog>
    </>
  );
}


export default AddSignersDialog

