import React ,{useContext, useState, useEffect}from 'react'
import AuthContext from '../../context/Authcontext'

import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import {useLocation} from 'react-router-dom'

import NewUserDialog from '../../components/NewUserDialog';
import UserUpdateDialog from '../../components/UserUpdateDialog';
import CompanyUpdateDialog from '../../components/CompanyUpdateDialog';
import Alerts from '../../components/Alert';
import ApproveCompanyDialog from '../../components/ApproveCompanyDialog';
import logo from '../../images/techedge.png'
import defaultAvatar from '../../images/default_avatar.png'
import * as constants from '../../components/constants/constants'
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import IndividualAccounts from '../../components/dashboard/IndividualAccounts';
import Users2 from '../../components/Users2';
import Companies2 from '../../components/Companies2';
import NewCompanies2 from '../../components/NewCompanies2';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ResponsiveAppBar from '../../components/navbar/AppBarAdmin';


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

function SuperAdminDashboard() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const[users,setUsers]=useState([])
    const[individualusers,setIndividualUsers]=useState([])

   
    const [opendialognewuser, setOpenDialogNewUser] = useState(false);
    const [opendialogupdatecompany, setOpenDialogUpdateCompany] = useState(false);
    const [opendialogupdateuser, setOpenDialogUpdateUser] = useState(false);
    const [opendialogapprovecompany, setOpenDialogApproveCompany] = useState(false);
    const [company4approval, setCompany4Approval] = useState('');
    const [company4approvalemail, setCompany4ApprovalEmail] = useState('');
    
    
    const[companies,setCompanies]=useState([])
    const[newcompanies,setNewCompanies]=useState([])
    let[currenteditcompany,setCurrentEditCompany]=useState(0)
    let[currenteditcompanyname,setCurrentEditCompanyName]=useState('')
    let[currenteditcompanyemail,setCurrentEditCompanyEmail]=useState('')
    let[currenteditcompanyactive,setCurrentEditCompanyActive]=useState('')
    let[currenteditcompanyapproved,setCurrentEditCompanyApproved]=useState('')
    let[currenteditcompanyapprovedregistereddate,setCurrentEditCompanyRegisteredDate]=useState('')

    let[currentedituser,setCurrentEditUser]=useState(0)
    let[currentedituseremail,setCurrentEditUserEmail]=useState('')
    let[currentedituseractive,setCurrentEditUserActive]=useState('')
    let[currentedituserfirst,setCurrentEditUserFirst]=useState('')
    let[currentedituserlast,setCurrentEditUserLast]=useState('')
    let[currentedituserphone,setCurrentEditUserPhone]=useState('')
    let[currentedituseradmin,setCurrentEditUserAdmin]=useState('')
    let[companylogo,setCompanyLogo]=useState('')

    

    const location = useLocation()
    let {authTokens,logoutUser,user}=useContext(AuthContext)
    let[avatar,setAvatar]=useState('')
    let[openalert,setOpenAlert]=useState(false)
    let[alertseverity,setAlertSeverity]=useState('')
    let [alertmsg,setAlertMsg]=useState('')
      
    let navigate = useNavigate()

    const primaryColor={
        color:'#1C4690'
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
             getUsers()
            setOpenDialogUpdateUser(false);
          }, 4000)
      
        });
    
      }

    
    let getAvatar=()=>{
        var config = {
        method: 'get',
        url: `${constants.devApiBaseUrl}/api/avatar/`,
        headers: {'Authorization': `Bearer ${authTokens.access}` }
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


    let getUsers=async()=>{
        var data = JSON.stringify({
        "company": user.companyid
        });
        
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${constants.devApiBaseUrl}/api/admin/users/`,
            headers: {'Authorization': `Bearer ${authTokens.access} ` },
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

    let getIndividualUsers=async()=>{
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${constants.devApiBaseUrl}/api/individual/users/`,
            headers: {'Authorization': `Bearer ${authTokens.access} ` },
        };
        
        axios(config)
        .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setIndividualUsers(response.data)
        })
        .catch(function (error) {
        // console.log(error);
        });
    }

    let getCompanies=async()=>{
        var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${constants.devApiBaseUrl}/api/approved/companies/`,
        headers: { 
            'Authorization': `Bearer ${authTokens.access} `,
            'Content-Type': 'application/json'
        },
        };
        
        axios(config)
        .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setCompanies(response.data)
        })
        .catch(function (error) {
        // console.log(error);
        });
    }

    let getNewCompanies=async()=>{
        var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${constants.devApiBaseUrl}/api/new/companies/`,
        headers: { 
            'Authorization': `Bearer ${authTokens.access}`,
            'Content-Type': 'application/json'
        },
        };
        
        axios(config)
        .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setNewCompanies(response.data)
        })
        .catch(function (error) {
        // console.log(error);
        });
    }

    let homePage=()=>{
        navigate('/')
    }

    let adminPage=()=>{
        navigate('/admin/dashboard')
    }
  

    useEffect(()=>{
        if (user.is_admin === "True" || user.groups.includes("TechedgeAdmin")){
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
        
        getAvatar()
        getCompanies()
        // getIndividualUsers()
        // getNewCompanies()
        // getUsers()
    }, [])


  return (
   <>
        
        < ApproveCompanyDialog
            getUsers={getUsers} 
            getCompanies={getCompanies}
            getNewCompanies={getNewCompanies}
            setOpenDialogApproveCompany={setOpenDialogApproveCompany}
            opendialogapprovecompany={opendialogapprovecompany} 
            setOpenAlert={setOpenAlert} 
            setAlertMsg={setAlertMsg} 
            setAlertSeverity={setAlertSeverity}
            company4approval={company4approval}
            company4approvalemail={company4approvalemail}
        />

        < NewUserDialog
            user={user} 
            getUsers={getUsers} 
            setOpenDialogNewUser={setOpenDialogNewUser}
            opendialognewuser={opendialognewuser} 
            openalert={openalert} 
            setOpenAlert={setOpenAlert} 
            alertmsg={alertmsg} 
            setAlertMsg={setAlertMsg} 
            alertseverity={alertseverity} 
            setAlertSeverity={setAlertSeverity}
        />

        <UserUpdateDialog
            useradmin={currentedituseradmin}  
            userfirst={currentedituserfirst} 
            userlast={currentedituserlast} 
            userphone={currentedituserphone} 
            userid={currentedituser} 
            useractive={currentedituseractive} 
            user={user} 
            getUsers={getUsers} 
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

        <CompanyUpdateDialog 
            companyregistered={currenteditcompanyapprovedregistereddate} 
            companyapproved={currenteditcompanyapproved} 
            companyname={currenteditcompanyname} 
            companyid={currenteditcompany} 
            companyactive={currenteditcompanyactive} 
            getCompanies={getCompanies}
            getNewCompanies={getNewCompanies}  
            companyemail={currenteditcompanyemail} 
            setOpenDialogUpdateCompany={setOpenDialogUpdateCompany} 
            opendialogupdatecompany={opendialogupdatecompany} 
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
            <div >
                {/* <a href="#Accounts Pending Approval" style={{fontSize:'13px'}}>
                    <i className="fas fa-building sshadow-lg  mx-2" aria-hidden="true"></i>
                    Accounts Pending Approval
                </a> 
                <a href="#Company Accounts"style={{fontSize:'13px'}} >
                    <i className="fas fa-building shadow-lg  mx-2" aria-hidden="true"></i>
                    Company Accounts
                </a> 
                <a href="#Admin Users" style={{fontSize:'13px'}}>
                    <i className="fas fa-users shadow-lg mx-2" aria-hidden="true"></i>
                    Admin Users
                </a>  */}
                
                {user.groups.includes("TechedgeAdmin")?
                <>
                    <a href="#" onClick={homePage} style={{fontSize:'11px'}}>
                    <i className="fas fa-home mx-2 " aria-hidden="true"></i>
                    Home Dashboard
                    
                </a>
                </>:
                <>
                </>}
                {user.is_admin == 'True' || user.is_superadmin == 'True' && user.groups.includes("TechedgeAdmin") ? 
                    <a href="#" onClick={adminPage} style={{fontSize:'11px'}}>
                        <i className="fas fa-user-shield  mx-2 " aria-hidden="true"></i>
                            Admin Dashboard
                        
                    </a>
                    :
                    <>
                    </>
                }
               
                <a href="#" onClick={logoutUser} style={{fontSize:'11px'}} >
                    <i className="fas fa-power-off shadow-lg  mx-2" aria-hidden="true"></i>
                    Sign Out
                </a>
            </div>                
        </aside>
        <main className="main"  >
        <ResponsiveAppBar  user={user}  avatar={avatar}   homePage={homePage}  logoutUser={logoutUser}  />
                <Alerts alertseverity={alertseverity} alertmsg={alertmsg} openalert={openalert} setOpenAlert={setOpenAlert}/>
      
                    <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className='bg-white'>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab style={{textTransform:'none',fontSize:'11px'}} className='shadow-lg' icon={<i className="fas fa-server" style={{textTransform: 'none',fontSize:'15px'}}></i>}  onClick={()=>{getCompanies()}}  label=" Company Accounts " {...a11yProps(0)} />
                            <Tab style={{textTransform:'none',fontSize:'11px'}} icon={<i className="fas fa-users" style={{textTransform: 'none',fontSize:'15px'}}></i>}  onClick={()=>{getUsers()}}  label=" Admin Accounts" {...a11yProps(1)} />
                            <Tab style={{textTransform:'none',fontSize:'11px'}} icon={<i className="fas fa-user" style={{textTransform: 'none',fontSize:'15px'}}></i>}  onClick={()=>{getIndividualUsers()}}  label=" Individual Accounts" {...a11yProps(2)} />
                            <Tab style={{textTransform:'none',fontSize:'11px'}} icon={<i className="fas fa-inbox" style={{textTransform: 'none',fontSize:'15px'}}></i>}  onClick={()=>{getNewCompanies()}}  label=" Pending Approval" {...a11yProps(3)} />
                        
                        </Tabs>
                    </Box>
                     <CustomTabPanel value={value} index={0}>
                        <div  id='Company Accounts'>
                            <h6 className='text-center p-3 card-header'  style={{backgroundColor:'#ffff',fontSize:'12px',borderRadius:'0',borderTop:'none',boxShadow:'0',borderColor:'#e5e5e5'}}> Company Accounts</h6>
                            <Companies2  
                                getCompanies={getCompanies} 
                                setCurrentEditCompany={setCurrentEditCompany} 
                                setCompanies={setCompanies} 
                                setOpenDialogUpdateCompany={setOpenDialogUpdateCompany}
                                setCurrentEditCompanyName={setCurrentEditCompanyName} 
                                setCurrentEditCompanyEmail={setCurrentEditCompanyEmail} 
                                setCurrentEditCompanyActive={setCurrentEditCompanyActive} 
                                setCurrentEditCompanyApproved={setCurrentEditCompanyApproved} 
                                setCurrentEditCompanyRegisteredDate={setCurrentEditCompanyRegisteredDate} 
                                companies={companies}
                            />
                        
                            <br/>
                        
                        </div>

                     </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <div  id='Admin Users'>
     
                            <h6 className='text-center p-3 card-header'  style={{backgroundColor:'#ffff',fontSize:'12px',borderRadius:'0',borderTop:'none',boxShadow:'0',borderColor:'#e5e5e5'}}> Admin Accounts</h6>
                            
                            <Users2 
                                getUser={getUser} 
                                setCurrentEditUserAdmin={setCurrentEditUserAdmin} 
                                setCurrentEditUserPhone={setCurrentEditUserPhone} 
                                setCurrentEditUserLast={setCurrentEditUserLast} 
                                setCurrentEditUserFirst={setCurrentEditUserFirst} 
                                setCurrentEditUser={setCurrentEditUser} 
                                setCurrentEditUserEmail={setCurrentEditUserEmail} 
                                setCurrentEditUserActive={setCurrentEditUserActive} 
                                setOpenDialogUpdateUser={setOpenDialogUpdateUser} 
                                companyid={user.companyid} 
                                getUsers={getUsers} 
                                setUsers={setUsers} 
                                users={users}
                            /> 
                            <br/>
                        
                        </div>
                        
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                         
                        <div  id='Admin Users'>
                     
                        <h6 className='text-center p-3 card-header'  style={{backgroundColor:'#ffff',fontSize:'12px',borderRadius:'0',borderTop:'none',boxShadow:'0',borderColor:'#e5e5e5'}}> Individual Accounts</h6>

                        
                            <IndividualAccounts 
                                getIndividualUsers={getIndividualUsers} 
                                individualusers={individualusers}
                            /> 
                            <br/>
                        
                        </div>
                        
                     </CustomTabPanel>
                      <CustomTabPanel value={value} index={3}>
                        <div  id='Accounts Pending Approval'>

                            <h6 className='text-center p-3 card-header'  style={{backgroundColor:'#ffff',fontSize:'12px',borderRadius:'0',borderTop:'none',boxShadow:'0',borderColor:'#e5e5e5'}}> Accounts Pending Approval</h6>

                            <NewCompanies2  
                                newcompanies={newcompanies}
                                company4approval={company4approval}
                                company4approvalemail={company4approvalemail}
                                setOpenDialogApproveCompany={setOpenDialogApproveCompany}
                                setCompany4Approval={setCompany4Approval}
                                setCompany4ApprovalEmail={setCompany4ApprovalEmail}

                            />
                        
                            <br/>
                            
                        </div>
                        
                     </CustomTabPanel>
                     </Box>
            
               
             
               
               
               
           

        </main>
   </>
  )
}

export default SuperAdminDashboard