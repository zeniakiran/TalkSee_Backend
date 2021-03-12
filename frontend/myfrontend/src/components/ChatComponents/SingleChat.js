import React, { useEffect, useState,useRef } from "react";
import TypeMessage from "./TypeMessage"
//import "./chat.css";
import Typography from '@material-ui/core/Typography';
import SettingMessage from "./SettingMessage"
import userservice from "../../services/UserService"
export default function SingleChat(props) {
  //
  // const [chat, setChat] = useState(props.activeChat);
  const [showLoading, setShowLoading] = useState(false)
  let userId = props.userId
  const [userName,setUName] = useState("")
  console.log("single chat");
 useEffect (()=>{
    userservice.getUserByEmail(userId)
    .then((user)=> setUName(user[0].firstName)).
    catch((err)=>console.log(err))
 },[userName])
  
  return (
    <React.Fragment>
      
        
          {props.activeChat.messages.length>1? (
            <SettingMessage chat={props.activeChat}/>
          ) : (
            <div className="div-center">
              <Typography  style={{marginLeft:"2rem"}}>Hey &nbsp;{userName}! </Typography>
              <Typography >Select a Chat to view conversation</Typography>
            </div>
            
          )}
        
      
    </React.Fragment>
  );
}
