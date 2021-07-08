import React, { useEffect, useContext,useRef } from "react";
import Header from "./Header";
import { isAuthenticated } from "../clientStorages/auth";
import { Button, Grid } from "@material-ui/core";
import {SocketContext} from '../../../context/SocketContext';
import io from "socket.io-client";
import { useHistory } from 'react-router-dom';
import Badge from '@material-ui/core/Badge';
import PageTitle from "./pageTitle";

const UserDashboard = ({uuId}) => {
  //const {chatRecipients,setRecipients,getRecData} = useContext(MyChatsContext);
  //const [obj, setObj] = useState({})
  const myId= isAuthenticated()._id;
 // const [count,setCount]= useState(0)
  //const [friendCount,setFriendCount]=useState(0);
  //let showBtn = useRef(0)
  let userEmail = useRef()
  let history = useHistory()
  let counte=0;
  userEmail.current = JSON.parse(localStorage.getItem("user")).email
  const {clientSocket,setSocket,messageEvent,roomJoin,friendReq,getRequest,frndcounter,msgCounter,msgNotify,acceptRejectCounter} = useContext(SocketContext);
useEffect(()=>msgNotify,[])
  useEffect(()=>acceptRejectCounter,[])
  let clientSocket1 = useRef()
   console.log(msgCounter);
   window.onload = () => {
       friendReq()
       acceptRejectCounter()
       msgNotify()
     messageEvent()
     getRequest()
    roomJoin(myId)
    clientSocket1 = io("/")
  setSocket((s)=>{
      s = clientSocket1
      s.on('connect' , () => {
        console.log("connected",s.id);
        s.emit("adduser",{id:s.id, name: userEmail.current})
        
      });
      return s;
    })
  };
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

  return (<div style={{height:"100vh"}} className="back_divs dashboardDiv">
    <Header/>
    <PageTitle name={"Dashboard"}/>
           <Grid container>
               <Grid item xs={1} sm={3} md={2}  ></Grid>
               <Grid item xs={10} sm={6} md={8} >
                
          <div className="mySettings"> 
          <i class="fas fa-user-cog mySettingsicon"  ></i>
         <Button className= "loginbtn myDashboardBtn"
           variant="contained" 
            fullWidth
            size="large"
             onClick={event =>  history.push('/my-account-settings/'+myId)}>
          Account Settings
            </Button>
            </div>
{
          frndcounter >= 1 ?
          <div className="myContacts"> 
          <i class="fas fa-address-book myContacticon"  ></i>
           <Button className= "loginbtn myDashboardBtn"
           variant="contained"
            size="large"
           
            fullWidth
             onClick={event =>  history.push('/my-contact-list/'+myId)}>
               
            Contacts
            <Badge badgeContent={frndcounter } className="msgCounter" color="Secondary">
            </Badge>
            </Button>
            </div>
          :
          <div className="myContacts"> 
           <i class="fas fa-address-book myContacticon"  ></i>
         <Button className= "loginbtn myDashboardBtn"
           variant="contained" 
            fullWidth
            size="large"
             onClick={event =>  history.push('/my-contact-list/'+myId)}>
            Contacts
            </Button>
            </div>
        }    
         
            {
          msgCounter >= 1?
          <div className="myChats"> 
           <i className="fas fa-comments myChaticon"  ></i>
           <Button className= "loginbtn myDashboardBtn"
           variant="contained"
            size="large"
           
            fullWidth
             onClick={event =>  history.push('/mychats/'+myId)}>
               
            Chats
            <Badge badgeContent={msgCounter} className="msgCounter" color="Secondary">
            </Badge>
            </Button>
            </div>
          :
          <div className="myChats"> 
           <i className="fas fa-comments myChaticon"  ></i>
         <Button className= "loginbtn myDashboardBtn"
           variant="contained" 
            fullWidth
            size="large"
             onClick={event =>  history.push('/mychats/'+myId)}>
            Chats
            </Button>
            </div>
        } 
       
        </Grid>
        <Grid item xs={1} sm={3} md={2} ></Grid>
        </Grid>
            
            </div>)
};

export default UserDashboard;