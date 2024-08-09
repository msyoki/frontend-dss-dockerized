import * as React from 'react';
import {useState,useRef} from 'react';

import Dialog from '@mui/material/Dialog';

import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';
import { SignatureComponent } from '@syncfusion/ej2-react-inputs';
import { getComponent } from '@syncfusion/ej2-base';
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';
import Switch from '@mui/material/Switch';
import axios from 'axios'
import Alerts from './Alert';


//Tabs imports
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

//checkbox
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as constants from '../components/constants/constants'
import SignatureUploadMsgDialog from './SignatureUploadMsgDialog';



const SignatureDialog=(props) =>{
  const [addEmail, setAddEmail] = useState(false);
  const [addDateStamp, setAddDateStamp] = useState(false);
  const [addTimeStamp, setAddTimeStamp] = useState(false);

  // Handler functions for checkbox changes
  const handleAddEmailChange = (event) => {
    setAddEmail(event.target.checked);
  };

  const handleAddDateStampChange = (event) => {
    setAddDateStamp(event.target.checked);
  };

  const handleAddTimeStampChange = (event) => {
    setAddTimeStamp(event.target.checked);
  };
  const handleButtonClick = () => {
    // You can do further processing with the checkbox values here
  };

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const selectRef = useRef();

    const [selectedsignature, setSelectedSignature] = React.useState('');

    const inputRef = React.useRef(null);
    const inputRef1 = React.useRef(null);

    let[openalert,setOpenAlert]=useState(false)
    let[alertseverity,setAlertSeverity]=useState('info')
    let [alertmsg,setAlertMsg]=useState('')
    let [checked,setChecked]=useState(false);

    // let [signatureWidth,setSignatureWidth]=useState('');
    // let [signatureHeight,setSignatureHeight]=useState('');

    let [badsignature,setBadSignature]=useState(false);
    let[signatureforsaving,setSignatureForSaving]=useState('')
    const[signaturetitle,setSignatureTitle]=useState('')
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('md');
    const [stamp,setStamp]= React.useState(false);
  

    let changeSavedSwitch=(e)=>{
        setChecked(e.target.checked);
        
    }
     
    function onSelect(e) {
        if(checked && signaturetitle === '')
        {
            setOpenAlert(true)
            setAlertMsg('please provide a title for the new signature above')
            setAlertSeverity('error')
            setTimeout(
            function() {
            setOpenAlert(false);
            }, 3000)
        }
        else{
            if(!addTimeStamp && ! addDateStamp && !addEmail){
                props.setHasAnnotations(false)
                let signature = getComponent(document.getElementById('signature'), 'signature');
                props.setTempSignature(signature.signatureValue);
            
                props.setSaveSignature(signature.signatureValue)

                if(props.pagetype === 'selfsign'){
                    
                    var viewer = document.getElementById('previewer').ej2_instances[0];
                    viewer.customStampSettings = {
                        isLock: false,
                        width:props.signaturewidth,
                        height:props.signatureheight,
                        customStamps: [{
                            customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
                            signature.signatureValue
                            ,
                        }],
                    };
                
                
                    // document.getElementById('complete').style.display="block";

                }
                else{
                    
                    var viewer = document.getElementById('previewer2').ej2_instances[0];
                    viewer.customStampSettings = {
                        isLock: false,
                        width:props.signaturewidth,
                        height:props.signatureheight,
                        customStamps: [{
                            customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
                            signature.signatureValue
                            ,
                        }],
                    };
                
                
                    // document.getElementById('complete').style.display="block";

                }

                // alert(`${signature.signatureValue}`)
                props.setAddSignature(true)
                props.setOpenDialogSignature(false)
                // signature.save(text, 'Signature');
                if(checked === true){
                    let data = JSON.stringify({
                        "email": props.signeremail,
                        "signature": signature.signatureValue,
                        "titile": signaturetitle
                    });
                    
                    let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    data : data
                    };
                    
                    axios.request(config)
                    .then((response) => {
                    // // console.log(JSON.stringify(response.data));
                    setChecked(false)
                    })
                    .catch((error) => {
                    // console.log(error);
                    });
                    
                }    
            }
            else{
                if(addTimeStamp && !addDateStamp){
                    props.setHasAnnotations(true)
                    let signature = getComponent(document.getElementById('signature'), 'signature');
                    let data = JSON.stringify({
                        "signature": `${signature.signatureValue}`,
                        "signerGuid": `${props.signerguid}`,
                        "signerEmail": addEmail,
                        "signTimestamp": addTimeStamp,
                        "date": true
                        });
                    let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: `${constants.devApi2BaseUrl}/api/Timestamp`,
                        headers: { 
                            'Content-Type': 'application/json'
                        },
                        data : data
                        };
        
                        axios.request(config)
                        .then((response) => {
                        // // console.log(JSON.stringify(response.data));
                        if(response.data.signature){
                            props.setSaveSignature(signature.signatureValue)
                            props.setTempSignature(response.data.signature);
                            if(props.pagetype === 'selfsign'){
                               
                                var viewer = document.getElementById('previewer').ej2_instances[0];
                                viewer.customStampSettings = {
                                    isLock: false,
                                    width:200,
                                    height:50,
                                    customStamps: [{
                                        customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
                                        response.data.signature
                                        ,
                                    }],
                                };
                            
                            
                                // document.getElementById('complete').style.display="block";
        
                            }
                            else{
                              
                                var viewer = document.getElementById('previewer2').ej2_instances[0];
                                viewer.customStampSettings = {
                                    isLock: false,
                                    width:200,
                                    height:50,
                                    customStamps: [{
                                        customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
                                        response.data.signature
                                        ,
                                    }],
                                };
                            
                            
                                // document.getElementById('complete').style.display="block";
        
                            }
        
                            // alert(`${signature.signatureValue}`)
                            props.setAddSignature(true)
                            props.setOpenDialogSignature(false)
                            // signature.save(text, 'Signature');
                            if(checked === true){
                                let data = JSON.stringify({
                                    "email": props.signeremail,
                                    "signature": signature.signatureValue,
                                    "titile": signaturetitle
                                });
                                
                                let config = {
                                method: 'post',
                                maxBodyLength: Infinity,
                                url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
                                headers: { 
                                    'Content-Type': 'application/json'
                                },
                                data : data
                                };
                                
                                axios.request(config)
                                .then((response) => {
                                // // console.log(JSON.stringify(response.data));
                                setChecked(false)
                                })
                                .catch((error) => {
                                // // console.log(error);
                                });
                                
                            }
                        }
                        })
                        .catch((error) => {
                        // console.log(error);
                    });
                }
                else{
                    props.setHasAnnotations(true)
                    let signature = getComponent(document.getElementById('signature'), 'signature');
                    // // console.log(signature.signatureValue)
                    let data = JSON.stringify({
                    "signature": `${signature.signatureValue}`,
                    "signerGuid": `${props.signerguid}`,
                    "signerEmail": addEmail,
                    "signTimestamp": addTimeStamp,
                    "date": addDateStamp
                    });
    
                    let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${constants.devApi2BaseUrl}/api/Timestamp`,
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    data : data
                    };
    
                    axios.request(config)
                    .then((response) => {
                    // // console.log(JSON.stringify(response.data));
                    props.setTempSignature(response.data.signature);
                    if(response.data.signature){
                        props.setSaveSignature(signature.signatureValue)
    
                        if(props.pagetype === 'selfsign'){
                            
                            var viewer = document.getElementById('previewer').ej2_instances[0];
                            viewer.customStampSettings = {
                                isLock: false,
                                width:200,
                                height:50,
                                customStamps: [{
                                    customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
                                    response.data.signature
                                    ,
                                }],
                            };
                        
                        
                            // document.getElementById('complete').style.display="block";
    
                        }
                        else{
                          
                            var viewer = document.getElementById('previewer2').ej2_instances[0];
                            viewer.customStampSettings = {
                                isLock: false,
                                width:200,
                                height:50,
                                customStamps: [{
                                    customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
                                    response.data.signature
                                    ,
                                }],
                            };
                        
                        
                            // document.getElementById('complete').style.display="block";
    
                        }
    
                        // alert(`${signature.signatureValue}`)
                        props.setAddSignature(true)
                        props.setOpenDialogSignature(false)
                        // signature.save(text, 'Signature');
                        if(checked === true){
                            let data = JSON.stringify({
                                "email": props.signeremail,
                                "signature": signature.signatureValue,
                                "titile": signaturetitle
                            });
                            
                            let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
                            headers: { 
                                'Content-Type': 'application/json'
                            },
                            data : data
                            };
                            
                            axios.request(config)
                            .then((response) => {
                            // // console.log(JSON.stringify(response.data));
                            setChecked(false)
                            })
                            .catch((error) => {
                            // // console.log(error);
                            });
                            
                        }
                    }
                    })
                    .catch((error) => {
                        // console.log(error);
                    });
                }
            }
          
        }
  
    }

    let previewSaved=(e,selectedValue)=> {
        setSelectedSignature(e.target.value);
        if (selectedValue) {
            const image = new Image();
            image.src = selectedValue; // Update the MIME type accordingly

            image.onload = () => {
                var a = 620;
                var b = 450;

                // Calculate the ratio of the change in a
                var changeRatio = (newA, oldA) => (newA / oldA);

                // Calculate the new value of b based on the change in a
                var newA = image.width; // Replace with the new value of a
                var adjustedB = b * changeRatio(newA, a);
                const reductionAmount = adjustedB 
                // Calculate the scaling factor
                const scaleFactor = (image.width - reductionAmount) / image.width;
                
              props.setUploadedHeight(image.height)
              props.setUploadedWidth(image.width)
              props.setSignatureWidth(image.width * scaleFactor);
              props.setSignatureHeight(image.height * scaleFactor);
            //   // console.log(image.width)
            //   // console.log(image.height)
              if (image.width < 200 || image.height < 200) {
                setBadSignature(true);
              } else {
                let signature = getComponent(document.getElementById('signature'), 'signature');
                signature.load(selectedValue);
                props.setTempSignature(selectedValue);
          
              }
            };
        }
 
          
     
    }

    function onSelect1(e) {
        if(checked && signaturetitle === '')
        {
            setOpenAlert(true)
            setAlertMsg('please provide a title for the new signature above')
            setAlertSeverity('error')
            setTimeout(
            function() {
            setOpenAlert(false);
            }, 3000)
        }
        else{
            if(!addTimeStamp && ! addDateStamp && !addEmail){
                props.setHasAnnotations(false)
                props.setTempSignature(props.tempUploadedsignature);
                       
                if(props.pagetype === 'selfsign'){
                   
                    var viewer = document.getElementById('previewer').ej2_instances[0];
                    viewer.customStampSettings = {
                        isLock: false,
                        width:props.signaturewidth,
                        height:props.signatureheight,
                        customStamps: [{
                            customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
                            props.tempUploadedsignature
                            ,
                        }],
                    };
            
                    // document.getElementById('complete').style.display="block";
                }
                else{
                   
                    var viewer = document.getElementById('previewer2').ej2_instances[0];
                    viewer.customStampSettings = {
                        isLock: false,
                        width:props.signaturewidth,
                        height:props.signatureheight,
                        customStamps: [{
                            customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
                            props.tempUploadedsignature
                            ,
                        }],
                    };
                
                
                    // document.getElementById('complete').style.display="block";
                }
    
                props.setAddSignature(true)
                let signature = getComponent(document.getElementById('signature'), 'signature');
                if (!signature.disabled && !signature.isReadOnly) {
                    signature.clear();
                }
                setSelectedSignature('');
                props.setOpenDialogSignature(false)
                // signature.save(text, 'Signature');
                if(checked === true){
                    let data = JSON.stringify({
                        "email": props.signeremail,
                        "signature": signatureforsaving,
                        "titile":signaturetitle
                    });
                    
                    let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    data : data
                    };
                    
                    axios.request(config)
                    .then((response) => {
                    // // console.log(JSON.stringify(response.data));
                    setChecked(false)
                    })
                    .catch((error) => {
                    // // console.log(error);
                    });
                    
                }
                
            

                
            }
            else{
                if(addTimeStamp && !addDateStamp){
                    props.setHasAnnotations(true)
                    let data = JSON.stringify({
                        "signature": `${props.tempUploadedsignature}`,
                        "signerGuid": `${props.signerguid}`,
                        "signerEmail": addEmail,
                        "signTimestamp": addTimeStamp,
                        "date": true
                        });
                    let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: `${constants.devApi2BaseUrl}/api/Timestamp`,
                        headers: { 
                            'Content-Type': 'application/json'
                        },
                        data : data
                        };
        
                        axios.request(config)
                        .then((response) => {
                        // // console.log(JSON.stringify(response.data));
                        props.setTempSignature(response.data.signature);
                       
                        if(props.pagetype === 'selfsign'){
                        
                            var viewer = document.getElementById('previewer').ej2_instances[0];
                            viewer.customStampSettings = {
                                isLock: false,
                                width:200,
                                height:50,
                                customStamps: [{
                                    customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
                                    response.data.signature
                                    ,
                                }],
                            };
                    
                            // document.getElementById('complete').style.display="block";
                        }
                        else{
                          
                            var viewer = document.getElementById('previewer2').ej2_instances[0];
                            viewer.customStampSettings = {
                                isLock: false,
                                width:200,
                                height:50,
                                customStamps: [{
                                    customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
                                    response.data.signature
                                    ,
                                }],
                            };
                        
                        
                            // document.getElementById('complete').style.display="block";
                        }
            
                        props.setAddSignature(true)
                        let signature = getComponent(document.getElementById('signature'), 'signature');
                        if (!signature.disabled && !signature.isReadOnly) {
                            signature.clear();
                        }
                        setSelectedSignature('');
                        props.setOpenDialogSignature(false)
                        // signature.save(text, 'Signature');
                        if(checked === true){
                            let data = JSON.stringify({
                                "email": props.signeremail,
                                "signature": signatureforsaving,
                                "titile":signaturetitle
                            });
                            
                            let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
                            headers: { 
                                'Content-Type': 'application/json'
                            },
                            data : data
                            };
                            
                            axios.request(config)
                            .then((response) => {
                            // // console.log(JSON.stringify(response.data));
                            setChecked(false)
                            })
                            .catch((error) => {
                            // // console.log(error);
                            });
                            
                        }
                        
                    
    
                       
                        })
                        .catch((error) => {
                        // // console.log(error);
                        });
                }
                else{
                    props.setHasAnnotations(true)
                    let data = JSON.stringify({
                    "signature": `${props.tempUploadedsignature}`,
                    "signerGuid": `${props.signerguid}`,
                    "signerEmail": addEmail,
                    "signTimestamp": addTimeStamp,
                    "date": addDateStamp
                    });
        
                    let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${constants.devApi2BaseUrl}/api/Timestamp`,
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    data : data
                    };
        
                    axios.request(config)
                    .then((response) => {
                    // // console.log(JSON.stringify(response.data));
                    props.setTempSignature(response.data.signature)
                    setStamp(false)
                    //copy
                    if(props.tempUploadedsignature){
                        if(props.pagetype === 'selfsign'){
                           
                            var viewer = document.getElementById('previewer').ej2_instances[0];
                            viewer.customStampSettings = {
                                isLock: false,
                                width:200,
                                height:50,
                                customStamps: [{
                                    customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
                                    response.data.signature
                                    ,
                                }],
                            };
                    
                            // document.getElementById('complete').style.display="block";
                        }
                        else{
                           
                            var viewer = document.getElementById('previewer2').ej2_instances[0];
                            viewer.customStampSettings = {
                                isLock: false,
                                width:200,
                                height:50,
                                customStamps: [{
                                    customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
                                    response.data.signature
                                    ,
                                }],
                            };
                        
                        
                            // document.getElementById('complete').style.display="block";
                        }
            
                        props.setAddSignature(true)
                        let signature = getComponent(document.getElementById('signature'), 'signature');
                        if (!signature.disabled && !signature.isReadOnly) {
                            signature.clear();
                        }
                        setSelectedSignature('');
                        props.setOpenDialogSignature(false)
                        // signature.save(text, 'Signature');
                        if(checked === true){
                            let data = JSON.stringify({
                                "email": props.signeremail,
                                "signature": signatureforsaving,
                                "titile":signaturetitle
                            });
                            
                            let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
                            headers: { 
                                'Content-Type': 'application/json'
                            },
                            data : data
                            };
                            
                            axios.request(config)
                            .then((response) => {
                            // // console.log(JSON.stringify(response.data));
                            setChecked(false)
                            })
                            .catch((error) => {
                            // // console.log(error);
                            });
                            
                        }
                    
                
    
                    }
                    })
                    .catch((error) => {
                    // // console.log(error);
                    });
                }
            }
           
           
        }
    }
    const handleClose = () => {
        clrBtnClick()
       
        setSelectedSignature('');
        props.setOpenDialogSignature(false);

 
     
    };

    let uploadsignature = async(file)=> {
        let signature = getComponent(document.getElementById('signature'), 'signature');
        
        const convertBase64 = (file) => {
            return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
        
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
        
            fileReader.onerror = (error) => {
                reject(error);
            };
            });
        };
            

        const base64 = await convertBase64(file);
        signature.load(base64);
        setSignatureForSaving(base64)
        props.setTempSignature(base64) 
    }

    function clrBtnClick() {
        props.setSigningPadDisabled(false)
        let signature = getComponent(document.getElementById('signature'), 'signature');
        if (!signature.disabled && !signature.isReadOnly) {
            signature.clear();
           
        }
        props.setTempSignature("");
        // document.getElementById('annotationtext').value=""
    }

    // triggers when file is selected with click
    const handleUploadChange = function(e) {
        const selectedFile = e.target.files[0];
      
        if (e.target.files && e.target.files[0]) {
            if (selectedFile) {
                const image = new Image();
                image.src = URL.createObjectURL(selectedFile);
                image.onload = () => {
                    var a = 620;
                    var b = 450;
    
                    // Calculate the ratio of the change in a
                    var changeRatio = (newA, oldA) => (newA / oldA);
    
                    // Calculate the new value of b based on the change in a
                    var newA = image.width; // Replace with the new value of a
                    var adjustedB = b * changeRatio(newA, a);
                    const reductionAmount = adjustedB 
                 
                    // Calculate the scaling factor
                  const scaleFactor = (image.width - reductionAmount) / image.width;
                  props.setUploadedHeight(image.height)
                  props.setUploadedWidth(image.width)
                  props.setSignatureWidth(image.width * scaleFactor)
                  props.setSignatureHeight(image.height * scaleFactor)
                  // console.log(image.width)
                  // console.log(image.height)
                  if (image.width < 200 || image.height < 200) {
                    setBadSignature(true)
                    inputRef.current.value='';
                  } else {
                  
                    const file = e.target.files[0];
                    uploadsignature(file) 
                    e.target.value = null 
                   
                  }
                };
            }
          
        }
     
       
    };

    // triggers the input when the button is clicked
    const browseFromComputer = () => {
        inputRef.current.click();
    };

    let showUploadForm=()=>{
        props.setSigningPadDisabled(false)
    
        setSelectedSignature('');
       
        clrBtnClick()
       
        props.setSigningPadDisabled(true)
     
      
    }

    let showDrawForm=()=>{
        props.setSigningPadDisabled(false)

        setSelectedSignature('');
       
        // setAnnotationsButtonColor('e-custom-light')
        clrBtnClick()
      
    }

    let showSelectForm=()=>{
        clrBtnClick()
        
        setSelectedSignature('');
      
      
        props.setSigningPadDisabled(true)
  
         

    }


    
  return (
    <>
        <Dialog
            open={props.opendialogsignature}
            keepMounted
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            className='text-center'
        >
            <Box sx={{ width: '80%' , typography: 'body1' }}>
                <TabContext value={value}>
                    <DialogTitle className="text-center" style={{  backgroundColor: '#ffff', color: "#5555" }}>

                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="text-center">
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Select " value="1"  onClick={showSelectForm}/>
                            <Tab label="Draw " value="2"  onClick={showDrawForm}/>
                            <Tab label="Upload " value="3" onClick={showUploadForm}/>
                            </TabList>
                        </Box>
                    
                    </DialogTitle>

                    
                    <div style={{overflow:'hidden'}}>
                        <DialogContent className='row text-center'  >
                        <SignatureUploadMsgDialog
                        signatureWidth={props.uploadedsignaturewidth}
                        signatureHeight={props.uploadedsignatureheight}
                        badsignature={badsignature}
                        setBadSignature={setBadSignature}
                        />
                        <div className='col-md-7 col-sm-12 text-center card ' style={{borderRadius:'0',borderTop:'none',boxShadow:'0'}}>
                            <SignatureComponent
                                strokeColor='#03045e'
                                // disabled={props.signingpaddidabled}
                                maxStrokeWidth={3}
                                minStrokeWidth={0.5}
                                velocity={0.7}
                                id='signature'
                                style={{ width:'100%',borderStyle: 'dashed', borderColor: '#00509d', borderWidth: '0.5px' }}
                                className=' card '
                            />
                            <TabPanel  value="2" sx={{ height: "10px" }}>
                                <span className='input-group d-flex justify-content-center'>
                                {checked ? (
                                        <>
                                            <input
                                            type='text'
                                            style={{ width: '50%' }}
                                            onChange={(e) => setSignatureTitle(e.target.value)}
                                            className='form-control form-control-sm '
                                            placeholder='Enter signature title here'
                                            />
                                        </>
                                        ) : (
                                        <></>
                                        )}
                                        <label className='my-1' style={{ fontSize: '13px' }}>Save Signature? </label>
                                        <Switch
                                        checked={checked}
                                        onChange={changeSavedSwitch}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                </span>
                            </TabPanel>
                            <TabPanel  value="3" sx={{ height: "10px" }}>
                                <span className='input-group d-flex justify-content-center'>
                                {checked ? (
                                        <>
                                            <input
                                            type='text'
                                            style={{ width: '50%' }}
                                            onChange={(e) => setSignatureTitle(e.target.value)}
                                            className='form-control form-control-sm '
                                            placeholder='Enter signature title here'
                                            />
                                        </>
                                        ) : (
                                        <></>
                                        )}
                                        <label className='my-2' style={{ fontSize: '13px' }}>Save Signature? </label>
                                        <Switch
                                        checked={checked}
                                        onChange={changeSavedSwitch}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                       
                                    />
                                </span>
                            </TabPanel>
                            <div className='input-group '>


                                {/* Drawn signature */}
                                <TabPanel value="1" sx={{ height: "15px" , marginBottom:'15px'}}>
                                {/* Uploaded signature */}
                                {props.tempUploadedsignature !== '' && !stamp ? (
                                <>
                                <ButtonComponent
                                    cssClass='e-custom-primary'
                                    style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '13px' }}
                                    className='m-2'
                                    disabled={false}
                                    onClick={onSelect1}
                                >
                                    <i className="fas fa-map-marker-alt mx-1"></i>Place selected Signature
                                </ButtonComponent>
                                </>
                                ) : (
                                <> </>
                                )}
                                <ButtonComponent
                                    cssClass='e-custom-light'
                                    style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '13px' }}
                                    className='m-2'
                                    disabled={false}
                                    onClick={handleClose}
                                    >
                                    <i className="fas fa-times mx-1"></i> Cancel
                                    </ButtonComponent>
                                </TabPanel>
                                <TabPanel value="2" sx={{ height: "15px" ,marginBottom:'15px'}}>
                                <div >

                                </div>
                                <ButtonComponent
                                    cssClass='e-custom-primary'
                                    style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '13px' }}
                                    id='placeDrawn'
                                    className='m-2'
                                    disabled={false}
                                    onClick={onSelect}
                                    >
                                    <i className="fas fa-map-marker-alt mx-1"></i> Place Drawn Signature
                                    </ButtonComponent>
                                    <ButtonComponent
                                    id='clear'
                                    cssClass='e-custom-warning'
                                    style={{ textTransform: 'none', fontWeight: 'lighter' }}
                                    className='m-2'
                                    disabled={false}
                                    onClick={clrBtnClick}
                                    >
                                    <i className="fas fa-eraser mx-1"></i> Clear
                                    </ButtonComponent>
                                    <ButtonComponent
                                    cssClass='e-custom-light'
                                    style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '13px' }}
                                    className='m-2'
                                    disabled={false}
                                    onClick={handleClose}
                                    >
                                    <i className="fas fa-times mx-1"></i> Cancel
                                    </ButtonComponent>

                                </TabPanel>
                                <TabPanel value="3" sx={{ height: "15px",marginBottom:'15px' }}>
                                <div >

                                </div>
                                    {/* Uploaded signature */}
                                {props.tempUploadedsignature !== '' && !stamp ? (
                                <>
                                <ButtonComponent
                                    cssClass='e-custom-primary'
                                    style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '13px' }}
                                    className='m-2'
                                    disabled={false}
                                    onClick={onSelect1}
                                >
                                    <i className="fas fa-map-marker-alt mx-1"></i>Place Uploaded Signature
                                </ButtonComponent>
                                </>
                                ) : (
                                <> </>
                                )}
                                <ButtonComponent
                                    cssClass='e-custom-light'
                                    style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '13px' }}
                                    className='m-2'
                                    disabled={false}
                                    onClick={handleClose}
                                    >
                                    <i className="fas fa-times mx-1"></i> Cancel
                                    </ButtonComponent>

                                </TabPanel>





                            </div>
                        </div>
                        <div className='col-md-5 col-sm-12 text-center'>
                    
                        
                            <TabPanel value="1">
                                {/* Select Signature */}
                                <div >

                        
                                <div className='input-group '>  
                            
                                    <FormControl variant="filled" style={{ width: "100%" }}>
                                  
                                    <select
                                        ref={selectRef}
                                        labelId="ss"
                                        id="s"
                                        value={selectedsignature}
                                        onChange={(e) => previewSaved(e, e.target.value)}
                                        name="s"
                                        className='form-control form-control-md form-select'
                                    >
                                       <option value="" style={{ fontSize: "13px" }} className='text-muted' disabled>
                                            {props.signersavedsignatures.length > 0
                                            ? `Please select`
                                            : "No saved signatures"}
                                        </option>
                                        {props.signersavedsignatures?
                                        <>
                                             {props.signersavedsignatures.map((s, index) => (
                                        <option key={index} value={s.signature} style={{ fontSize: "14px" }}>{s.title}</option>
                                        ))}
                                        </>:<></>}
                                       
                                    </select>
                                    </FormControl>
                                    
                                </div>
                                
                                <p className='text-center p-2 text-center text-dark my-3' style={{ fontWeight: '200',  fontSize: '14px' }}>
                                        <i class="fas fa-hand-pointer mx-1" style={{fontSize:'20px'}}></i> Select Signature    
                                    </p>
                                
                            
                            
                                </div>
                            </TabPanel>
                            <TabPanel value="2">
                                {/* Draw Signature */}
                                <div className='text-center' >
                            
                                <p className='text-center p-2 text-center text-dark' style={{ fontWeight: '200',  fontSize: '14px' }}>
                                    <i class="fas fa-pen-alt mx-1" style={{fontSize:'20px'}}></i> Draw Signature      
                                </p>
                        
                                </div>
                            </TabPanel>
                            <TabPanel value="3">
                                <input
                                    ref={inputRef}
                                    type="file"
                                    id="file-upload-form"
                                    mmultiple={false}
                                    accept="image/png"
                                    onChange={handleUploadChange}
                                    hidden
                                />
                            <div className='text-center  ' >
                                        <p className='text-center text-dark' style={{ fontWeight: '200', fontSize: '14px' }}><i class="fas fa-upload mx-1" style={{fontSize:'20px'}}></i> Upload Signature</p>
                                    </div>
                                <div className=' d-flex justify-content-center'>
                                
                                    <ButtonComponent
                                    cssClass='e-custom-primary my-2'
                                    style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: "11px" }}
                                    className='mx-3'
                                    content='Browse from Device'
                                    disabled={false}
                                    onClick={browseFromComputer}
                                    />
                                
                                </div>
                            
                                <p style={{ fontSize: '13px' }}>( Kindly upload an image with dimentions of at least 200 width x 200 height )</p>
                            
                            </TabPanel>
                        <hr/>
                        <Alerts alertseverity={alertseverity} alertmsg={alertmsg} openalert={openalert} setOpenAlert={setOpenAlert} />

                            <div >
                                <small style={{color: '#00509d'}} className='my-1'>Signature  Customization </small>
                                <div className='d-flex justify-content-center'>
                                    <FormGroup className='text-center'>
                                        <FormControlLabel style={{fontSize:'10px'}}
                                        control={<Checkbox checked={addEmail}  onChange={handleAddEmailChange} />}
                                        label={<span style={{ fontSize: '13px' }}>{"Add email stamp"}</span>}
                                        />
                                        <FormControlLabel style={{fontSize:'10px'}}
                                        control={<Checkbox checked={addDateStamp}  onChange={handleAddDateStampChange} />}
                                        label={<span style={{ fontSize: '13px' }}>{"Add date stamp"}</span>}
                                        />
                                        <FormControlLabel style={{fontSize:'10px'}}
                                        control={<Checkbox checked={addTimeStamp}  onChange={handleAddTimeStampChange} />}
                                        label={<span style={{ fontSize: '13px' }}>{"Add date & time stamp"}</span>}
                                        />
                                    </FormGroup>

                                    {/* <button className='btn btn-primary'  onClick={handleButtonClick}>
                                        Get Values
                                    </button> */}
                        
                                </div>
                            </div>
                        
                        </div>
                        </DialogContent>
                    </div>
                </TabContext>
            </Box>

        </Dialog>

    </>
  );
}


export default  SignatureDialog

