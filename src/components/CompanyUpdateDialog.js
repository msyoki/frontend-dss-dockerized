import * as React from 'react';
import {useState, useEffect,useContext} from 'react'
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
import axios from 'axios'
import TitleCase from 'react-title-case';
import AuthContext from '../context/Authcontext'
import * as  constants from '../components/constants/constants'



const CompanyUpdateDialog=(props) =>{

    let {authTokens}=useContext(AuthContext)
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
    const [fullWidth, setFullWidth] = React.useState(true);

    
    

    let navigate = useNavigate();


    const primaryColor={
  
      color:"#174291"
    }

  

  let updateCompany=(e)=>{
    e.preventDefault()

    var FormData = require('form-data');
    var data = new FormData();
    // if(e.target.is_approved.value){
    //   data.append('approved', e.target.is_approved.value)
    // }
    if(e.target.is_active.value){
      data.append('active', e.target.is_active.value)
    }  

    var config = {
    method: 'patch',
    url: `${constants.devApiBaseUrl}/api/company/${props.companyid}`,
    headers: {'Authorization':`Bearer ${authTokens.access}`},
    data : data
    };

    axios(config)
    .then(function (response) {
    props.setOpenAlert(true)
    props.setAlertMsg('updated successfully !!!')
    props.setAlertSeverity('success')
    props.setOpenDialogUpdateCompany(false);
    setTimeout(
    function() {
        props.setOpenAlert(false);
        props.getCompanies()
        props.getNewCompanies()
        props.setOpenDialogUpdateCompany(false);
        document.getElementById('company-update-form').reset()
    }, 2000)
 

    })
    .catch(function (error) {
      props.setOpenAlert(true)
      props.setAlertMsg(`${error.response.data['message']}`)
      props.setAlertSeverity('error')
      setTimeout(
      function() {
          props.setOpenAlert(false);
          props.getCompanies()
          props.getNewCompanies()
          props.setOpenDialogUpdateCompany(false);
      }, 4000)
  
    });

  }

  const handleClose = () => {
    props.setOpenDialogUpdateCompany(false);
  };


  
  return (
    <div >
     
      <Dialog
        // fullWidth={fullWidth}
   
        // fullScreen={fullScreen}
        open={props.opendialogupdatecompany}

        keepMounted
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        // className='App-header'
      >
        <DialogTitle style={{backgroundColor:'#1C4690',fontSize:'16px'}} className='shadow-lg text-white text-center'><i className="fas fa-building m-1"></i> {"Edit Company "} : <small>{props.companyname}  </small>
          
        </DialogTitle>
        <br/>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" >
            <Alerts alertseverity={props.alertseverity} alertmsg={props.alertmsg} openalert={props.openalert} setOpenAlert={props.setOpenAlert}/>  
            <form onSubmit={updateCompany} id='company-update-form'> 
            <div className="form-group">
                <div className="form-group mb-2">
                    <label htmlFor="phone"><small>Active</small></label>
                    <div className="input-group mt-2">
                        <span className="input-group-text" id="basic-addon2">
                            <span className="fas fa-plug" style={primaryColor}></span>
                        </span>
                        <select className='form-control form-control-sm' name="is_active" id="is_active">
                          <option value="" selected>{props.companyactive}</option>
                          {props.companyactive == 'True'?(
                            <>
                              <option value="false">False</option>
                            </>
                          ):(
                            <>
                              <option value="true">True</option>
                            </>
                          )}
                        </select>
                    </div>  
                </div>
                {/* <div className="form-group mb-2">
                    <label htmlFor="phone"><small>Approved</small></label>
                    <div className="input-group mt-2">
                        <span className="input-group-text" id="basic-addon2">
                            <span className="fas fa-plug" style={primaryColor}></span>
                        </span>
                        <select className='form-control form-control-sm' name="is_approved" id="is_approved">
                          <option value="" selected>{props.companyapproved}</option>
                          {props.companyapproved == 'True'?(
                            <>
                              <option value="false">False</option>
                            </>
                          ):(
                            <>
                              <option value="true">True</option>
                            </>
                          )}
                        </select>
                    </div>  
                </div> */}
                <DialogActions>
                <Button onClick={handleClose}>CANCEL</Button>
                <Button type='submit' >SUBMIT</Button>
                </DialogActions>
            </div>
            </form>
      
          </DialogContentText>
        </DialogContent>
    
      </Dialog>
 
    </div>
  );
}


export default  CompanyUpdateDialog