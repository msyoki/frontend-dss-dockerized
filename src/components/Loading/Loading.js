import React from "react";
import logo from "../../images/techedge.png";
import '../../styles/Loading.css'
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

const Loading = () => (
  <div className='loading d-flex justify-content-center main-loader' style={{ margin: '15%' }} >

    <img src={logo} alt="logo" width='250px' />
    <br />

    <Box sx={{ width: '45%' }}>
      <LinearProgress />
    </Box>
    <p className="mt-2" style={{ fontSize: '12.5px' }}>Please wait, loading resources ...</p>

  </div>

);

export default Loading;