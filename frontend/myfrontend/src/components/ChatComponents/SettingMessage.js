import React, {useEffect} from "react";
import "./chat.css"
//import myimg from "./queen.jpg"
import { Player } from 'video-react';
import Checkbox from '@material-ui/core/Checkbox';
import "video-react/dist/video-react.css"
export default function SettingMessage(props) {
  //console.log("From setting",props.chat)
  const [checked, setChecked] = React.useState(false);
  const [messages, setMessages] = React.useState()
  let someArray=[]
  const handleChange = (event,message) => {
    
    setChecked((c)=>{
      c= event.target.checked
      console.log("check value",c)
      if(c === true){
        console.log("in iffff")
        setMessages((m)=>{
          console.log("in setMessage")
          if(m !== undefined){
            console.log("in if 1")
            if(m.msgs !== undefined){
              console.log("in if 2")
            let msgs = [...m.msgs]
            msgs = [...msgs  ,message]
            console.log("mmmmm",m.length)
            return {...m, msgs}
            }
            else {
              console.log("in msg",m)
              return {msgs: [message]};
            } 
          }
          else {
            console.log("in msg",m)
            return {msgs: [message]};
          }
          
        })
    
        }
        else{
          console.log("in elsey")
          if(messages.msgs !== undefined){
          someArray = messages.msgs
          someArray = messages.msgs.filter ((m)=>{
            return m._id !== message._id
          })
          setMessages((m)=>{
            m = someArray
            console.log("mmm",m)
            return m
          })
        }
        else{
          console.log("undened",messages.msgs)
          setMessages((m)=>{
            return m = []
          })
        }
          //console.log("msg 2: ",someArray)
        }
      return c
    })
      
    
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
