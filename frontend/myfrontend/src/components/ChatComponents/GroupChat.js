import React, { useState, useEffect ,useRef} from "react";
import TypeMessage from "./TypeMessage";
import axios from "axios";
import io from "socket.io-client";
import groupservice from "../../services/GroupService";
import "./chat.css"

const GroupChat = (props) =>{
    let userId = useRef("");
    let recipients = useRef([]);
    let roomId = useRef("");
    let clientSocket = useRef(null);
    let groupName = useRef("")
    useEffect (()=>{
        let groupId = 'bc41dc50-4a2f-4130-a299-8818f9d031fe'//props.match.params.id
        userId.current = localStorage.getItem("userId");
        groupservice.getGroupById(groupId)
        .then((data) => {
            console.log(data) 
            recipients.current = data[0].groupMembers
            groupName.current = data[0].groupName
            console.log(recipients.current)
            clientSocket.current = io("http://127.0.0.1:5000");
              clientSocket.current.emit(
                "roomJoin",
                { from: userId.current, to: groupName.current },
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
            
              });
        }).catch((err)=>{
            console.log("Error",err)
        })

    },[])

    useEffect (()=>{
        

    },[])

    const sendMessage = (message) =>{
        let messageS = {
            from: userId.current,
            to: groupName.current,
            room: roomId.current,
            messageBody: message,
            time: new Date().toLocaleString(),
            type: "sent",
          };
          clientSocket.current.emit("messageSend", messageS, (err) => {
            if (!err) {
                    console.log("message sent successfully");
                    console.log("MsgS",messageS)
             
            } 
            else {
                    console.log("error sending message:", err);
            }
          });
      
      
    }
    return (
        <div>
            <TypeMessage sendMessage={sendMessage} />
        </div>
    );
}


export default GroupChat;