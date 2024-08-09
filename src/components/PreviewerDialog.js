import * as React from 'react';
import { useState,useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { ButtonComponent, CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import logo from '../images/techedge.png'

import PreviewerOnly from './PreviewerOnly';
import AlignItemsList from './Comments';
import axios from 'axios'
import CommentsDialog from './CommentsDialog';
import * as constants from '../components/constants/constants'
import PdfViewerComponentViewOnly from './PdfViewerComponentViewOnly';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PreviewerDialog(props) {
  let [opendialogcomments, setOpenDialogComments] = useState(false)
  const [text, setText] = useState('');
  const [value, setValue] = useState(0);
  const [mainDoc, setMainDoc] = useState('');
  const [reportDocument, setReportDocument] = useState('');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  let mainDocName = `${props.filepreviewurl}.pdf`
  let ReportDocName = `${props.filepreviewurl}_Report.pdf`

  const logostyle = {
    width: "180px",
    backgroundColor: 'white'
  }
  let handleComments = () => {
    setOpenDialogComments(true)
  }
  const handleClose = () => {
    props.setOpenPreviewerDialog(false);
  };

  let addComment = (comment, signer) => {
    // console.log(`signerguid:${signer}`)
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
        // console.log(JSON.stringify(response.data));
        setText('')
        props.getComments(props.ccdocguid, props.ccdoctitle)
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
  
   
  }, []);


  return (
    <div>
      <CommentsDialog setText={setText} text={text} addComment={addComment} signerguid={props.signeruid} comments={props.comments} opendialogcomments={opendialogcomments} setOpenDialogComments={setOpenDialogComments} />

      <Dialog
        fullScreen
        open={props.openpreviewerdialog}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogContent style={{ backgroundColor: '#e5e5e5' }}  >
          <DialogContentText id="alert-dialog-description"   >
            <div className='row' style={{ height: '80vh' }}>

              <div className='col-sm-12 col-md-9' >
                {/* <div className='container p-2'>
                <span style={{fontSize:'14px'}} className='text-dark'>DSS Previewer </span> 
              
                    <ButtonComponent cssClass='e-custom-primary' className='m-1 p-2' style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}  onClick={handleClose}   disabled={false}><i className="fas  fa-times mx-2" ></i> Close</ButtonComponent>
                  
                      <ButtonComponent cssClass='e-custom-primary' className='m-1 p-2' style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   onClick={handleComments}  disabled={false}><i class="fas fa-comments mx-2"></i> Document comments</ButtonComponent>
                
                      
                      </div> */}
                <AppBar sx={{ position: 'relative', backgroundColor: '#e5e5e5' }}>
                  <Toolbar>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={handleClose}
                      aria-label="close"
                    >



                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                      {/* <span style={{fontSize:'14px'}} className='text-white'>DSS Previewer </span>  */}
                      <ButtonComponent
                        cssClass='e-custom-primary'
                        className='m-2 p-2'
                        style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                        disabled={false}
                        onClick={handleComments}

                      ><i className="fas fa-comments mx-1"></i><span className='mx-2'>Comments  ({props.comments.length})</span>
                      </ButtonComponent>
                      {/* {props.previewComplete?
                      <small className='text-dark'>NB: Scroll below to view summary document</small>
                     :
                     <></>
                    } */}



                    </Typography>
                    {/* <Button onClick={handleClose} className='text-white ' style={{fontSize:'14.5px',textTransform: 'none'}}><i className="fas  fa-times mx-2" ></i> Close </Button> */}
                    <ButtonComponent
                      cssClass='e-custom-warning'
                      className='m-2 p-2'
                      style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                      disabled={false}
                      onClick={handleClose}
                    ><i className="fas  fa-times mx-1"></i><span className='mx-2'>Close</span> </ButtonComponent>

                  </Toolbar>
                </AppBar>
                {props.previewComplete ?
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className='bg-white'>
                      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Signed Copy" {...a11yProps(0)} />
                        <Tab label="Signing Report" {...a11yProps(1)} />

                      </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                      <PdfViewerComponentViewOnly document={mainDocName} height={'70vh'} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                      <PdfViewerComponentViewOnly document={ReportDocName}  height={'70vh'} />
                    
                    </CustomTabPanel>

                  </Box>

                  :

                  <PdfViewerComponentViewOnly document={mainDocName}  height={'85vh'}/>

                }

    
              </div>
              <div className="col-lg-3 col-md-12 text-center card" style={{ borderRadius: '0', borderTop: 'none', boxShadow: '0' }} >


                <div className='p-3 card-header bg-white'>
                  <a href='https://techedge.co.ke' target="_blank">

                    <img src={logo} style={logostyle} alt="Default Logo" />

                  </a>

                </div>
                <p className='text-white p-2' style={{ fontSize: '12px', backgroundColor: '#1C4690' }}>Document Details</p>



                <ul style={{ listStyle: 'none' }}>



                  <li className='mt-1 mb-2' style={{ fontSize: '12px', fontWeight: '450', color: '#1C4690' }}>Title</li>
                  <li className='mt-2 mb-3' style={{ fontSize: '12px', fontWeight: '440' }}>{props.filepreviewtitle}</li>

                  <li className='mt-2 mb-2' style={{ fontSize: '12px', color: '#1C4690' }}>Owner: {props.docowner}</li>
                  <li className='mt-2 mb-2' style={{ fontSize: '12px', color: '#1C4690' }}>Created: {props.doccreated}</li>
                  <li className='mt-3 mb-3' style={{ fontSize: '12px', color: '#1C4690', height: '12vh', overflowY: 'scroll' }}>

                    Signers ({props.signers.length}):
                    <div>
                      {props.signers.length > 0 ? (
                        props.signers.map((s, index) => (
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
                <div className='container my-4'>



                  <ButtonComponent
                    cssclassName='e-custom-primary'
                    className='m-2 p-2'
                    style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                    disabled={false}
                    onClick={handleComments}

                  ><i className="fas fa-comments mx-1"></i><span className='mx-2'>Comments ( {props.comments.length} )</span>  </ButtonComponent>

                </div>



              </div>

            </div>

          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PreviewerDialog