import TypeMessage from "./TypeMessage";
import React, { useEffect, useState, useRef,useContext } from "react";
import axios from "axios";
import io from "socket.io-client";
import chatservice from "../../services/ChatService";
import userservice from "../../services/UserService";
import "./chat.css"
import "./logout.css"
//import Pusher from 'pusher-js';
import SettingMessage from "./SettingMessage"
import CircularProgress from '@material-ui/core/CircularProgress'
import { isAuthenticated, logout } from "../FrontendComponents/clientStorages/auth";
import { useHistory } from 'react-router-dom';
import {MyChatsContext} from '../../context/MyChatsContext';
import {SocketContext} from '../../context/SocketContext';
export default function SingleChat(props) {
  
 // console.log("Pr",props)
  const [chat, setChat] = useState([{ from: "", to: "", messages: [] }]);
  const [loading,setLoading] = useState(false)
  const [isRecipient,setIsRec] = useState(0)
  let chats = useRef([])
  let x = [];
  let dummy = [];
  //const [user,setUser]= useState({uId:"",uImg:""})
  let user = useRef({uId:"",uImg:""})
  let recipient = useRef("");
  let recipientInfo = useRef({name:"",lang:"",url:""})
  let roomId = useRef("");
  //let clientSocket = useRef(null);
  //clientSocket = props.clientSocket
  const clientSocket = useContext(SocketContext);
  const {chatRecipients,setRecipients,getRecData} = useContext(MyChatsContext);
  let data;
  let returndata;
  let history = useHistory();
  let pusher=""

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
  //setUser((u)=>{u.uId=localStorage.getItem("userId")}); 
  var us = JSON.parse(localStorage.getItem("user"))
  user.current.uId = us.email
  userservice.getUserByEmail(user.current.uId).
    then((data) =>{
        /* setUser((u) => {
          u.uImg=data[0].profileImg
          console.log("U",u)
          return u
        }) */
        user.current.uImg= data[0].profileImg
  }).catch((err)=>console.log("Err in UserService",err))
  console.log(user.current.uId)
  chatservice.getMessagesbyEmail(user.current.uId,recipient.current)
  .then((data) => { 
              chats.current = data;
              console.log("Data",chats.current)
              if (chats) {
                //console.log("in Chat",chats.current)
                chats.current.map((chat, index) => {
                   dummy.push(chat)
               });
              }
              else{
                console.log("No chats or some error")
              }
              //console.log("dummy",dummy)
              setChat({messages:dummy})
              //console.log("chat again",chat)
              //props.clientSocket.current = io("http://127.0.0.1:5000");
              //console.log("ghj",props.clientSocket.current.id)
              /* props.clientSocket.current.emit("adduser",{id:props.clientSocket.current.id, name: user.current.uId}) */
              /* props.clientSocket.current.emit(
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
 */
              
              

              
    })
   .catch((err) => console.log("This is err"+ err));
}
getData();

}, []);

useEffect(()=>{
  getRecData(user.current.uId)
  console.log(chatRecipients)
},[chatRecipients])

useEffect (()=>{
  /* clientSocket.emit(
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
  ); */
   clientSocket.on("messageReceived", (payload) => {
    console.log("in receive payload",payload)
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
    //console.log("Received chat",chat)

    //props.child()
    
    
  });
  /*clientSocket.on("newMessage", (payload) => {
    console.log("IN NEW MSG")
    //props.appFunc(payload.notification)
  
  }) */
  
  

},[clientSocket,chatRecipients])

const handleLogOut = (evt) => {
  logout(() => {
    history.push("/login");
  });
};

const setRecArray = (index,msg)=>{
  let items = [...chatRecipients.lastMsg];
    // 2. Make a shallow copy of the item you want to mutate
    let item = {...items[index]};
    // 3. Replace the property you're intested in
    item.lastMsg = msg;
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;
    // 5. Set the state to our new copy
    setRecipients({items});

}

  const sendMessage = (message) => {
            setLoading(true)
            data = { 'msg' : message, 
                    'lang': recipientInfo.current.lang,
                    'userImgUrl': user.current.uImg
                    };
            //console.log(data)
            axios.post('http://127.0.0.1:80/',data) // flask ka post method call kre ga
            .then((response )=> {
            /* pusher.subscribe('my-channel')
            .bind('my-event', data => {
              alert("new message!",data)
            }); */
            setLoading(false)
           // console.log(" Response" ,response.data);
            returndata = response.data
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
              //console.log(" Type : ", messageS.type)
              } 
              else {
                      console.log("error sending message:", err);
              }
            })
         
         }).catch((err)=>console.log(err))
      
    
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
      <button
        className="btn text-decoration-none btn-link   pl-0"
        style={{textDecoration:"none"}}
        onClick={handleLogOut}
      >
        <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
      </button>
      <div className="singleChatContainer">
        <div className="mesgs">
          <div className="msg_history">
          <div className="profilediv">
            <img className="profile" src= {recipientInfo.current.url} alt="dp"/>
          </div>
          <div className="recName">
          
            {recipientInfo.current.name}
            <br/>
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
