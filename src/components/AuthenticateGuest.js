import { useState, useContext, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Alert from '../components/Alert';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import Authcontext from '../context/Authcontext';
import * as React from 'react';
import LoadingMini from './Loading/LoadingMini';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import KeyIcon from '@mui/icons-material/Key';
import ImageViewer from './ImageViewer';

const AuthGuestDialog = (props) => {
    let [loading, setLoading] = useState(false);
    let [iconUnlocked, setIconUnlock] = useState(false);

    const [maxWidth, setMaxWidth] = React.useState('sm');
    let { authenticateGuest } = useContext(Authcontext);

    const handleCancel=()=>{
        window.location.reload();
    }

    async function VerifyGuest(e) {
        setLoading(true);
        let username = props.signersEmail;
        let password = e.target.password.value;
        let response = await authenticateGuest(e, username, password);

        if (response === 200) {

            setTimeout(() => {
                // Code to be executed after 4 seconds
                setLoading(false);
                props.setLocked(false);
                setTimeout(function () {
                    props.setOpenDialogAuthGuest(false);
                }, 3000);
            }, 3000);
        } else {
            setLoading(false);
            alert("Invalid password");
        }
    }

    let togglep = () => {
        let input_type = document.getElementById('password').type;
        if (input_type === 'password') {
            document.getElementById('password').type = 'text';
            document.getElementById('togglePassword').className = 'fas fa-eye ml-2';
        } else {
            document.getElementById('password').type = 'password';
            document.getElementById('togglePassword').className = 'fas fa-eye-slash ml-2';
        }
    };



    return (

        <Dialog
            open={props.opendialogauthguest}
            maxWidth={maxWidth}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            style={{ backgroundColor: '#1C4690' }}
        >
            <DialogContent
            style={{width:'400px'}}
            >
                <DialogContentText id="alert-dialog-slide-description" className='text-center'>
                    {props.locked ? (
                        <>
                            {loading ? (
                                <div style={{
                                    fontSize: '12px',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <LoadingMini msg={"Verifying"} msg2={"Please wait while we verify your password..."} />
                                    <i className="fas fa-lock my-1" style={{ fontSize: '50px', color: '#174291' }}></i>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        fontSize: '13px',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '20px'
                                    }}
                                >
                                    <form onSubmit={VerifyGuest} >
                                
                                   
                                   
                                     
                                        <div className="text-center">
                                            <i className="fas fa-lock my-2" style={{ fontSize: '40px', color: '#174291' }}></i>
                                            <p className='my-2' style={{ color: '#174291' }}>Signature is locked</p>
                                       
                                        </div>
                                        <ImageViewer base64={props.placedSignature}/>
                                    
                                      <p className='my-3'>To sign as <span style={{ color: '#174291',fontSize:'11px' }}>: {props.signersEmail}</span> </p>
                                     
                                            {/* <p className='my-3'>Enter your account password to place signature</p> */}

                                      <div className='text-center'>
                                        
                                   
                                            <Input
                                                id="password"
                                                autoComplete='false'
                                                type="password"
                                                placeholder="Enter account password"
                                                name="password"
                                                autocomplete="new-password"
                                                required
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <KeyIcon />
                                                    </InputAdornment>
                                                }
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <i
                                                            onClick={togglep}
                                                            className="fas fa-eye-slash"
                                                            id="togglePassword"
                                                            style={{ cursor: 'pointer' }}
                                                        ></i>
                                                    </InputAdornment>
                                                }
                                            />
                                             
                                           
                                            
                                        <ButtonComponent
                                                size='sm'
                                                cssClass='e-custom-primary'
                                                className='my-3 p-2'
                                                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                disabled={false}
                                            >
                                                <i className="fas fa-check mx-1"></i>
                                                <span className='mx-2'>Submit Password</span>
                                            </ButtonComponent>
                                     
                                            </div>
                                          
                                     
                                    </form>
                                    <ButtonComponent
                                                onClick={handleCancel}
                                                size='sm'
                                                cssClass='e-custom-light mx-2'
                                                className=' p-2'
                                                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                                                disabled={false}
                                            >
                                                <i className="fas fa-times mx-1"></i>
                                                <span className='mx-2'>Cancel</span>
                                            </ButtonComponent>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div style={{
                                fontSize: '12px',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}>

                                <div style={{
                                    fontSize: '12px',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <LoadingMini msg={"Document Unlocked"} msg2={"Click on the page to place your signature"} />

                                    <i className="fas fa-lock-open my-1" style={{ fontSize: '50px', color: '#174291' }}></i>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContentText>
            </DialogContent>
        </Dialog>

    );
}

export default AuthGuestDialog;
