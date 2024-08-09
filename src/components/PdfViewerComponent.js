import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import SignatureDialog from "./SignatureDialog";
import { Tooltip } from '@mui/material';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { useNavigate } from "react-router-dom";
import ConfirmCompleteDialog from "./ConfirmCompleteDialog";
import SigningOptionDialog from "./signingOptionDialog";
import signHere from '../images/signhere.png'
import axios from "axios"
import OtpDialog from "./OtpDialog";

import * as constants from './constants/constants'
import AuthGuestDialog from "./AuthenticateGuest";

async function loadPdf(container, document) {
  const PSPDFKit = await import("pspdfkit");
  const customButton = {
    type: "custom",
    id: "my-button",
    title: "Stamp",
    icon: "<i className='fas fa-stamp'></i>",
    onPress: (event) => {
      const AddText = async () => {
        async function onPagePress(event) {
          // Your existing code here...
          const PSPDFKit = await import("pspdfkit");

          const textAnnotation = new PSPDFKit.Annotations.TextAnnotation({
            boundingBox: new PSPDFKit.Geometry.Rect({ left: event.point.x, top: event.point.y, width: 120, height: 70 }),
            fontSize: 11,

            isSignature: false,
            text: {
              format: "plain",
              value: "Double click to edit text",
            },
            pageIndex: event.pageIndex,

          });

          instance.create(textAnnotation);


          // Remove the event listener once the logic is complete
          instance.removeEventListener("page.press", onPagePress);


          const annotations = await instance.getAnnotations(0);
          annotations.forEach((annotation) => {
            const annotationId = annotation.id;

          });
        }


        instance.addEventListener("page.press", onPagePress);




      }

      AddText()
    }
  };


  const instance = await PSPDFKit.load({
    licenseKey: constants.license,
    container,
    document,
    toolbarItems: [...PSPDFKit.defaultToolbarItems, customButton],

    baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,


  });
  const items = instance.toolbarItems;




  //instance.setToolbarItems(items.filter((item) => item.type !== "document-editor" && item.type !== "document-crop" && item.title !== "erase" &&  item.type !== "export-pdf" && item.type !== "ink" && item.type !== "print" && item.type !== "text-fill-color" && item.type !== "annotate" && item.type !== "signature" && item.type !== "highlighter" && item.type !== "image" && item.type !== "stamp" && item.type !== "note"  && item.type !== "line" && item.type !== "callout" && item.type !== "link" && item.type !== "text-highlighter" && item.type !== "arrow" && item.type !== "rectangle" && item.type !== "ellipse" && item.type !== "polygon" && item.type !== "polyline" && item.type !== "arrow")); 

  instance.setToolbarItems(items.filter((item) => {
    return (
      item.type === "sidebar-thumbnails" ||
      item.type === "sidebar-document-outline" ||
      item.type === "sidebar-annotations" ||
      item.type === "pager" ||
      item.type === "zoom-in" ||
      item.type === "zoom-out"
      //item.type === "custom" 
    );
  }));


  return instance;

}
let textEventActive = false
let imageEventActive = false
let onPagePressTextAdded = false;
let onPagePressImageAdded = false;



