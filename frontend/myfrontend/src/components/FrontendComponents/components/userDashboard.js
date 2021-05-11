import React, { useEffect, useState,useContext,useRef } from "react";
import Header from "./Header";
import { isAuthenticated } from "../clientStorages/auth";
import { Button } from "@material-ui/core";
import {SocketContext} from '../../../context/SocketContext';
//import {MyChatsContext} from '../../../context/MyChatsContext';
import io from "socket.io-client";
import { useHistory } from 'react-router-dom';
 //import { ToastContainer } from 'react-toastify';
//import Toast from 'react-bootstrap/Toast' 


const UserDashboard = ({uuId}) => {
  //const {chatRecipients,setRecipients,getRecData} = useContext(MyChatsContext);
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const myId= isAuthenticated()._id;
  let userEmail = useRef()
  let history = useHistory()
  userEmail.current = JSON.parse(localStorage.getItem("user")).email
  console.log(userEmail)
  const {clientSocket,setSocket,messageEvent,roomJoin} = useContext(SocketContext);
  let clientSocket1 = useRef()
   
   window.onload = () => {
     messageEvent()
    let did = JSON.parse(localStorage.getItem('user'))._id
    roomJoin(did)
    clientSocket1 = io("http://127.0.0.1:5000")
    setSocket((s)=>{
      s = clientSocket1
      s.on('connect' , () => {
        console.log("connected",s.id);
        s.emit("adduser",{id:s.id, name: userEmail.current})
        
      });
      return s;
    })
  };

  useEffect (()=>{
    setFname(isAuthenticated().firstName);
    setLname(isAuthenticated().lastName);
    console.log(history)
   },[])
  
   useEffect(()=>{
    if(clientSocket!==undefined){
        console.log(clientSocket)
        clientSocket.emit("adduser",{id:clientSocket.id, name: userEmail.current})
      }
      else{
        console.log("no socket")
      }
   },[],[clientSocket])

   useEffect (()=>{
     messageEvent()
     //console.log("msg event")
   },[]);

   useEffect (()=>{
    roomJoin(myId)
  },[]);

  return <div>
    <Header/>
   {/* <ToastContainer/> */}
    <h1> Hi, {Fname + " " + Lname}</h1>
     <Button className= "loginbtn"
             style={{marginLeft:"20rem" ,display:"block"}}
            variant="outlined" 
            color="Primary"
            onClick={event =>  history.push('/all-contacts/'+myId)}> Add New friend</Button>
    <Button className= "loginbtn"
             style={{marginLeft:"20rem",marginTop:"2rem"}}
            variant="outlined" 
            color="Primary"
            onClick={event =>  history.push('/all-my-friends/'+myId)}> My friend Lists</Button>
    <Button className= "loginbtn"
             style={{marginLeft:"20rem",marginTop:"2rem",display:"block"}}
            variant="outlined" 
            color="Primary"
            onClick={event =>  history.push('/mychats/'+myId)}> My Chats</Button>
    <Button className= "loginbtn"
             style={{marginLeft:"20rem",marginTop:"2rem",display:"block"}}
            variant="outlined" 
            color="Primary"
            onClick={event =>  history.push('/update-my-profile-setup/'+myId)}>Update Profile</Button>
      
    </div>
};

export default UserDashboard;