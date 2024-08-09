import React, { useState } from 'react';
import { Tooltip } from '@mui/material';
import helplogo from '../images/help2.png';
import '../styles/HelpBubble.css'; // Import the CSS file for styling

const HelpBubble = ({ content }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  };

  const handleExitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  return (
    <div className="help-bubble-container">
   
      <Tooltip placement="left-end" title="Full Screen">
        <i
          className="fas fa-expand help-bubble help-bubble-fullscreen"
          onClick={handleFullscreen}
          aria-label="Full Screen"
        ></i>
      </Tooltip>
      <Tooltip placement="left-end" title="Exit Full Screen" >
        <i
          className="fas fa-compress help-bubble help-bubble-exit-fullscreen"
          onClick={handleExitFullscreen}
          aria-label="Exit Full Screen"
        ></i>
      </Tooltip>
      <Tooltip placement="left-end" title="Help">
        <img
          src={helplogo} // Help icon
          className="help-bubble help-bubble-help"
          onClick={handleOpenModal}
          alt="Help Icon"
          width={"60px"}
        />
      </Tooltip>
      {isModalOpen && (
        <div>
          <div className="help-bubble-modal" onClick={handleCloseModal}></div>
          <div className="help-bubble-tooltip bg-white p-3">
            <i
              className="fas fa-times-circle close-button p-2"
              style={{ color: "#e76f51", fontSize: '25px' }}
              onClick={handleCloseModal}
              aria-label="Close"
            ></i>
            <p className="help-bubble-text" style={{ fontSize: '16px', color: '#1C4690' }}>
              To sign the document
            </p>
            <div style={{ fontSize: '12px' }}>
              <ol>
                <li>Once the document loads, use the options at the top of the screen to either,</li>
                <ul>
                  <li>Sign on the current page,</li>
                  <li>Sign on all pages,</li>
                  <li>Decline to sign,</li>
                </ul>
                <li>Should you choose “Sign on the current page” or “Sign on all pages”, a pop-up window will appear that allows you to either choose from a list of saved signatures, upload a signature from your computer, or draw a new signature.</li>
                <li>Once you have selected your preferred signing option, the signature appears on the signature pad.</li>
                <li>Click on ‘Place Signature’ below where your signature appears. The document will then appear on the previewer.</li>
                <li>Place your cursor where you would like to place the signature and click. Use your cursor to position and resize the signature as you prefer.</li>
                <li>Click on “Complete Signing” at the top right of the previewer.</li>
              </ol>
              <p style={{ fontSize: '12px' }}>
                Congratulations on successfully signing the document. We thank you for using our service. We hope you enjoyed the experience.
              </p>
            </div>
            <p className="help-bubble-text" style={{ fontSize: '13px' }}>{content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpBubble;
