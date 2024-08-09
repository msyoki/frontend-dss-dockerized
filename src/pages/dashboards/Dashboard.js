import React, { useContext, useState, useEffect } from 'react'
import '../../styles/Dashboard.css'
import AuthContext from '../../context/Authcontext'
import FileUpload from '../../components/FileUpload'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import LoadingMini from '../../components/Loading/LoadingMini'
import Switch from '@mui/material/Switch';
import Alerts from '../../components/Alert'
import PreviewerDialog from '../../components/PreviewerDialog'
import MyUploads2 from '../../components/dashboard/MyUploads'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import ResponsiveAppBar2 from '../../components/navbar/AppbarHome'
import CommentsDialog from '../../components/CommentsDialog'
import AddSignersDialog from '../../components/AddSignersDialog'
import Loading from '../../components/Loading/Loading'
import logo from '../../images/techedge.png'
import Complete2 from '../../components/dashboard/Complete'
import Inbox2 from '../../components/dashboard/Inbox'
import Voided2 from '../../components/dashboard/Voided'
import Outbox2 from '../../components/dashboard/Outbox'
import defaultAvatar from '../../images/default_avatar.png'
import * as constants from "../../components/constants/constants"
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/AssignmentInd';
import PhoneIcon from '@mui/icons-material/ContactPhone';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Trashed from '../../components/dashboard/Trashed'
import { Margin } from '@mui/icons-material'

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


