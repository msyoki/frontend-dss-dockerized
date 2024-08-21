import * as React from 'react';
import { useState, useRef } from 'react';

import Dialog from '@mui/material/Dialog';

import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';
import { SignatureComponent } from '@syncfusion/ej2-react-inputs';
import { getComponent } from '@syncfusion/ej2-base';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import Switch from '@mui/material/Switch';
import axios from 'axios'
import Alerts from './Alert';
import { CircularProgress } from '@mui/material';
import imageCompression from 'browser-image-compression';


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

import FormControl from '@mui/material/FormControl';
import * as constants from '../components/constants/constants'
import SignatureUploadMsgDialog from './SignatureUploadMsgDialog';


const SignatureDialog = (props) => {
    
    const [addEmail, setAddEmail] = useState(false);
    const [addDateStamp, setAddDateStamp] = useState(false);
    const [addTimeStamp, setAddTimeStamp] = useState(false);
    const [loading,setLoading]=useState(false)
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


    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const selectRef = useRef();

    const [selectedsignature, setSelectedSignature] = React.useState('');

    const inputRef = React.useRef(null);
 
    let [openalert, setOpenAlert] = useState(false)
    let [alertseverity, setAlertSeverity] = useState('info')
    let [alertmsg, setAlertMsg] = useState('')
    let [checked, setChecked] = useState(false);

    // let [signatureWidth,setSignatureWidth]=useState('');
    // let [signatureHeight,setSignatureHeight]=useState('');

    let [badsignature, setBadSignature] = useState(false);
    let [signatureforsaving, setSignatureForSaving] = useState('')
    const [signaturetitle, setSignatureTitle] = useState('')
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('md');
    const [stamp, setStamp] = React.useState(false);


    let changeSavedSwitch = (e) => {
        setChecked(e.target.checked);

    }

 
    function onSelect(e) {
        if (checked && signaturetitle === '') {
            setOpenAlert(true)
            setAlertMsg('please provide a title to save the signature')
            setAlertSeverity('error')
            setTimeout(
                function () {
                    setOpenAlert(false);
                }, 3000)
        }
        else {
            // Has timestamp only No annotations
            // if (!addTimeStamp && !addDateStamp && !addEmail) {
            //     // console.log("no annotations")
            //     props.setHasAnnotations(false)
            //     let signature = getComponent(document.getElementById('signature'), 'signature');
            //     props.setTempSignature(signature.signatureValue);
            //     props.setSaveSignature(signature.signatureValue)
            //     let signaturetype = "drawn"
                
            //     props.pdskPlaceSignature(signature.signatureValue, signaturetype, false)
            //     // alert(`${signature.signatureValue}`)
            //     props.setAddSignature(true)
            //     props.setOpenDialogSignature(false)
            //     // signature.save(text, 'Signature');
            //     if (checked === true) {
            //         let data = JSON.stringify({
            //             "email": props.signeremail,
            //             "signature": signature.signatureValue,
            //             "titile": signaturetitle
            //         });
                    

            //         let config = {
            //             method: 'post',
            //             maxBodyLength: Infinity,
            //             url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
            //             headers: {
            //                 'Content-Type': 'application/json'
            //             },
            //             data: data
            //         };

            //         axios.request(config)
            //             .then((response) => {
            //                 // console.log(JSON.stringify(response.data));
            //                 setChecked(false)
            //             })
            //             .catch((error) => {
            //                 console.log(error);
            //             });

            //     }
            // }
            // else {
            //     // Has timestamp only No annotations
            //     if (addTimeStamp && !addDateStamp) {

            //         props.setHasAnnotations(true)
            //         let signature = getComponent(document.getElementById('signature'), 'signature');
            //         let data = JSON.stringify({
            //             "signature": `${signature.signatureValue}`,
            //             "email":`${props.signeremail}`,
            //             "signerGuid": `${props.signerguid}`,
            //             "signerEmail": addEmail,
            //             "signTimestamp": addTimeStamp,
            //             "date": true
            //         });

                 
            //         let config = {
            //             method: 'post',
            //             maxBodyLength: Infinity,
            //             // url: `${constants.devApi2BaseUrl}/api/Timestamp`,
            //             url:`${constants.devApiBaseUrl}/api/annotate/`,
            //             headers: {
            //                 'Content-Type': 'application/json'
            //             },
            //             data: data
            //         };
            //         setLoading(true)

            //         axios.request(config)
            //             .then((response) => {
            //                 // console.log(JSON.stringify(response.data));
            //                 if (response.data.signature) {
            //                     setLoading(false)
            //                     props.setSaveSignature(signature.signatureValue)
            //                     props.setTempSignature(response.data.signature);

            //                     let signaturetype = "drawn"

            //                     props.pdskPlaceSignature(response.data.signature, signaturetype, true)


            //                     // alert(`${signature.signatureValue}`)
            //                     props.setAddSignature(true)
            //                     props.setOpenDialogSignature(false)
            //                     // signature.save(text, 'Signature');
            //                     if (checked === true) {
            //                         let data = JSON.stringify({
            //                             "email": props.signeremail,
            //                             "signature": signature.signatureValue,
            //                             "titile": signaturetitle
            //                         });

            //                         let config = {
            //                             method: 'post',
            //                             maxBodyLength: Infinity,
            //                             url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
            //                             headers: {
            //                                 'Content-Type': 'application/json'
            //                             },
            //                             data: data
            //                         };

            //                         axios.request(config)
            //                             .then((response) => {
            //                                 // console.log(JSON.stringify(response.data));
            //                                 setChecked(false)
            //                             })
            //                             .catch((error) => {
            //                                 // console.log(error);
            //                             });

            //                     }
            //                 }
            //             })
            //             .catch((error) => {
            //                 console.log(error);
            //             });
            //     }
            //     // Has all annotations
            //     else {
            //         // console.log("annotations")
            //         props.setHasAnnotations(true)
            //         let signature = getComponent(document.getElementById('signature'), 'signature');
            //         console.log(signature.signatureValue)
            //         let data = JSON.stringify({
            //             "signature": `${signature.signatureValue}`,
            //             "email":`${props.signeremail}`,
            //             "signerGuid": `${props.signerguid}`,
            //             "signerEmail": addEmail,
            //             "signTimestamp": addTimeStamp,
            //             "date": addDateStamp
            //         });
               
                  
            //         let config = {
            //             method: 'post',
            //             maxBodyLength: Infinity,
            //             // url: `${constants.devApi2BaseUrl}/api/Timestamp`,
            //             url:`${constants.devApiBaseUrl}/api/annotate/`,
            //             headers: {
            //                 'Content-Type': 'application/json'
            //             },
            //             data: data
            //         };
            //         setLoading(true)
            //         axios.request(config)
            //             .then((response) => {
            //                 // console.log(JSON.stringify(response.data));
            //                 setLoading(false)
            //                 props.setTempSignature(response.data.signature);
            //                 if (response.data.signature) {
            //                     props.setSaveSignature(signature.signatureValue)
            //                     let signaturetype = "drawn"
            //                     props.pdskPlaceSignature(response.data.signature, signaturetype, true)

            //                     props.setAddSignature(true)
            //                     props.setOpenDialogSignature(false)
            //                     // signature.save(text, 'Signature');
            //                     if (checked === true) {
            //                         let data = JSON.stringify({
            //                             "email": props.signeremail,
            //                             "signature": signature.signatureValue,
            //                             "titile": signaturetitle
            //                         });

            //                         let config = {
            //                             method: 'post',
            //                             maxBodyLength: Infinity,
            //                             url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
            //                             headers: {
            //                                 'Content-Type': 'application/json'
            //                             },
            //                             data: data
            //                         };

            //                         axios.request(config)
            //                             .then((response) => {
            //                                 // console.log(JSON.stringify(response.data));
            //                                 setChecked(false)
            //                             })
            //                             .catch((error) => {
            //                                 // console.log(error);
            //                             });

            //                     }
            //                 }
            //             })
            //             .catch((error) => {
            //                 console.log(error);
            //                 // console.log(data)
            //             });
            //     }
            // }
            props.setHasAnnotations(true)
            let signature = getComponent(document.getElementById('signature'), 'signature');
         

            let annotate=false
            if ( addTimeStamp || addDateStamp || addEmail){
              
                annotate=true
            }
         
            let data = JSON.stringify({
                "signature": `${signature.signatureValue}`,
                "email":`${props.signeremail}`,
                // "signerGuid": `${props.signerguid}`,
                // "signerEmail": addEmail,
                "signTimestamp": addTimeStamp,
                "date": addDateStamp,
                "annotate":annotate
            });
            // console.log(data)
  
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                // url: `${constants.devApi2BaseUrl}/api/Timestamp`,
                url:`${constants.devApiBaseUrl}/api/annotate/`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
           
            setLoading(true)
            axios.request(config)
                .then((response) => {
                    // console.log(response.data.signature.image);
                    setLoading(false)
                    props.setTempSignature(response.data.signature.image);
                    if (response.data.signature) {
                        props.setSaveSignature(signature.signatureValue)
                        let signaturetype = "drawn"
                        props.pdskPlaceSignature(response.data.signature.image, signaturetype, annotate)

                        props.setAddSignature(true)
                        props.setOpenDialogSignature(false)
                        // signature.save(text, 'Signature');
                        if (checked === true) {
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
                                data: data
                            };

                            axios.request(config)
                                .then((response) => {
                                    // console.log(JSON.stringify(response.data));
                                    setChecked(false)
                                })
                                .catch((error) => {
                                    // console.log(error);
                                });

                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    // console.log(data)
                });



        }

    }

    let previewSaved = async (e, selectedValue) => {
        setSelectedSignature(e.target.value);

        if (selectedValue) {
            let signature = getComponent(document.getElementById('signature'), 'signature');



            const resizeImage = (base64String) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = selectedValue;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = 250;
                        let height = 500;
                        const aspectRatio = img.width / img.height;


                        // if (aspectRatio > 1.5) {
                        height = width / aspectRatio;
                        // } else {
                        //     width = height * aspectRatio;
                        // }
                        canvas.width = width;
                        canvas.height = height;
                        props.setUploadedHeight(height / 2)
                        props.setUploadedWidth(width / 2)
                        props.setSignatureWidth(width / 2);
                        props.setSignatureHeight(height / 2);
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL('image/png'));
                    };
                });
            };


            const resizedBase64 = await resizeImage(selectedValue);
            signature.load(resizedBase64);
            setSignatureForSaving(selectedValue)
            props.setTempSignature(selectedValue)



        }




    }

    const onSelect1 = async () => {
  
        if (checked && signaturetitle === '') {
            setOpenAlert(true)
            setAlertMsg('please provide a title for the new signature above')
            setAlertSeverity('error')
            setTimeout(
                function () {
                    setOpenAlert(false);
                }, 3000)
        }
        else {
            let annotate=false
            if (addTimeStamp || addDateStamp || addEmail) {
               
                annotate=true
            }
            props.setHasAnnotations(true)
            let data = JSON.stringify({
                "signature": `${props.tempUploadedsignature}`,
                "email":`${props.signeremail}`,
                // "signerGuid": `${props.signerguid}`,
                // "signerEmail": addEmail,
                "signTimestamp": addTimeStamp,
                "date": addDateStamp,
                "annotate": props.isStamp? false: annotate
            });

        
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                // url: `${constants.devApi2BaseUrl}/api/Timestamp`,
                url:`${constants.devApiBaseUrl}/api/annotate/`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            setLoading(true)
            // console.log(data)
            axios.request(config)
                .then((response) => {
                    setLoading(false)
                    // console.log(JSON.stringify(response.data.signature.image));
                    props.setTempSignature(response.data.signature.image)
                    setStamp(false)
                    //copy
                    if (props.tempUploadedsignature) {
                        let signaturetype = "upload"
                        props.pdskPlaceSignature(response.data.signature.image, signaturetype, annotate)


                        props.setAddSignature(true)
                        let signature = getComponent(document.getElementById('signature'), 'signature');
                        if (!signature.disabled && !signature.isReadOnly) {
                            signature.clear();
                        }
                        setSelectedSignature('');
                        props.setOpenDialogSignature(false)
                        // signature.save(text, 'Signature');
                        if (checked === true) {
                            let data = JSON.stringify({
                                "email": props.signeremail,
                                "signature": signatureforsaving,
                                "titile": signaturetitle
                            });

                            let config = {
                                method: 'post',
                                maxBodyLength: Infinity,
                                url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                data: data
                            };

                            axios.request(config)
                                .then((response) => {
                                    // console.log(JSON.stringify(response.data));
                                    setChecked(false)
                                })
                                .catch((error) => {
                                    // console.log(error);
                                });

                        }



                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            // if (props.isStamp) {
            //     props.setHasAnnotations(false)
            //     props.setTempSignature(props.tempUploadedsignature);
            //     let signaturetype = "upload"
            //     props.pdskPlaceSignature(props.tempUploadedsignature, signaturetype, false)


            //     props.setAddSignature(true)
            //     let signature = getComponent(document.getElementById('signature'), 'signature');
            //     if (!signature.disabled && !signature.isReadOnly) {
            //         signature.clear();
            //     }
            //     setSelectedSignature('');
            //     props.setOpenDialogSignature(false)
            //     // signature.save(text, 'Signature');
            //     if (checked === true) {
            //         let data = JSON.stringify({
            //             "email": props.signeremail,
            //             "signature": signatureforsaving,
            //             "titile": signaturetitle
            //         });

            //         let config = {
            //             method: 'post',
            //             maxBodyLength: Infinity,
            //             url: `${constants.devApi2BaseUrl}/api/SaveStamp/Create`,
            //             headers: {
            //                 'Content-Type': 'application/json'
            //             },
            //             data: data
            //         };

            //         axios.request(config)
            //             .then((response) => {
            //                 // console.log(JSON.stringify(response.data));
            //                 setChecked(false)
            //             })
            //             .catch((error) => {
            //                 // console.log(error);
            //             });

            //     }
            // } else {
            //     // if (!addTimeStamp && !addDateStamp && !addEmail) {
            //     //     props.setHasAnnotations(false)
            //     //     props.setTempSignature(props.tempUploadedsignature);
            //     //     let signaturetype = "upload"
            //     //     props.pdskPlaceSignature(props.tempUploadedsignature, signaturetype, false)


            //     //     props.setAddSignature(true)
            //     //     let signature = getComponent(document.getElementById('signature'), 'signature');
            //     //     if (!signature.disabled && !signature.isReadOnly) {
            //     //         signature.clear();
            //     //     }
            //     //     setSelectedSignature('');
            //     //     props.setOpenDialogSignature(false)
            //     //     // signature.save(text, 'Signature');
            //     //     if (checked === true) {
            //     //         let data = JSON.stringify({
            //     //             "email": props.signeremail,
            //     //             "signature": signatureforsaving,
            //     //             "titile": signaturetitle
            //     //         });

            //     //         let config = {
            //     //             method: 'post',
            //     //             maxBodyLength: Infinity,
            //     //             url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
            //     //             headers: {
            //     //                 'Content-Type': 'application/json'
            //     //             },
            //     //             data: data
            //     //         };

            //     //         axios.request(config)
            //     //             .then((response) => {
            //     //                 // console.log(JSON.stringify(response.data));
            //     //                 setChecked(false)
            //     //             })
            //     //             .catch((error) => {
            //     //                 // console.log(error);
            //     //             });
            //     //     }
            //     // }
            //     // else {
            //     //     // Has timestamp only No annotations
            //     //     if (addTimeStamp && !addDateStamp) {
            //     //         props.setHasAnnotations(true)
            //     //         let data = JSON.stringify({
            //     //             "signature": `${props.tempUploadedsignature}`,
            //     //             "email":`${props.signeremail}`,
            //     //             "signerGuid": `${props.signerguid}`,
            //     //             "signerEmail": addEmail,
            //     //             "signTimestamp": addTimeStamp,
            //     //             "date": true
            //     //         });
            //     //         let config = {
            //     //             method: 'post',
            //     //             maxBodyLength: Infinity,
            //     //             // url: `${constants.devApi2BaseUrl}/api/Timestamp`,
            //     //             url:`${constants.devApiBaseUrl}/api/annotate/`,

            //     //             headers: {
            //     //                 'Content-Type': 'application/json'
            //     //             },
            //     //             data: data
            //     //         };
            //     //         setLoading(true)
            //     //         axios.request(config)
            //     //             .then((response) => {
            //     //                 setLoading(false)
            //     //                 // console.log(JSON.stringify(response.data));
            //     //                 props.setTempSignature(response.data.signature);
            //     //                 let signaturetype = "upload"
            //     //                 props.pdskPlaceSignature(response.data.signature, signaturetype, true)


            //     //                 props.setAddSignature(true)
            //     //                 let signature = getComponent(document.getElementById('signature'), 'signature');
            //     //                 if (!signature.disabled && !signature.isReadOnly) {
            //     //                     signature.clear();
            //     //                 }
            //     //                 setSelectedSignature('');
            //     //                 props.setOpenDialogSignature(false)
            //     //                 // signature.save(text, 'Signature');
            //     //                 if (checked === true) {
            //     //                     let data = JSON.stringify({
            //     //                         "email": props.signeremail,
            //     //                         "signature": signatureforsaving,
            //     //                         "titile": signaturetitle
            //     //                     });

            //     //                     let config = {
            //     //                         method: 'post',
            //     //                         maxBodyLength: Infinity,
            //     //                         url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
            //     //                         headers: {
            //     //                             'Content-Type': 'application/json'
            //     //                         },
            //     //                         data: data
            //     //                     };

            //     //                     axios.request(config)
            //     //                         .then((response) => {
            //     //                             // console.log(JSON.stringify(response.data));
            //     //                             setChecked(false)
            //     //                         })
            //     //                         .catch((error) => {
            //     //                             // console.log(error);
            //     //                         });

            //     //                 }




            //     //             })
            //     //             .catch((error) => {
            //     //                 // console.log(error);
            //     //             });
            //     //     }
            //     //     // Has all annotations
            //     //     else {
            //     //         // console.log("has annotations")
            //     //         props.setHasAnnotations(true)
            //     //         let data = JSON.stringify({
            //     //             "signature": `${props.tempUploadedsignature}`,
            //     //             "email":`${props.signeremail}`,
            //     //             "signerGuid": `${props.signerguid}`,
            //     //             "signerEmail": addEmail,
            //     //             "signTimestamp": addTimeStamp,
            //     //             "date": addDateStamp
            //     //         });
                      
            //     //         let config = {
            //     //             method: 'post',
            //     //             maxBodyLength: Infinity,
            //     //             // url: `${constants.devApi2BaseUrl}/api/Timestamp`,
            //     //             url:`${constants.devApiBaseUrl}/api/annotate/`,
            //     //             headers: {
            //     //                 'Content-Type': 'application/json'
            //     //             },
            //     //             data: data
            //     //         };
            //     //         setLoading(true)
            //     //         // console.log(data)
            //     //         axios.request(config)
            //     //             .then((response) => {
            //     //                 setLoading(false)
            //     //                 // console.log(JSON.stringify(response.data));
            //     //                 props.setTempSignature(response.data.signature)
            //     //                 setStamp(false)
            //     //                 //copy
            //     //                 if (props.tempUploadedsignature) {
            //     //                     let signaturetype = "upload"
            //     //                     props.pdskPlaceSignature(response.data.signature, signaturetype, true)


            //     //                     props.setAddSignature(true)
            //     //                     let signature = getComponent(document.getElementById('signature'), 'signature');
            //     //                     if (!signature.disabled && !signature.isReadOnly) {
            //     //                         signature.clear();
            //     //                     }
            //     //                     setSelectedSignature('');
            //     //                     props.setOpenDialogSignature(false)
            //     //                     // signature.save(text, 'Signature');
            //     //                     if (checked === true) {
            //     //                         let data = JSON.stringify({
            //     //                             "email": props.signeremail,
            //     //                             "signature": signatureforsaving,
            //     //                             "titile": signaturetitle
            //     //                         });

            //     //                         let config = {
            //     //                             method: 'post',
            //     //                             maxBodyLength: Infinity,
            //     //                             url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
            //     //                             headers: {
            //     //                                 'Content-Type': 'application/json'
            //     //                             },
            //     //                             data: data
            //     //                         };

            //     //                         axios.request(config)
            //     //                             .then((response) => {
            //     //                                 // console.log(JSON.stringify(response.data));
            //     //                                 setChecked(false)
            //     //                             })
            //     //                             .catch((error) => {
            //     //                                 // console.log(error);
            //     //                             });

            //     //                     }



            //     //                 }
            //     //             })
            //     //             .catch((error) => {
            //     //                 console.log(error);
            //     //             });
            //     //     }
            //     // }
            //     // let annotate=false
            //     // if (addTimeStamp || addDateStamp || addEmail) {
            //     //     annotate=true
            //     // }
            //     // props.setHasAnnotations(true)
            //     // let data = JSON.stringify({
            //     //     "signature": `${props.tempUploadedsignature}`,
            //     //     "email":`${props.signeremail}`,
            //     //     "signerGuid": `${props.signerguid}`,
            //     //     "signerEmail": addEmail,
            //     //     "signTimestamp": addTimeStamp,
            //     //     "date": addDateStamp,
            //     //     "annotate":annotate
            //     // });
              
            //     // let config = {
            //     //     method: 'post',
            //     //     maxBodyLength: Infinity,
            //     //     // url: `${constants.devApi2BaseUrl}/api/Timestamp`,
            //     //     url:`${constants.devApiBaseUrl}/api/annotate/`,
            //     //     headers: {
            //     //         'Content-Type': 'application/json'
            //     //     },
            //     //     data: data
            //     // };
            //     // setLoading(true)
            //     // // console.log(data)
            //     // axios.request(config)
            //     //     .then((response) => {
            //     //         setLoading(false)
            //     //         // console.log(JSON.stringify(response.data));
            //     //         props.setTempSignature(response.data.signature)
            //     //         setStamp(false)
            //     //         //copy
            //     //         if (props.tempUploadedsignature) {
            //     //             let signaturetype = "upload"
            //     //             props.pdskPlaceSignature(response.data.signature, signaturetype, true)


            //     //             props.setAddSignature(true)
            //     //             let signature = getComponent(document.getElementById('signature'), 'signature');
            //     //             if (!signature.disabled && !signature.isReadOnly) {
            //     //                 signature.clear();
            //     //             }
            //     //             setSelectedSignature('');
            //     //             props.setOpenDialogSignature(false)
            //     //             // signature.save(text, 'Signature');
            //     //             if (checked === true) {
            //     //                 let data = JSON.stringify({
            //     //                     "email": props.signeremail,
            //     //                     "signature": signatureforsaving,
            //     //                     "titile": signaturetitle
            //     //                 });

            //     //                 let config = {
            //     //                     method: 'post',
            //     //                     maxBodyLength: Infinity,
            //     //                     url: `${constants.devApi2BaseUrl}/api/SaveSignature/Create`,
            //     //                     headers: {
            //     //                         'Content-Type': 'application/json'
            //     //                     },
            //     //                     data: data
            //     //                 };

            //     //                 axios.request(config)
            //     //                     .then((response) => {
            //     //                         // console.log(JSON.stringify(response.data));
            //     //                         setChecked(false)
            //     //                     })
            //     //                     .catch((error) => {
            //     //                         // console.log(error);
            //     //                     });

            //     //             }



            //     //         }
            //     //     })
            //     //     .catch((error) => {
            //     //         console.log(error);
            //     //     });
            // }



        }
    }
    const handleClose = () => {
        clrBtnClick()

        setSelectedSignature('');
        props.setOpenDialogSignature(false);



    };

    // let uploadsignature = async (file) => {
    //     let signature = getComponent(document.getElementById('signature'), 'signature');

    //     const convertBase64 = (file) => {
    //         return new Promise((resolve, reject) => {
    //             const fileReader = new FileReader();
    //             fileReader.readAsDataURL(file);

    //             fileReader.onload = () => {
    //                 resolve(fileReader.result);
    //             };

    //             fileReader.onerror = (error) => {
    //                 reject(error);
    //             };
    //         });
    //     };

    //     const resizeImage = (base64String) => {
    //         return new Promise((resolve) => {
    //             const img = new Image();
    //             img.src = base64String;
    //             img.onload = () => {
    //                 const canvas = document.createElement('canvas');
    //                 let width = 250;
    //                 let height = 500;
    //                 const aspectRatio = img.width / img.height;

    //                 // if (aspectRatio > 1.5) {
    //                 height = width / aspectRatio;
    //                 // } else {
    //                 //     width = height * aspectRatio;
    //                 // }
    //                 canvas.width = width;
    //                 canvas.height = height;
    //                 props.setUploadedHeight(height / 2)
    //                 props.setUploadedWidth(width / 2)
    //                 props.setSignatureWidth(width / 2);
    //                 props.setSignatureHeight(height / 2);
    //                 const ctx = canvas.getContext('2d');
    //                 ctx.drawImage(img, 0, 0, width, height);
    //                 resolve(canvas.toDataURL('image/png'));
    //             };
    //         });
    //     };

    //     const base64 = await convertBase64(file);
    //     const resizedBase64 = await resizeImage(base64);
    //     signature.load(resizedBase64);
    //     setSignatureForSaving(base64)
    //     props.setTempSignature(base64)
    // }
  
    let uploadsignature = async (file) => {
        let signature = getComponent(document.getElementById('signature'), 'signature');

        const compressImage = async (file) => {
            const options = {
                maxSizeMB: 1, // Maximum size in MB
                maxWidthOrHeight: 500, // Maximum width or height in pixels
                useWebWorker: true,
            };
            try {
                const compressedFile = await imageCompression(file, options);
                return compressedFile;
            } catch (error) {
                console.error("Error compressing image:", error);
            }
        };

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

        const resizeImage = (base64String) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = base64String;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = 250;
                    let height = 500;
                    const aspectRatio = img.width / img.height;

                    // if (aspectRatio > 1.5) {
                    height = width / aspectRatio;
                    // } else {
                    //     width = height * aspectRatio;
                    // }
                    canvas.width = width;
                    canvas.height = height;
                    props.setUploadedHeight(height / 2)
                    props.setUploadedWidth(width / 2)
                    props.setSignatureWidth(width / 2);
                    props.setSignatureHeight(height / 2);
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/png'));
                };
            });
        };

        const compressedFile = await compressImage(file);
        const base64 = await convertBase64(compressedFile);
        const resizedBase64 = await resizeImage(base64);
        signature.load(resizedBase64);
        setSignatureForSaving(base64)
        props.setTempSignature(base64)
    };


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
    const handleUploadChange = function (e) {
        const selectedFile = e.target.files[0];

        if (e.target.files && e.target.files[0]) {
            if (selectedFile) {
                const image = new Image();
                image.src = URL.createObjectURL(selectedFile);
                image.onload = () => {
                    // Desired dimensions in centimeters
                    // const desiredWidthInCm = 4;
                    // const desiredHeightInCm = 2;

                    // // Convert centimeters to pixels using typical DPI (dots per inch) for screens
                    // const dpi = 96; // Typical screen DPI
                    // const desiredWidth = desiredWidthInCm * dpi / 2.54; // 2.54 cm per inch
                    // const desiredHeight = desiredHeightInCm * dpi / 2.54;

                    // // Calculate scaling factors for width and height
                    // const scaleFactorWidth = desiredWidth / image.width;
                    // const scaleFactorHeight = desiredHeight / image.height;

                    // // Use the smaller scaling factor to ensure the image fits within the desired dimensions
                    // const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);

                    // // Calculate the new dimensions
                    // const newWidth = Math.round(image.width * scaleFactor);
                    // const newHeight = Math.round(image.height * scaleFactor);

                    // // Display the new dimensions
                    // console.log("New width:", newWidth, "pixels");
                    // console.log("New height:", newHeight, "pixels");

                    // props.setUploadedHeight(newHeight)
                    // props.setUploadedWidth(newWidth)
                    // props.setSignatureWidth(newWidth)
                    // props.setSignatureHeight(newHeight)

                    if (image.width < 200 || image.height < 200) {
                        setBadSignature(true)
                        inputRef.current.value = '';
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

    let showUploadForm = () => {
        props.setSigningPadDisabled(false)

        setSelectedSignature('');

        clrBtnClick()

        props.setSigningPadDisabled(true)


    }

    let showDrawForm = () => {
        props.setSigningPadDisabled(false)

        setSelectedSignature('');

        // setAnnotationsButtonColor('e-custom-light')
        clrBtnClick()

    }

    let showSelectForm = () => {
        clrBtnClick()

        setSelectedSignature('');


        props.setSigningPadDisabled(true)



    }



    return (

        <Dialog
            open={props.opendialogsignature}
            keepMounted
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            className='text-center'
            style={{ height: '100%' }}


        >
            <div style={{ overflowX: 'hidden' }}>
                {props.isStamp ?
                    <TabContext value={value} >
                        <DialogTitle className="text-center" style={{ backgroundColor: '#ffff', color: "#5555" }}>

                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="text-center">
                                <TabList onChange={handleChange} aria-label="lab API tabs example">


                                    <Tab label="Upload " selected value="1" style={{ fontSize: '13px' }} onClick={showUploadForm} />

                                    <Tab label="Select " value="2" style={{ fontSize: '13px' }} onClick={showSelectForm} />

                                </TabList>
                            </Box>

                        </DialogTitle>

                        <DialogContent className='row text-center '  >

                            <div className='col-md-8 col-sm-12' >

                                <SignatureUploadMsgDialog
                                    signatureWidth={props.uploadedsignaturewidth}
                                    signatureHeight={props.uploadedsignatureheight}
                                    badsignature={badsignature}
                                    setBadSignature={setBadSignature}
                                />

                                <SignatureComponent
                                    strokeColor='#03045e'
                                    maxStrokeWidth={3}
                                    minStrokeWidth={0.5}
                                    velocity={0.7}
                                    id='signature'
                                    style={{
                                        borderStyle: 'dashed',
                                        borderColor: '#00509d',
                                        width: '100%', // Adjust width to match the dimensions of the uploaded images
                                        height: '55%', // Adjust height to match the dimensions of the uploaded images
                                        backgroundPosition: 'center', // Center the background image
                                        backgroundSize: 'contain', // Ensure the image fits within the signature pad
                                        backgroundRepeat: 'no-repeat', // Prevent the image from repeating
                                    }}


                                />
                                <TabPanel value="1" >
                                    {checked ? (
                                        <>
                                            <FormControl component="fieldset" variant="standard" style={{ width: '100%' }}>
                                                <input
                                                    type='text'
                                                    onChange={(e) => setSignatureTitle(e.target.value)}
                                                    className='form-control form-control-sm'
                                                    placeholder='Enter signature title here'
                                                    required
                                                />
                                                <FormGroup style={{ fontSize: '12px' }}>

                                                    <FormControlLabel
                                                        label={<span style={{ fontSize: '12px' }}>Save Stamp?</span>}
                                                        control={
                                                            <>

                                                                <Switch checked={checked} onChange={changeSavedSwitch} inputProps={{ 'aria-label': 'controlled' }} />

                                                            </>
                                                        }

                                                    />

                                                </FormGroup>
                                            </FormControl>

                                        </>
                                    ) : (
                                        <>

                                            <FormControl component="fieldset" variant="standard" style={{ width: '100%' }}>
                                                <FormGroup style={{ fontSize: '12px' }}>

                                                    <FormControlLabel
                                                        label={<span style={{ fontSize: '12px' }}>Save Stamp?</span>}
                                                        control={
                                                            <>

                                                                <Switch checked={checked} onChange={changeSavedSwitch} inputProps={{ 'aria-label': 'controlled' }} />

                                                            </>
                                                        }

                                                    />

                                                </FormGroup>
                                            </FormControl>
                                        </>
                                    )}

                                    {props.tempUploadedsignature !== '' && !stamp ? (
                                        <>
                                            <ButtonComponent
                                                cssClass='e-custom-light'
                                                className='m-2 p-2'
                                                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                disabled={false}
                                                onClick={handleClose}
                                            >
                                                <i className="fas fa-times mx-1"></i> <span className='mx-2'>Cancel</span>
                                            </ButtonComponent>
                                            <ButtonComponent
                                                cssClass='e-custom-primary'

                                                className='m-2 p-2'
                                                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                disabled={false}
                                                onClick={onSelect1}
                                            >
                                                {loading ? <CircularProgress className='text-white' size={15} /> : <i className="fas fa-map-marker-alt mx-1"></i>} <span className='mx-2'>Place Uploaded Stamp</span>
                                            </ButtonComponent>




                                        </>
                                    ) : (
                                        <>

                                            <ButtonComponent
                                                cssClass='e-custom-light'
                                                className='m-2 p-2'
                                                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                disabled={false}
                                                onClick={handleClose}

                                            >
                                                <i className="fas fa-times mx-1"></i>   <span className='mx-2'>Cancel</span>
                                            </ButtonComponent>


                                        </>
                                    )}
                                </TabPanel>
                                {/* Drawn signature */}
                                <TabPanel value="2">
                                    {/* Uploaded signature */}

                                    {props.tempUploadedsignature !== '' && !stamp ? (
                                        <>
                                            <ButtonComponent
                                                cssClass='e-custom-light'
                                                className='m-2 p-2'
                                                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                disabled={false}
                                                onClick={handleClose}
                                            >
                                                <i className="fas fa-times mx-1"></i><span className='mx-2'>Cancel</span>
                                            </ButtonComponent>
                                            <ButtonComponent
                                                cssClass='e-custom-primary'

                                                className='m-2 p-2'
                                                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                disabled={false}
                                                onClick={onSelect1}
                                            >
                                                {loading ? <CircularProgress className='text-white' size={15} /> : <i className="fas fa-map-marker-alt mx-1"></i>}<span className='mx-2'>Place Selected Stamp</span>
                                            </ButtonComponent>





                                        </>
                                    ) : (
                                        <>
                                            <div className='col-md-12 col-sm-12'>

                                                <span className='mr-auto'>
                                                    <ButtonComponent
                                                        cssClass='e-custom-light'
                                                        className='m-2 p-2'
                                                        style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                        disabled={false}
                                                        onClick={handleClose}
                                                    >
                                                        <i className="fas fa-times mx-1" ></i> <span className='mx-2'>Cancel</span>
                                                    </ButtonComponent>
                                                </span>
                                            </div>
                                        </>
                                    )}




                                </TabPanel>


                                <TabPanel value="3" >
                                </TabPanel>




                            </div>

                            <div className='col-md-4 col-sm-12  shadow-lg'>


                                <TabPanel value="2">
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
                                                    {props.signersavedstamps ?
                                                        <>
                                                            <option value="" style={{ fontSize: "13px" }} className='text-muted' disabled>
                                                                {props.signersavedstamps.length > 0
                                                                    ? `Please select`
                                                                    : "No saved stamps"}
                                                            </option>
                                                            {props.signersavedstamps ?
                                                                <>
                                                                    {props.signersavedstamps.map((s, index) => (
                                                                        <option key={index} value={s.signature} style={{ fontSize: "14px" }}>{s.title}</option>
                                                                    ))}
                                                                </>
                                                                :
                                                                <></>

                                                            }

                                                        </> :
                                                        <></>
                                                    }
                                                </select>
                                            </FormControl>

                                        </div>

                                        <p className='text-center p-2 text-center text-dark my-3' style={{ fontWeight: '200', fontSize: '14px' }}>
                                            <i class="fas fa-hand-pointer mx-1" style={{ fontSize: '20px' }}></i> Select Stamp
                                        </p>



                                    </div>
                                </TabPanel>

                                <TabPanel value="1">
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        id="file-upload-form"
                                        mmultiple={false}
                                        accept="image/png"
                                        onChange={handleUploadChange}
                                        hidden
                                    />

                                    <p className='text-center text-dark' style={{ fontWeight: '200', fontSize: '14px' }}><i class="fas fa-upload mx-1" style={{ fontSize: '15px' }}></i> Upload Stamp</p>

                                    <div className=' d-flex justify-content-center'>

                                        <ButtonComponent
                                            cssClass='e-custom-primary'
                                            className='m-2 p-2'
                                            style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                            disabled={false}
                                            onClick={browseFromComputer}
                                        >
                                            <span className='mx-2'>Browse from Device</span>
                                        </ButtonComponent>

                                    </div>

                                    <p style={{ fontSize: '11px' }}>( Kindly upload an image with dimentions of at least 200 width x 200 height )</p>

                                </TabPanel>

                                <Alerts alertseverity={alertseverity} alertmsg={alertmsg} openalert={openalert} setOpenAlert={setOpenAlert} />





                            </div>
                        </DialogContent>

                    </TabContext>
                    :
                    <TabContext value={value} >

                        <DialogTitle className="text-center" style={{ backgroundColor: '#ffff', color: "#5555" }}>

                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="text-center">
                                <TabList onChange={handleChange} aria-label="lab API tabs example">


                                    <Tab label="Draw " value="1" style={{ fontSize: '13px' }} onClick={showDrawForm} />



                                    <Tab label="Upload " value="2" style={{ fontSize: '13px' }} onClick={showUploadForm} />

                                    <Tab label="Select " value="3" style={{ fontSize: '13px' }} onClick={showSelectForm} />

                                </TabList>
                            </Box>

                        </DialogTitle>

                        <DialogContent className=' text-center'   >

                            <div className='row'>
                                <div className='col-md-8 col-sm-12' >
                                    <SignatureUploadMsgDialog
                                        signatureWidth={props.uploadedsignaturewidth}
                                        signatureHeight={props.uploadedsignatureheight}
                                        badsignature={badsignature}
                                        setBadSignature={setBadSignature}
                                    />

                                    <SignatureComponent
                                        strokeColor='#03045e'
                                        maxStrokeWidth={3}
                                        minStrokeWidth={0.5}
                                        velocity={0.7}
                                        id='signature'
                                        style={{
                                            borderStyle: 'dashed',
                                            borderColor: '#00509d',
                                            width: '100%', // Adjust width to match the dimensions of the uploaded images
                                            height: '55%', // Adjust height to match the dimensions of the uploaded images
                                            backgroundPosition: 'center', // Center the background image
                                            backgroundSize: 'contain', // Ensure the image fits within the signature pad
                                            backgroundRepeat: 'no-repeat', // Prevent the image from repeating
                                        }}

                                    />

                                    <TabPanel value="1"  >
                                        {checked ? (
                                            <>

                                                <FormControl component="fieldset" variant="standard" style={{ width: '100%' }}>
                                                    <input
                                                        type='text'
                                                        onChange={(e) => setSignatureTitle(e.target.value)}
                                                        className='form-control form-control-sm'
                                                        placeholder='Enter signature title here'
                                                        required
                                                    />
                                                    <FormGroup style={{ fontSize: '12px' }}>

                                                        <FormControlLabel
                                                            label={<span style={{ fontSize: '12px' }}>Save Signature?</span>}
                                                            control={
                                                                <>

                                                                    <Switch checked={checked} onChange={changeSavedSwitch} inputProps={{ 'aria-label': 'controlled' }} />

                                                                </>
                                                            }

                                                        />

                                                    </FormGroup>
                                                </FormControl>


                                            </>
                                        ) : (

                                            <FormControl component="fieldset" variant="standard" style={{ width: '100%' }}>
                                                <FormGroup style={{ fontSize: '12px' }}>
                                                    <FormControlLabel
                                                        control={<Switch checked={checked} onChange={changeSavedSwitch} inputProps={{ 'aria-label': 'controlled' }} />}
                                                        label={<span style={{ fontSize: '12px' }}>Save Signature?</span>}
                                                    />
                                                </FormGroup>
                                            </FormControl>

                                        )}

                                        <ButtonComponent
                                            id='clear'
                                            cssClass='e-custom-warning'
                                            className='m-2 p-2'
                                            style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                            disabled={false}
                                            onClick={clrBtnClick}
                                        >
                                            <i className="fas fa-eraser mx-1"></i><span className='mx-2'>Clear Pad</span>
                                        </ButtonComponent>

                                        <ButtonComponent
                                            cssClass='e-custom-light'
                                            className='m-2 p-2'
                                            style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                            disabled={false}
                                            onClick={handleClose}
                                        >
                                            <i className="fas fa-times mx-1"></i><span className='mx-2'>Cancel</span>
                                        </ButtonComponent>

                                        <ButtonComponent
                                            cssClass='e-custom-primary'
                                            id='placeDrawn'
                                            className='m-2 p-2'
                                            style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                            disabled={false}
                                            onClick={onSelect}
                                        >
                                            {loading ? <CircularProgress className='text-white' size={15} /> : <i className="fas fa-map-marker-alt mx-1"></i>}<span className='mx-2'>Place Drawn Signature</span>
                                        </ButtonComponent>

                                    </TabPanel>
                                    <TabPanel value="2">
                                        {checked ? (
                                            <>
                                                <FormControl component="fieldset" variant="standard" style={{ width: '100%' }}>
                                                    <input
                                                        type='text'
                                                        onChange={(e) => setSignatureTitle(e.target.value)}
                                                        className='form-control form-control-sm'
                                                        placeholder='Enter signature title here'
                                                        required
                                                    />
                                                    <FormGroup style={{ fontSize: '12px' }}>
                                                        <FormControlLabel
                                                            label={<span style={{ fontSize: '12px' }}>Save Signature?</span>}
                                                            control={
                                                                <>

                                                                    <Switch checked={checked} onChange={changeSavedSwitch} inputProps={{ 'aria-label': 'controlled' }} />

                                                                </>
                                                            }

                                                        />

                                                    </FormGroup>
                                                </FormControl>


                                            </>
                                        ) : (
                                            <>
                                                <FormControl component="fieldset" variant="standard" style={{ width: '100%' }}>
                                                    <FormGroup style={{ fontSize: '12px' }}>
                                                        <FormControlLabel
                                                            label={<span style={{ fontSize: '12px' }}>Save Signature?</span>}
                                                            control={
                                                                <>

                                                                    <Switch checked={checked} onChange={changeSavedSwitch} inputProps={{ 'aria-label': 'controlled' }} />

                                                                </>
                                                            }

                                                        />

                                                    </FormGroup>
                                                </FormControl>
                                            </>
                                        )}
                                        {/* Uploaded signature */}

                                        {props.tempUploadedsignature !== '' && !stamp ? (
                                            <>

                                                <ButtonComponent
                                                    cssClass='e-custom-light'
                                                    className='m-2 p-2'
                                                    style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                    disabled={false}
                                                    onClick={handleClose}
                                                >
                                                    <i className="fas fa-times mx-1"></i> <span className='mx-2'>Cancel</span>
                                                </ButtonComponent>
                                                <ButtonComponent
                                                    cssClass='e-custom-primary'

                                                    className='m-2 p-2'
                                                    style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                    disabled={false}
                                                    onClick={onSelect1}
                                                >
                                                    {loading ? <CircularProgress className='text-white' size={15} /> : <i className="fas fa-map-marker-alt mx-1"></i>}<span className='mx-2'>Place Uploaded Signature</span>
                                                </ButtonComponent>



                                            </>
                                        ) : (
                                            <>
                                                <div className='col-md-12 col-sm-12'>
                                                    <ButtonComponent
                                                        cssClass='e-custom-light'
                                                        className='m-2 p-2'
                                                        style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                        disabled={false}
                                                        onClick={handleClose}

                                                    >
                                                        <i className="fas fa-times mx-1"></i>   <span className='mx-2'>Cancel</span>
                                                    </ButtonComponent>

                                                </div>
                                            </>
                                        )}


                                    </TabPanel>
                                    <TabPanel value="3">
                                        {/* Uploaded signature */}

                                        {props.tempUploadedsignature !== '' && !stamp ? (
                                            <>

                                                <ButtonComponent
                                                    cssClass='e-custom-light'
                                                    className='m-2 p-2'
                                                    style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                    disabled={false}
                                                    onClick={handleClose}
                                                >
                                                    <i className="fas fa-times mx-1"></i><span className='mx-2'>Cancel</span>
                                                </ButtonComponent>
                                                <ButtonComponent
                                                    cssClass='e-custom-primary'

                                                    className='m-2 p-2'
                                                    style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                    disabled={false}
                                                    onClick={onSelect1}
                                                >
                                                    {loading ? <CircularProgress className='text-white' size={15} /> : <i className="fas fa-map-marker-alt mx-1"></i>}<span className='mx-2'>Place Selected Signature</span>
                                                </ButtonComponent>



                                            </>
                                        ) : (
                                            <>
                                                <div className='col-md-12 col-sm-12'>

                                                    <span className='mr-auto'>
                                                        <ButtonComponent
                                                            cssClass='e-custom-light'
                                                            className='m-2 p-2'
                                                            style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                            disabled={false}
                                                            onClick={handleClose}
                                                        >
                                                            <i className="fas fa-times mx-1" ></i> <span className='mx-2'>Cancel</span>
                                                        </ButtonComponent>
                                                    </span>
                                                </div>
                                            </>
                                        )}




                                    </TabPanel>


                                </div>
                                <div className='col-md-4 col-sm-12  shadow-lg '>

                                    <TabPanel value="1" >
                                        {/* Draw Signature */}

                                        <p className='text-center p-2 text-center text-dark' style={{ fontWeight: '200', fontSize: '14px' }}>
                                            <i class="fas fa-pen-alt mx-1" style={{ fontSize: '15px' }}></i> Draw Signature
                                        </p>

                                    </TabPanel>
                                    <TabPanel value="2">
                                        <input
                                            ref={inputRef}
                                            type="file"
                                            id="file-upload-form"
                                            mmultiple={false}
                                            accept="image/png"
                                            onChange={handleUploadChange}
                                            hidden
                                        />

                                        <p className='text-center text-dark' style={{ fontWeight: '200', fontSize: '14px' }}><i class="fas fa-upload mx-1" style={{ fontSize: '15px' }}></i> Upload Signature</p>

                                        <div className=' d-flex justify-content-center'>

                                            <ButtonComponent
                                                cssClass='e-custom-primary'
                                                className='m-2 p-2'
                                                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                disabled={false}
                                                onClick={browseFromComputer}
                                            >
                                                <span className='mx-2'>Browse from Device</span>
                                            </ButtonComponent>

                                        </div>

                                        <p style={{ fontSize: '11px' }}>( Kindly upload an image with dimentions of at least 200 width x 200 height )</p>

                                    </TabPanel>
                                    <TabPanel value="3">
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
                                                        {props.signersavedsignatures ?
                                                            <>
                                                                <option value="" style={{ fontSize: "13px" }} className='text-muted' disabled>

                                                                    {props.signersavedsignatures.length > 0
                                                                        ? `Please select`
                                                                        : "No saved signatures"}
                                                                </option>
                                                                {props.signersavedsignatures.length > 0 ?
                                                                    <>
                                                                        {props.signersavedsignatures.map((s, index) => (
                                                                            <option key={index} value={s.signature} style={{ fontSize: "14px" }}>{s.title}</option>
                                                                        ))}
                                                                    </> : <></>}
                                                            </> :
                                                            <></>
                                                        }


                                                    </select>
                                                </FormControl>

                                            </div>

                                            <p className='text-center p-2 text-center text-dark my-3' style={{ fontWeight: '200', fontSize: '14px' }}>
                                                <i class="fas fa-hand-pointer mx-1" style={{ fontSize: '20px' }}></i> Select Signature
                                            </p>



                                        </div>
                                    </TabPanel>


                                    <Alerts alertseverity={alertseverity} alertmsg={alertmsg} openalert={openalert} setOpenAlert={setOpenAlert} />


                                    <small style={{ color: '#00509d' }} className='my-1'>
                                        Signature Customization </small>
                                    <div className='d-flex justify-content-center'>
                                        <FormGroup className='text-center'>
                                            <FormControlLabel style={{ fontSize: '12px' }}
                                                control={<Checkbox checked={addEmail} onChange={handleAddEmailChange} />}
                                                label={<span style={{ fontSize: '12px' }}>{"Add email stamp"}</span>}
                                            />
                                            <FormControlLabel style={{ fontSize: '12px' }}
                                                control={<Checkbox checked={addDateStamp} onChange={handleAddDateStampChange} />}
                                                label={<span style={{ fontSize: '12px' }}>{"Add date stamp"}</span>}
                                            />
                                            <FormControlLabel style={{ fontSize: '12px' }}
                                                control={<Checkbox checked={addTimeStamp} onChange={handleAddTimeStampChange} />}
                                                label={<span style={{ fontSize: '12px' }}>{"Add date & time stamp"}</span>}
                                            />
                                        </FormGroup>

                                        {/* <button className='btn btn-primary'  onClick={handleButtonClick}>
                                        Get Values
                                    </button> */}

                                    </div>


                                </div>
                            </div>
                        </DialogContent>

                    </TabContext>
                }

            </div>

        </Dialog>


    );
}


export default SignatureDialog

