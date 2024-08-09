import  React, { useRef } from 'react';
import {useContext,useState} from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios'
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';
import AuthContext from '../context/Authcontext'
import ConfirmVoid2 from './ConfirmVoid2';
import { useNavigate } from 'react-router-dom';
import {useLocation} from 'react-router-dom'
import Switch from '@mui/material/Switch';
import Alerts from './Alert';
import LoadingMini from './Loading/LoadingMini';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as constants from '../components/constants/constants'


const AddSignersDialog2=(props) =>{
  const selectRef = useRef();

  const [workflow, setWorkflow] = React.useState('');
  const[selectedworkflowtitle,setSelectedWorkflowTitle] = React.useState('');

  let [emailexists,setEmailExists]=useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');

  const textcolor={
      color:'#1C4690'
    }
  const handleClose = () => {
      props.setOpenDialogAddSigners(false);
  };

  let navigate = useNavigate();


  var [signers,setSigners]=useState([])
  let {authTokens,logoutUser,user}=useContext(AuthContext)

  let [checked,setChecked]=useState(false);
  let [checked2,setChecked2]=useState(false);
  let[openalert,setOpenAlert]=useState(false)
  let[alertseverity,setAlertSeverity]=useState('')
  let [alertmsg,setAlertMsg]=useState('')

  let changeForm=(e)=>{
    setChecked(e.target.checked);
    
  }

  let changeForm2=(e)=>{
    setChecked2(e.target.checked);
    
  }
 
  
  let AddWorkflow=(e,selectedValue)=>{
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
        setSigners( signers => [...signers,object])
        // console.log(object);
      }
    }
  }

  

  let addMailList=(e)=>{
    e.preventDefault()
    selectRef.current.value = ''; // Reset the value to empty
    setWorkflow('');
    setSelectedWorkflowTitle('')
    setEmailExists(false)
    var email= document.getElementById('to').value
    // if(document.getElementById('otp').value === 'true' && document.getElementById('phone').value === ''){
    if(checked === true && !e.target.phone.value){
      setOpenAlert(true)
      setAlertMsg('phone number is required for otp')
      setAlertSeverity('error')
      setTimeout(
      function() {
      setOpenAlert(false);
      }, 3000)
    }
    else{
      if(validateEmail(email)){
        // var otp= document.getElementById('otp').value
      
        var otp= checked
        let phone= otp? e.target.phone.value : '';
        
        
        let signer = otp?{
          "email": email,
          "phone": phone
        }:{
          "email": email
        };
  
        if (signers.length < 1){
          // console.log(signers.length)
          setSigners( signers => [...signers,signer])
          document.getElementById('to').value = ''
          // document.getElementById('otp').value = false
          if(checked){
            document.getElementById('phone').value = ''
          }
          setChecked(false)
          
          // document.getElementById('phone').style.display='none '
        
        }
        else{
          var emailexists=false
          signers.forEach(function(item){
            if(item.email == email){
              emailexists=true
            }
          })
          if(emailexists == false){
            setSigners( signers => [...signers,signer])
            document.getElementById('to').value = ''
            if(checked){
                document.getElementById('phone').value = ''
            }
            // document.getElementById('otp').value = false
            setChecked(false)
            // document.getElementById('phone').style.display='none'

            // console.log(signers)
          }
          else{
            setOpenAlert(true)
            setAlertMsg('email already exists, enter another signer or send to signers')
            setAlertSeverity('error')
            setTimeout(
            function() {
            setOpenAlert(false);
            }, 3000)
          
          }
  
        }
    
      }
  
       
      else if(!email){
        setOpenAlert(true)
        setAlertMsg('Email is required')
        setAlertSeverity('error')
        setTimeout(
        function() {
        setOpenAlert(false);
        }, 3000)
       
      }
      
      else{
        setOpenAlert(true)
        setAlertMsg(`email ${email} is invalid, enter a valid email address`)
        setAlertSeverity('error')
        setTimeout(
        function() {
        setOpenAlert(false);
        }, 3000)

      }
    }
  
  }
  let removeSigner=(e,email)=>{
    setSigners(signers.filter(item => item.email !== email));
    if(signers.length === 1){
      selectRef.current.value = ''; // Reset the value to empty
      setWorkflow('');
      setSelectedWorkflowTitle('')
      setChecked2(false)
    }
    // console.log(signers)
    // console.log(signers)
  }
  let validateEmail=(email)=> {
    const res = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
    return res.test(email);
    }

 let handleClose2=()=>{
    props.setOpenDialogAddSigners(false)
    selectRef.current.value = ''; // Reset the value to empty
    setWorkflow('');
    setSelectedWorkflowTitle('')
    setSigners([])
 }


  

 let sendForSigning=(e)=>{
  let assignmentDescription= document.getElementById('ad').value
  
  // if(!assignmentDescription){
  //     setOpenAlert(true)
  //     setAlertMsg('Assignment description is required !')
  //     setAlertSeverity('error')
  //     setTimeout(
  //     function() {
  //     setOpenAlert(false);
  //     }, 3000)
  // }
  if(checked2 === true && document.getElementById('wftitle').value === ''){
    setOpenAlert(true)
    setAlertMsg('new workflow title is required !!!')
    setAlertSeverity('error')
    setTimeout(
    function() {
    setOpenAlert(false);
    }, 3000)
  }
  else{
    function removeExtension(filename) {
      const x = filename.substring(0, filename.lastIndexOf('.')) || filename;
      const y = x.split('_')
      return y[1];
    }

    const filename=props.fileurl
    const newfilename = removeExtension(filename)

    if(!signers){
      setOpenAlert(true)
      setAlertMsg('atleast one signer is required')
      setAlertSeverity('error')
      setTimeout(
      function() {
      setOpenAlert(false);
      }, 3000)
    
    }
    else{
      props.setLoading(true)
      const url = `${constants.devApiBaseUrl}/api/othersignersoncesigned/`;
      if(assignmentDescription){
        var mydata = JSON.stringify({
          "documentid": newfilename,
          "signers": signers,
          "assignmentd":assignmentDescription
        });
      }
      else{
        var mydata = JSON.stringify({
          "documentid": newfilename,
          "signers": signers
        });
      }
      // console.log(mydata)
      // console.log(filename)
      // console.log(signers)
      const config = {
        headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${authTokens.access}`
        },
      };

      axios.post(url, mydata, config)
      .then((response) => {
        if (response.status === 200){
          // console.log(response.data)
          props.setLoading(false)
          navigate('/',{state:{openalert:true,alertmsg:`successfully sent to other signers`,alertseverity:'success'}})
    
        }else if(response.statusText === 'Unauthorized'){
        logoutUser()
        }
        else{
          setOpenAlert(true)
          setAlertMsg('error')
          setAlertSeverity('error')
          setTimeout(
          function() {
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
       
          <div className='row m-0' style={{width:'100%'}} >

            <div className=' shadow-lg col-md-12 col-lg-5 p-3' style={{backgroundColor:'#1C4690',color:'white'}}>
            {/* <p className='text-white text-center  mb-4 '><i className="fas fa-mail-bulk"></i> Request e-signatures </p> */}
            <label className=' my-3 text-white' style={{fontSize:'14px'}}><i className="fas fa-network-wired mx-1"></i> Saved Workflows :</label>
              <div className='bg-white'>
                <FormControl variant="filled" style={{width:"100%"}} >
                  <InputLabel id="demo-simple-select-filled-label" style={{fontSize:"14px",color:"black"}} >Select Worflow</InputLabel>
                  <Select
                    ref={selectRef}
                    labelId="wf"
                    id="wf"
                    value={workflow}
                    onChange={(e) => AddWorkflow(e,e.target.value)} 
                    name="wf" 
                    size="small"
                  
                  >
                    <MenuItem value="" style={{fontSize:"13px"}} >
                      <span style={{color:'#1C4690'}}> {props.workflows?<>Total saved ({props.workflows.length})</>:<>No Results Found</>}</span>
                    </MenuItem>
                    {props.workflows.map((wf)=>(
                              
                      <MenuItem value={wf.id} style={{fontSize:"14px"}}>{wf.title} </MenuItem>
                    ))}
                
                  </Select>
                </FormControl>
              </div>
            
              <p className=' text-white text-center  my-2' style={{fontSize:'13px',fontWeight:'550' }}> OR </p> 
              
              <p className=' text-white text-center my-2' style={{fontSize:'12px', }}>Add email addresses of signers below, one at a time and specify OTP verification for each signer, if checked, specify phone number.</p> 

              <label className=' my-1 text-white' style={{fontSize:'14px', }}><i className="fas fa-envelope mx-1" ></i > Signer's Email :</label>
              <div className='input-group '>
                <input className=' form-control form-control-sm '  type="email" id="to" name="to" placeholder='e.g example@gmail.com' required/> 
            
              </div>
              

              <form onSubmit={addMailList}>
              {/* <div className='input-group mt-4' style={{backgroundColor:"#e5e5e5"}}>
            
            <label className=' m-1 text-dark m-2' style={{fontSize:'12.5px', }}><i className="fas fa-key mx-1" style={{color:"#1C4690"}}></i> Verify via sms OTP? </label>
              <Switch
                checked={checked}
                onChange={changeForm}
                inputProps={{ 'aria-label': 'controlled' }}
              /> 
              {checked.toString() === "true"?
    
                < input className="form-control form-control-sm" type="phone" id="phone" pattern='[0]{1}[1-7]{1}[0-9]{2}[0-9]{3}[0-9]{3}' placeholder='e.g. 07xx xxx xxx' required />  
            
              :
              
                <></>
              } 
            </div> */}
            
            <div className='row d-flex justify-content-center'>
                    <div className='text-center col-7 my-3'>
                    <ButtonComponent cssClass='e-custom-light' type='submit' style={{textTransform: 'none',fontWeight:'lighter',fontSize:'14px',width:"100%"}} className='m-2 p-2'  disabled={false}> <i className="fas fa-plus-circle" ></i> Add Signer</ButtonComponent><br/>
                      <ButtonComponent cssClass='e-custom-warning' onClick={handleClose2} style={{textTransform: 'none',fontWeight:'lighter',fontSize:'14px',width:"100%"}} className='m-2 p-2' disabled={false}>  Cancel/ Back home</ButtonComponent>       
              
                    </div>
                  </div>
              </form>
              
        
            </div>
            <div className='col-md-12 col-lg-7 shadow-lg text-center '  id='maillist'>
            
              <Alerts alertseverity={alertseverity} alertmsg={alertmsg} openalert={openalert} setOpenAlert={setOpenAlert}/>
              <span style={{height:'auto', maxHeight: '160px', overflow: 'auto', }} className=" bg-white text-center">
                {signers.length < 1?
                <>
                
                <div className="row d-flex justify-content-center mt-5">

                      
                      <div className="col-md-6">

                      <h6 className='mt-2  mb-4' style={textcolor}><i className="fas fa-envelope-open-text mx-1"></i> No signers added</h6>

                      </div>
              

                </div>
                
                </>
                :
              
                <>
                  <br/> 
                  {workflow?
                    <>
                      <h6 className='mt-2  mb-4' style={textcolor}>Selected Workflow - {selectedworkflowtitle}</h6>
                    
                    </>
                    :<></>}
                
                  {signers.length > 0?(
                  <>
                    <h6 className='mt-2  mb-4' style={textcolor}><i className="fas fa-users mx-1"></i> Signers ( <small>{signers.length}</small> )</h6>
                  </>
                    ):(
                      <>
                      </>
                    )}

                  <ul  style={{listStyle:'none', height:'30vh',overflowY:'scroll' }} className='mt-4'>
                  
                  
                
                  {signers.map((item,index)=>(
                    <li key={index} >
                     <small className='  btn  m-1 shadow-lg' style={{fontSize:'12.5px', borderRadius:'25px',backgroundColor:'white'}}><i className="fas fa-user-circle m-1" style={textcolor}></i>  <small className='mx-1'>{item.email}</small>{item.phone?  <><i className="fas fa-mobile text-danger mx-1"></i> <small>{item.phone}</small></>:<></>} <span className='text-danger ' > <i className='fas fa-trash-alt mx-2' onClick={e=>removeSigner(e,item.email)}></i></span></small>
                    </li>
                  ))}
                </ul>
                {signers.length > 0?(
                  <>
                  {!workflow?
                  <>
         
                <div className='input-group ' style={{backgroundColor:"#e5e5e5"}}>
                <label className=' m-1 text-dark m-2' style={{fontSize:'12.5px' }}><i className="fas fa-network-wired mx-1" style={{color:"#1C4690"}}></i> Save as workflow? </label>

                  <Switch
                    checked={checked2}
                    onChange={changeForm2}
                    inputProps={{ 'aria-label': 'controlled' }}
                  /> 
                  {checked2.toString() === "true"?

                    < input className="form-control form-control-sm" type="text" id="wftitle"  placeholder='Type workflow title here'  required/> 
                  
                  :
                  
                    <></>
                  } 
                </div>
                  </>
                  :<></>}
                        
                
            
                          
                  </>
                    ):(
                      <>
                      </>
                    )}
                </>
              
                }
              </span>
            
              <div className='row '>
      
                {signers.length > 0?(
                  
                  <div className='text-center'>
                  <label className=' m-3' style={{fontSize:'14px', }}>Assignment Description :</label>
              <div className='input-group'>
                <textarea className='form-control form-control-sm' id="ad" name="ad" rows="3" cols="50">
                </textarea>
              </div>
        
              
                  <div className='mt-3 mb-3'>
                  <ButtonComponent 
                        cssClass='e-custom-success' 
                        className='m-2 p-2' 
                        style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
                        onClick={sendForSigning}
                        disabled={false} 
                        > <i className="fas fa-mail-bulk mx-1" ></i> <span className='mx-2'>Send to Signers</span>  
                      </ButtonComponent>
                    </div>
                    
            
                  
                  </div>
                ):(
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


export default  AddSignersDialog2

