import React, { useEffect, useState,useContext,useRef } from "react";
import Header from "./Header";
import { isAuthenticated } from "../clientStorages/auth";
import { Button } from "@material-ui/core";
import {SocketContext} from '../../../context/SocketContext';
import { useHistory } from 'react-router-dom';

const UserDashboard = ( ) => {
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  let userEmail = useRef()
  let history = useHistory()
  userEmail.current = JSON.parse(localStorage.getItem("user")).email
  console.log(userEmail)
  const clientSocket = useContext(SocketContext);
   useEffect (()=>{
    setFname(isAuthenticated().firstName);
    setLname(isAuthenticated().lastName);
   },[])
  
   useEffect(()=>{
    if(clientSocket!==undefined){
        console.log(clientSocket)
        clientSocket.emit("adduser",{id:clientSocket.id, name: userEmail.current})
      }
      else{
        console.log("no socket")
      }
   },[clientSocket])
  return <div>
    <Header/>
   
    <h1> Hi, {Fname + " " + Lname}</h1>
     <Button className= "loginbtn"
             style={{marginLeft:"20rem" ,display:"block"}}
            variant="outlined" 
            color="Primary"
            onClick={event =>  history.push('/all-contacts')}> Add New friend</Button>
    <Button className= "loginbtn"
             style={{marginLeft:"20rem",marginTop:"2rem"}}
            variant="outlined" 
            color="Primary"
            onClick={event =>  history.push('/all-my-friends')}> My friend Lists</Button>
      
    </div>
};

export default UserDashboard;