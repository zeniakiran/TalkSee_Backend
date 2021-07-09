import React, {useState,useRef} from "react";
import "./chat.css"
import { Player } from 'video-react';
import "video-react/dist/video-react.css"
import {  Grid, Button } from "@material-ui/core";
import DeleteMessage from './DeleteMsg'
import chatservice from "../../services/ChatService";
export default function SettingMessage(props) {
 
  var boxchecked = JSON.parse(localStorage.getItem("deletion"));
  const [open, setOpen] = React.useState(false);
  const [show,setShow] = React.useState(false)
  const [messageId, setId] = useState()
 
  const handleClose = () => {
    setOpen(false);
  };

  let elem = null;
  
  const handleClickOpen= (msgId)=>{
    if(boxchecked.state === true){
      console.log("mid in settingmsg1",msgId);
      setShow(false)
         chatservice.deleteMessage(msgId).then((res)=>{
        console.log("response: ",res)
        props.getData()
      })
      .catch((err)=>  console.log(err))
   }
   else{
  setShow(true)
  console.log("mid in settingmsg2",msgId);
  setId(msgId)}
  }

  if (props.message.to === props.user) {
    console.log(props.message.msgId)
         elem = (
          <div >
            <div className='incoming_msg_img'>
              
            </div>
            <Grid container >
                  <Grid item xs={6} md={4}>  
                  <div  style={{ margin:"12px 15px 4px 8px",overflow:"hidden"}}> 
                    <Player   >
                     <source src={props.message.messageVideo} />
                  </Player>
    
                  
                    </div>
                    </Grid>
                  <Grid item xs={6} md={8}  >  {
                props.isDel ?
                <Button className="Allbtn"  style={{textTransform:"capitalize" ,marginTop:"0.8rem", color:"#EC5454",fontSize:"1.2rem"}}>
                  <i class="fas fa-trash-alt"   onClick={()=>handleClickOpen(props.message.msgId)}></i>
                </Button>
    
                : null
              }</Grid> 
                  </Grid>
                   <div class="chat-message is-received">
                    <div class="message-block">
                   <div class="message-text"><span>{props.message.messageBody}</span></div>
                       <span className="received_time_date"> {props.message.time}</span>
                    </div>
                    </div>
          </div>
        );
      
      }
      else if (props.message.from === props.user) {
        console.log(props.message.msgId)
        console.log("url",props.message.messageVideo)
        elem = (
          <div >
            
             
              <Grid container >
                  <Grid item xs={6} md={8}>  {
                props.isDel ?
                <Button className="Allbtn" style={{textTransform:"capitalize" ,float:"right",marginTop:"0.8rem",color:"#EC5454",fontSize:"1.2rem"}}  >
                   <i class="fas fa-trash-alt"  onClick={()=>handleClickOpen(props.message.msgId)}></i>
                </Button>
                : null
                   }</Grid>
                  <Grid item xs={6} md={4}  >
                     <div style={{ margin:"12px 15px 4px 8px",overflow:"hidden"}}> 
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