function PdfViewerComponent(props) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [pdfInstance, setPdfInstance] = useState(null);
  let [savedBlob, setBlob] = useState(null)
  let [deleteAnnotations, setDeletionAnnotation] = useState([])
  let [textAnnotation, setTextAnnotations] = useState([])
  let [savedsignaturetype, setSavedSignatureType] = useState('')
  let [updatedImageAnnotations, setUpdatedImageAnnotations] = useState([])
  let [savedbase64Signature, setBase64Signature] = useState('')

  let [signatureAnnotated, setSignatureAnnotated] = useState(false)
  let [isStamp, setIsStamp] = useState(false)

  async function handleSign() {

    setIsStamp(false);
    props.newSignature();
    setOpenSignatureOptions(true);
    props.setSinglepage(false);
    props.setMultipage(false);
    props.setAllPgebtnCssClass('e-custom-light');
    props.setOnePgebtnCssClass('e-custom-light');
    setOpenSignatureOptions(true);
  }


  async function handleStamp() {
 
    setIsStamp(true);
    props.newSignature();
    props.setSinglepage(false);
    props.setMultipage(false);
    props.setAllPgebtnCssClass('e-custom-light');
    props.setOnePgebtnCssClass('e-custom-light');
    setOpenSignatureOptions(true);
  }
  const [openSignatureOptions, setOpenSignatureOptions] = React.useState(false);


  async function FormInatsnceClick() {
    const PSPDFKit = await import("pspdfkit");
    const formFieldName = "signature";

    // Get all form fields in the document.
    const formFields = await pdfInstance.getFormFields();

    // Find the signature form field.
    const field = formFields.find(
      (formField) =>
        formField.name === formFieldName &&
        formField instanceof PSPDFKit.FormFields.SignatureFormField
    );

    // Set a custom value for the signature field.
    pdfInstance.setFormFieldValue(field.name);
  }



  const downloadFile = async () => {
    const buffer = await pdfInstance.exportPDF();
    const supportsDownloadAttribute = HTMLAnchorElement.prototype.hasOwnProperty("download");
    const blob = new Blob([buffer], { type: "application/pdf" });
    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, "download.pdf");
    } else if (!supportsDownloadAttribute) {
      const reader = new FileReader();
      reader.onloadend = function () {
        const dataUrl = reader.result;
        downloadPdf(dataUrl);
      };
      reader.readAsDataURL(blob);
    } else {
      const objectUrl = window.URL.createObjectURL(blob);
      downloadPdf(objectUrl);
      window.URL.revokeObjectURL(objectUrl);
    }
    function downloadPdf(blob) {
      const a = document.createElement("a");
      a.href = blob;
      a.style.display = "none";
      a.download = "download.pdf";
      a.setAttribute("download", "download.pdf");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  async function updateImageAnnotations(annotation) {

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
    const isIdExistsIndex = updatedImageAnnotations.findIndex(item => item.id === newItem.id);

    if (isIdExistsIndex !== -1) {
      // If the id exists, update the boundingBox for that item
      setUpdatedImageAnnotations(prevAnnotations => {
        const updatedAnnotations = [...prevAnnotations];
        updatedAnnotations[isIdExistsIndex].boundingBox = newItem.boundingBox;
        return updatedAnnotations;
      });
    } else {
      // If the id doesn't exist, add the new item to the list
      setUpdatedImageAnnotations(prevAnnotations => [...prevAnnotations, newItem]);
    }
  }

  // Assuming you have both state variables and other necessary data


  const completeSigning = async () => {
    try {
      props.setOpenDialogLoading(true);
      const annotationsForEachPage = await Promise.all(
        Array.from(Array(pdfInstance.totalPageCount).keys()).map(pdfInstance.getAnnotations)
      );
      const allAnnotations = annotationsForEachPage.flat();

      const annotationKeyCheck = 'text';

      for (const item of JSON.parse(JSON.stringify(allAnnotations))[0]) {
        if (item.hasOwnProperty(annotationKeyCheck)) {
          const idToCheck = item.id;
          const existsInListB = textAnnotation.some(itemB => itemB.id === idToCheck);
          if (!existsInListB) {
            setTextAnnotations(prevannotationList => [...prevannotationList, item]);
          }
        }
      }

      let listA = deleteAnnotations;
      let listB = props.annotationList;
      let listC = textAnnotation;

      function removeItemsById(id) {
        setDeletionAnnotation(listA => listA.filter(itemA => itemA.id !== id));
        props.setAnnotationList(listB => listB.filter(itemB => itemB.id !== id));
        removeItemsById2(id);
      }

      function removeItemsById2(id) {
        setDeletionAnnotation(listA => listA.filter(itemA => itemA.id !== id));
        setTextAnnotations(listC => listC.filter(itemC => itemC.id !== id));
      }


      listA.forEach(itemA => {
        const idToCheck = itemA.id;
        const existsInListB = listB.some(itemB => itemB.id === idToCheck);
        const existsInListC = listC.some(itemC => itemC.id === idToCheck);
        if (existsInListB) {
          removeItemsById(idToCheck);
        }
        if (existsInListC) {
          removeItemsById2(idToCheck);
          
        }
      });


      function removeItemByTextValue(){
        setTextAnnotations(listC => listC.filter(itemC => itemC.text.value !== "Double click to edit text"));
      }
      removeItemByTextValue();
  


      updatedImageAnnotations.forEach(updatedItem => {
        const indexInAnnotations = props.annotationList.findIndex(item => item.id === updatedItem.id);
        if (indexInAnnotations !== -1) {
          props.setAnnotationList(prevAnnotations => {
            const updatedAnnotations = [...prevAnnotations];
            updatedAnnotations[indexInAnnotations].boundingBox = updatedItem.boundingBox;
            return updatedAnnotations;
          });
        }
      });

      props.setOpenDialogLoading(false);
      props.setOpenConfirmCompleteDialog(true);
    } catch (error) {
      // Handle any errors here
      // console.error("Error occurred:", error);
      // Optionally, you can notify the user about the error
      // Example: showSnackbar("An error occurred while completing signing process.");
    }
  };



  let placeSignature = async (combinedBase64String, signatureType, annotations) => {
    props.setPlacedSignature(combinedBase64String)
 
    if (props.authenticateUser) {
      props.setFileLocked(true)
      props.setOpenDialogAuthGuest(true)
    }

    textEventActive = false
    imageEventActive = true
    // Set signature type and base64 string
    setSavedSignatureType(signatureType);
    setBase64Signature(combinedBase64String);
 

    const PSPDFKit = await import("pspdfkit");

    if(!onPagePressImageAdded){
      async function onPagePress2(event) {
        // Your existing code here...
   
     
          try {
            const request = await fetch(combinedBase64String);
            // console.log(request)
            const blob = await request.blob();
            
            setBlob(blob)
  
            const imageAttachmentId = await pdfInstance.createAttachment(blob);
            let imageHeight = null
            let imageWidth = null
            let imageHeightpost = null
            let imagewidthpost = null
            if (imageEventActive) {
              if (!annotations) {
                setSignatureAnnotated(false)
                imageHeight =  40;
                imageWidth =  80;
                imageHeightpost = 40
                imagewidthpost = 80
                if (props.multipage) {
                  // Assuming instance.totalPageCount is the total number of pages
                  const docPageCount = pdfInstance.totalPageCount;
  
                  // // Perform an action on each page
                  for (let currentPage = 0; currentPage <= docPageCount; currentPage++) {
  
                    const annotation = new PSPDFKit.Annotations.ImageAnnotation({
                      pageIndex: currentPage,
                      isSignature: true,
                      locked: false,
                      contentType: 'image/png',
                      imageAttachmentId,
                      description: 'Signature',
                      boundingBox: new PSPDFKit.Geometry.Rect({
                        left: event.point.x,
                        top: event.point.y,
                        width: imageWidth,
                        height: imageHeight,
  
                      }),
                    });
                    const createdAnnotations = await pdfInstance.create(annotation);
                    const [savedAnnotation] = await pdfInstance.ensureChangesSaved(createdAnnotations);
  
                    const annotationData = {
                      id: savedAnnotation.id,
                      pageIndex: currentPage,
                      isSignature: true,
                      locked: false,
                      contentType: 'image/png',
                      signature: combinedBase64String,
                      description: isStamp ? 'Stamp' : 'Signature',
                      boundingBox: {
                        left: event.point.x,
                        top: event.point.y,
                        width: imageWidth,
                        height: imageHeight,
                      },
                    };
                    props.setAnnotationList((prevannotationList) => [...prevannotationList, annotationData]);
  
                  }
                  pdfInstance.removeEventListener("page.press", onPagePress2);
  
  
                } else {
                  const annotation = new PSPDFKit.Annotations.ImageAnnotation({
                    pageIndex: event.pageIndex,
                    isSignature: true,
                    locked: false,
                    contentType: 'image/png',
                    imageAttachmentId,
                    description: 'Signature',
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
                  pdfInstance.removeEventListener("page.press", onPagePress2);
                  const annotationData = {
                    id: savedAnnotation.id,
                    pageIndex: event.pageIndex,
                    isSignature: true,
                    locked: false,
                    contentType: 'image/png',
                    signature: combinedBase64String,
                    description: isStamp ? 'Stamp' : 'Signature',
                    boundingBox: {
                      left: event.point.x,
                      top: event.point.y,
                      width: imageWidth,
                      height: imageHeight,
                    },
                  };
                  props.setAnnotationList((prevannotationList) => [...prevannotationList, annotationData]);
  
  
                }
                onPagePressImageAdded = false;
  
              } else {
                setSignatureAnnotated(true)
                imageHeight = 40
                imageWidth = 150
                imageHeightpost = 40
                imagewidthpost = 150
  
                if (props.multipage) {
                  // Assuming instance.totalPageCount is the total number of pages
                  const docPageCount = pdfInstance.totalPageCount;
  
  
                  // // Perform an action on each page
                  for (let currentPage = 0; currentPage <= docPageCount; currentPage++) {
  
                    // const annotationJSON = PSPDFKit.Annotations.toSerializableObject(annotation);
                    const annotation = new PSPDFKit.Annotations.ImageAnnotation({
                      pageIndex: currentPage,
                      isSignature: true,
                      locked: false,
                      contentType: 'image/png',
                      imageAttachmentId,
                      description: 'Signature',
                      boundingBox: new PSPDFKit.Geometry.Rect({
                        left: event.point.x,
                        top: event.point.y,
                        width: imageWidth,
                        height: imageHeight,
  
                      }),
                    });
                    const createdAnnotations = await pdfInstance.create(annotation);
                    const [savedAnnotation] = await pdfInstance.ensureChangesSaved(createdAnnotations);
  
                    const annotationData = {
                      id: savedAnnotation.id,
                      pageIndex: currentPage,
                      isSignature: true,
                      locked: false,
                      contentType: 'image/png',
                      signature: combinedBase64String,
                      description: isStamp ? 'Stamp' : 'Signature',
                      boundingBox: {
                        left: event.point.x,
                        top: event.point.y,
                        width: imageWidth,
                        height: imageHeight,
                      },
                    };
                    props.setAnnotationList((prevannotationList) => [...prevannotationList, annotationData]);
  
                  }
                  pdfInstance.removeEventListener("page.press", onPagePress2);
  
                } else {
                  const annotation = new PSPDFKit.Annotations.ImageAnnotation({
                    pageIndex: event.pageIndex,
                    isSignature: true,
                    locked: false,
                    contentType: 'image/png',
                    imageAttachmentId,
                    description: 'Signature',
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
                  pdfInstance.removeEventListener("page.press", onPagePress2);
                  const annotationData = {
                    id: savedAnnotation.id,
                    pageIndex: event.pageIndex,
                    isSignature: true,
                    locked: false,
                    contentType: 'image/png',
                    signature: combinedBase64String,
                    description: isStamp ? 'Stamp' : 'Signature',
                    boundingBox: {
                      left: event.point.x,
                      top: event.point.y,
                      width: imageWidth,
                      height: imageHeight,
                    },
                  };
                  props.setAnnotationList((prevannotationList) => [...prevannotationList, annotationData]);
  
                }
                onPagePressImageAdded = false;
              }
            }
            onPagePressImageAdded = false;
  
  
          } catch (error) {
  
            pdfInstance.removeEventListener("page.press", onPagePress2);
            // console.error('Error:', error);
          }
        
  
      }
      pdfInstance.addEventListener("page.press", onPagePress2);
      onPagePressImageAdded = true;
    }
 
  };



  const AddText = async () => {
    textEventActive = true;
    imageEventActive = false;

    
  
    // Check if the event listener has already been added
    if (!onPagePressTextAdded) {
      async function onPagePress(event) {
        // Your existing code here...
        const PSPDFKit = await import("pspdfkit");
  
        const textAnnotation = new PSPDFKit.Annotations.TextAnnotation({
          boundingBox: new PSPDFKit.Geometry.Rect({ left: event.point.x, top: event.point.y, width: 120, height: 70 }),
          fontSize: 11,
          isSignature: false,
          text: {
            format: "plain",
            value: "Double click to edit text",
          },
          pageIndex: event.pageIndex,
        });
  
        if (textEventActive) {
          pdfInstance.create(textAnnotation);
          // Remove the event listener once the logic is complete
          pdfInstance.removeEventListener("page.press", onPagePress);
  
          const annotations = await pdfInstance.getAnnotations(0);
          annotations.forEach((annotation) => {
            const annotationId = annotation.id;
          });

          onPagePressTextAdded = false;
        }
      }
  
      // Add the event listener
      pdfInstance.addEventListener("page.press", onPagePress);
      onPagePressTextAdded = true; // Set the flag to indicate that the event listener has been added
    }
  };
  

  const placeSignatureAgain = async () => {
    props.setPlacedSignature(props.tempUploadedsignature)
    const PSPDFKit = await import("pspdfkit")
    textEventActive = false
    imageEventActive = true
    if (props.authenticateUser) {
      props.setFileLocked(true)
      props.setOpenDialogAuthGuest(true)
    }
    if(!onPagePressImageAdded){
      async function onPagePress2(event) {
        // Your existing code here...
        if(imageEventActive){


            try {
              const request = await fetch(props.tempUploadedsignature);
    
              // console.log(request)
              const blob = await request.blob();
    
    
              const imageAttachmentId = await pdfInstance.createAttachment(blob);
              let imageHeight = null
              let imageWidth = null
              let imageHeightpost = null
              let imagewidthpost = null
              if (!signatureAnnotated) {
    
                // if(savedsignaturetype === "upload"){
                imageHeight = 40
                imageWidth = 80
                imageHeightpost = 40
                imagewidthpost = 80
                if (props.multipage) {
                  // Assuming instance.totalPageCount is the total number of pages
                  const docPageCount = pdfInstance.totalPageCount;
    
                  // // Perform an action on each page
                  for (let currentPage = 0; currentPage <= docPageCount; currentPage++) {
    
                    const annotation = new PSPDFKit.Annotations.ImageAnnotation({
                      pageIndex: currentPage,
                      isSignature: true,
                      locked: false,
                      contentType: 'image/png',
                      imageAttachmentId,
                      description: 'Signature',
                      boundingBox: new PSPDFKit.Geometry.Rect({
                        left: event.point.x,
                        top: event.point.y,
                        width: imageWidth,
                        height: imageHeight,
    
                      }),
                    });
                    const createdAnnotations = await pdfInstance.create(annotation);
                    const [savedAnnotation] = await pdfInstance.ensureChangesSaved(createdAnnotations);
    
                    const annotationData = {
                      id: savedAnnotation.id,
                      pageIndex: currentPage,
                      isSignature: true,
                      locked: false,
                      contentType: 'image/png',
                      signature: props.tempUploadedsignature,
                      description: isStamp ? 'Stamp' : 'Signature',
                      boundingBox: {
                        left: event.point.x,
                        top: event.point.y,
                        width: imageWidth,
                        height: imageHeight,
                      },
                    };
                    props.setAnnotationList((prevannotationList) => [...prevannotationList, annotationData]);
    
                  }
                  pdfInstance.removeEventListener("page.press", onPagePress2);
    
    
                } else {
                  const annotation = new PSPDFKit.Annotations.ImageAnnotation({
                    pageIndex: event.pageIndex,
                    isSignature: true,
                    locked: false,
                    contentType: 'image/png',
                    imageAttachmentId,
                    description: 'Signature',
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
                  pdfInstance.removeEventListener("page.press", onPagePress2);
                  const annotationData = {
                    id: savedAnnotation.id,
                    pageIndex: event.pageIndex,
                    isSignature: true,
                    locked: false,
                    contentType: 'image/png',
                    signature: props.tempUploadedsignature,
                    description: isStamp ? 'Stamp' : 'Signature',
                    boundingBox: {
                      left: event.point.x,
                      top: event.point.y,
                      width: imageWidth,
                      height: imageHeight,
                    },
                  };
                  props.setAnnotationList((prevannotationList) => [...prevannotationList, annotationData]);
    
    
                }
    
    
              } else {
           
                imageHeight = 40
                imageWidth = 150
                imageHeightpost = 40
                imagewidthpost = 150
  
          
            
                if (props.multipage) {
                  // Assuming instance.totalPageCount is the total number of pages
                  const docPageCount = pdfInstance.totalPageCount;
    
    
                  // // Perform an action on each page
                  for (let currentPage = 0; currentPage <= docPageCount; currentPage++) {
    
                    // const annotationJSON = PSPDFKit.Annotations.toSerializableObject(annotation);
                    const annotation = new PSPDFKit.Annotations.ImageAnnotation({
                      pageIndex: currentPage,
                      isSignature: true,
                      locked: false,
                      contentType: 'image/png',
                      imageAttachmentId,
                      description: 'Signature',
                      boundingBox: new PSPDFKit.Geometry.Rect({
                        left: event.point.x,
                        top: event.point.y,
                        width: imageWidth,
                        height: imageHeight,
    
                      }),
                    });
                    const createdAnnotations = await pdfInstance.create(annotation);
                    const [savedAnnotation] = await pdfInstance.ensureChangesSaved(createdAnnotations);
    
                    const annotationData = {
                      id: savedAnnotation.id,
                      pageIndex: currentPage,
                      isSignature: true,
                      locked: false,
                      contentType: 'image/png',
                      signature: props.tempUploadedsignature,
                      description: isStamp ? 'Stamp' : 'Signature',
                      boundingBox: {
                        left: event.point.x,
                        top: event.point.y,
                        width: imageWidth,
                        height: imageHeight,
                      },
                    };
                    props.setAnnotationList((prevannotationList) => [...prevannotationList, annotationData]);
    
                  }
                  pdfInstance.removeEventListener("page.press", onPagePress2);
    
                } else {
                  const annotation = new PSPDFKit.Annotations.ImageAnnotation({
                    pageIndex: event.pageIndex,
                    isSignature: true,
                    locked: false,
                    contentType: 'image/png',
                    imageAttachmentId,
                    description: 'Signature',
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
                  pdfInstance.removeEventListener("page.press", onPagePress2);
                  const annotationData = {
                    id: savedAnnotation.id,
                    pageIndex: event.pageIndex,
                    isSignature: true,
                    locked: false,
                    contentType: 'image/png',
                    signature: props.tempUploadedsignature,
                    description: isStamp ? 'Stamp' : 'Signature',
                    boundingBox: {
                      left: event.point.x,
                      top: event.point.y,
                      width: imageWidth,
                      height: imageHeight,
                    },
                  };
                  props.setAnnotationList((prevannotationList) => [...prevannotationList, annotationData]);
    
                }
              }
              onPagePressImageAdded = false;
    
    
            } catch (error) {
    
              pdfInstance.removeEventListener("page.press", onPagePress2);
              // console.error('Error:', error);
            }
          
        }
      

      }
      pdfInstance.addEventListener("page.press", onPagePress2);
      onPagePressImageAdded = true;
    }
   
    
  }





  async function placeDefaultAnnotations(instance) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${constants.annotationsurl}/api/Annoations/${props.signerguid}`,
    };
    await axios.request(config)
      .then(async (response) => {
        const PSPDFKit = await import("pspdfkit");
        for (const key in response.data) {
          const item = response.data[key];

          // Fetch blob
          const request = await fetch(signHere);
          const blob = await request.blob();

          // Create attachment
          const imageAttachmentId = await instance.createAttachment(blob);

          const annotation = new PSPDFKit.Annotations.ImageAnnotation({
            pageIndex: item.pageIndex,
            isSignature: item.isSignature,
            locked: item.lock,
            contentType: item.contentType,
            imageAttachmentId,
            description: 'signing field',
            boundingBox: new PSPDFKit.Geometry.Rect({
              left: item.boundingBox.left,
              top: item.boundingBox.top,
              width: item.boundingBox.width,
              height: item.boundingBox.height,

            }),
          });
          const createdAnnotations = await instance.create(annotation);
          const [savedAnnotation] = await instance.ensureChangesSaved(createdAnnotations);


        }
        props.setDefaultAnnotations(response.data)
        // console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        // console.log(error);
      });



  };


  useEffect(() => {

    loadPdf(containerRef.current, props.document)
      .then((instance) => {
        setPdfInstance(instance)
        // placeDefaultAnnotations(instance, props.defaultannotations)
        // if(props.defaultannotations){
        // console.log(props.defaultannotations)


        // }
        function setID(id) {
          // console.log(id);
          let appendId = { "id": id }
          setDeletionAnnotation((prevannotationList) => [...prevannotationList, appendId]);

        }
        instance.addEventListener("annotations.delete", updatedAnnotations => {
          const id = JSON.parse(JSON.stringify(updatedAnnotations))[0].id;
          // console.log(props.annotationList.length)
          setID(id)

        })

        instance.addEventListener("annotations.update", deletedAnnotations => {
          const annotation = JSON.parse(JSON.stringify(deletedAnnotations))[0];
          updateImageAnnotations(annotation)

          // Now mylistA is updated with the new boundingBox if myid exists in the list


        })
        // function delayedFunction() {

        // }

        // setTimeout(delayedFunction, 5000); // 5000 milliseconds = 5 seconds



      })
      .catch((error) => {
        // Handle errors
        // console.error("Error loading PDF:", error);
      });

    return () => {
      // Unmount cleanup if needed
    };
  }, [props.document]);

  return (
    <>
      <OtpDialog
        time={props.time}
        setTime={props.setTime}
        setResetTimer={props.setResetTimer}
        timerClock={props.timerClock}
        alertseverity={props.alertseverity}
        alertmsg={props.alertmsg}
        openalert={props.openalert}
        maskedotpphone={props.maskedotpphone}
        otpphone={props.currentsignerphone}
        trialcount={props.trialcount}
        setTrialCount={props.setTrialCount}
        setAlertMsg={props.setAlertMsg}
        setAlertSeverity={props.setAlertSeverity}
        setOpenAlert={props.setOpenAlert}
        setOTP={props.setOTP}
        setOpenDialogOtp={props.setOpenDialogOtp}
        opendialogotp={props.opendialogotp}
        completeSigning={props.completeSigning}
        user={props.user}
      />


      <ConfirmCompleteDialog
        opendialogloading={props.opendialogloading}
        setOpenDialogLoading={props.setOpenDialogLoading}
        openconfirmcompletedialog={props.openconfirmcompletedialog}
        setOpenConfirmCompleteDialog={props.setOpenConfirmCompleteDialog}
        completeSigning={props.handleClickOpenDialogOtp}
        textAnnotation={textAnnotation}
        fileurl={props.fileurl}
        signerguid={props.signerguid}
        ip={props.ip}
        checkSigning={props.checkSigning}
        setOpenDialogSignature={props.setOpenDialogSignature}
        docname={props.docname}
        pagetype={props.pagetype}
        guid={props.guid}
        updatedImageAnnotations={updatedImageAnnotations}
        annotationList={props.annotationList}
        displayPercentageWaitingTime={props.displayPercentageWaitingTime}
      />
      <SigningOptionDialog
        open={openSignatureOptions}
        setOpen={setOpenSignatureOptions}
        onepagebtncssclass={props.onepagebtncssclass}
        allpagebtncssclass={props.allpagebtncssclass}
        signonePage={props.signonePage}
        signAllpages={props.signAllpages}
        isStamp={isStamp}
      />

      <SignatureDialog

        opendialogsignature={props.opendialogsignature}
        setOpenDialogSignature={props.setOpenDialogSignature}
        user={props.user}
        savedsignature={props.savedsignature}
        setSaveSignature={props.setSaveSignature}
        setAddSignature={props.setAddSignature}
        tempUploadedsignature={props.tempUploadedsignature}
        setTempSignature={props.setTempSignature}
        signersavedsignatures={props.signersavedsignatures}
        signersavedstamps={props.signersavedstamps}
        signeremail={props.currentsignerEmail}
        pagetype={props.pagetype}
        isstamp={props.isstampuload}
        signingpaddidabled={props.signingpaddidabled}
        setSigningPadDisabled={props.setSigningPadDisabled}
        signerguid={props.signerguid}
        setSignatureHeight={props.setSignatureHeight}
        setSignatureWidth={props.setSignatureWidth}
        signaturewidth={props.signaturewidth}
        signatureheight={props.signatureheight}
        uploadedsignatureheight={props.uploadedsignatureheight}
        uploadedsignaturewidth={props.uploadedsignaturewidth}
        setUploadedHeight={props.setUploadedHeight}
        setUploadedWidth={props.setUploadedWidth}
        setHasAnnotations={props.setHasAnnotations}
        instance={pdfInstance}
        pdskPlaceSignature={placeSignature}
        isStamp={isStamp}
      />
      <div className='row p-1' style={{ backgroundColor: "#cccccc" }}  >

        {props.user ?
          <>
            <div className='col-md-5 col-sm-12 d-flex justify-content-center' >
              {props.tempUploadedsignature ?
                <>

                  <Tooltip title='Place signature on current page'>
                    <span className='mr-auto'>
                      <ButtonComponent cssClass='e-custom-primary' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} onClick={handleSign} disabled={false}> <i className="fas fa-signature mx-1" ></i><span className='mx-1'>Sign </span></ButtonComponent>
                    </span>
                  </Tooltip>
                  <Tooltip title='Place signature on current page'>
                    <span className='mr-auto'>
                      <ButtonComponent cssClass='e-custom-primary' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} onClick={handleStamp} disabled={false}> <i className="fas fa-stamp mx-1" ></i><span className='mx-1'>Stamp</span></ButtonComponent>
                    </span>
                  </Tooltip>
                  <Tooltip title='Place Signature Again'>
                    <span>
                      <ButtonComponent onClick={placeSignatureAgain} cssClass='e-custom-light' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} disabled={false}> <i className="fas fa-map-marker-alt mx-1" ></i><span className='mx-1'>Place {isStamp ? <>Stamp</> : <>Signature</>} </span></ButtonComponent>
                    </span>
                  </Tooltip>

                  <Tooltip title='Add Free Text'>
                    <span>
                      <ButtonComponent onClick={AddText} cssClass='e-custom-light' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} disabled={false}> <i className="fas fa-keyboard mx-1"></i><span className='mx-1'>Text </span> </ButtonComponent>
                    </span>
                  </Tooltip>


                </>
                :
                <>


                  <Tooltip title='Place signature on current page'>
                    <span className='mr-auto'>
                      <ButtonComponent cssClass='e-custom-primary' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} onClick={handleSign} disabled={false}> <i className="fas fa-signature mx-1" ></i><span className='mx-1'>Sign </span></ButtonComponent>
                    </span>
                  </Tooltip>
                  <Tooltip title='Place signature on current page'>
                    <span className='mr-auto'>
                      <ButtonComponent cssClass='e-custom-primary' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} onClick={handleStamp} disabled={false}> <i className="fas fa-stamp mx-1" ></i><span className='mx-1'>Stamp</span></ButtonComponent>
                    </span>
                  </Tooltip>

                  <Tooltip title='Add Text'>
                    <span>
                      <ButtonComponent onClick={AddText} cssClass='e-custom-light' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} disabled={false}> <i className="fas fa-keyboard mx-1"></i><span className='mx-1'>Text</span> </ButtonComponent>
                    </span>
                  </Tooltip>


                </>
              }

            </div>

            <div className='col-md-2 col-sm-12 d-flex justify-content-center'>
              {props.annotationList.length > 0 ?
                <>
                  <Tooltip title='Complete signing' >
                    <span>
                      <ButtonComponent onClick={completeSigning} cssClass='e-custom-success' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} disabled={false}> <i className="fas fa-pen-nib mx-1" ></i><span className='mx-1'>Complete Signing</span></ButtonComponent>
                    </span>

                  </Tooltip>
                </> : <></>
              }

            </div>

            <div className='col-md-5 col-sm-12 d-flex justify-content-center'>
              <Tooltip title='Void the document'>

                <span>
                  <ButtonComponent cssClass='e-custom-danger' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} id='decline' onClick={props.setOpenDialogVoid} disabled={false}> <i className="fas fa-ban mx-1" ></i><span className='mx-1'>Decline Signing</span></ButtonComponent>
                </span>
              </Tooltip>
              <Tooltip title='Cancel' >
                <span>
                  <ButtonComponent cssClass='e-custom-warning' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} onClick={() => { navigate("/") }} disabled={false}><i className="fas fa-times mx-1"></i><span className='mx-1'>Cancel</span> </ButtonComponent>
                </span>

              </Tooltip>
            </div>


          </>

          :
          <>
            <div className='col-md-6 col-sm-12 d-flex justify-content-center' >


              {props.tempUploadedsignature ?
                <>

                  <Tooltip title='Place signature on current page'>
                    <span className='mr-auto'>
                      <ButtonComponent cssClass='e-custom-primary' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} onClick={handleSign} disabled={false}> <i className="fas fa-signature mx-1" ></i><span className='mx-1'>Sign </span></ButtonComponent>
                    </span>
                  </Tooltip>
                  <Tooltip title='Place signature on current page'>
                    <span className='mr-auto'>
                      <ButtonComponent cssClass='e-custom-primary' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} onClick={handleStamp} disabled={false}> <i className="fas fa-stamp mx-1" ></i><span className='mx-1'>Stamp</span></ButtonComponent>
                    </span>
                  </Tooltip>

                  <Tooltip title='Place Signature Again'>
                    <span>
                      <ButtonComponent onClick={placeSignatureAgain} cssClass='e-custom-light' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} disabled={false}> <i className="fas fa-map-marker-alt mx-1" ></i><span className='mx-1'>Place {isStamp ? <>Stamp</> : <>Signature</>} </span></ButtonComponent>
                    </span>
                  </Tooltip>
                  <Tooltip title='Add Text'>
                    <span>
                      <ButtonComponent onClick={AddText} cssClass='e-custom-light' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} disabled={false}> <i className="fas fa-keyboard mx-1"></i><span className='mx-1'>Text</span> </ButtonComponent>
                    </span>
                  </Tooltip>

                </>
                :
                <>

                  <Tooltip title='Place signature on current page'>
                    <span className='mr-auto'>
                      <ButtonComponent cssClass='e-custom-primary' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} onClick={handleSign} disabled={false}> <i className="fas fa-signature mx-1" ></i><span className='mx-1'>Sign </span></ButtonComponent>
                    </span>
                  </Tooltip>
                  <Tooltip title='Place signature on current page'>
                    <span className='mr-auto'>
                      <ButtonComponent cssClass='e-custom-primary' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} onClick={handleStamp} disabled={false}> <i className="fas fa-stamp mx-1" ></i><span className='mx-1'>Stamp</span></ButtonComponent>
                    </span>
                  </Tooltip>
                  <Tooltip title='Add Text'>
                    <span>
                      <ButtonComponent onClick={AddText} cssClass='e-custom-light' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} disabled={false}> <i className="fas fa-keyboard mx-1"></i><span className='mx-1'>Text</span> </ButtonComponent>
                    </span>
                  </Tooltip>
                </>
              }

            </div>

            <div className='col-md-6 col-sm-12 d-flex justify-content-center'>
              {props.annotationList.length > 0 ?
                <>
                  <Tooltip title='Complete signing' >
                    <span>
                      <ButtonComponent onClick={completeSigning} cssClass='e-custom-success' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} disabled={false}> <i className="fas fa-pen-nib mx-1" ></i><span className='mx-1'>Complete Signing</span></ButtonComponent>
                    </span>

                  </Tooltip>
                </> : <></>
              }
              <Tooltip title='Void the document' id="test-2">

                <span>
                  <ButtonComponent cssClass='e-custom-danger' className='m-1 p-2' style={{ textTransform: 'none', fontWeight: 'lighter', fontSize: '12px' }} id='decline' onClick={props.setOpenDialogVoid} disabled={false}> <i className="fas fa-ban mx-1" ></i> <span className='mx-1'>Decline Signing</span></ButtonComponent>
                </span>
              </Tooltip>

            </div>


          </>
        }

      </div>

      <div ref={containerRef} style={{ width: "100%", height: "90vh" }} />
    </>
  );
}

PdfViewerComponent.propTypes = {
  document: PropTypes.string.isRequired,
};

export default PdfViewerComponent;
