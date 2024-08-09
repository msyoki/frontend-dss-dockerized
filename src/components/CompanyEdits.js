import React, { useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import AuthContext from '../context/Authcontext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import * as constants from '../components/constants/constants';

const CompanyEdits = (props) => {
  const { authTokens, logoutUser, user } = useContext(AuthContext);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [logoFile, setLogoFile] = useState('');

  const handleClose = () => {
    props.setOpenDialogCompanyEdits(false);
  };

  const handleAvatarFileChange = (event) => {
    setLogoFile(event.target.files[0]);
  };

  const updateCompanyLogo = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (logoFile) {
      formData.append('logo', logoFile);
      formData.append('fileName', logoFile.name);
    }

    const config = {
      method: 'patch',
      url: `${constants.devApiBaseUrl}/api/company/${user.companyid}`,
      headers: { 'Authorization': `Bearer ${authTokens.access} ` },
      data: formData
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data['logo']));
        props.setCompanyLogo(response.data['logo']);

        setOpenAlert(true);
        setAlertMsg('Profile updated, effective on next login');
        setAlertSeverity('success');
        setTimeout(() => {
          setOpenAlert(false);
        }, 2000);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  return (
    <Dialog
      open={props.opendialogcompanyedits}
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      className='text-center'
    >
      <Card>
        <div className="card-content-wrapper">
          <br />
          <CardMedia
            component="img"
            alt="Organization Logo"
            style={{ maxWidth: '50%', maxHeight: '50%', margin: 'auto' }}
            image={props.companylogo}

          />

          <CardContent className='content-section'>
            <Typography variant="body2" color="text.white" className='p-4'>
              Upload Organization Logo
              <div className="form-group mb-1 p-3">
                <div className="input-group mt-1">
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    name="logo"
                    accept="image/png,image/jpeg"
                    onChange={handleAvatarFileChange}
                  />
                </div>
              </div>
              <small> Recommended dimensions: (min 1752 x 572) File Type: png</small>
            </Typography>
            <div className="button-section">
              <ButtonComponent
                cssClass='e-custom-warning'
                className='m-2 p-2'
                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                disabled={false}
                onClick={handleClose}
              >
                <i className="fas fa-times mx-1"></i><span className='mx-2'>Cancel </span>
              </ButtonComponent>
              <ButtonComponent
                cssClass='e-custom-light'
                className='m-2 p-2'
                style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }}
                disabled={false}
                onClick={updateCompanyLogo}
              >
                <i className="fas fa-save mx-1"></i><span className='mx-2'>Save Update </span>
              </ButtonComponent>
            </div>
          </CardContent>
        </div>
      </Card>
    </Dialog>
  );
}

export default CompanyEdits;
