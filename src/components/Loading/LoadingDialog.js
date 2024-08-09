import  React, {useState} from 'react';

import Dialog from '@mui/material/Dialog';
import loadingimg from "../../images/loading.svg";
import logo from "../../images/techedge.png";
import Box from '@mui/material/Box';

import LinearProgress from '@mui/material/LinearProgress';

const LoadingDialog=(props) =>{
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  return (
    <div >
      <Dialog
        open={props.opendialogloading}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        keepMounted
        aria-describedby="alert-dialog-slide-description"

      >
 
      <div className='text-center p-3'>
      <img src={logo} alt="logo" width='250px'  />
        <br/>
        <Box sx={{ width: '100%' }} className="my-2">
              <LinearProgress />
            
            </Box>
        <p className="mt-2" style={{fontSize:'12.5px'}}>Please wait, processing ...</p>

      </div>
    
      </Dialog>
    </div>
  );
}


export default  LoadingDialog

