import React, { useEffect, useState,useContext,useRef } from "react";
import Header from "./Header";
import { isAuthenticated } from "../clientStorages/auth";
import { Button, Grid } from "@material-ui/core";
import {SocketContext} from '../../../context/SocketContext';
//import {MyChatsContext} from '../../../context/MyChatsContext';
import io from "socket.io-client";
import { useHistory } from 'react-router-dom';
import {ChatContext} from '../../../context/ChatContext';
import ChatIcon from '@material-ui/icons/Chat';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import SettingsIcon from '@material-ui/icons/Settings';
import GroupAddRoundedIcon from '@material-ui/icons/GroupAddRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import Badge from '@material-ui/core/Badge';
//import chatservice from '../../../services/ChatService';
import accountService from '../../../services/accountService';
//import friendService from '../../../services/friendService';
 //import { ToastContainer } from 'react-toastify';
//import Toast from 'react-bootstrap/Toast' 
import '../../ChatComponents/chat.css'
import PageTitle from "./pageTitle";


const UserDashboard = ({uuId}) => {
  //const {chatRecipients,setRecipients,getRecData} = useContext(MyChatsContext);
  //const [obj, setObj] = useState({})
  const myId= isAuthenticated()._id;
 // const [count,setCount]= useState(0)
  //const [friendCount,setFriendCount]=useState(0);
  let showBtn = useRef(0)
  let userEmail = useRef()
  let history = useHistory()
  userEmail.current = JSON.parse(localStorage.getItem("user")).email
  const {clientSocket,setSocket,messageEvent,roomJoin,friendReq,getRequest,frndcounter,msgCounter} = useContext(SocketContext);

  let clientSocket1 = useRef()
   
   window.onload = () => {
       friendReq()
     messageEvent()
     getRequest()
    roomJoin(myId)
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
const DeleteAccount =()=>{
accountService.deleteMyAccount(myId)
 .then((res) =>history.push('/signup'))
  .catch((err) => console.log(err));
}
 /* useEffect(()=>{
    chatservice.offlinemessages(isAuthenticated().email)
        .then((res)=>{
            if(res.count > 0){
              setObj((o)=>{
                o = {sender: res.info.sender, receiver: res.info.receiver}
                return o
              })
              //obj = {sender: res.info.sender, receiver: res.info.receiver}
              setCount((c)=>{
                c = res.count
                return c
              })
       
            }
        })
        .catch((err)=>console.log(err))

  },[])
useEffect(()=>{
  friendService.getFriendRequestsCount(myId)
  .then((res)=>{ 
     if(res> 0)
     setFriendCount(res)
  })
  .catch((err)=>console.log(err))
},[])*/
  
  
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
    //friendReq()
     messageEvent()
   },[]);

   useEffect (()=>{
    roomJoin(myId)
  },[]);

  return <div style={{height:"100vh"}} className="back_divs">
    <Header/>
    <PageTitle name={"Dashboard"}/>
   {/* <ToastContainer/> */}
     <Grid container>
       <Grid item xs={1} md={4}></Grid>
       <Grid item xs={10} md={4}>
          <Button className= "loginbtn"
             style={{padding:"10px 20px",display:"block",backgroundColor:"#C8906A"}}
            variant="contained" 
            color="Secondary"
            fullWidth
            onClick={event =>  history.push('/all-contacts/'+myId)}>
              <PersonAddIcon className='chaticon'
              color = "white"/> Add New friend
            </Button>
            <Button className= "loginbtn"
             style={{ padding:"10px 40px",marginTop:"2rem",display:"block",backgroundColor:"#C0C86A"}}
            variant="contained" 
            color="Secondary"
            fullWidth
            onClick={event =>  history.push('/all-my-friends/'+myId)}>
              < PeopleAltIcon className='chaticon'
              color = "white"/> My Friends
            </Button>
           {/*  {
    obj.sender !== undefined ?
        obj.sender.forEach((o)=>
        {
            o !== userEmail.current ?
            showBtn.current = showBtn.current + 1
          :
          showBtn.current = 0
          })
    :
    null
    } */}
    
        {
          msgCounter >= 1 ?
           <Button className= "loginbtn"
             style={{ padding:"10px 20px" , marginTop:"2rem",display:"block",backgroundColor:"#D582BD"}}
           variant="contained" 
            color="Secondary" 
            fullWidth
             onClick={event =>  history.push('/mychats/'+myId)}>
            <Badge badgeContent={msgCounter} color="secondary" style={{marginRight:"0.5rem"}}>
              <ChatIcon className='chaticon'
              onClick={event =>  history.push('/mychats/'+myId)}
              color = "white"
              />  
            </Badge>
            My Chats
            </Button>
          :
         <Button className= "loginbtn"
             style={{ padding:"10px 50px" ,marginTop:"2rem",display:"block",backgroundColor:"#D582BD"}}
           variant="contained" 
            color="Secondary" 
            fullWidth
             onClick={event =>  history.push('/mychats/'+myId)}>
          <ChatIcon className='chaticon'
              color = "white"
              />  My Chats
            </Button>
            
        }    
         {
          frndcounter >= 1 ?
           <Button className= "loginbtn"
             style={{ padding:"10px 20px" , marginTop:"2rem",display:"block",backgroundColor:"#8298D5"}}
           variant="contained" 
            color="Secondary" 
            fullWidth
             onClick={event =>  history.push('/all-friend-requests/'+myId)}>
            <Badge badgeContent={frndcounter} color="secondary" style={{marginRight:"0.5rem"}}>
              <GroupAddRoundedIcon className='chaticon'
              onClick={event =>  history.push('/all-friend-requests/'+myId)}
              color = "white"
              />  
            </Badge>
            My Friend Requests
            </Button>
          :
         <Button className= "loginbtn"
             style={{ padding:"10px 50px" ,marginTop:"2rem",display:"block",backgroundColor:"#8298D5"}}
           variant="contained" 
            color="Secondary" 
            fullWidth
             onClick={event =>  history.push('/all-friend-requests/'+myId)}>
          <GroupAddRoundedIcon className='chaticon'
              color = "white"
              />  My Friend Requests
            </Button>
            
        }
         <Button className= "loginbtn"
             style={{ padding:"10px 27px",marginTop:"2rem",display:"block",backgroundColor:"#69B6CF"}}
           variant="contained" 
            color="Secondary"
            fullWidth
            onClick={event =>  history.push('/update-my-profile-setup/'+myId)}>
              <SettingsIcon className='chaticon'
              color = "white"/>Update Profile
            </Button>
       
             <Button className= "loginbtn"
             style={{padding:"10px 20px",marginTop:"2rem",display:"block",backgroundColor:"#C3767F"}}
            variant="contained" 
            color="Secondary"
            fullWidth
            onClick={DeleteAccount}>
              <DeleteIcon className='chaticon'
              color = "white"/> Delete Account
            </Button>
             
       </Grid>
        <Grid item xs={1} md={4}></Grid>
     </Grid>
    
    
    
    
    
    </div>
};

export default UserDashboard;