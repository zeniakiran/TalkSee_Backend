import React, { useEffect, useState,useContext,useRef } from "react";
import Header from "./Header";
import { isAuthenticated } from "../clientStorages/auth";
import { Button } from "@material-ui/core";
import {SocketContext} from '../../../context/SocketContext';
import {MyChatsContext} from '../../../context/MyChatsContext';
import { useHistory } from 'react-router-dom';

const UserDashboard = ( ) => {
  const {chatRecipients,setRecipients,getRecData} = useContext(MyChatsContext);
  const [isRecipient,setIsRec] = useState(0)
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
   window.onload = () => {
    alert('page is fully loaded');
  };
  
   useEffect(()=>{
    if(clientSocket!==undefined){
        console.log(clientSocket)
        clientSocket.emit("adduser",{id:clientSocket.id, name: userEmail.current})
        clientSocket.on("newMessage", (payload) => {
            console.log("IN NEW MSG",payload.notification)
          //props.appFunc(payload.notification)
          
        })
        /* clientSocket.on("newRecipient", (payload) => {
          console.log("IN NEW REc",payload)
          let index;
          let count=0;
          if(chatRecipients.Rname && chatRecipients.lastMsg){
            console.log(chatRecipients)
            chatRecipients.Rname.map((r,indx)=>{
              console.log(payload.payload.from)
                if(payload.payload.from ===r){
                  console.log("true",typeof(payload.payload.from),r)
                  //setRecArray(index,payload.messageBody) 
                  index = indx
                  count = count+1
                  //setIsRec(count)
                }
                else{
                  console.log("false",payload.payload.from,r)
                }
            })
            if(count >=1)
                setRecArray(index,payload.payload.messageBody)
            else if(count === 0)
                console.log("recipient not present")
            console.log("After state",chatRecipients)
          }
          else{
            console.log("no chat")
          }
        //props.appFunc(payload.notification)

        
      }) */
      }
      else{
        console.log("no socket")
      }
   },[],[clientSocket])
   const setRecArray = (index,msg)=>{
    let items = [...chatRecipients.lastMsg];
      // 2. Make a shallow copy of the item you want to mutate
      let item = {...items[index]};
      // 3. Replace the property you're intested in
      //item.lastMsg = msg;
      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      items[index] = msg;
      // 5. Set the state to our new copy
      setRecipients((r)=>{
        r.lastMsg = items
        console.log(r)
        return r
      });
      history.push('/mychats')
  }
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
    <Button className= "loginbtn"
             style={{marginLeft:"20rem"}}
            variant="outlined" 
            color="Primary"
            onClick={event =>  history.push('/mychats')}> My Chats</Button>
      
    </div>
};

export default UserDashboard;