import React, { useState, useContext, useEffect } from 'react'
import AuthContext from '../context/Authcontext'
import { useNavigate } from "react-router-dom";

import '../styles/App.css';

// import Navbar1 from '../components/Navbar/Navbar1';
import { useLocation } from 'react-router-dom'

import Loading from '../components/Loading/Loading';
import axios from 'axios'
import ConfirmVoid from '../components/ConfirmVoid';
import OtpDialog from '../components/OtpDialog';
import { getComponent } from '@syncfusion/ej2-base';
import SignatureDialog from '../components/SignatureDialog';
import logo from '../images/techedge.png'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import HelpBubble from '../components/HelpBubble';
import ConfirmCompleteDialog from '../components/ConfirmCompleteDialog';
import LoadingDialog from '../components/Loading/LoadingDialog';
import CommentsDialog from '../components/CommentsDialog';
import * as constants from '../components/constants/constants'
import PdfViewerComponent from '../components/PdfViewerComponent';
import LoadingMini from '../components/Loading/LoadingMini2';
import AuthGuestDialog from '../components/AuthenticateGuest';


function Signing_Page_Self() {

  const location = useLocation()
  let [loading, setLoading] = useState(false)
  let navigate = useNavigate();
  let { authTokens, user } = useContext(AuthContext)
  let [avatar, setAvatar] = useState('')

  let [onepagebtncssclass, setOnePgebtnCssClass] = useState('e-custom-light')
  let [allpagebtncssclass, setAllPgebtnCssClass] = useState('e-custom-light')
  let [opendialogloading, setOpenDialogLoading] = useState(false)
  let [opendialogcomments, setOpenDialogComments] = useState(false)
  let [opendialogsignature, setOpenDialogSignature] = useState(false)
  let [signed, setSigned] = useState(false)
  let [voided, setVoided] = useState(false)
  let [ip, setIp] = useState('')
  let [savedsignature, setSaveSignature] = useState('')
  let [addsignature, setAddSignature] = useState(false)
  let [docguid, setDocGuid] = useState('')
  let [singlepage, setSinglepage] = useState(false)
  let [multipage, setMultipage] = useState(false)
  let [comments, setComments] = useState([])
  let [signingpaddidabled, setSigningPadDisabled] = useState(true)

  let [newotp, setOTP] = useState('');
  let [otpphone, setOtpPhone] = useState('');
  let [maskedotpphone, setMaskedOtpPhone] = useState('');
  let [trialcount, setTrialCount] = useState(0);
  const [openalert, setOpenAlert] = React.useState(true);
  const [alertmsg, setAlertMsg] = React.useState('');
  const [alertseverity, setAlertSeverity] = React.useState('');
  let [signeruid, setSignerUid] = useState('')
  const [text, setText] = useState('');
  const [opendialogvoid, setOpenDialogVoid] = React.useState(false);
  const [opendialogotp, setOpenDialogOtp] = React.useState(false);
  let [tempUploadedsignature, setTempSignature] = useState('')
  let [docoassignmentdescription, setDocAssignmentDescription] = React.useState([])
  let [signersavedsignatures, setSignerSavedSignatures] = React.useState([]);
  let [signersavedstamps, setSignerSavedStamps] = React.useState([]);
  let [signers, setSigners] = useState([])
  let [doccreated, setDocCreated] = useState('')
  let [docname, setDocName] = useState('')
  let [companylogo, setCompanyLogo] = useState('')

  let [docowner, setDocOwner] = useState('')
  let [signaturewidth, setSignatureWidth] = useState('');
  let [signatureheight, setSignatureHeight] = useState('');
  let [uploadedsignaturewidth, setUploadedWidth] = useState('');
  let [uploadedsignatureheight, setUploadedHeight] = useState('');
  let [hasannotations, setHasAnnotations] = useState(false)
  let [pdfInstance, setPdfInstance] = useState(null);
  let [isstampuload, setIsStampUpload] = useState(false)
  let [annotationList, setAnnotationList] = useState([]);
  let [sampleURL, setSampleUrl] = useState('')
  let [fileLocked, setFileLocked] = useState(true);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  let [authenticateUser, setAuthenticateUser] = useState(true)
  const [placedSignature, setPlacedSignature] = useState("")

  let [opendialogauthguest, setOpenDialogAuthGuest] = useState(false)

  const [openconfirmcompletedialog, setOpenConfirmCompleteDialog] = React.useState(false);
  let newSignature = () => {
    setTempSignature('')
  }
  let handleComments = () => {
    setOpenDialogComments(true)
  }
  const handleClickOpenCompleteDialog = () => {
    setOpenConfirmCompleteDialog(true);
  };

  const handleClickOpenDialogVoid = () => {
    setOpenDialogVoid(true);
  };



  let signAllpages = (e) => {
    setMultipage(true)
    setSinglepage(false)
    setSigningPadDisabled(true)
    // document.getElementById('signaturediv').style.display='block'

    getSavedSignatures()
    getSavedStamps()
    // var viewer = document.getElementById('previewer').ej2_instances[0];
    // viewer.annotationModule.setAnnotationMode('HandWrittenSignature');
    setAddSignature(false)
    setAllPgebtnCssClass('e-custom-primary')
    setOnePgebtnCssClass('e-custom-light')
    // document.getElementById('singonePage').className=" btn btn-outline-light btn-md  mb-4 ";
    // document.getElementById('allPages').className=" btn btn-light btn-md  mb-5  ";
    // document.getElementById('complete').style.display="block";
    let signature = getComponent(document.getElementById('signature'), 'signature');
    if (!signature.disabled && !signature.isReadOnly) {
      signature.clear();
      setTempSignature('')
    }


    // document.getElementById('placeDrawn').style.display='none'
    // document.getElementById('clear').style.display='none'

    setOpenDialogSignature(true)

  }


  let signonePage = (e) => {
    setSinglepage(true)
    setMultipage(false)
    setSigningPadDisabled(true)

    // document.getElementById('signaturediv').style.display='block'

    getSavedSignatures()
    getSavedStamps()
    setAddSignature(false)
    setOnePgebtnCssClass('e-custom-primary')
    setAllPgebtnCssClass('e-custom-light')

    let signature = getComponent(document.getElementById('signature'), 'signature');
    if (!signature.disabled && !signature.isReadOnly) {
      signature.clear();
      setTempSignature('')
    }
    setSinglepage(true)
    setMultipage(false)

    // document.getElementById('placeDrawn').style.display='none'
    // document.getElementById('clear').style.display='none'

    setOpenDialogSignature(true)
  }

  const logostyle = {
    width: "45%",
    backgroundColor: 'white'
  }

  // send for signing after signing


  let getIP = () => {
    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://ipapi.co/json',
      headers: {}
    };

    axios(config)
      .then(function (response) {

        setIp(response.data.ip)
      })
      .catch(function (error) {
        // // console.log(error);
        setIp("hidden")
      });

  }


  function getComments(documentguid) {
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

  let getSavedSignatures = () => {
    let data = JSON.stringify({
      "email": user.email
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${constants.devApiBaseUrl}/api/savedsignatures/`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        // // console.log(JSON.stringify(response.data));
        setSignerSavedSignatures(response.data)
      })
      .catch((error) => {
        // // console.log(error);
      });

  }
  let getSavedStamps = () => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${constants.devApi2BaseUrl}/api/SaveStamp/Receive?Email=${user.email}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    axios.request(config)
      .then((response) => {
        setSignerSavedStamps(response.data)
        // console.log(response.data)
      })
      .catch((error) => {
        // // console.log(error);
      });

  }
  let getCompanyLogo = (guid) => {

    let data = JSON.stringify({
      "docguid": guid
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${constants.devApiBaseUrl}/api/logo2/`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        // // console.log(JSON.stringify(response.data.logo));
        setCompanyLogo(response.data.logo)

      })
      .catch((error) => {
        // // console.log(error);
      });


  }


  let getSignerUid = () => {
    let g = location.state.fileurl;
    function removeExtension(filename) {
      const x = filename.substring(0, filename.lastIndexOf('.')) || filename;
      const y = x.split('_')
      return y[1];
      // alert(y[1])
    }
    let documentguid = removeExtension(g)
    setDocGuid(documentguid)
    getCompanyLogo(documentguid)
    let data = JSON.stringify({
      "docguid": documentguid
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${constants.devApiBaseUrl}/api/signer/selfsign/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        // // console.log(response.data.uid)
        setSignerUid(response.data.uid)
        setSigners(response.data.signers)
        setDocCreated(response.data.created)
        setDocOwner(response.data.owner)
        setDocName(response.data.docname)
        setDocAssignmentDescription(response.data.assignmentd)
        getComments(documentguid)
      })
      .catch((error) => {
        // // console.log(error);
      });


  }
  let addComment = (comment, signer) => {
    if (comment) {
      // alert(signer)
      let data = JSON.stringify({
        "signer": `${signer}`,
        "comment": `${comment}`
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${constants.devApiBaseUrl}/api/new/comments/`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          // // console.log(JSON.stringify(response.data));
          getComments(docguid)
          setText('')
          document.getElementById('textarea').value = '';
        })
        .catch((error) => {
          // // console.log(error);
        });
    }
    else {
      alert('comment text is required')
    }

  }

  let placeSignatureAgain = () => {
    setOnePgebtnCssClass('e-custom-light')
    setAllPgebtnCssClass('e-custom-light')
    var viewer = document.getElementById('previewer').ej2_instances[0];
    if (!hasannotations) {
      var viewer = document.getElementById('previewer').ej2_instances[0];
      viewer.customStampSettings = {
        isLock: false,
        width: signaturewidth,
        height: signatureheight,
        customStamps: [{
          customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
            tempUploadedsignature
          ,
        }],
      };
    }
    else {
      var viewer = document.getElementById('previewer').ej2_instances[0];
      viewer.customStampSettings = {
        isLock: false,
        width: 200,
        height: 50,
        customStamps: [{
          customStampName: "Image {7d5b51b2-be92-4a6d-997f-89007824ed87}", customStampImageSource:
            tempUploadedsignature
          ,
        }],
      };
    }


    // document.getElementById('complete').style.display="block";


  }




  let [openfreetext, setopenFreeTextModal] = useState(false)
  // let[selectedfontfamily,setFontFamily]=useState('')
  // let[selectedfontsize,setFontSize]=useState('')

  var isAddingTextBox = false; // Initialize the flag outside the function

  function placeText(ff, fs, mt) {
    if (!isAddingTextBox) {
      var previewer = document.getElementById('previewer');

      // Mousemove event handler for the PDF previewer
      function handleMouseClick(event) {
        // Get the mouse coordinates relative to the PDF previewer
        var rect = previewer.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;

        // Add a text box annotation at the cursor position
        addTextBoxAtCursor(x, y, ff, fs, mt);
      }

      // Attach the mousemove event handler to the PDF previewer
      previewer.addEventListener('click', handleMouseClick);

      // Remove the mousemove event listener after the text box is added
      previewer.addEventListener('click', function () {
        previewer.removeEventListener('click', handleMouseClick);
        isAddingTextBox = false; // Reset the flag
      });
    }
  }

  function addtext() {
    // setopenFreeTextModal(true);
    // isAddingTextBox = false; // Reset the flag to allow adding another text box
    // Check if the element exists
    const element = document.getElementById('previewer_annotation_freeTextEditIcon');

    if (element) {
      // Create and dispatch a click event
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      element.dispatchEvent(clickEvent);
    } else {
      // console.error("Element with ID 'previewer_annotation_freeTextEditIcon' not found.");
    }
  }

  // Function to add a text box annotation
  function addTextBoxAtCursor(x, y, ff, fs, mt) {
    var viewer = document.getElementById('previewer').ej2_instances[0];
    let newfs = parseInt(fs);
    viewer.annotation.addAnnotation('FreeText', {
      offset: { x: x, y: y },
      fontSize: newfs,
      fontFamily: ff,
      width: 200,
      height: 40,
      isLock: false,
      defaultText: mt,
    });
  }

  let getFileURL = async () => {

    try {

      // Add onDownloadProgress to the Axios configuration

      const response = await axios.get(`${constants.devApiBaseUrl}/api/base64/${location.state.fileurl}/`, {
        onDownloadProgress: progressEvent => {
          const percentage = (progressEvent.loaded / progressEvent.total) * 100;
          displayPercentageWaitingTime(percentage);
        }
      });

      // Handle the response data
      setSampleUrl(response.data.base64_uri);

    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };

  // Function to display percentage waiting time
  function displayPercentageWaitingTime(percentage) {
    // You can update your UI or // console.log the percentage
    let perce = parseFloat(percentage.toFixed(2));
    setLoadingPercentage(perce);

  }


  useEffect(() => {

    getFileURL()

    setAvatar(location.state.avatar)
    getIP()
    getSignerUid()
  }, [])

  return (
    <>
      {loading ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <AuthGuestDialog
            setOpenDialogAuthGuest={setOpenDialogAuthGuest}
            opendialogauthguest={opendialogauthguest}
            signersEmail={user.email}
            setLocked={setFileLocked}
            locked={fileLocked}
            placedSignature={placedSignature}

          />
          <ConfirmVoid
            setOpenDialogVoid={setOpenDialogVoid}
            setOpenDialogLoading={setOpenDialogLoading}
            opendialogvoid={opendialogvoid}
            docname={docname}
            signerguid={signeruid}
            fileurl={location.state.fileurl}
            user={user}
          />

          <OtpDialog
            alertseverity={alertseverity}
            alertmsg={alertmsg}
            openalert={openalert}
            maskedotpphone={maskedotpphone}
            otpphone={otpphone}
            newotp={newotp}
            setOtpPhone={setOtpPhone}
            setMaskedOtpPhone={setMaskedOtpPhone}
            trialcount={trialcount}
            setTrialCount={setTrialCount}
            setAlertMsg={setAlertMsg}
            setAlertSeverity={setAlertSeverity}
            setOpenAlert={setOpenAlert}
            setOTP={setOTP}
            setOpenDialogOtp={setOpenDialogOtp}
            opendialogotp={opendialogotp}

            user={user}
          />
          <CommentsDialog setText={setText} text={text} addComment={addComment} signerguid={signeruid} comments={comments} opendialogcomments={opendialogcomments} setOpenDialogComments={setOpenDialogComments} />
          <LoadingDialog opendialogloading={opendialogloading} />
          <HelpBubble
            content=''
          />
          <div className=" row " style={{ minHeight: '100vh', backgroundColor: '#e5e5e5' }} id='downloadPgHidden' >


            <div className="col-lg-9 col-md-12  card" style={{ borderRadius: '0', borderTop: 'none', boxShadow: '0', backgroundColor: '#ffff' }}>

              <div className=''>

                {sampleURL ?
                  <PdfViewerComponent
                    //document={`https://mfilesdsscorppreviewerdevsdk.techedge.dev/Data/${location.state.fileurl}`}
                    document={sampleURL}
                    pdfInstance={pdfInstance}
                    setOpenDialogAuthGuest={setOpenDialogAuthGuest}
                    authenticateUser={authenticateUser}
                    setPlacedSignature={setPlacedSignature}
                    setFileLocked={setFileLocked}
                    setPdfInstance={setPdfInstance}
                    opendialogsignature={opendialogsignature}
                    user={user}
                    savedsignature={savedsignature}
                    setSaveSignature={setSaveSignature}
                    setSignerSavedStamps={setSignerSavedStamps}
                    setAddSignature={setAddSignature}
                    tempUploadedsignature={tempUploadedsignature}
                    setTempSignature={setTempSignature}
                    signersavedsignatures={signersavedsignatures}
                    signersavedstamps={signersavedstamps}
                    setAllPgebtnCssClass={setAllPgebtnCssClass}
                    setOnePgebtnCssClass={setOnePgebtnCssClass}
                    currentsignerEmail={user.email}
                    pagetype={'selfsign'}
                    isstampuload={isstampuload}
                    signingpaddidabled={signingpaddidabled}
                    setSigningPadDisabled={setSigningPadDisabled}
                    signerguid={signeruid}
                    setSignatureHeight={setSignatureHeight}
                    setSignatureWidth={setSignatureWidth}
                    uploadedsignatureheight={uploadedsignatureheight}
                    uploadedsignaturewidth={uploadedsignaturewidth}
                    setUploadedHeight={setUploadedHeight}
                    setUploadedWidth={setUploadedWidth}
                    setHasAnnotations={setHasAnnotations}
                    instance={pdfInstance}
                    hasannotations={hasannotations}
                    width={signaturewidth}
                    height={signatureheight}
                    allpagebtncssclass={allpagebtncssclass}
                    onepagebtncssclass={onepagebtncssclass}
                    newSignature={newSignature}
                    signonePage={signonePage}
                    signAllpages={signAllpages}
                    annotationList={annotationList}
                    setAnnotationList={setAnnotationList}
                    setSinglepage={setSinglepage}
                    setMultipage={setMultipage}
                    opendialogloading={opendialogloading}
                    setOpenDialogLoading={setOpenDialogLoading}
                    openconfirmcompletedialog={openconfirmcompletedialog}
                    setOpenConfirmCompleteDialog={setOpenConfirmCompleteDialog}
                    fileurl={location.state.fileurl}
                    ip={ip}
                    setOpenDialogSignature={setOpenDialogSignature}
                    docname={docname}
                    setOpenDialogVoid={setOpenDialogVoid}
                    guid={docguid}
                    multipage={multipage}
                  /> :
                  <div className='bg-white ' style={{ height: '100vh' }}>
                    <LoadingMini filename={docname} percent={loadingPercentage} logo={logo} companylogo={companylogo} logostyle={logostyle} />

                  </div>}


              </div>


            </div>

            <div className="col-lg-3 col-md-12 text-center card" style={{ borderRadius: '0', borderTop: 'none', boxShadow: '0' }}>

              <div className='p-2 card-header bg-white'>
                <a href='https://techedge.co.ke' target="_blank">
                  {companylogo ? <>

                    <img src={companylogo} style={logostyle} />

                  </> : <>

                    <img src={logo} style={logostyle} />

                  </>}
                </a>

              </div>
              <p className='text-white p-2' style={{ fontSize: '12px', backgroundColor: '#1C4690' }}>Document Details</p>

              <div className='container-fluid my-2'>
                <ul style={{ listStyle: 'none' }}>
                  <li className='mt-1 mb-2' style={{ fontSize: '12px', fontWeight: '450' }}><span style={{ color: '#1C4690' }} className='m-1'>Title</span> </li>
                  <li className='mt-2 mb-3' style={{ fontSize: '12px', fontWeight: '440' }}>{location.state.originalfilename}</li>
                  <li className='mt-2 mb-2' style={{ fontSize: '12px', color: '#1C4690' }}>Owner : {docowner}</li>
                  <li className='mt-2 mb-2' style={{ fontSize: '12px', color: '#1C4690' }}>Created: {doccreated}</li>
                  {docoassignmentdescription ? <li className='mt-2 mb-2' style={{ fontSize: '12px', color: '#1C4690' }}>Instructions: <br /> <span style={{ fontSize: '12px', color: '#595959' }}>{docoassignmentdescription}</span></li>
                    : <></>}
                  <li className='mt-3 mb-3' style={{ fontSize: '12px', color: '#1C4690', height: '12vh', overflowY: 'scroll' }}>
                    Signers ({signers.length}):
                    <div >
                      {signers.length > 0 ? (
                        signers.map((s, index) => (
                          <span key={index} style={{ fontSize: '12px' }}>
                            {s.signed === 'True' ? (
                              <small className='text-success'>
                                <i className="fas dot fa-circle text-success shadow-lg m-1" aria-hidden="true" ></i>
                                {s.email}
                                <br />
                                <span style={{ fontSize: '10px' }}>{s.signed_time_stamp}</span>
                              </small>
                            ) : (
                              <span>
                                {s.current_signer === 'True' ? (
                                  <span>
                                    <small>
                                      <i className="fas dot fa-circle text-secondary shadow-lg m-1" aria-hidden="true"></i>
                                      {s.email}
                                    </small>
                                  </span>
                                ) : (
                                  <span>
                                    <small>
                                      <i className="fas dot fa-circle text-secondary shadow-lg m-1" aria-hidden="true"></i>
                                      {s.email}
                                    </small>
                                  </span>
                                )}
                              </span>
                            )}
                            <br />
                          </span>
                        ))
                      ) : (
                        <></>
                      )}
                    </div>

                  </li>
                </ul>



              </div>

              <div className='container my-4 '>

                <ButtonComponent
                  cssClass='e-custom-primary'
                  className='m-2 p-2'
                  style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                  disabled={false}
                  onClick={handleComments}

                ><i class="fas fa-comments mx-1"></i><span className='mx-2'>Comments ( {comments.length} )</span>  </ButtonComponent>

              </div>
              <div className='card-footer p-2 bg-white '>
                <a className="my-4" href='https://techedge.co.ke' target="_blank">
                  <img src={logo} style={{ width: '50%' }} alt="Footer Logo" />
                </a>
              </div>





            </div>


          </div>

        </>
      )}
    </>
  )
}

export default Signing_Page_Self