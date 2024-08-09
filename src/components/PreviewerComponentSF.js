import React, { useEffect, useRef ,useState} from "react";
import PropTypes from "prop-types";
import SignatureDialog from "./SignatureDialog";
import { Tooltip } from '@mui/material';
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';
import { useNavigate } from "react-router-dom";
import ConfirmCompleteDialog from "./ConfirmCompleteDialog";
import signHere from '../images/signhere.png'
import * as constants from './constants/constants'

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
      // item.type === "sidebar-thumbnails" ||
      // item.type === "sidebar-annotations" ||
      // item.type === "sidebar-document-outline" ||
      item.type === "pager"||
      item.type === "zoom-in"||
      item.type === "zoom-out"
    );
  }));
  return instance;

}

function PdfViewerComponentSF(props) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [pdfInstance, setPdfInstance] = useState(null);




async function updateImageAnnotations(annotation){

  // Create a new item to add to the list
  const newItem = {
      id: annotation.id,
      boundingBox: {
        left: annotation.boundingBox.left,
        top: annotation.boundingBox.top,
        width: annotation.boundingBox.width,
        height: annotation.boundingBox.height,
      },
  };

  // Check if the id already exists in updatedImageAnnotations
  const isIdExistsIndex = props.updatedDefaultAnnotations.findIndex(item => item.id === newItem.id);

  if (isIdExistsIndex !== -1) {
      // If the id exists, update the boundingBox for that item
      props.setUpdatedDefaultAnnotations(prevAnnotations => {
          const updatedAnnotations = [...prevAnnotations];
          updatedAnnotations[isIdExistsIndex].boundingBox = newItem.boundingBox;
          return updatedAnnotations;
      });
  } else {
    // If the id doesn't exist, add the new item to the list
    props.setUpdatedDefaultAnnotations(prevAnnotations => [...prevAnnotations, newItem]);
  }
}

let placeSignature = async () => {
  // Assuming annotationData is defined

  // Set signature type and base64 string
 
  const PSPDFKit = await import("pspdfkit");

  // Function to handle page press event
  async function onPagePress(event) {
    try {
      // Fetch blob
      const request = await fetch(signHere);
      const blob = await request.blob();
    

      // Create attachment
      const imageAttachmentId = await pdfInstance.createAttachment(blob);

      // Set default dimensions
      let imageHeight = 80;
      let imageWidth = 80;

      const annotation = new PSPDFKit.Annotations.ImageAnnotation({
        pageIndex: event.pageIndex,
        isSignature: true,
        locked:false,
        contentType: 'image/png',
        imageAttachmentId,
        description:'signing field',
        boundingBox: new PSPDFKit.Geometry.Rect({
          left: event.point.x,
          top: event.point.y,
          width: imageWidth,
          height: imageHeight,
            
        }),
      });
        // const annotationJSON = PSPDFKit.Annotations.toSerializableObject(annotation);

      const createdAnnotations = await pdfInstance.create(annotation);
      const [savedAnnotation] = await pdfInstance.ensureChangesSaved(createdAnnotations);
      pdfInstance.removeEventListener("page.press", onPagePress);

      // Set annotation data
      const annotationData = {
        id: savedAnnotation.id,
        pageIndex: event.pageIndex,
        isSignature: true,
        locked: false,
        contentType: 'image/png',
        signature: signHere,
        description:'signing field',
        boundingBox: {
          left: event.point.x,
          top: event.point.y,
          width: imageWidth,
          height: imageHeight,
        },
      };

    //  console.log(annotationData)
    
    // Sample email
      let email = props.activeSigner;

      // Update the signers state variable
      props.setSigners(prevSigners => {
        // Create a copy of the previous signers array
        const updatedSigners = [...prevSigners];

        // Find the signer with the matching email
        const signerIndex = updatedSigners.findIndex(signer => signer.email === email);

        // If signer is found, append annotationData to its annotations array
        if (signerIndex !== -1) {
          if (!updatedSigners[signerIndex].annotations) {
            updatedSigners[signerIndex].annotations = []; // Ensure annotations array exists
          }
          updatedSigners[signerIndex].annotations.push(annotationData);
        }
        // console.log(updatedSigners)
        return updatedSigners;
      });
    
     
    

      // Update annotation list
      // props.setAnnotationList(prevannotationList => [...prevannotationList, annotationData]);
    

      // Remove event listener
      
    } catch (error) {
      // Handle error
      pdfInstance.removeEventListener("page.press", onPagePress);
      console.error('Error:', error);
    }
  }

  // Add event listener
  pdfInstance.addEventListener("page.press", onPagePress);
};


  useEffect(() => {
 
    
    loadPdf(containerRef.current, props.document)
      .then((instance) => {
        setPdfInstance(instance)
        function setID(id){
          // console.log(id);
          let appendId = {"id":id}
          props.setDeletionAnnotation((prevannotationList) => [...prevannotationList, appendId]);
          
        }
        instance.addEventListener("annotations.delete", deletedAnnotations=>{
          const id = JSON.parse(JSON.stringify(deletedAnnotations))[0].id;
          setID(id)
        })
        instance.addEventListener("annotations.update", updatedAnnotations=>{
          const annotation = JSON.parse(JSON.stringify(updatedAnnotations))[0];
          updateImageAnnotations(annotation)

          // Now mylistA is updated with the new boundingBox if myid exists in the list

          
        })
      })
      .catch((error) => {
        // Handle errors
        console.error("Error loading PDF:", error);
      });

    return () => {
      // Unmount cleanup if needed
    };
  }, [props.document]);

  return (
    <>
      {props.signers?
      <>
      
     
                    
      
        <div className="shadow-lg">

      <div className=" bg-white ">
      {props.activeSigner === null?       
      <>
       <div className="bg-white ">
       <ButtonComponent 
                          cssClass='e-custom-success' 
                          className='m-2 p-2' 
                          style={{textTransform: 'none',fontWeight:'lighter',fontSize:'14px'}}
                          onClick={props.sendForSigning}
                          disabled={false} 
                          > <i className="fas fa-mail-bulk mx-1" ></i> <span className='mx-2'>Send to Signers</span>  
                        </ButtonComponent>
        </div> 
      </>
      : 
          <>
            {/* <p style={{fontSize:'12px'}}  className='m-2' > <span style={{color:"#2364aa"}}>Selected:</span> {props.activeSigner} </p>    
      */}
       <ButtonComponent 
                          cssClass='e-custom-success' 
                          className='m-2 p-2' 
                          style={{textTransform: 'none',fontWeight:'lighter',fontSize:'14px'}}
                          onClick={props.sendForSigning}
                          disabled={false} 
                          > <i className="fas fa-mail-bulk mx-1" ></i> <span className='mx-2'>Send to Signers</span>  
                        </ButtonComponent>
            <ButtonComponent   className='m-1 p-1' cssClass='e-custom-warning'  style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}  onClick={placeSignature} disabled={false}><i className="fas fa-tag mx-1"></i><span className='mx-1'>Drop "Sign Here" Annotation  </span></ButtonComponent>

        </>
        }

      </div> 
  
        </div>
      </>:<>
        
      </>}
     
      
      <div ref={containerRef} style={{ width: "100%", height: "90vh" }} />
    </>
  );
}

PdfViewerComponentSF.propTypes = {
  document: PropTypes.string.isRequired,
};

export default PdfViewerComponentSF;




