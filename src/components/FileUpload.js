import React from 'react'
import { ButtonComponent  } from '@syncfusion/ej2-react-buttons';
function FileUpload(props) {
  

  // ref
  const inputRef = React.useRef(null);

  // drag state
  const [dragActive, setDragActive] = React.useState(false);
  
  // handle drag events
  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  // triggers when file is dropped
  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // at least one file has been dropped so do something
      // handleFiles(e.dataTransfer.files);
      if (e.dataTransfer.files.length > 1) {
        alert("Please select max 1 file.");
        e.preventDefault();
      }
      if(!e.dataTransfer.files[0].name.includes('.pdf')){
        alert("Please select a pdf file.");
      }
      else{
        props.setFile(e.dataTransfer.files[0])
        document.getElementById('file-upload-form').style.display='none';
        document.getElementById('sign-type').style.display='block';
        // alert(`${e.dataTransfer.files[0].name} uploaded successfully!!`)
        props.setUploadedFile(e.dataTransfer.files[0].name)
        props.setFile(e.dataTransfer.files[0])
      }
    }
  };

  // triggers when file is selected with click
    const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      // at least one file has been selected so do something
      // handleFiles(e.target.files);
      if (e.target.files.length > 1) {
        alert("Please select max 1 file.");
        e.preventDefault();
      }
      else{
        props.setFile(e.target.files[0])
        document.getElementById('file-upload-form').style.display='none';
        document.getElementById('sign-type').style.display='block';
        // alert(`${e.target.files[0].name} uploaded successfully!!`)
        props.setUploadedFile(e.target.files[0].name)
        props.setFile(e.target.files[0])
      }
     
    }
  };

  // triggers the input when the button is clicked
    const onButtonClick = () => {
    inputRef.current.click();
  };
  return (
    <>
      
      <form id="form-file-upload" onDragEnter={handleDrag} types={"pdf"} onSubmit={(e) => e.preventDefault()}  >
      <input ref={inputRef} type="file" id="input-file-upload" multiple={false} accept="application/pdf" onChange={handleChange} />
      <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
  
        <div>
        <p><i className="fas fa-upload "  style={{fontSize:'30px', color:'#495057'}}></i></p>
       
        <p className=' bg-white p-2 ' style={{fontSize:'13px'}}>Upload a PDF file for signing </p>
  
        <ButtonComponent  
          cssClass='e-custom-primary' 
          className='m-2 p-2' 
          style={{textTransform: 'none',fontWeight:'lighter',fontSize:'12px'}}   
          disabled={false} 
          onClick={onButtonClick}
          ><i className='far fa-plus-square m-1'></i> <span className='mx-2'> Select file from device </span> </ButtonComponent>
            <br/>
     or
       
          <p style={{fontSize:'13px', color:'#495057'}}  >Drag and Drop Document Here </p>
     
        </div> 
      </label>
      { dragActive && <div id="drag-file-element" accept="application/pdf" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
    </form>
    <p className=' mt-5' style={{fontSize:'13px',color:'#495057'}}>Max File Size Requirement 20MB</p>
    
    </>
  )
}

export default FileUpload