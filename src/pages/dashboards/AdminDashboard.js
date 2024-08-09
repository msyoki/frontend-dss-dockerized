import React ,{useContext, useState, useEffect,useMemo}from 'react'
import '../../styles/Dashboard.css'
import AuthContext from '../../context/Authcontext'

import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import {useLocation} from 'react-router-dom'


import NewUserDialog from '../../components/NewUserDialog';
import UserUpdateDialog from '../../components/UserUpdateDialog';
import Alerts from '../../components/Alert';
import Logs2 from '../../components/Logs2';
import ResponsiveAppBar from '../../components/navbar/AppBarAdmin';
import logo from '../../images/techedge.png'
import defaultAvatar from '../../images/default_avatar.png'
import Users2 from '../../components/Users2';
import DocLogs2 from '../../components/DocLogs2';

import CompanyEdits from '../../components/CompanyEdits';
import * as constants from "../../components/constants/constants"
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';


import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';

import   InputRightElement from '@mui/material';

import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingMini from '../../components/Loading/LoadingMini';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
function AdminDashboard() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };
   
    const [opendialognewuser, setOpenDialogNewUser] = useState(false);
    const [opendialogupdateuser, setOpenDialogUpdateUser] = useState(false);
    const[users,setUsers]=useState([])
    let[currentedituser,setCurrentEditUser]=useState(0)
    let[currentedituseremail,setCurrentEditUserEmail]=useState('')
    let[currentedituseractive,setCurrentEditUserActive]=useState('')
    let[currentedituserfirst,setCurrentEditUserFirst]=useState('')
    let[currentedituserlast,setCurrentEditUserLast]=useState('')
    let[currentedituserphone,setCurrentEditUserPhone]=useState('')
    let[currentedituseradmin,setCurrentEditUserAdmin]=useState('')
    let[loading,setLoading]=useState(false)
   
    let[opendialogcompanyedits,setOpenDialogCompanyEdits]=useState(false)
    const location = useLocation()
    let {authTokens,logoutUser,user,updateToken}=useContext(AuthContext)
    let[avatar,setAvatar]=useState('')
    let[openalert,setOpenAlert]=useState(false)
    let[alertseverity,setAlertSeverity]=useState('')
    let [alertmsg,setAlertMsg]=useState('')
    let[companylogs,setCompanyLogs]=useState([]) 
    let[companydocs,setCompanyDocs]=useState([])
    let[companylogo,setCompanyLogo]=useState('')
    let [smtpconfigs,setSMTPConfigs]=useState({})

    
    const [formData, setFormData] = useState({
        smtpPort: '',
        smtpHost: '',
        smtpUsername: '',
        smtpPassword: '',
    });
      
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const saveSettings = async (e) => {
        e.preventDefault();
        setLoading(true)
        let data = JSON.stringify({
            ...(formData.smtpPort !== '' && { "port": `${formData.smtpPort}`}),
            ...(formData.smtpHost !== '' && { "url": `${formData.smtpHost}` }),
            ...(formData.smtpUsername !== '' && { "username": `${formData.smtpUsername}` }),
            ...(formData.smtpDisplayName !== '' && { "display_name": `${formData.smtpDisplayName}` }),
            ...(formData.smtpPassword !== '' && { "password": `${formData.smtpPassword}` }),
        });

        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url:    `${constants.devApiBaseUrl}/api/update/smtp/configs/ `,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${authTokens.access}`
        },
        data : data
        };

        axios.request(config)
        .then((response) => {
    
        getSmtpConfigs()
        })
        .catch((error) => {
        console.log(error);
        });

    };

    let getSmtpConfigs =async () => {
        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${constants.devApiBaseUrl}/api/get/smtp/configs/`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${authTokens.access}`
        },
        };

        await axios.request(config)
        .then((response) => {
        setLoading(false)
   
        setSMTPConfigs(response.data)
        })
        .catch((error) => {
        console.log(error);
        });

    };



    let navigate = useNavigate()


    const primaryColor={
        color:'#1C4690'
    }

    
    let getCompanyLogo=()=>{
        var config = {
        method: 'get',
        url: `${constants.devApiBaseUrl}/api/logo/`,
        headers: {'Authorization': `Bearer ${authTokens.access} ` }
        };

        axios(config)
        .then(function (response) {
        // console.log(response.data)
        let url=`${constants.devApiBaseUrl}${response.data['logo_url']}`
        setCompanyLogo(url)
        // console.log(url);
        })
        .catch(function (error) {
        // console.log(error);
        });

    }

  

    
    let getUser=()=>{
        var config = {
        method: 'get',
        url: `${constants.devApiBaseUrl}/api/user/${currentedituser}`,
        headers: {'Authorization': `Bearer ${authTokens.access} ` }
        };
    
        axios(config)
        .then(function (response) {

        setCurrentEditUserEmail(response.data['email'])
        setCurrentEditUserLast(response.data['last_name'])
        setCurrentEditUserFirst(response.data['first_name'])
        setCurrentEditUserPhone(response.data['phone'])
        setCurrentEditUserActive(`${response.data['is_active']}`)
        setCurrentEditUserAdmin(`${response.data['is_admin']}`)
        setOpenDialogUpdateUser(true)
  
        })
        .catch(function (error) {
          setOpenAlert(true)
          setAlertMsg(`${error.response.data['message']}`)
          setAlertSeverity('error')
          setTimeout(
          function() {
             setOpenAlert(false);
             getusers()
            setOpenDialogUpdateUser(false);
          }, 4000)
      
        });
    
      }

    let newUser=()=>{
        setOpenDialogNewUser(true)
    }
    
    let getAvatar=()=>{
        var config = {
        method: 'get',
        url: `${constants.devApiBaseUrl}/api/avatar/`,
        headers: {'Authorization': `Bearer ${authTokens.access}` },
        };

        axios(config)
        .then(function (response) {
        // setAvatar(response.data)
        let url=`${constants.devApiBaseUrl}${response.data['avatar_url']}`
        setAvatar(url)
        // console.log(url);
        })
        .catch(function (error) {
        // console.log(error);
        });

    }

    let getDocLogs=()=>{
    
        setValue(1)
        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${constants.devApiBaseUrl}/api/doc/logs/`,
        headers: {'Authorization': `Bearer ${authTokens.access} ` }
        };
    
        axios.request(config)
        .then((response) => {
        // console.log(JSON.stringify(response.data));
        setCompanyDocs(response.data)
        })
        .catch((error) => {
        // console.log(error);
        });

    }

    let homePage=()=>{
        navigate('/')
    }

    let getlogs=()=>{
        setValue(2)
        var admin_email=user.email
        var admin_ind=admin_email.indexOf("@");
        var admin_domain=admin_email.slice((admin_ind+1),admin_email.length);
    

    
        let data = JSON.stringify({
        "domain": admin_domain
        });

        let config = {
        method: 'post',
        url: `${constants.devApiBaseUrl}/api/logs/`,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios.request(config)
        .then((response) => {
            // console.log(JSON.stringify(response.data));
            setCompanyLogs(response.data)
        })
        .catch((error) => {
            // console.log(error);
        });

    }
    let getusers=async()=>{
        setValue(0)
        var data = JSON.stringify({
        "company": user.companyid
        });
        
        var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${constants.devApiBaseUrl}/api/users/`,
        headers: {
            'Authorization': `Bearer ${authTokens.access} `,
            'Content-Type': 'application/json'
        },
        data : data
        };
        
        axios(config)
        .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setUsers(response.data)
        })
        .catch(function (error) {
        // console.log(error);
        });
    }


    let showUsers=()=>{
        document.getElementById('companyUsers').style.display='block'
        document.getElementById('companyDocuments').style.display='none'
        document.getElementById('userLogs').style.display='none'
    }

    let showDocuments=()=>{
        document.getElementById('companyUsers').style.display='none'
        document.getElementById('companyDocuments').style.display='block'
        document.getElementById('userLogs').style.display='none'
    }

    let showLogs=()=>{
        document.getElementById('companyUsers').style.display='none'
        document.getElementById('companyDocuments').style.display='none'
        document.getElementById('userLogs').style.display='block'
    }
    let sadminPage=()=>{
        navigate('/super/admin/dashboard')
    }
   

    useEffect(()=>{
        getSmtpConfigs()
        getDocLogs()
        getlogs()
        getusers()
        getAvatar()
        getCompanyLogo()
        if(user.is_admin == "True"){
        }
        else{
            navigate('/')
        }


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
            
            <CompanyEdits getCompanyLogo={getCompanyLogo} setCompanyLogo={setCompanyLogo}   companylogo={companylogo}  opendialogcompanyedits={opendialogcompanyedits}  setOpenDialogCompanyEdits={setOpenDialogCompanyEdits}/>
            <NewUserDialog 
                user={user} 
                getusers={getusers} 
                setOpenDialogNewUser={setOpenDialogNewUser}
                opendialognewuser={opendialognewuser} 
                openalert={openalert} 
                setOpenAlert={setOpenAlert} 
                alertmsg={alertmsg} 
                setAlertMsg={setAlertMsg} 
                alertseverity={alertseverity} 
                setAlertSeverity={setAlertSeverity}
                authTokens={authTokens}
               
            />

            <UserUpdateDialog 
                useradmin={currentedituseradmin}  
                userfirst={currentedituserfirst} 
                userlast={currentedituserlast} 
                userphone={currentedituserphone} 
                userid={currentedituser} 
                useractive={currentedituseractive} 
                user={user} 
                getusers={getusers} 
                useremail={currentedituseremail} 
                setOpenDialogUpdateUser={setOpenDialogUpdateUser} 
                opendialogupdateuser={opendialogupdateuser} 
                openalert={openalert} 
                setOpenAlert={setOpenAlert} 
                alertmsg={alertmsg} 
                setAlertMsg={setAlertMsg} 
                alertseverity={alertseverity} 
                setAlertSeverity={setAlertSeverity}
            />

      
        <aside className='aside shadow-lg'>
          
            {companylogo?<>
                <div className='d-flex justify-content-center m-0 bg-white p-2 ' >
                    <img src={companylogo} alt='Organization logo' width='55%'  />
        
                </div>
            </>:<>
                <div className='d-flex justify-content-center m-0 bg-white p-2' >
                    <img src={logo} alt='Organization logo' width='55%'  />
        
                </div>

            </>}
         
         
           

            {avatar?<>
                <div className='d-flex justify-content-center  p-2' style={{backgroundColor:'#fff'}}>

                <Stack direction="row" spacing={3}>
                  
                  <Avatar
                      alt={`${user.first_name} ${user.last_name}`}
                      src={avatar}
                      sx={{ width: 55, height: 55 }}
                      className='shadow-lg bg-secondary'
                  />
                   <br/><br/>
                </Stack>
             
                </div>
              
            </>:<>
                <div className='d-flex justify-content-center p-2 ' style={{backgroundColor:'#fff'}}>

                <Stack direction="row" spacing={3}>
                  
                  <Avatar
                      alt={`${user.first_name} ${user.last_name}`}
                      src={defaultAvatar}
                      sx={{ width: 55, height: 55 }}
                      className='shadow-lg bg-secondary'
                  />
                   <br/><br/>
                </Stack>
    
                </div>
               
            </>}

  
            <div className='text-center mt-0 mb-0 p-2 shadow-lg'  >
                <span className='mr-3' style={{fontSize:'13px'}}>{user.first_name} {user.last_name}  </span> 
            </div>
            <p className=' p-2 text-center shadow-lg mb-0'>
               <small style={{fontSize:'10px'}}> ADMIN ACCOUNT</small>
               <br/>
               <small style={{fontSize:'10px'}}>( {user.email} )</small>
            </p>

            <div>
            <a href="#" onClick={homePage} style={{fontSize:'11px'}}>
                    <i className="fas fa-home mx-2  " aria-hidden="true"></i>
                    Home Dashboard
                    
                </a>
                <a href="#" onClick={newUser} style={{fontSize:'11px'}}>
                    <i className="fas fa-user-plus  shadow-lg  mx-2" aria-hidden="true"></i>
                    Create Account
                </a>
      
            
             
                {user.groups.includes("TechedgeAdmin")?
                <>
                    <a href="#" onClick={sadminPage} style={{fontSize:'11px'}}>
                    <i className="fas fa-user-shield  mx-2 " aria-hidden="true"></i>
                     SuperAdmin Dashboard
                    
                </a>
                </>:
                <>
                </>}
                <a href="#" onClick={()=>setOpenDialogCompanyEdits(true)} style={{fontSize:'11px'}}>
                    <i className="fas fa-cog  shadow-lg  mx-2 " aria-hidden="true"></i>
                    Change Organization Logo
                </a>
             
        

                <a href="#" onClick={logoutUser} style={{fontSize:'11px'}} >
                    <i className="fas fa-power-off shadow-lg mx-2 " aria-hidden="true"></i>
                    Sign Out
                </a>
            </div>
            <br/>
           
        </aside>
       
                 
               
  
        <main className="main " >
            <ResponsiveAppBar  user={user}  avatar={avatar}  showDocuments={showDocuments} showLogs={showLogs} showUsers={showUsers} homePage={homePage}  logoutUser={logoutUser}  setOpenDialogCompanyEdits={setOpenDialogCompanyEdits}  sadminPage={sadminPage} />
            <Alerts alertseverity={alertseverity} alertmsg={alertmsg} openalert={openalert} setOpenAlert={setOpenAlert}/>      
            <Box sx={{ width: '100%' }}>
                <Box sx={{  borderColor: 'divider',backgroundColor:'#ffff' }} >
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab style={{textTransform:'none',fontSize:'11px'}} className='shadow-lg' icon={<i className="fas fa-user" style={{textTransform: 'none',fontSize:'15px'}}></i>}  onClick={()=>{getusers()}} label="Accounts" {...a11yProps(0)} />
                        <Tab style={{textTransform:'none',fontSize:'11px'}} icon={<i className="fas fa-folder-open" style={{textTransform: 'none',fontSize:'15px'}}></i>}  onClick={()=>{getDocLogs()}} label="Documents" {...a11yProps(1)} />
                        <Tab style={{textTransform:'none',fontSize:'11px'}} icon={<i className="fas fa-list" style={{textTransform: 'none',fontSize:'15px'}}></i>}  onClick={()=>{getlogs()}}  label="Account Logs" {...a11yProps(2)} />    
                        <Tab style={{textTransform:'none',fontSize:'11px'}} icon={<i className="fas fa-envelope-open-text" style={{textTransform: 'none',fontSize:'15px'}}></i>}  label='Mailer Settings' {...a11yProps(3)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0} >
                    
                    <div  id='companyUsers'>
        
                        <h6 className='text-center p-3 card-header'  style={{backgroundColor:'#ffff',fontSize:'12px',borderRadius:'0',borderTop:'none',boxShadow:'0',borderColor:'#e5e5e5'}}> Users Accounts</h6>

                        <Users2 
                            getUser={getUser} 
                            newUser={newUser}
                            setCurrentEditUserAdmin={setCurrentEditUserAdmin} 
                            setCurrentEditUserPhone={setCurrentEditUserPhone} 
                            setCurrentEditUserLast={setCurrentEditUserLast} 
                            setCurrentEditUserFirst={setCurrentEditUserFirst} 
                            setCurrentEditUser={setCurrentEditUser} 
                            setCurrentEditUserEmail={setCurrentEditUserEmail} 
                            setCurrentEditUserActive={setCurrentEditUserActive} 
                            setOpenDialogUpdateUser={setOpenDialogUpdateUser} 
                            companyid={user.companyid} 
                            getusers={getusers} 
                            setUsers={setUsers} 
                            users={users}
                            />

                        
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    
                <div  id='companyDocuments'>
                        
                        <h6 className='text-center p-3 card-header text-dark'  style={{backgroundColor:'#ffff',fontSize:'12px',borderRadius:'0',borderTop:'none',boxShadow:'0',borderColor:'#e5e5e5'}}> Document Logs</h6>
                    
                        <DocLogs2 
                            companydocs={companydocs}
                        />

                    
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                <div  id='userLogs'>
                        
                        <h6 className='text-center p-3 card-header text-dark'  style={{backgroundColor:'#ffff',fontSize:'12px',borderRadius:'0',borderTop:'none',boxShadow:'0',borderColor:'#e5e5e5'}}> Activity Logs</h6>
                    
                        <Logs2
                            logs={companylogs}
                        />
                    
                        
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                <div  id='SMT Settings'  >
                        
                        <h6 className=' p-3 card-header text-dark text-center '  style={{backgroundColor:'#ffff',fontSize:'12px',borderRadius:'0',borderTop:'none',boxShadow:'0',borderColor:'#e5e5e5'}}> SMTP Settings </h6>
                        
                        <div className='bg-light '>
                            <form onSubmit={saveSettings} autoComplete="off">
                                <div className='row '>
                                <div className='col-lg-1 col-md-1 col-sm-12'> </div>
                            
                               
                                    <div className='col-lg-5 col-md-5 col-sm-12'>
                                    <div className="form-group card p-4">
                                        {loading?<LoadingMini/>:
                                            <>
                                                <h6 className=' p-3 card-header text-dark text-center'  style={{backgroundColor:'#ffff',fontSize:'12px',borderRadius:'0',borderTop:'none',boxShadow:'0',borderColor:'#e5e5e5'}}>Current Configurations </h6>
                                                
                                                <label htmlFor="smtpPort"><small style={{ fontSize: '12px' }}>SMTP Port  <span className='text-muted'>: {smtpconfigs.port} </span></small></label>
                                        
                                                <label htmlFor="smtpHost"><small style={{ fontSize: '12px' }}>SMTP Host <span className='text-muted'>: {smtpconfigs.url} </span></small></label>
                                            

                                                <label htmlFor="smtpUsername"><small style={{ fontSize: '12px' }}>SMTP Username <span className='text-muted'>: {smtpconfigs.username} </span></small></label>
                                                <label htmlFor="smtpDisplayName"><small style={{ fontSize: '12px' }}>SMTP Mail From <span className='text-muted'>: {smtpconfigs.display_name} </span></small></label>
                                            

                                                <div className='input-group mt-2'>
                                                    <label htmlFor="smtpPassword"><small style={{ fontSize: '12px' }}>SMTP Password <span className='text-muted'>:<TextField
                                                        disabled
                                                        fullWidth
                                                        style={{ fontSize: '12px' }}
                                                        variant="standard"
                                                        type={showPassword ? 'text' : 'password'}
                                                        InputProps={{
                                                            endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={handleTogglePassword} edge="end" style={{fontSize:'10px'}}>
                                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                            ),
                                                        }}
                                                        value={smtpconfigs.password}
                                                        autoComplete="off"
                                                        onChange={handleInputChange}
                                                        /></span></small></label>
                                                    
                                                </div>
                                            </>
                                        }
                                    </div>
                               
                                    </div>
                                    <div className='col-lg-5 col-md-5 col-sm-12'>
                                   
                                    <h6 className=' bg-light card-header text-dark text-center mb-2'  style={{backgroundColor:'#ffff',fontSize:'12px',borderRadius:'0',borderTop:'none',boxShadow:'0',borderColor:'#e5e5e5'}}>Update Form </h6>
                        
                                    <div className="form-group ">
                                        <label htmlFor="smtpPort"><small style={{ fontSize: '12px' }}>SMTP Port </small></label>
                                        <div className="input-group mt-2">
                                        <FormControl variant="standard" fullWidth>
                                            <Input
                                            style={{ fontSize: '12px' }}
                                            id="smtpPort"
                                            name="smtpPort"
                                            placeholder='Enter new SMTP port'
                                            type='number'
                                            autoComplete="off"
                                            onChange={handleInputChange}
                                            />
                                        </FormControl>
                                        </div>

                                        <label htmlFor="smtpHost"><small style={{ fontSize: '12px' }}>SMTP Host </small></label>
                                        <div className="input-group mt-2">
                                        <FormControl variant="standard" fullWidth>
                                            <Input
                                            style={{ fontSize: '12px' }}
                                            id="smtpHost"
                                            name="smtpHost"
                                            placeholder='Enter new SMTP host'
                                            type='text'
                                            autoComplete="off"
                                            onChange={handleInputChange}
                                            />
                                        </FormControl>
                                        </div>

                                        <label htmlFor="smtpUsername"><small style={{ fontSize: '12px' }}>SMTP Username </small></label>
                                        <div className="input-group mt-2">
                                        <FormControl variant="standard" fullWidth>
                                            <Input
                                            style={{ fontSize: '12px' }}
                                            id="smtpUsername"
                                            name="smtpUsername"
                                            placeholder='Enter new SMTP username'
                                            type='email'
                                            autoComplete="off"
                                            onChange={handleInputChange}
                                            />
                                        </FormControl>
                                        </div>
                                        <label htmlFor="smtpDisplayname"><small style={{ fontSize: '12px' }}>SMTP Mail From </small></label>
                                        <div className="input-group mt-2">
                                        <FormControl variant="standard" fullWidth>
                                            <Input
                                            style={{ fontSize: '12px' }}
                                            id="smtpDisplayName"
                                            name="smtpDisplayName"
                                            placeholder='Enter new SMTP display name'
                                            type='text'
                                            autoComplete="off"
                                            onChange={handleInputChange}
                                            />
                                        </FormControl>
                                        </div>

                                        <label htmlFor="smtpPassword"><small style={{ fontSize: '12px' }}>SMTP Password </small></label>
                                        <div className="input-group mt-2">
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                            fullWidth
                                            style={{ fontSize: '12px' }}
                                            variant="standard"
                                            type={showPassword ? 'text' : 'password'}
                                            // InputProps={{
                                            //     endAdornment: (
                                            //     <InputAdornment position="end">
                                            //         <IconButton onClick={handleTogglePassword} edge="end">
                                            //         {showPassword ? <Visibility /> : <VisibilityOff />}
                                            //         </IconButton>
                                            //     </InputAdornment>
                                            //     ),
                                            // }}
                                            id="smtpPassword"
                                            name="smtpPassword"
                                            autoComplete="off"
                                            onChange={handleInputChange}
                                            />
                                        </FormControl>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="text-center mt-2 pt-2 mb-4 ">
                            
                                        <ButtonComponent  
                                            cssClass='e-custom-primary' 
                                            className='m-2 p-2' 
                                            style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
                                            disabled={false} 
                                            type='submit'
                                            > <span className='mx-2'> Update Settings</span> </ButtonComponent>
                                    
                                        </div>
                                    </div>
                                    </div>
                                    <div className='col-lg-1 col-md-2 col-sm-12'> </div>
                                </div>
                            </form>
                        </div>
                        
                    </div>
                </CustomTabPanel>
            </Box>
        </main>
   </>
  )
}

export default AdminDashboard