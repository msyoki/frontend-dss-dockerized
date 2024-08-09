import React from "react";
import loading from "../../images/techedge.png";
import Box from '@mui/material/Box';

import LinearProgress from '@mui/material/LinearProgress';
const LoadingMini = (props) => (
  <div className='App'>
    <div className='text-center p-2'>
      <div className="spinner ">
        <img src={loading} alt="Loading" width='200px' margin='50%' />
        <p className="my-2" style={{ fontSize: '13px' }}>{props.msg ? <>{props.msg}</> : <>Please wait, processing request ...</>}</p>
        <Box sx={{ width: '100%' }} className='my-2'>
          <LinearProgress />

        </Box>
       
        <p style={{ fontSize: '13px' }}>{props.msg2 ? <>{props.msg2}</> : <></>} </p>

        
      </div>
    </div>
  </div>

);

export default LoadingMini;