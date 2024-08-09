// import React from "react";
// import loading from "../../images/loading.svg";

// const LoadingMini = (props) => (

//     <div className='text-center bg-white my-3 '>
//         <div className="spinner p-3" > 
//             <br/><br/>
//             <h2 style={{fontSize:'20px',color:'#1C4690'}} className="p-3 bg-white my-3">{props.filename}</h2>
//             <img src={loading} alt="Loading" width='100px' margin='50%' />
           
           
//             <p className="my-2 text-muted" style={{fontSize:'15px'}}>{props.percent} %</p>
//             <p className="my-3 text-muted" style={{fontSize:'14px'}}>Processing file, kindly wait...</p>
            
//         </div>
//     </div>

  
// );

// export default LoadingMini;



import * as React from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import logo from '../../images/techedge.png'

function CircularProgressWithLabel(props) {
    return (
      React.createElement(Box, { sx: { position: 'relative', display: 'inline-flex' } },
        React.createElement(CircularProgress, { variant: 'determinate', size:70, ...props }),
        React.createElement(Box, { sx: {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          } },
          React.createElement(Typography, { variant: 'caption', component: 'div', color: 'text.secondary',fontSize:"12px" }, `${props.value}%`)
        )
      )
    );
  }
  

export default function LoadingMini(props) {
  let logostyle={
    width:'20%',
  
  }

  return (
    
    <div className='text-center  my-3 '>
        <div className="spinner p-3  bg-white" > 
        <br/>  <br/>
            <div className='p-2 my-3'>
                <a href='https://techedge.co.ke' target="_blank">
                    {props.companylogo ? (
                      <img src={props.companylogo} style={logostyle} alt="Company Logo" />
                    ) : (
                        <img src={logo} style={logostyle} alt="Default Logo" />
                    )}
                </a>
            
            </div>
            <br/>
            <CircularProgressWithLabel value={props.percent} />
            {/* <h2 style={{fontSize:'12px',color:'#1C4690'}} className="p-3 bg-white my-3">Preparing {props.filename}, kindly wait...</h2>
         */}
         {props.filename?
         <>
          <p className="my-4 text-muted" style={{fontSize:'14.5px'}}>Preparing {props.filename}, kindly wait...</p> 
           
         </>:
         <>
          <p className="my-4 text-muted" style={{fontSize:'14.5px'}}>Processing, please wait</p> 
           
         </>}
         
        </div>
    </div>
  );
}