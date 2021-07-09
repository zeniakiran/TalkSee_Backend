import React, { useEffect, useState,useContext,useRef } from "react";
import Header from "./Header";
import { isAuthenticated } from "../clientStorages/auth";
import { Button, Grid,Hidden } from "@material-ui/core";
import {SocketContext} from '../../../context/SocketContext';
import {ChatContext} from '../../../context/ChatContext';
import io from "socket.io-client";
import { useHistory } from 'react-router-dom';
import ChatIcon from '@material-ui/icons/Chat';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import SettingsIcon from '@material-ui/icons/Settings';
import GroupAddRoundedIcon from '@material-ui/icons/GroupAddRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import Badge from '@material-ui/core/Badge';
import chatservice from '../../../services/ChatService';
import accountService from '../../../services/accountService';
import friendService from '../../../services/friendService';
 //import { ToastContainer } from 'react-toastify';
//import Toast from 'react-bootstrap/Toast' 
import '../../ChatComponents/chat.css'
import PageTitle from "./pageTitle";


const UserDashboard = ({setLogin,setUsers}) => {
  //const {chatRecipients,setRecipients,getRecData} = useContext(MyChatsContext);
  //const [obj, setObj] = useState({})
  const myId= isAuthenticated()._id;
  //const [msgCounter,setMsgCounter]= useState(0)
  //const [friendCount,setFriendCount]=useState(0);
  let showBtn = useRef(0)
  let userEmail = useRef()
  let history = useHistory()
  userEmail.current = JSON.parse(localStorage.getItem("user")).email
  const IP_URL = localStorage.getItem('IP_URL')
  console.log(userEmail)
  const {clientSocket,setSocket,messageEvent,roomJoin,friendReq,getRequest,frndcounter,msgNotify,msgCounter,acceptRejectCounter} = useContext(SocketContext);
  //const {count, obj} = useContext(ChatContext);

  console.log("counter in dashbord",msgCounter)
  let clientSocket1 = useRef()
  useEffect(()=>msgNotify,[])
  useEffect(()=>acceptRejectCounter,[])
  
   window.onload = () => {
       friendReq()
       acceptRejectCounter()
       msgNotify()
     messageEvent()
     getRequest()
    roomJoin(myId)
    clientSocket1 = io('/')
  setSocket((s)=>{
      s = clientSocket1
      s.on('connect' , () => {
        console.log("connected",s.id);
        s.emit("adduser",{id:s.id, name: userEmail.current})
        
      });
      return s;
    })
  };

  /* useEffect(()=>{

    clientSocket.on("messagecounter", (payload) => {
      // console.log(" counter : ",payload)
      //setCount(payload.counter) 
    });
    chatservice.offlinemessages(isAuthenticated().email)
        .then((res)=>{
            if(res.count > 0){
              setObj((o)=>{
                o = {sender: res.info.sender, receiver: res.info.receiver}
                return o
              })
              //obj = {sender: res.info.sender, receiver: res.info.receiver}
              console.log("obj",obj)
              setCount((c)=>{
                c = res.count
                return c
              })
       
            }
        })
        .catch((err)=>console.log(err))

  },[]) */
/* useEffect(()=>{
  console.log("count value",count)
  friendService.getFriendRequestsCount(myId)
  .then((res)=>{ 
     if(res> 0)
     setFriendCount(res)
  })
  .catch((err)=>console.log(err))
},[]) */
  
  
   useEffect(()=>{
    if(clientSocket!==undefined){
        console.log(clientSocket)
        clientSocket.emit("adduser",{id:clientSocket.id, name: userEmail.current}, (usersArray)=>{
          //console.log("users array",usersArray)
          setUsers((u)=>{
            u = usersArray
            console.log("users array",usersArray)
            return u
          })
        })
      }
      else{
        console.log("no socket")
      }
   },[])

   useEffect (()=>{
    //friendReq()
     //messageEvent()
     //console.log("message event")
     //friendReq()
   },[]);

   useEffect (()=>{
    roomJoin(myId)
  },[]);

  return <div style={{height:"100vh"}} className="back_divs dashboardDiv">
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
            <Badge badgeContent={frndcounter} className="msgCounter" color="Secondary">
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
            
            </div>
  
            {/* <div style={{height:"100vh"}} className="back_divs">
    <Header setLogin={setLogin}/>
    <PageTitle name={"Dashboard"}/>
   {/* <ToastContainer/>}
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
    {/*         {
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
    } }
    
        {
          //showBtn.current >= 1 ?
          msgCounter>=1 ?
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
    
    
    
    
    
    </div> */}
};

export default UserDashboard;