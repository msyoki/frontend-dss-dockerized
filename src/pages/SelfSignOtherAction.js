import React, { useEffect, useState, useContext } from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/Authcontext';
import AddSignersDialog2 from '../components/AddSignersDialog2';
import PreviewerOnly from '../components/PreviewerOnly';
import PreviewerDialog2 from '../components/PreviewerDialog2';
import Loading from '../components/Loading/Loading';
import logo from '../images/techedge.png';
import * as constants from '../components/constants/constants';

function SelfSignOtherAction() {
  const { authTokens } = useContext(AuthContext);
  const [fileurl, setFileUrl] = useState('');
  const [voided, setVoided] = useState(false);
  const navigate = useNavigate();
  const [opendialogaddsigners, setOpenDialogAddSigners] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [openpreviewerdialog, setOpenPreviewerDialog] = useState(false);


  const sendforSigning = (e) => {
    setOpenDialogAddSigners(true);
  };

  const selfSignComplete = () => {
    const g = location.state.fileurl;
    function removeExtension(filename) {
      const x = filename.substring(0, filename.lastIndexOf('.')) || filename;
      const y = x.split('_');
      return y[1];
    }

    const newfilename = removeExtension(g);

    const data = JSON.stringify({
      "fileGuid": newfilename
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${constants.devApiBaseUrl}/api/selfsign/closesigning/`,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        // // console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        // // console.log(error);
      });
  };

  const home = () => {
    if (voided) {
      navigate('/', { state: { openalert: true, alertmsg: 'Document voided successfully', alertseverity: 'success' } });
    } else {
      navigate('/', { state: { openalert: true, alertmsg: 'Document signed successfully', alertseverity: 'success' } });
    }
  };

  const getWorkflows = () => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${constants.devApiBaseUrl}/api/workflows/`,
      headers: {'Authorization': `Bearer ${authTokens.access}`}
    };
  
    axios.request(config)
      .then((response) => {
        // // console.log(JSON.stringify(response.data));
        setWorkflows(response.data);
      })
      .catch((error) => {
        // // console.log(error);
      });
  };

  const preview = () => {
    setOpenPreviewerDialog(true);
  };

  useEffect(() => {
    getWorkflows();
    setFileUrl(location.state.fileurl);
 
    setVoided(location.state.voided);
    if (!location.state.voided) {
      selfSignComplete();
    }
  }, []);

  return (
    <>
      {loading ? (
        <Loading/>
      ) : (
        <>
          <PreviewerDialog2 openpreviewerdialog={openpreviewerdialog} setOpenPreviewerDialog={setOpenPreviewerDialog} filepreviewurl={`${location.state.docguid}.pdf`} />
          <AddSignersDialog2 getWorkflows={getWorkflows} workflows={workflows} opendialogaddsigners={opendialogaddsigners} setOpenDialogAddSigners={setOpenDialogAddSigners} fileurl={fileurl} loading={loading} setLoading={setLoading}/>
          <div className="  d-flex justify-content-md-center align-items-center vh-100" style={{backgroundColor:'#1C4690'}}  >
            <div className='bg-white text-center  col-md-4 col-sm-12' >
              <div className='col-12 p-3'>
                <br/>
                <a href='https://techedge.co.ke' target="_blank"><img src={logo} width='200px' className=''/></a>
                <p className=' text-dark m-2 ' style={{fontSize:'14px',fontWeight:"490"}}><span style={{color:'#1C4690'}}>Document Title <br/><br/></span>{location.state.doctitle}</p>
                <p className=' text-dark m-2 ' style={{fontSize:'13px'}}>Document {voided === true ? 'voided' : 'signed'} successfully,</p>
                <br/>
                <div className='container-fluid my-4'>
                  {voided === true ? 
                    <> 
                      <ButtonComponent 
                        cssClass='e-custom-primary' 
                        className='m-2 p-2' 
                        style={{textTransform: 'none',fontWeight:'lighter',fontSize:'14px'}}
                        onClick={()=>window.open(`${constants.devApi2BaseUrl}/api/Doc/FileDownload/${location.state.docguid}`)}
                        disabled={false} 
                      > <i className="fas fa-envelope-open mx-1" ></i> <span className='mx-2'> Download voided document</span>  
                      </ButtonComponent>
                      <br/>
                    </>
                    : 
                    <>
                      <ButtonComponent 
                        cssClass='e-custom-primary' 
                        className='m-2 p-2' 
                        style={{textTransform: 'none',fontWeight:'lighter',fontSize:'14px'}}
                        onClick={sendforSigning}
                        disabled={false} 
                      > <i className="fas fa-envelope-open mx-1" ></i> <span className='mx-2'> Send to others to sign</span>  
                      </ButtonComponent>
                      <br/>
                      <ButtonComponent 
                        cssClass='e-custom-success' 
                        className='m-2 p-2' 
                        style={{textTransform: 'none',fontWeight:'lighter',fontSize:'14px'}}
                        onClick={()=>window.open(`${constants.devApi2BaseUrl}/api/Doc/FileDownload/${location.state.docguid}`)}
                        disabled={false} 
                      > <i className="fas fa-download mx-1" ></i> <span className='mx-2'>Download signed document</span>  
                      </ButtonComponent>
                      <br/>
                    </>
                  }
                  <ButtonComponent 
                    cssClass='e-custom-light' 
                    className='m-2 p-2' 
                    style={{textTransform: 'none',fontWeight:'lighter',fontSize:'14px'}}
                    onClick={preview}
                    disabled={false} 
                  > <i className="fas fa-eye mx-1" ></i> <span className='mx-2'>Preview Document</span>  
                  </ButtonComponent>
                  <br/>
                  <ButtonComponent 
                    cssClass='e-custom-warning' 
                    className='m-2 p-2' 
                    style={{textTransform: 'none',fontWeight:'lighter',fontSize:'14px'}}
                    onClick={home}  
                    disabled={false} 
                  > <i className="fas fa-home mx-1" ></i> <span className='mx-2'>Go back home</span>  
                  </ButtonComponent>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SelfSignOtherAction;
