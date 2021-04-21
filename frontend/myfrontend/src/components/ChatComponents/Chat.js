import TypeMessage from "./TypeMessage";
import React, { useEffect, useState, useRef,useContext } from "react";
import axios from "axios";
import io from "socket.io-client";
import chatservice from "../../services/ChatService";
import userservice from "../../services/UserService";
import "./chat.css"
import SettingMessage from "./SettingMessage"
import CircularProgress from '@material-ui/core/CircularProgress'
import { isAuthenticated, logout } from "../FrontendComponents/clientStorages/auth";
import { useHistory } from 'react-router-dom';
import {MyChatsContext} from '../../context/MyChatsContext';
import {SocketContext} from '../../context/SocketContext';
import Header from "../FrontendComponents/components/Header";

export default function SingleChat(props) {
 
  const [chat, setChat] = useState([{ from: "", to: "", messages: [] }]);
  const [loading,setLoading] = useState(false)
  let chats = useRef([])
  let dummy = [];
  let user = useRef({uId:"",uImg:""})
  let recipient = useRef("");
  let recipientInfo = useRef({name:"",lang:"",url:""})
  let roomId = useRef("");
  //let clientSocket = useRef(null);
  //clientSocket = props.clientSocket
  const {clientSocket} = useContext(SocketContext);
  console.log("my socket",clientSocket)
  //const {chatRecipients,setRecipients,getRecData} = useContext(MyChatsContext);
  let returndata;
  
  useEffect (()=>{
  recipientInfo.current.name= localStorage.getItem("recName")
  recipientInfo.current.lang = localStorage.getItem("recLang")
  recipientInfo.current.url = localStorage.getItem("profileUrl")
  //console.log("vghbjn in Chat",props.child)
  },[])

  /* useEffect (()=>{
      pusher = new Pusher('f99dc5faffa906c52c32', {
      secret: 'b525f9548e7daffdcb76',
      cluster: 'ap2',
      encrypted: true
    });
    pusher.connection.bind('connected', function () {
      // attach the socket ID to all outgoing Axios requests
      axios.defaults.headers.common['X-Socket-Id'] = pusher.connection.socket_id;
  });
  },[]) */
useEffect(() => {

const getData = () => { 
recipient.current = props.match.params.id
var us = JSON.parse(localStorage.getItem("user"))
user.current.uId = us.email
userservice.getUserByEmail(user.current.uId).
then((data) =>{
    user.current.uImg= data[0].profileImg
}).catch((err)=>console.log("Err in UserService",err))

  chatservice.getMessagesbyEmail(user.current.uId,recipient.current)
  .then((data) => { 
    chats.current = data;
    console.log("Data",chats.current)
    if (chats) {
      chats.current.map((chat, index) => {
          dummy.push(chat)
      });
    }
    else{
      console.log("No chats or some error")
    }
    setChat({messages:dummy})   
    })
  .catch((err) => console.log("This is err"+ err));
}
getData();

}, []);

let count=0;

useEffect (()=>{
  count = count+1;
    console.log("useEffect called",count)
    clientSocket.on("messageReceived", (payload) => {
      //console.log("in receive payload",payload)
      /* chatservice.createMessage(payload)
      .then((response)=>console.log(response))
      .catch((err)=>console.log(err)) */
          setChat((chatState) => {
            if(chatState.messages){
              let newMessages = [...chatState.messages];
            newMessages = [...newMessages, payload];
            return { ...chatState, messages: newMessages };
            }
            else{
              return {messages: [payload] };  
            }
            
          });   
    });
},[])


  const sendMessage = (message) => {
      setLoading(true)
      let data = { 'msg' : message, 
              'lang': recipientInfo.current.lang,
              'userImgUrl': user.current.uImg
              };
      //console.log(data)
      //axios.post('http://127.0.0.1:80/',data) // flask ka post method call kre ga
      //.then((response )=> {
      setLoading(false)
      // console.log(" Response" ,response.data);
      //returndata = response.data
      let messageS = {
      from: user.current.uId,
      to: recipient.current,
      room: roomId.current,
      messageBody: message,
      messageVideo: returndata,
      //translated: returndata,
      time: new Date().toLocaleString(),
      type: "sent"
    };
      clientSocket.emit("messageSend", messageS, (err) => {
          if (!err) {
            console.log("message sent successfully");
            /* chatservice.createMessage(messageS)
            .then((response)=>console.log(response))
            .catch((err)=>console.log(err)) */
            //console.log("MsgS",messageS)
          if(chat.messages){
            setChat({messages : [...chat.messages,messageS]});
            console.log("sent chat",chat)
          }
          else{
            setChat({messages : [messageS]})
            console.log("first message "+ chat)
          }
          } 
          else {
            console.log("error sending message:", err);
          }
        })
        clientSocket.emit("messageSend1", messageS,(err)=>{
          if(!err)
            console.log("testing")
          else
            console.log(err)
        })
        clientSocket.off('messageSend1')
  
  };

  let elem = null;
  if(!chat.messages){
      console.log("in if part")
    elem = <h5 style = {{textAlign:"center"}}>There are currently no Messages</h5>
  }
  else{
    console.log("in else")
      elem = (
        <SettingMessage chat={chat} user={user.current.uId}/>
      )
  }
  return (
    <React.Fragment>
      <Header/>
      <div className="singleChatContainer">
        <div className="mesgs">
          <div className="msg_history">
            <div className="profilediv">
              <img className="profile" src= {recipientInfo.current.url} alt="dp"/>
              <span className="recName">{recipientInfo.current.name}</span>
            </div>
            {elem}
            {loading ? <div className = "load"><CircularProgress color="secondary" /></div>:null}
          </div>
          <TypeMessage sendMessage={sendMessage} />
        </div>
      </div>
    </React.Fragment>
  );
}
