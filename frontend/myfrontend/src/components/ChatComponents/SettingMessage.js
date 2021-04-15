import React from "react";
import "./chat.css"
//import myimg from "./queen.jpg"
import { Player } from 'video-react';
import "video-react/dist/video-react.css"
export default function TypeMessage(props) {
  //console.log("From setting",props.chat)
  return (
    props.chat.messages.map((message) => {
        //console.log("msg",message)
        //console.log("user",props.user)
      if (message.to === props.user) {
        //console.log("Type received")
        return (
          <div className ='msgdiv'>
          <div className="incoming_msg_img">
           
          </div>
            <div className="received_msg">
              <div className="received_withd_msg">
                <div> 
                {/* <Player >
                  <source src={message.messageVideo} />
              </Player> */}
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
            <div class="sent_msg">
            {/* <Player>
                  <source src={message.messageVideo} />
              </Player> */}
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
