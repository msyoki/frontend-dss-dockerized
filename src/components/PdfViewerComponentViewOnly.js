import React, { useEffect, useRef ,useState} from "react";
import PropTypes from "prop-types";
import SignatureDialog from "./SignatureDialog";
import { Tooltip } from '@mui/material';
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';
import { useNavigate } from "react-router-dom";
import ConfirmCompleteDialog from "./ConfirmCompleteDialog";
import * as constants from './constants/constants'
import axios from 'axios'
import LoadingMini from "./Loading/LoadingMini2";

async function loadPdf(container, document) {
  
  const PSPDFKit = await import("pspdfkit");
  const instance = await PSPDFKit.load({
    licenseKey:constants.license,
    container,
    document,
    baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
  
  });
  const items = instance.toolbarItems;
  
  //instance.setToolbarItems(items.filter((item) => item.type !== "document-editor" && item.type !== "document-crop" && item.title !== "erase" &&  item.type !== "export-pdf" && item.type !== "ink" && item.type !== "print" && item.type !== "text-fill-color" && item.type !== "annotate" && item.type !== "signature" && item.type !== "highlighter" && item.type !== "image" && item.type !== "stamp" && item.type !== "note"  && item.type !== "line" && item.type !== "callout" && item.type !== "link" && item.type !== "text-highlighter" && item.type !== "arrow" && item.type !== "rectangle" && item.type !== "ellipse" && item.type !== "polygon" && item.type !== "polyline" && item.type !== "arrow")); 

  instance.setToolbarItems(items.filter((item) => {
    return (
      item.type === "sidebar-thumbnails" ||
      item.type === "sidebar-document-outline" ||
      item.type === "pager"||
      item.type === "zoom-in"||
      item.type === "zoom-out"
    );
  }));
  return instance;

}

function PdfViewerComponentViewOnly(props) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [pdfInstance, setPdfInstance] = useState(null);
  const [document,setDocument]=useState('')
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  let getDocument = async() => {

    try {
   
        // Add onDownloadProgress to the Axios configuration
        const response = await axios.get(`${constants.devApiBaseUrl}/api/base64/${props.document}/`, {
            onDownloadProgress: progressEvent => {
              const percentage = (progressEvent.loaded / progressEvent.total) * 100;
              displayPercentageWaitingTime(percentage);
            }
        });
        console.log(response.data.base64_uri)
        // Handle the response data
        setDocument(response.data.base64_uri);
        loadPdf(containerRef.current, response.data.base64_uri)
        .then((instance) => {
          setPdfInstance(instance)
        })
        .catch((error) => {
          // Handle errors
          console.error("Error loading PDF:", error);
        });
  
      return () => {
        // Unmount cleanup if needed
      };
       
    } catch (error) {
        // Handle errors
        console.error(error);
    }
  };


  // Function to display percentage waiting time
function displayPercentageWaitingTime(percentage) {
  // You can update your UI or // console.log the percentage
  let perce = parseFloat(percentage.toFixed(2));
  setLoadingPercentage(perce);

}

  useEffect(() => {
    getDocument()
    
  }, [props.document]);

  return (
    <>
      {document?
      
      <div ref={containerRef} style={{ width: "100%", height: `${props.height}` }} />
      :
        <LoadingMini percent={loadingPercentage} />

      }
 
    </>
  );
}

PdfViewerComponentViewOnly.propTypes = {
  document: PropTypes.string.isRequired,
};

export default PdfViewerComponentViewOnly;