function Dashboard() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [activeLink, setActiveLink] = useState('inbox'); // Initialize the active link state


    const location = useLocation()
    let { authTokens, logoutUser, user } = useContext(AuthContext)
    let [opendialogaddsigners, setOpenDialogAddSigners] = useState(false);
    let [signeruid, setSignerUid] = useState('')
    let [trashed, setTrashed] = useState([])
    let [myuploads, setMyUploads] = useState([])
    let [inbox, setInbox] = useState([])
    let [outbox, setOutbox] = useState([])
    let [complete, setComplete] = useState([])
    let [voided, setVoided] = useState([])
    let [count, setCount] = useState(null)
    let [avatar, setAvatar] = useState('')
    let [avatarfile, setAvatarFile] = useState()
    let [uploadedfile, setUploadedFile] = useState('')
    let [loading, setLoading] = useState(false)
    let [loadingmini, setLoadingMini] = useState(false)
    let [openalert, setOpenAlert] = useState(false)
    let [alertseverity, setAlertSeverity] = useState('info')
    let [alertmsg, setAlertMsg] = useState('')
    let [openpreviewerdialog, setOpenPreviewerDialog] = useState(false)

    let [filepreviewurl, setFilePreviewUrl] = useState('')
    let [previewComplete, setPreviewComplete] = useState(false)
    let [filepreviewtitle, setFilePreviewTitle] = useState('')
    let [opendialogcomments, setOpenDialogComments] = useState(false)
    let [comments, setComments] = useState([])
    let [ccdocguid, setCCDocGuid] = useState('')
    let [ccdoctitle, setCCDocTitle] = useState('')
    let [uploadedfileurl, setUploadedFileUrl] = useState('')
    let [signers, setSigners] = useState([])
    let [doccreated, setDocCreated] = useState('')
    let [docowner, setDocOwner] = useState('')
    let [assdescription, setDocAssdescription] = useState('')
    let [checked, setChecked] = useState(false);
    let [workflows, setWorkflows] = useState([])
    let [companylogo, setCompanyLogo] = useState('')
    let [jsonPhoneCodesData, setJsonPhoneCodesData] = useState([])

    const [isOnline, setIsOnline] = useState(window.navigator.onLine);
    const [color, setColor] = useState(isOnline ? 'red' : 'green');



    let changeSavedSwitch = (e) => {
        setChecked(e.target.checked);

    }


    let navigate = useNavigate()
    var fileurl = "";

    let [file, setFile] = useState()
    let getWorkflows = () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${constants.devApiBaseUrl}/api/workflows/`,
            headers: { 'Authorization': `Bearer ${authTokens.access}` }
        };

        axios.request(config)
            .then((response) => {
                // // console.log(JSON.stringify(response.data));
                setWorkflows(response.data)
            })
            .catch((error) => {
                // // console.log(error);
            });

    }

    let sendUploadForSigning = (guid) => {

        getWorkflows()
        setUploadedFileUrl(guid)

        setOpenDialogAddSigners(true)

    }
    let updateUser = (e) => {
        e.preventDefault()

        var FormData = require('form-data');
        var data = new FormData();
        if (avatarfile) {
            data.append('avatar', avatarfile);
            data.append('fileName', avatarfile.name);
        }
        if (e.target.first_name.value) {
            data.append('first_name', e.target.first_name.value)
        }
        if (e.target.last_name.value) {
            data.append('last_name', e.target.last_name.value)
        }
        if (e.target.phone.value) {
            data.append('phone', e.target.phone.value)
        }
        data.append('mailtoall', checked)
        var config = {
            method: 'patch',
            url: `${constants.devApiBaseUrl}/api/user/${user.id}`,
            headers: { 'Authorization': `Bearer ${authTokens.access} ` },
            data: data
        };

        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                // console.log(response.data['first_name'])
                setAvatar(response.data['avatar'])
                document.getElementById('profile-content').style.display = 'none';
                if (uploadedfile) {
                    document.getElementById('sign-type').style.display = 'block';
                }
                else {
                    document.getElementById('file-upload-form').style.display = 'block';
                }
                setOpenAlert(true)
                setAlertMsg('Profile updated, effective on next login')
                setAlertSeverity('success')
                setTimeout(
                    function () {
                        setOpenAlert(false);
                    }, 2000)

            })
            .catch(function (error) {
                console.log(error);
            });

    }

    let getCompanyLogo = () => {
        var config = {
            method: 'get',
            url: `${constants.devApiBaseUrl}/api/logo/`,
            headers: { 'Authorization': `Bearer ${authTokens.access} ` }
        };

        axios(config)
            .then(function (response) {
                // // console.log(response.data)
                let url = `${constants.devApiBaseUrl}${response.data['logo_url']}`
                setCompanyLogo(url)
                // // console.log(url);
            })
            .catch(function (error) {
                // // console.log(error);
            });

    }


    const previewFile = async (guid, signedStatus, voidedStatus, title) => {

        // Fetch comments and signer UID asynchronously
        getComments(guid, title);
        getSignerUid(guid);

        // Fetch user IP and log the activity


        // Determine the preview state and URL based on status
        let previewUrl = guid;
        let previewComplete = false;

        if (signedStatus === 'True') {
            previewComplete = true;
        } else if (signedStatus === 'False' && voidedStatus === 'True') {
            previewComplete = false;
        } else if (signedStatus === 'False' && voidedStatus === 'False') {
            try {
                const currentSignerData = JSON.stringify({ guid: guid });

                const signerResponse = await axios.post(`${constants.devApiBaseUrl}/api/current/signer/`, currentSignerData, {
                    headers: { 'Authorization': `Bearer ${authTokens.access}` },
                    maxBodyLength: Infinity
                });

                previewUrl = `${signerResponse.data.uid}_${guid}`;
            } catch (error) {
                // console.error(error);
            }
        }
        // Update state for file preview
        setFilePreviewUrl(previewUrl);
        setPreviewComplete(previewComplete);
        setFilePreviewTitle(title);
        setOpenPreviewerDialog(true);


        try {
            let userip = "hidden";  // Initialize userip with "hidden"

            try {
                // Attempt to get the user's IP address
                const ipResponse = await axios.get('https://ipapi.co/json', { maxBodyLength: Infinity });
                // If the IP address fetch is successful, update the userip
                userip = ipResponse.data.ip;
            } catch (error) {
                // If the IP address fetch fails, userip remains "hidden"
                // console.error('Error fetching IP address:', error.message);
            }

            const logData = JSON.stringify({
                activity: "preview",
                description: `previewed ${title}`,
                guid: guid,
                ip: userip,
                user: user.email
            });

            const logConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${constants.devApiBaseUrl}/api/new/log/`,
                headers: { 'Content-Type': 'application/json' },
                data: logData
            };

            await axios.request(logConfig);
        } catch (error) {
            // console.error(error);
        }

    };


    let getAvatar = () => {
        var config = {
            method: 'get',
            url: `${constants.devApiBaseUrl}/api/avatar/`,
            headers: { 'Authorization': `Bearer ${authTokens.access} ` }
        };

        axios(config)
            .then(function (response) {
                // setAvatar(response.data)
                let url = `${constants.devApiBaseUrl}${response.data['avatar_url']}`
                setAvatar(url)
                // // console.log(url);
            })
            .catch(function (error) {
                // // console.log(error);
            });

    }

    function handleAvatarFileChange(event) {
        setAvatarFile(event.target.files[0])
    }

    let backHome = () => {
        setValue(0)
        document.getElementById('profile-content').style.display = 'none';
        if (uploadedfile) {
            document.getElementById('sign-type').style.display = 'block';
        }
        else {
            document.getElementById('file-upload-form').style.display = 'block';
        }


    }
    let signFromInbox = (row) => {
        let document = `${row.uid}_${row.guid}.pdf/${row.uid}`
        if(row.selfsign){
            navigate('/sign', { state: { 'fileurl': `${row.uid}_${row.guid}.pdf`, 'originalfilename': row.title, 'avatar': avatar } })
        }
        else{
            navigate(`/mail/sign/${document}`, { state: { guid: `${row.guid}` } })
        }
       
        // alert(document)

    }

    let getInbox = (e) => {
        setActiveLink('inbox')
        setValue(0)
        document.getElementById('profile-content').style.display = 'none';
        if (uploadedfile) {
            document.getElementById('sign-type').style.display = 'block';
        }
        else {
            document.getElementById('file-upload-form').style.display = 'block';
        }
        // document.getElementById('home').style.display='none';

        var config = {
            method: 'get',
            url: `${constants.devApiBaseUrl}/api/inbox/`,
            headers: { 'Authorization': `Bearer ${authTokens.access} ` }
        };
        axios(config)
            .then(function (response) {
                setInbox(response.data)

                setCount(response.data.length)

            })
            .catch(function (error) {
                // // console.log(error);

            });

    }


    let getOutbox = () => {
        setValue(1)
        document.getElementById('profile-content').style.display = 'none';
        if (uploadedfile) {
            document.getElementById('sign-type').style.display = 'block';
        }
        else {
            document.getElementById('file-upload-form').style.display = 'block';
        }
        var config = {
            method: 'get',
            url: `${constants.devApiBaseUrl}/api/outbox/`,
            headers: { 'Authorization': `Bearer ${authTokens.access} ` }
        };
        axios(config)
            .then(function (response) {
                setOutbox(response.data)

                setCount(response.data.length)

            })
            .catch(function (error) {

            });

    }
    let getComplete = () => {
        setValue(2)
        document.getElementById('profile-content').style.display = 'none';
        if (uploadedfile) {
            document.getElementById('sign-type').style.display = 'block';
        }
        else {
            document.getElementById('file-upload-form').style.display = 'block';
        }
        // document.getElementById('home').style.display='none';

        var config = {
            method: 'get',
            url: `${constants.devApiBaseUrl}/api/complete/`,
            headers: { 'Authorization': `Bearer ${authTokens.access} ` }
        };
        axios(config)
            .then(function (response) {
                setComplete(response.data)

                setCount(response.data.length)


            })
            .catch(function (error) {
                // console.log(error);

            });

    }

    let getVoided = () => {
        setValue(3)
        document.getElementById('profile-content').style.display = 'none';
        if (uploadedfile) {
            document.getElementById('sign-type').style.display = 'block';
        }
        else {
            document.getElementById('file-upload-form').style.display = 'block';
        }

        var config = {
            method: 'get',
            url: `${constants.devApiBaseUrl}/api/voided/`,
            headers: { 'Authorization': `Bearer ${authTokens.access} ` }
        };
        axios(config)
            .then(function (response) {
                setVoided(response.data)

                setCount(response.data.length)

            })
            .catch(function (error) {
                // // console.log(error);

            });

    }


    let getMyUploads = () => {
        setValue(4)
        document.getElementById('profile-content').style.display = 'none';
        if (uploadedfile) {
            document.getElementById('sign-type').style.display = 'block';
        }
        else {
            document.getElementById('file-upload-form').style.display = 'block';
        }

        var config = {
            method: 'get',
            url: `${constants.devApiBaseUrl}/api/myuploads/`,
            headers: { 'Authorization': `Bearer ${authTokens.access} ` }
        };
        axios(config)
            .then(function (response) {
                setMyUploads(response.data)

                setCount(response.data.length)

            })
            .catch(function (error) {

            });

    }

    let getTrashed = () => {
        setValue(5)
        document.getElementById('profile-content').style.display = 'none';
        if (uploadedfile) {
            document.getElementById('sign-type').style.display = 'block';
        }
        else {
            document.getElementById('file-upload-form').style.display = 'block';
        }
        var config = {
            method: 'get',
            url: `${constants.devApiBaseUrl}/api/trashed/`,
            headers: { 'Authorization': `Bearer ${authTokens.access} ` }
        };
        axios(config)
            .then(function (response) {
                setTrashed(response.data)

                setCount(response.data.length)

            })
            .catch(function (error) {

            });

    }

    let showProfile = () => {
        document.getElementById('profile-content').style.display = 'block';
        document.getElementById('file-upload-form').style.display = 'none';
        document.getElementById('sign-type').style.display = 'none';
    }

    let handleSubmit2 = async () => {
        setLoadingMini(true);
        getWorkflows();

        const url = `${constants.devApiBaseUrl}/api/uploadOthers/`;
        const formData = new FormData();
        formData.append('formFile', file);
        formData.append('title', file.name);

        const config = {
            headers: { 'Authorization': `Bearer ${authTokens.access}` }
        };

        try {

            const uploadResponse = await axios.post(url, formData, config);

            if (uploadResponse.status === 200) {
                const fileurl = uploadResponse.data.fileguid;

                let userip = "hidden";  // Initialize userip with "hidden"

                try {
                    // Attempt to get the user's IP address
                    const ipResponse = await axios.get('https://ipapi.co/json', { maxBodyLength: Infinity });
                    // If the IP address fetch is successful, update the userip
                    userip = ipResponse.data.ip;
                } catch (error) {
                    // If the IP address fetch fails, userip remains "hidden"
                    // console.error('Error fetching IP address:', error.message);
                }

                const logData = JSON.stringify({
                    activity: "upload",
                    description: `uploaded ${file.name} for signing by others`,
                    guid: `${fileurl}`,
                    ip: userip,
                    user: user.email
                });

                const logConfig = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${constants.devApiBaseUrl}/api/new/log/`,
                    headers: { 'Content-Type': 'application/json' },
                    data: logData
                };

                await axios.request(logConfig);

                setLoadingMini(false);
                setUploadedFileUrl(fileurl);
                setOpenDialogAddSigners(true);
            } else {
                alert("File upload failed");
                setLoadingMini(false);
            }
        } catch (error) {
            // console.error(error);
            alert(`Error: ${error.message}`);
            setLoadingMini(false);
        }
    };


    let handleSubmit = async () => {
        setLoadingMini(true);

        const url = `${constants.devApiBaseUrl}/api/upload/`;
        const formData = new FormData();
        formData.append('formFile', file);


        const config = {
            headers: { 'Authorization': `Bearer ${authTokens.access}` }
        };

        try {
            const uploadResponse = await axios.post(url, formData, config);

            if (uploadResponse.status === 200) {
                const fileurl = uploadResponse.data.fileguid;

                let userip = "hidden";  // Initialize userip with "hidden"

                try {
                    // Attempt to get the user's IP address
                    const ipResponse = await axios.get('https://ipapi.co/json', { maxBodyLength: Infinity });
                    // If the IP address fetch is successful, update the userip
                    userip = ipResponse.data.ip;
                } catch (error) {
                    // If the IP address fetch fails, userip remains "hidden"
                    // console.error('Error fetching IP address:', error.message);
                }

                const removeExtension = (filename) => {
                    const x = filename.substring(0, filename.lastIndexOf('.')) || filename;
                    const y = x.split('_');
                    return y[1];
                };

                const documentguid = removeExtension(fileurl);
                const data = JSON.stringify({
                    "activity": "upload",
                    "description": `uploaded ${file.name} for self signing`,
                    "guid": `${documentguid}`,
                    "ip": userip,
                    "user": user.email
                });

                const logConfig = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${constants.devApiBaseUrl}/api/new/log/`,
                    headers: { 'Content-Type': 'application/json' },
                    data: data
                };

                await axios.request(logConfig);

                setLoadingMini(false);
                navigate('/sign', { state: { 'fileurl': fileurl, 'originalfilename': file.name, 'avatar': avatar } });
            } else {
                alert("File upload failed");
                setLoadingMini(false);  // Ensure loading state is reset
            }
        } catch (error) {
            // console.error(error);
            setLoadingMini(false);  // Ensure loading state is reset
        }
    };


    let selfSign = (e) => {
        handleSubmit()
    }

    let selfSignSaved = (saveddocguid, savedfilename) => {
        // // console.log(`${saveddocguid}`)
        // // console.log(`${savedfilename}`)
        let data = JSON.stringify({
            "documentid": `${saveddocguid}`
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${constants.devApiBaseUrl}/api/saved/selfsign/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access} `
            },
            data: data
        };

        axios.request(config)
            .then((response) => {

                navigate('/sign', { state: { 'fileurl': response.data.fileName, 'originalfilename': savedfilename, 'avatar': avatar } })

            })
            .catch((error) => {
                // // console.log(error);
            });
    }

    let mailtoSigners = (e) => {
        handleSubmit2()
    }

    const saveToMyFolder = async (e) => {
        setLoadingMini(true);

        const url = `${constants.devApiBaseUrl}/api/uploadOthers/`;
        const formData = new FormData();
        formData.append('formFile', file);
        formData.append('title', file.name);

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${authTokens.access}`
            }
        };

        try {
            const uploadResponse = await axios.post(url, formData, config);

            if (uploadResponse.status === 200) {
                const fileurl = uploadResponse.data.fileguid;

                let userip = "hidden";  // Initialize userip with "hidden"

                try {
                    // Attempt to get the user's IP address
                    const ipResponse = await axios.get('https://ipapi.co/json', { maxBodyLength: Infinity });
                    // If the IP address fetch is successful, update the userip
                    userip = ipResponse.data.ip;
                } catch (error) {
                    // If the IP address fetch fails, userip remains "hidden"
                    console.error('Error fetching IP address:', error.message);
                }

                const logData = JSON.stringify({
                    activity: "upload",
                    description: `saved ${file.name} for later`,
                    guid: `${fileurl}`,
                    ip: userip,
                    user: user.email
                });

                const logConfig = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${constants.devApiBaseUrl}/api/new/log/`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: logData
                };

                await axios.request(logConfig);

                setLoadingMini(false);
                window.location.reload(false);
            } else {
                alert("File upload failed");
                setLoadingMini(false);
            }
        } catch (error) {
            // console.error(error);
            alert(`Error: ${error.message}`);
            setLoadingMini(false);
        }
    };


    let getComments = (documentguid, documenttitle) => {
        setCCDocGuid(documentguid)
        setCCDocTitle(documenttitle)

        let data = JSON.stringify({
            "guid": `${documentguid}`
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${constants.devApiBaseUrl}/api/comments/`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                // // console.log(JSON.stringify(response.data));
                setComments(response.data)

            })
            .catch((error) => {
                // // console.log(error);
            });
    }

    let refreshdata = () => {
        getAvatar()
        getTrashed()
        getMyUploads()
        getVoided()
        getComplete()
        getOutbox()
        getInbox()

        setCount(complete.length)
        document.getElementById('home').style.display = 'block';
    }

    let adminPage = () => {
        navigate('/admin/dashboard')
    }

    const getSignerUid = async (documentguid) => {
        const data = JSON.stringify({
            "docguid": documentguid
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${constants.devApiBaseUrl}/api/signer/selfsign/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`
            },
            data: data
        };

        try {
            const response = await axios.request(config);

            setSignerUid(response.data.uid);
            setSigners(response.data.signers);
            setDocCreated(response.data.created);
            setDocAssdescription(response.data.assignmentd);
            setDocOwner(response.data.owner);

            // Call getComments only if the above state updates were successful
            getComments(documentguid);
        } catch (error) {
            // console.error(error);
        }
    };

    const changePassword = () => {
        window.open(`/password-reset`, '_blank');
    };



    let resetForm = () => {
        setUploadedFile('')
        document.getElementById('file-upload-form').style.display = 'block';
        document.getElementById('sign-type').style.display = 'none';
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    getAvatar(),
                    getCompanyLogo(),
                    getTrashed(),
                    getMyUploads(),
                    getVoided(),
                    getComplete(),
                    getOutbox(),
                    getInbox(),
                ]);
                setCount(complete.length);

                if (user.mailtoall === 'True') {
                    setChecked(true);
                } else {
                    setChecked(false);
                }

                if (user.is_admin === 'True' && user.is_superuser === 'True') {
                    navigate('/admin/dashboard');
                }

                if (location.state) {
                    setOpenAlert(location.state.openalert);
                    setAlertMsg(location.state.alertmsg);
                    setAlertSeverity(location.state.alertseverity);
                    setTimeout(() => setOpenAlert(false), 3000);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        document.getElementById('home').style.display = 'block';

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);


    return (
        <>
            {loading ?
                <>
                    <Loading />
                </>
                :
                <>

                    <AddSignersDialog jsonPhoneCodesData={jsonPhoneCodesData} loading={loading} setLoading={setLoading} getWorkflows={getWorkflows} workflows={workflows} opendialogaddsigners={opendialogaddsigners} setOpenDialogAddSigners={setOpenDialogAddSigners} fileurl={uploadedfileurl} refreshdata={refreshdata} setUploadedFile={setUploadedFile} />
                    <CommentsDialog opendialogcomments={opendialogcomments} setOpenDialogComments={setOpenDialogComments} comments={comments} ccdocguid={ccdocguid} ccdoctitle={ccdoctitle} />
                    <PreviewerDialog signers={signers} doccreated={doccreated} assdescription={assdescription} docowner={docowner} user={user} avatar={avatar} getComments={getComments} openpreviewerdialog={openpreviewerdialog} setOpenPreviewerDialog={setOpenPreviewerDialog} comments={comments} ccdocguid={ccdocguid} ccdoctitle={ccdoctitle} filepreviewurl={filepreviewurl} filepreviewtitle={filepreviewtitle} signeruid={signeruid} previewComplete={previewComplete} />

                    <aside className='aside shadow-lg' >

                        {companylogo ? <>
                            <div className='d-flex justify-content-center  bg-white p-2' >
                                <img src={companylogo} alt='Organization logo' width='55%' />

                            </div>
                        </> : <>
                            <div className='d-flex justify-content-center  bg-white p-2 ' >
                                <img src={logo} alt='Organization logo' width='55%' />

                            </div>

                        </>}



                        {avatar ? <>
                            <div className='d-flex justify-content-center  p-2' style={{ backgroundColor: '#fff' }}>

                                <Avatar
                                    alt={`${user.first_name} ${user.last_name}`}
                                    className='shadow-lg bg-secondary'
                                    src={avatar}
                                    sx={{ width: 55, height: 55 }}
                                />
                                <br /><br />


                            </div>

                        </> : <>
                            <div className='d-flex justify-content-center p-2 ' style={{ backgroundColor: '#fff' }}>


                                <Avatar
                                    alt={`${user.first_name} ${user.last_name}`}
                                    className='shadow-lg bg-secondary'
                                    src={defaultAvatar}
                                    sx={{ width: 55, height: 55 }}
                                />
                                <br /><br />
                                {/* </StyledBadge> */}

                            </div>

                        </>}

                        <div className='text-center mt-0 mb-0 p-2 shadow-lg' onClick={showProfile}>
                            <span className='mr-3' style={{ fontSize: '13px' }}>{user.first_name} {user.last_name}  </span> <i className="fas fa-info-circle  m-1" style={{ color: "#ffda75", cursor: 'pointer' }}></i>

                        </div>



                        <p className=' p-2 text-center  mb-0 shadow-lg'>
                            <small style={{ fontSize: '10px', }}>{user.company === 'Individual' ? <>INDIVIDUAL</> : <>CORPORATE</>} ACCOUNT </small>
                        </p>

                        <div className=''>
                            <a href="#" onClick={getInbox} style={{ fontSize: '11px' }}>
                                <i className="fas dot fa-circle text-danger shadow-lg m-1" aria-hidden="true"></i>
                                <span className='m-1'> Inbox ( {inbox.length} ) - Waiting for me</span>

                            </a>

                            <a href="#" onClick={getOutbox} style={{ fontSize: '11px' }}>
                                <i className="fas dot fa-circle text-warning shadow-lg  m-1" aria-hidden="true"></i>
                                <span className='m-1'>    Outbox ( {outbox.length} ) - Waiting for Others</span>

                            </a>
                            <a href="#" onClick={getComplete} style={{ fontSize: '11px' }}>
                                <i className="fas dot fa-circle text-success shadow-lg  m-1" aria-hidden="true"></i>
                                <span className='m-1'> Completed ( {complete.length} ) - Signed</span>

                            </a>
                            <a href="#" onClick={getVoided} style={{ fontSize: '11px' }}>
                                <i className="fas fas fa-ban shadow-lg  m-1" aria-hidden="true" ></i>
                                <span className='m-1'>  Voided ( {voided.length} ) - Voided</span>

                            </a>
                            <a href="#" onClick={getMyUploads} style={{ fontSize: '11px' }}>
                                <i className="fas fa-save shadow-lg  m-1" aria-hidden="true"></i>
                                <span className='m-1'>  Saved for Later ( {myuploads.length} ) - Unsigned</span>

                            </a>
                            <a href="#" onClick={getTrashed} style={{ fontSize: '11px' }}>
                                <i className="fas fa-trash-alt shadow-lg  m-1" aria-hidden="true"></i>
                                <span className='m-1'>  Trashed ( {trashed.length} ) </span>

                            </a>


                            {user.is_admin == 'True' ?
                                <a href="#" onClick={adminPage} style={{ fontSize: '11px' }}>
                                    <i className="fas fa-user-shield  m-1 " aria-hidden="true"></i>
                                    <span className='m-1'> Admin Dashboard</span>

                                </a>
                                :
                                <>
                                </>
                            }



                            <a href="#" onClick={logoutUser} style={{ fontSize: '11px' }} >
                                <i className="fas fa-power-off  m-1 " aria-hidden="true"></i>
                                <span className='m-1'> Sign Out</span>

                            </a>
                        </div>



                    </aside>

                    <main className="main" id="home-content">
                        <ResponsiveAppBar2 avatar={avatar} adminPage={adminPage} logoutUser={logoutUser} user={user} showProfile={showProfile} />

                        <div className="row" style={{ height: '100%' }}>
                            <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12" id="home" style={{ backgroundColor: '#e5e5e5', borderRadius: '0', borderTop: 'none', boxShadow: '0', borderColor: '#e5e5e5' }}>


                                <div className="text-center p-2" id="profile-content">
                                    <div className="text-center bg-white ">

                                        {/* <form className="text-center p-2">
                                            <div className="form-group my-3">
                                                <div className="input-group mt-1">
                                                    <FormControl variant="standard" fullWidth size='sm'>
                                                        <InputLabel htmlFor="input-with-icon-adornment">
                                                            First Name
                                                        </InputLabel>
                                                        <Input
                                                            style={{ fontSize: '14px' }}
                                                            id="first_name"
                                                            startAdornment={<InputAdornment position="start"><BadgeIcon /></InputAdornment>}
                                                            name="first_name"
                                                            placeholder={user.first_name}
                                                            type='text'
                                                        />
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className="form-group my-3">
                                                <div className="input-group mt-1" style={{ fontSize: '13px' }}>
                                                    <FormControl variant="standard" fullWidth size='sm'>
                                                        <InputLabel htmlFor="input-with-icon-adornment">
                                                            Last Name
                                                        </InputLabel>
                                                        <Input
                                                            style={{ fontSize: '14px' }}
                                                            id="last_name"
                                                            startAdornment={<InputAdornment position="start"><BadgeIcon /></InputAdornment>}
                                                            name="last_name"
                                                            placeholder={user.last_name}
                                                            type='text'
                                                        />
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className="form-group my-3">
                                                <div className='input-group mt-1'>
                                                    <FormControl variant="standard" fullWidth>
                                                        <InputLabel htmlFor="input-with-icon-adornment">
                                                            Phone
                                                        </InputLabel>
                                                        <Input
                                                            style={{ fontSize: '14px' }}
                                                            id="phone"
                                                            startAdornment={<InputAdornment position="start"><PhoneIcon /></InputAdornment>}
                                                            name="phone"
                                                            placeholder={user.phone}
                                                            type='phone'
                                                            inputProps={{ pattern: '[0]{1}[1-7]{1}[0-9]{2}[0-9]{3}[0-9]{3}' }}
                                                        />
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className="form-group my-3">
                                                <div className="input-group mt-1">
                                                    <FormControl variant="standard" fullWidth size='sm'>
                                                        <InputLabel htmlFor="input-with-icon-adornment">
                                                            Email Address
                                                        </InputLabel>
                                                        <Input
                                                            style={{ fontSize: '14px' }}
                                                            startAdornment={<InputAdornment position="start"><EmailIcon /></InputAdornment>}
                                                            placeholder={user.email}
                                                            type='email'
                                                        />
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <ButtonComponent
                                                cssClass='e-custom-light'
                                                className='m-2 p-2'
                                                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                disabled={false}
                                                onClick={backHome}
                                            >
                                                <span className='mx-2'>Back home</span>
                                            </ButtonComponent>
                                        </form> */}
                                        <p style={{ fontSize: '14px', backgroundColor: '#1C4690', color: "#ffff" }} className='p-2' >Profile Info</p>
                                        <form onSubmit={updateUser} className="text-center p-2">

                                       
                                            <div className="form-group my-1">
                                                <div className="input-group mt-1">
                                                    <FormControl fullWidth size="sm">

                                                        <Input
                                                            style={{ fontSize: '14px' }}
                                                            id="first_name"
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <BadgeIcon />
                                                                </InputAdornment>
                                                            }
                                                            name="first_name"
                                                            placeholder={user.first_name}
                                                            type="text"
                                                        />
                                                    </FormControl>
                                                </div>
                                            </div>

                                            <div className="form-group my-3">
                                                <div className="input-group mt-1">
                                                    <FormControl  fullWidth size="sm">

                                                        <Input
                                                            style={{ fontSize: '14px' }}
                                                            id="last_name"
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <BadgeIcon />
                                                                </InputAdornment>
                                                            }
                                                            name="last_name"
                                                            placeholder={user.last_name}
                                                            type="text"
                                                        />
                                                    </FormControl>
                                                </div>
                                            </div>

                                            <div className="form-group my-3">
                                                <div className="input-group mt-1">
                                                    <FormControl fullWidth>

                                                        <Input
                                                            style={{ fontSize: '14px' }}
                                                            id="phone"
                                                            size='small'
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <PhoneIcon />
                                                                </InputAdornment>
                                                            }
                                                            name="phone"
                                                            placeholder={user.phone == null ? "Enter phone number" : user.phone}
                                                            type="phone"
                                                            inputProps={{
                                                                pattern: '[0]{1}[1-7]{1}[0-9]{2}[0-9]{3}[0-9]{3}',
                                                            }}
                                                        />
                                                    </FormControl>
                                                </div>
                                            </div>
                                     
                                            <div className="form-group ">


                                                <FormControl variant="standard" fullWidth className="input-group mt-1">
                                                    <Box className="my-3" display="flex" alignItems="center">
                                                    <Typography className='text-secondary' variant="body1" style={{ marginRight: '8px' }}>
                                                          <i class="fas fa-image mx-1" style={{fontSize:'18px'}}></i>  Picture
                                                        </Typography>
                                                        <Input
                                                            style={{ fontSize: '12px' ,width:'60%'}}
                                                            id="avatar"
                                                            onChange={handleAvatarFileChange}
                                                            name="avatar"
                                                            placeholder="Profile Pic"
                                                            type="file"
                                                          
                                                        />
                                                       
                                                    </Box>
                                                </FormControl>

                                            </div>
                                         
                                            <div className='text-start '>
                                            <ButtonComponent
                                                cssClass="e-custom-light"
                                                style={{ textTransform: 'none', fontWeight: 'lighter', width: '40%', fontSize: '12px' }}
                                                className="p-2"
                                                disabled={false}
                                                onClick={changePassword}
                                            >
                                                Password Reset
                                            </ButtonComponent>
                                            </div>

                                            <div className="form-group text-dark text-start">
                                                <label htmlFor="" className="my-2">
                                                    <small style={{ fontSize: '13px', color: '#2364aa' }}>Mailer Settings</small>
                                                </label>
                                                <br />
                                                <p style={{ fontSize: '11px' }} className='text-left'>
                                                    NB: By default, we will send a final signed copy to your email only. <br />
                                                    In case you would like the final copy shared with all signers, kindly turn on the switch below;
                                                </p>

                                                <div className="input-group text-dark" style={{ fontSize: '12px' }}>
                                                    <Switch checked={checked} onChange={changeSavedSwitch} inputProps={{ 'aria-label': 'controlled' }} />
                                                    {checked ? (
                                                        <p className="mt-2 text-dark" style={{ fontSize: '13px' }}>Send copy to all signers and myself</p>
                                                    ) : (
                                                        <p className="mt-2 text-dark" style={{ fontSize: '13px' }}>Send copy to myself only</p>
                                                    )}
                                                </div>
                                            </div>


                                            <div className="form-group my-2">
                                                <div className="text-center mt-2 pt-2 ">
                                                    <ButtonComponent
                                                        cssClass="e-custom-light"
                                                        style={{ textTransform: 'none', fontWeight: 'lighter', width: '40%', fontSize: '12px' }}
                                                        className="m-1 p-2"
                                                        disabled={false}
                                                        onClick={refreshdata}
                                                    >
                                                        Cancel
                                                    </ButtonComponent>
                                                    <ButtonComponent
                                                        cssClass="e-custom-primary"
                                                        type="submit"
                                                        style={{ textTransform: 'none', fontWeight: 'lighter', width: '40%', fontSize: '12px' }}
                                                        className="m-1 p-2"
                                                        disabled={false}
                                                    >
                                                        Save Changes
                                                    </ButtonComponent>
                                                </div>
                                            </div>
                                        </form>



                                    </div>
                                </div>

                                <div className="text-center p-2" id="file-upload-form">

                                    <h5 className='mb-4 mt-3' style={{ color: '#495057' }}> Welcome Back </h5>
                                    <Alerts alertseverity={alertseverity} alertmsg={alertmsg} openalert={openalert} setOpenAlert={setOpenAlert} />

                                    <FileUpload setFile={setFile} setUploadedFile={setUploadedFile} />

                                </div>

                                <div className="text-center p-2" id="sign-type">
                                    <p style={{ fontSize: '14px', backgroundColor: '#1C4690', color: "#ffff" }} className='p-2  my-0' >How would you like to proceed?</p>
                                    <Box className='text-center bg-white p-2 my-0'>
                                        {/* <h6 className='mb-4 mt-3' style={{ color: '#495057' }}> How would you like to proceed?</h6> */}
                                        <p className='my-2' style={{ fontSize: '12px', color: '#495057' }}> ( {uploadedfile} ) </p>

                                        {loadingmini ? (
                                            <>
                                                <LoadingMini />
                                            </>
                                        ) : (
                                            <>
                                                <p className='my-3' style={{ fontSize: '13px', color: '#495057' }}>Please select an option below</p>
                                                <div className='d-flex-justify-content-center my-4' >
                                                    <ButtonComponent
                                                        cssClass='e-custom-primary'
                                                        onClick={selfSign}
                                                        id='selfSign'
                                                        className='m-2 p-2'
                                                        style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '11px' }}
                                                        disabled={false}
                                                    >
                                                        <i className="fas fa-pen-nib mx-1"></i>
                                                        <span className='mx-2'>I want to sign myself now</span>
                                                    </ButtonComponent>
                                                    <ButtonComponent
                                                        cssClass='e-custom-primary'
                                                        onClick={mailtoSigners}
                                                        id='mailtoSigners'
                                                        className='m-2 p-2'
                                                        style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '11px' }}
                                                        disabled={false}
                                                    >
                                                        <i className="fas fa-envelope mx-1"></i>
                                                        <span className='mx-2'>I want to send to others to sign</span>
                                                    </ButtonComponent>
                                                    <ButtonComponent
                                                        cssClass='e-custom-light'
                                                        onClick={saveToMyFolder}
                                                        id='saveToMyFolder'
                                                        className='m-2 p-2'
                                                        style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '11px' }}
                                                        disabled={false}
                                                    >
                                                        <i className="fas fa-archive mx-1"></i>
                                                        <span className='mx-2'>I want to save for later</span>
                                                    </ButtonComponent>
                                                    <ButtonComponent
                                                        cssClass='e-custom-warning'
                                                        onClick={resetForm}
                                                        id='saveToMyFolder'
                                                        className='m-2 p-2'
                                                        style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '11px' }}
                                                        disabled={false}
                                                    >
                                                        <i className="fas fa-times mx-1"></i>
                                                        <span className='mx-2'>I want to cancel & upload again</span>
                                                    </ButtonComponent>
                                                </div>
                                            </>
                                        )
                                        }
                                    </Box>
                                </div>
                            </div>

                            <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12 card container" style={{ height: '100vh', backgroundColor: '#fff', borderRadius: 0, borderTop: 'none', boxShadow: 'none', borderColor: '#fff', overflow: 'scroll' }}>
                                <Box sx={{ width: '100%'}}>
                                    <Box sx={{ borderColor: 'divider' }}>
                                        <Tabs style={{overflowX:'scroll'}} value={value} onChange={handleChange} aria-label="basic tabs example">
                                            <Tab sx={{ textTransform: 'none', fontSize: '13px' ,width:'auto'}} onClick={getInbox} label="Inbox" {...a11yProps(0)} />
                                            <Tab sx={{ textTransform: 'none', fontSize: '13px',width:'auto' }} onClick={getOutbox} label="Outbox" {...a11yProps(1)} />
                                            <Tab sx={{ textTransform: 'none', fontSize: '13px',width:'auto' }} onClick={getComplete} label="Complete" {...a11yProps(2)} />
                                            <Tab sx={{ textTransform: 'none', fontSize: '13px',width:'auto' }} onClick={getVoided} label="Voided" {...a11yProps(3)} />
                                            <Tab sx={{ textTransform: 'none', fontSize: '13px',width:'auto' }} onClick={getMyUploads} label="Saved for later" {...a11yProps(4)} />
                                            <Tab sx={{ textTransform: 'none', fontSize: '13px',width:'auto' }} onClick={getTrashed} label="Trashed" {...a11yProps(5)} />
                                           
                                        </Tabs>
                                    </Box>
                                    <Box sx={{ borderColor: 'divider' }}>
                                        <CustomTabPanel value={value} index={0}>
                                            <Inbox2
                                                previewFile={previewFile}
                                                inbox={inbox}
                                                setInbox={setInbox}
                                                signFromInbox={signFromInbox}
                                                getSignerUid={getSignerUid}
                                                refreshdata={refreshdata}
                                                setOpenAlert={setOpenAlert}
                                                setAlertMsg={setAlertMsg}
                                                setAlertSeverity={setAlertSeverity}
                                            />
                                        </CustomTabPanel>
                                        <CustomTabPanel value={value} index={1}>
                                            <Outbox2
                                                previewFile={previewFile}
                                                refreshdata={refreshdata}
                                                getSignerUid={getSignerUid}
                                                signeruid={signeruid}
                                                outbox={outbox}
                                            />
                                        </CustomTabPanel>
                                        <CustomTabPanel value={value} index={2}>
                                            <Complete2
                                                previewFile={previewFile}
                                                complete={complete}
                                                getSignerUid={getSignerUid}
                                            />
                                        </CustomTabPanel>
                                        <CustomTabPanel value={value} index={3}>
                                            <Voided2
                                                previewFile={previewFile}
                                                getComments={getComments}
                                                refreshdata={refreshdata}
                                                voided={voided}
                                            />
                                        </CustomTabPanel>
                                        <CustomTabPanel value={value} index={4}>
                                            <MyUploads2
                                                previewFile={previewFile}
                                                signFromInbox={signFromInbox}
                                                sendUploadForSigning={sendUploadForSigning}
                                                selfSignSaved={selfSignSaved}
                                                myuploads={myuploads}
                                            />
                                        </CustomTabPanel>
                                        <CustomTabPanel value={value} index={5}>
                                            <Trashed
                                                previewFile={previewFile}
                                                signFromInbox={signFromInbox}
                                                sendUploadForSigning={sendUploadForSigning}
                                                selfSignSaved={selfSignSaved}
                                                trashed={trashed}
                                                setTrashed={setTrashed}
                                                refreshdata={refreshdata}
                                                setOpenAlert={setOpenAlert}
                                                setAlertMsg={setAlertMsg}
                                                setAlertSeverity={setAlertSeverity}
                                                user={user}
                                            />
                                        </CustomTabPanel>
                                    </Box>
                                </Box>
                            </div>
                        </div>
                    </main>

                </>
            }


        </>
    )
}

export default Dashboard