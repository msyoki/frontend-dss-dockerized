import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios'
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';
import AlignItemsList from './Comments';


const CommentsDialog=(props) =>{
  
    const handleClose = () => {
        props.setOpenDialogComments(false);
    };

    const primaryColor={
        color:'#174291'
      }
  return (
    <>
        <Dialog
            open={props.opendialogcomments}
            
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle className='text-white text-center' style={{fontWeight:'400',fontSize:'16px',backgroundColor:'#1C4690'}} > Comments</DialogTitle>
            <DialogContent className='card '  style={{width:'360px'}}> 
                
                <div className='card-body p-2 text-center'>
                    {props.docoassignmentdescription?
                    <>
                        <div className=' p-2 bg-white'   >
                            <small className='mt-3 mb-2' style={{fontSize:'12.5px'}}><span style={{color:'#1C4690'}}>Assignment Description</span> <br/>  {props.docoassignmentdescription}</small>

                        </div>
                    
                    </>:
                    <></>}
              
                
                <div className=' p-2 bg-white'   >
                      
                
                      {/* <h6 style={{color:'#1C4690',fontSize:'13px',fontWeight:'lighter'}} className='text-left'>Comment Form</h6> */}
                      <textarea id='textarea'  rows="auto" cols="50" className='form-control  mb-2'  placeholder="write your comment here..."  onChangeCapture={(e) => props.setText(e.target.value)}>
                      </textarea>
                   <ButtonComponent  
                                    cssClass='e-custom-light' 
                                    className='m-2 p-2' 
                                    style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
                                    disabled={false} 
                                    onClick={()=>props.addComment(props.text,props.signerguid)}
                                    > <span className='mx-2'> Add Comment</span> </ButtonComponent>
               
                 
                     
                    </div>
               
               
                       {props.comments.length !== 0?
                         <div style={{overflowY:'scroll',height:'30vh'}}>
                            <AlignItemsList comments={props.comments}/>
                        </div>
                        : 
                        <>
                            <i className="fas fa-comments" style={{marginTop:'15px',color:'#1C4690',fontSize:'35px',opacity:5}}></i> <br/>
                            <span className='text-muted' style={{color:'#1C4690',fontSize:'12px',opacity:5}}>No Comments</span>
                       </>
                           
                        }

                      
  
                </div>
                
                <div className='text-center '> 
                <ButtonComponent  
                    cssClass='e-custom-warning' 
                    className='m-2 p-2' 
                    style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
                    disabled={false} 
                    onClick={handleClose}
                    ><i className='fas fa-times mx-1'></i> <span className='mx-2'> Close</span> </ButtonComponent>
                                 
                </div>
            </DialogContent>
                
           
        </Dialog>
    </>
  );
}


export default  CommentsDialog

