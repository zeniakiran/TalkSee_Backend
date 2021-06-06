import React, {useState,useRef} from "react";
import "./chat.css"
import { Player } from 'video-react';
import "video-react/dist/video-react.css"
import {  Grid, Button } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

import DeleteMessage from './DeleteMsg'

export default function SettingMessage(props) {
 

  const [open, setOpen] = React.useState(false);
  const [show,setShow] = React.useState(false)
  const [messageId, setId] = useState()

  const handleClose = () => {
    setOpen(false);
  };

  let elem = null;
  let indexOfTerm = []
  let msgArr = []
  
  const handleClickOpen= (msgId)=>{
    setShow(true)
    setId(msgId)
  }

  if (props.message.to === props.user) {

     elem = (
      <div >
        <div className='incoming_msg_img'>
           {
            props.isDel ?
            <Button className="Allbtn" style={{textTransform:"capitalize" ,marginTop:"0.8rem", color:"gray"}}>
              <DeleteIcon onClick={()=>handleClickOpen(props.message._id)}/>
            </Button>
            : null
          }
        </div>
        <Grid container >
              <Grid item xs={6} md={3}>  
              <div  style={{marginLeft:"15px",marginTop:"12px",marginBottom:"8px"}}> 
                <Player   >
                 <source src={props.message.messageVideo} />
              </Player>
              
                </div></Grid>
              <Grid item xs={6} md={9}  ></Grid> 
              </Grid>
               <div class="chat-message is-received">
                <div class="message-block">
                  
               <div class="message-text">{props.message.messageBody}</div>
                   <span className="received_time_date"> {props.message.time}</span>
                </div>
                </div>
      </div>
    );
  
  }
  else if (props.message.from === props.user) {
    elem = (
      <div >
        
          {
            props.isDel ?
            <Button className="Allbtn" style={{textTransform:"capitalize" ,float:"right",marginTop:"0.8rem",color:"gray"}}>
              <DeleteIcon onClick={()=>handleClickOpen(props.message._id)}/>
            </Button>
            : null
               }
          <Grid container >
              <Grid item xs={6} md={9}></Grid>
              <Grid item xs={6} md={3}  >
                 <div style={{marginRight:"15px",marginTop:"12px",marginBottom:"8px"}}> 
                <Player   >
                  <source src={props.message.messageVideo} />
              </Player>
              
                </div></Grid>
              </Grid>
               <div class="chat-message is-sent" >
                 <div class="message-block">  
                 <div class="message-text"> {props.message.messageBody}</div>
                  <span class="sent_time_date"> {props.message.time}</span>
                 </div>
                </div>
      </div>
    );
  } 
   else {

    console.log("nothing");
  }
  return (
    <div>
        {elem}
        {
        show ?
        <DeleteMessage open ={show} setShow={setShow} msgId = {messageId} getData={props.getData}/>
        : null}
    </div>
  );
}
