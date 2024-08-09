import React ,{ useEffect } from 'react';
import { PdfViewerComponent,Toolbar as PreviewTool, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Inject } from '@syncfusion/ej2-react-pdfviewer';
import * as constants from '../components/constants/constants'

function PreviewerOnly(props) {
  
    let hideItems=()=>{
        var pdfViewer = document.getElementById('filepreview').ej2_instances[0];
    
        pdfViewer.toolbar.showToolbarItem(new Array("OpenOption"), false);
      
    }
    useEffect(()=>{
        // hideItems()
    }, )
  return (

    <PdfViewerComponent id="filepreview" interactionMode='1' showNotificationDialog={false} documentPath={props.filepreviewurl} serviceUrl={`${constants.devViewerServiceUrl}/api/pdfviewer`} className='card' style={{height:'100%',width:'100%',height:'85vh',borderRadius:'0',borderTop:'none',boxShadow:'0',backgroundColor:'#e5e5e5',borderColor:'#e5e5e5'}} >
        <Inject services={
            [
       
              // Toolbar, 
              Magnification, 
              Navigation, 
              LinkAnnotation, 
              BookmarkView, 
              ThumbnailView, 
              // Print, 
              TextSelection, 
              TextSearch, 
              // FormFields, 
              // FormDesigner
            ]
        }/>
    </PdfViewerComponent>
    
  )
}

export default PreviewerOnly