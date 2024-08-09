import React, { useState ,useEffect} from 'react'
import Logo from "../images/techedge.png"
import SignedImage from "../images/Voided.png"
import { useLocation } from 'react-router-dom'

function NotFound() {
    let location=useLocation()
    let [doctitle,setDocTitle]=useState('')
    const logostyle = {
      width:"80px"
    }
    const logostyle1 = {
        width:"300px"
    }
    
    useEffect(()=>{

        try {
            setDocTitle(location.state.doctitle)
        }
          catch(err) {  
        }
    }, [])


    return (
    <>   

        <div className='App' >
            <div className='row'>
              
                    <div className='col-md-9 col-lg-6 col-xl-4'></div>
                    <div className='col-md-9 col-lg-6 col-xl-4 text-center'>
        
                 
                        <div className='shadow-lg text-dark bg-white text-white my-1'>
                        <img src={Logo} className="img-fluid mt-5 mb-2" alt="logo" style={logostyle1}/>
                       
                        <div className='p-5 text-dark bg-primary text-white mt-4'>
                        {doctitle?<p >{doctitle}</p>:<></>}
                        {/* <p >{doctitle}</p> */}
                        <img src={SignedImage} className="img-fluid mb-3" alt="logo" style={logostyle}/>
                       
                        <hr/>
                        <p>404 Not Found</p>
                        <p style={{fontSize:'10px'}}>You are seeing this message because the resource you are requesting has either changed or does not exist</p>
                        </div>
                            
                        </div>
                    </div>
                    <div className='col-md-9 col-lg-6 col-xl-4'></div>
                
            </div>
        </div>

   
    
     
    </>

  )
}

export default NotFound