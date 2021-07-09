import React, { useEffect, useState, useRef, useContext } from "react";
import chatservice from "../../services/ChatService";
import friendService from "../../services/friendService";
import "./chat.css";
import SettingMessage from "./SettingMessage";
import { SocketContext } from "../../context/SocketContext";
import { ChatContext } from "../../context/ChatContext";
import 'react-toastify/dist/ReactToastify.css';
import RenderChat from './RenderChat'
import { toast } from 'react-toastify';
import { Zoom } from 'react-toastify';
import axios from 'axios';
import io from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

export default function SingleChat(props) {
  const [chat, setChat] = useState([{ from: "", to: "", messages: [] }]);
  const [searchChats, setSearchChats] = useState({messages :['']})
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(true)
  const scrollRef = useRef();
  let chats = useRef([]);
  let friends = useRef()
  let dummy = [];
  let user = useRef({ uId: "", uImg: "", uName: "" });
  let recipient = useRef("");
  let recipientInfo = useRef({ name: "", lang: "", url: "" });
  let roomId = useRef("");
  let myChatsRoom = useRef();
  let notificationRoom = useRef();
  let returndata;
  let id = props.match.params.id.split(" ");
  const { clientSocket,setSocket,roomJoin, messageEvent, friendReq } = useContext(SocketContext);
  const { count, setCounter } = useContext(SocketContext);
  const [isDel , setDel] = useState(false)
  const [isChat, setIsChat] = React.useState(false)
  let clientSocket1 = useRef()
  var us = JSON.parse(localStorage.getItem("user"));
  const IP_URL = localStorage.getItem('IP_URL')
  const IP = localStorage.getItem('IP')

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]); 
  
  //useEffect(() => {
    recipientInfo.current.name = localStorage.getItem("recName");
    recipientInfo.current.lang = localStorage.getItem("recLang");
    recipientInfo.current.url = localStorage.getItem("profileUrl");
    myChatsRoom.current = "mychats/" + localStorage.getItem("friendId");
    notificationRoom.current = "/" + id[1];
    recipient.current = id[0];
    user.current.uId = us.email;
    user.current.uName = us.firstName + " " + us.lastName;
    user.current.uImg = us.profileImg
 // }, [us]);

 window.onload = () => {
  friendReq()
  messageEvent()
  let did = JSON.parse(localStorage.getItem('user'))._id
  roomJoin(did)
  clientSocket1 = io(process.env.REACT_APP_IP_URL)
  setSocket((s)=>{
  s = clientSocket1
  s.on('connect' , () => {
    console.log("connected",s.id);
    s.emit("adduser",{id:s.id, name: user.current.uId})
    
  });
  return s;
  })
};

  const getData = () => {
    console.log("in get Data",user)
    chatservice
      .getMessagesbyEmail(user.current.uId, recipient.current)
      .then((data) => {
        if(data)
        {
          console.log("This data",data)
          chats.current = data;
          setChat({ messages: chats.current });
          setIsChat(true)
        }
        
      })
      .catch((err) => toast.error(
        'Database Connection Error', {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 3000,
        transition: Zoom
      }));
      
  };

  

  useEffect (()=>{
    let mycount=0;
    friendService.getAllFriends(us._id)
    .then((data)=>{
      friends.current = data
      friends.current.forEach((f) => {
        if(f.email === recipient.current)
          mycount=mycount+1
        
      })
      if(mycount<1)
       setIsFriend(false)
      })
      .catch((err=>toast.error(
        'Database Connection Error', {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 3000,
        transition: Zoom
      })))
  })
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (clientSocket !== undefined) {
      clientSocket.emit(
        "roomJoin",
        { from: user.current.uId, to: recipient.current },
        ({ error, room }) => {
          if (!error) {
            roomId.current = room;
            console.log("joined room with id", room);
          } else {
            console.log("error joining room", error);
          }
        }
      );

      clientSocket.on("messageReceived", (payload) => {
        setChat((chatState) => {
          if (chatState.messages) {
            let newMessages = [...chatState.messages];
            newMessages = [...newMessages, payload];
            return { ...chatState, messages: newMessages };
          } else {
            return { messages: [payload] };
          }
        });

        /* setCounter((c)=>{
          c = c+1
          console.log(" counter val from chat",c)
          return c
        }) */
      })

      return function cleanup() {
        clientSocket.off("messageReceived");
        console.log("in cleanup");
      };
    }
  }, []);

  const sendMessage = (message) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },};
    console.log(IP+'80/')
    let msgId = uuidv4()
    if (message == ""){
       toast.error("Please Type something",{
          position: toast.POSITION.TOP_LEFT,
        })
    }
   else
   {
     setLoading(true); 
     let data = {
      msg: message,
      lang: recipientInfo.current.lang,
      userImgUrl: user.current.uImg,
    };
    axios.post(process.env.REACT_APP_IP,data) // flask ka post method call kre ga
    .then((response )=> {
    setLoading(false);
    console.log(" Response" ,response.data);
    returndata = response.data
    let messageS = {
      from: user.current.uId,
      to: recipient.current,
      userName: user.current.uName,
      room: roomId.current,
      messageBody: message,
      messageVideo: returndata,
      time: new Date().toLocaleString(),
      type: "offline",
      msgId : msgId
    };
    clientSocket.emit("messageSend", messageS, (err) => {
      if (!err) {
        chatservice.createMessage(messageS)
            .then((response)=>console.log(response,msgId))
            .catch((err)=>toast.error(
              'Database Connection Error! Please try again', {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 3000,
              transition: Zoom
            }))
        
        if (chat.messages) {
          setChat({ messages: [...chat.messages, messageS] });
        } else {
          setChat({ messages: [messageS] });
        }
      } else {
        toast.error(
          'Error in sending message! Please try again', {
          position: toast.POSITION.TOP_LEFT,
          autoClose: 3000,
          transition: Zoom
        })
      }
    });
    clientSocket.emit(
      "messageSend1",
      {
        message: messageS,
        roomId: notificationRoom.current,
        name: user.current.uName,
      },
      (err) => {
        if (!err) console.log("testing");
        else console.log(err);
      }
    
    );

    clientSocket.emit(
      "myChats",
      { roomId: myChatsRoom.current, message: messageS, userImg: us.profileImg },
      (err) => {
        if (!err) console.log("testing");
        else console.log(err);
      }
    );
  }).catch((err)=>console.log(err.body))
    }
  };
  
  /* const chatDeleteHandler = (message)=>{
    console.log("Message",message)
    setMsgs(message.msg)
}
 */
  const searchChatHandler = (keywords)=>{
    setSearchTerm((term)=>{
      //console.log("keywords",term)
      term = keywords
      return term
    })
    
  }
  let elem = null;
  useEffect(() => {
    if(chat.messages){
      
    const list = chat.messages.filter(msg => msg.messageBody.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchChats({messages : list});
    }
    else{
      console.log("no chat")
    }
}, [searchTerm]);

  
  if (chat.messages === undefined) {
    
    elem = (
      <div class="d-flex justify-content-center">
         <strong style={{marginRight:"1rem"}}>Loading...</strong>
      <div class="spinner-border" role="status">
    </div>
    </div>
    );
  }
  else if(chat.messages.length == 0 ){
    elem = (<div  style= {{textAlign: "center",fontSize:"1.3rem",height:"100%", 
    backgroundImage: "linear-gradient(to right, #CECECE, #ebebeb)"
       }}><p style={{position:"relative",top:"40%"}}>Say Hi👋, to <strong>{recipientInfo.current.name}</strong></p></div>)
    } 
   else {
    if(searchTerm !== "" && searchChats.messages !== undefined){
      elem = (searchChats.messages.map((msg) =>{
        return <SettingMessage message={msg} user={user.current.uId} isDel={isDel} term={searchTerm}/>;
      })
      )
    }
    else{
      elem = (chat.messages.map((msg) =>{
        return ( <div ref={scrollRef}>
          <SettingMessage message={msg} user={user.current.uId} isDel={isDel} getData = {getData} id={id[1]} rec={recipient.current}/>
          </div>)
      })
      )
    }

    if(searchChats.messages.length === 0){
      console.log("no match")
      elem = (
        <h5 style={{ textAlign: "center" }}>No match found!</h5>
      )
    }
    
    
  }

  
  return (    
    <RenderChat recipientInfo={recipientInfo.current} 
     setLogin={props.setLogin}
     element={elem}
     loading = {loading}
     sendMessage = {sendMessage}
     isDel ={isDel}
     setDel = {setDel}
     isFriend = {isFriend}
     isChat={isChat}
     getData ={getData}
     searchTerm = {searchTerm}
     setTerm = {setSearchTerm}
     searchHandler ={searchChatHandler}
    />
  );
}