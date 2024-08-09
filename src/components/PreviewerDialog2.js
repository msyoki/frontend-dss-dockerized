import React from 'react'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import DialogContentText from '@mui/material/DialogContentText';

import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';


import PreviewerOnly from './PreviewerOnly';
import PdfViewerComponentViewOnly from './PdfViewerComponentViewOnly';
import * as constants from '../components/constants/constants'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function PreviewerDialog2(props) {
    const handleClose = () => {
        props.setOpenPreviewerDialog(false);
      };
  return (
    <div>

    <Dialog
      fullScreen
      open={props.openpreviewerdialog}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' ,backgroundColor:'#1C4690',height:"10vh"}}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
          
          >

                    
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            <span style={{fontSize:'13px'}} className='text-white '>DSS Previewer </span> 
          </Typography>
          {/* <ButtonComponent cssClass='e-custom-light' className='m-2 p-2' style={{textTransform: 'none',fontWeight:'lighter',fontSize:'16px'}} disabled={false} onClick={handleClose}> <i className="fas  fa-window-close mx-1" ></i> <span className='mx-1'>Close</span></ButtonComponent> */}
      <ButtonComponent 
                    cssClass='e-custom-warning'
                    className='m-2 p-2' 
                    style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
                    disabled={false}     
                    onClick={handleClose}
                    ><i className="fas  fa-times mx-1"></i><span className='mx-2'>Close</span> </ButtonComponent>
                    
        </Toolbar>
      </AppBar>
      <DialogContent  style={{backgroundColor:'#e5e5e5'}}>
        <DialogContentText id="alert-dialog-description"   >
          <div className='row' >
            <div className='col-sm-12 col-md-1   text-center'>
            </div>
            <div className='col-sm-12 col-md-10 '>
      
              {/* <PreviewerOnly filepreviewurl={props.filepreviewurl}/>
               */}
       
              <PdfViewerComponentViewOnly document={props.filepreviewurl}  height={'85vh'}/>
              
            </div>
            <div className="col-sm-12 col-md-1 text-center " >
            </div>
          </div>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  </div>
  )
}

export default PreviewerDialog2