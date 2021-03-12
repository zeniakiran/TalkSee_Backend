import React from "react";
import "./chat.css"
export default function TypeMessage(props) {
  //console.log("From setting",props.chat)
  return (
    props.chat.messages.map((message) => {
        console.log("msg type",message["type"])
        
      if (message.type === "received") {
        console.log("Type received")
        return (
          <div className ='msgdiv'>
          <div className="incoming_msg_img">
            </div>
            <div className="received_msg">
              <div className="received_withd_msg">
                <p>{message.messageBody}</p>
                <span className="time_date"> {message.time}</span>
              </div>
            </div>
          </div>
        );
      }
        return (
          <div class="outgoing_msg">
            <div class="sent_msg">
              <p>{message.messageBody}</p>
              <span class="time_date"> {message.time}</span>
            </div>
          </div>
        );
    })
  );
}
