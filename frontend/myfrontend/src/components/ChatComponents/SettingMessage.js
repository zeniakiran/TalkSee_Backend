import React, {useEffect} from "react";
import "./chat.css"
import { Player } from 'video-react';
import Checkbox from '@material-ui/core/Checkbox';
import "video-react/dist/video-react.css"
import {  Grid } from "@material-ui/core";
export default function SettingMessage(props) {
 const [checked, setChecked] = React.useState(false);

  const [messages, setMessages] = React.useState();
  let someArray = [];
  const handleChange = (event, message) => {
    setChecked((c) => {
      c = event.target.checked;
      if (c === true) {
        setMessages((m) => {
          if (m !== undefined) {
            if (m.msgs !== undefined) {
              let msgs = [...m.msgs];
              msgs = [...msgs, message];
              return { ...m, msgs };
            } else {
              return { msgs: [message] };
            }
          } else {
            return { msgs: [message] };
          }
        });
      } else {
        if (messages.msgs !== undefined) {
          someArray = messages.msgs;
          someArray = messages.msgs.filter((m) => {
            return m._id !== message._id;
          });
          setMessages(someArray);
        } else {
          setMessages((m) => {
            return (m = []);
          });
        }
      }
      return c;
    });
  };

  let elem = null;
  let indexOfTerm = []
  let msgArr = []
  if(props.term){
    console.log("term",props.term)


    indexOfTerm.push(props.message.messageBody.indexOf(props.term))
    msgArr.push(props.message.messageBody.split(""))
    console.log("term exists",indexOfTerm)

  }
  else{
    console.log("no term")
  }
  if(msgArr.length>=1){
    for (var i=0; i<msgArr.length; i++){
      if(props.term === msgArr[i])
      console.log("m",msgArr[i])
      else
      console.log("no mm",msgArr[i])
    }
  }

  if (props.message.to === props.user) {

     elem = (
      <div >
        <div className='incoming_msg_img'>
           {
            props.isDel ?
              <Checkbox 
              color="primary"
              onChange={(e) => {
                handleChange(e, props.message);
              }}
              inputProps={{ 'aria-label': 'primary checkbox' }} name="gilad" />: null
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
                  {
               props.term && msgArr?
                  msgArr.map((m)=>  
                   <div class="message-text">{m}</div>
                   )
                  
              : 
               <div class="message-text">{props.message.messageBody}</div>
                  
            }
                 
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
              <Checkbox color="primary"  onChange={(e) => {
              handleChange(e, props.message);
            }}
              inputProps={{ 'aria-label': 'primary checkbox' }} 
              name="gilad" />: null
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
                  {
            props.term?
           <div class="message-text"> {props.message.messageBody}</div>
              : 
                 <div class="message-text"> {props.message.messageBody}</div>
                  
            }  
                
                  <span class="sent_time_date"> {props.message.time}</span>
                 </div>
                </div>
      </div>
    );
  } 

   else {

    console.log("nothing");
  }

  useEffect(() => {
    props.delHandler(messages);
  }, [messages]);

  return (
    elem
  );
}
