import React, {useEffect} from "react";
import "./chat.css"
//import myimg from "./queen.jpg"
import { Player } from 'video-react';
import Checkbox from '@material-ui/core/Checkbox';
import "video-react/dist/video-react.css"
export default function SettingMessage(props) {
  //console.log("From setting",props.chat)
  const [checked, setChecked] = React.useState(true);
  const [messages, setMessages] = React.useState()
  const handleChange = (event,message) => {
    //console.log(message)
    setMessages((m)=>{
      if(m !== undefined){
        let msgs = [...m.msgs]
        msgs = [...msgs  ,message]
        //console.log("mmmmm",m)
        return {...m, msgs}
        
      }
      else {
        return {msgs: [message]};
      }
      
    })
    
    setChecked(event.target.checked);
  };

  useEffect(()=>{
    props.delHandler(messages)
  },[messages])

  console.log(props.isDel)
  return (
    props.chat.messages.map((message) => {
        //console.log("msg",message)
        //console.log("user",props.user)
      if (message.to === props.user) {
        //console.log("Type received")
        return (
          <div className ='msgdiv'>
          <div className="incoming_msg_img">
          {
            props.isDel ?
              <Checkbox 
              
              onChange={(e) => {
              handleChange(e, message);
               }}
              inputProps={{ 'aria-label': 'primary checkbox' }} name="gilad" />: null
          }
          
          </div>
            <div className="received_msg">
              <div className="received_withd_msg">
                <div className = "playerdiv"> 
                <Player >
                  <source src={message.messageVideo} />
              </Player>
                </div>
              
                <p>{message.messageBody}</p>
                <span className="time_date"> {message.time}</span>
              </div>
            </div>
          </div>
        );
      }
      else if(message.from === props.user) {
        return (
          <div class="outgoing_msg">
          {
            props.isDel ?
              <Checkbox 
             
              onChange={(e) => {
              handleChange(e, message);
               }}
              inputProps={{ 'aria-label': 'primary checkbox' }} 
              name="gilad" />: null
          }
            <div class="sent_msg">
            <div className = "playerdiv">
            {<Player>
                  <source src={message.messageVideo} />
              </Player>}
            </div>
            
              <p>{message.messageBody}</p>
              <span class="time_date"> {message.time}</span>
            </div>
          </div>
        );
      }
      else{
        console.log("nothing")
      }
        
    })
  );
}
