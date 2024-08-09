import * as React from 'react';
import {useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import * as constants from '../components/constants/constants'

export default function AlignItemsList(props) {

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {/* {comments} */}
     
      {props.comments.map((comment,index)=>(
     

       <div key={index} style={{fontSize:'13px'}}>
          {/* <Divider variant="inset" component="li" /> */}
          <ListItem alignItems="flex-start">
           <ListItemAvatar>
             <Avatar alt="TA" className='shadow-lg bg-secondary' src="https://dssauthcorpdev.techedge.dev/media/Avatars/dafault.png" />
           </ListItemAvatar>
  
           <ListItemText 
             primaryTypographyProps={{fontSize: '12px'}} 
             primary={comment.owner}
             secondary={
               <React.Fragment >
                 <Typography
                   sx={{ display: 'inline' }}
                   component="span"
                   variant="body3"
                 
                 >
                  
                 </Typography >
                 {`- ${comment.comment}`}
               </React.Fragment>
             }
           />
         </ListItem>
       
       </div>
     
      ))}
   
    </List>
  );
}