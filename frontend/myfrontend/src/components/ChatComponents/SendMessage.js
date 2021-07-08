import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import "./chat.css"
export default function SendMessage(props) {
  let roomId = useRef("");
  let clientSocket = useRef(null);
  console.log("rec",props.recipientId)

    useEffect(() => {
            clientSocket.current = io("/");
                    clientSocket.current.emit(
                      "roomJoin",
                      { from: props.userId, to: props.recipientId },
                      ({ error, room }) => {
                        if (!error) {
                          roomId.current = room;
                          console.log("joined room with id", room);
                        } else {
                          console.log("error joining room", error);
                        }
                      }
                    );
      
                    clientSocket.current.on("messageReceived", (payload) => {
                      console.log("Payload",payload)
                    
                      /* setChat((chatState) => {
                        if(chatState.messages){
                          let newMessages = [...chatState.messages];
                        newMessages = [...newMessages, payload];
                        return { ...chatState, messages: newMessages };
                        }
                        else{
                          return {messages: [payload] };  
                        }
                        
                      });      */
                      //console.log("Received chat",chat)
                    });
      
      
      }, []);
  return (
      <div>
          hello
      </div>
  )
}