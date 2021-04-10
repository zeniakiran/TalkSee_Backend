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
  //console.log("single chat:",props.activeChat.messages.length);
 useEffect (()=>{
    userservice.getUserByEmail(userId)
    .then((user)=> setUName(user[0].firstName)).
    catch((err)=>console.log(err))
 },[userName])
  let element = null;
    if(props.activeChat.messages.length>=1){
      element = (
        <SettingMessage chat={props.activeChat} user={userId}/>
      )
      //console.log("IF")
    }
    else if(props.rec>0){
      element=(
        <div className="div-center">
              <Typography  style={{marginLeft:"2rem"}}>Hey &nbsp;{userName}! </Typography>
              <Typography >Select a Chat to view conversation</Typography>
        </div>
      )
    }
    else{
      element = (
        <div className="div-center">
              <Typography  style={{marginLeft:"2rem"}}>Hey &nbsp;{userName}! </Typography>
              <Typography >Looks like you have'nt started a Chat yet..</Typography>
              <Typography >Select a <a href="/users">Contact</a> and start chatting!</Typography>
        </div>
      )
    }
  return (
    <React.Fragment>
      
        {element}
      
    </React.Fragment>
  );
}
