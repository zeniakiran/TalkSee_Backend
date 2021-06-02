import React, { useEffect, useState, useRef, useContext } from "react";
import chatservice from "../../services/ChatService";
import userservice from "../../services/UserService";
import friendService from "../../services/friendService";
import "./chat.css";
import SettingMessage from "./SettingMessage";
import { SocketContext } from "../../context/SocketContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import RenderChat from './RenderChat'

export default function SingleChat(props) {
  const [chat, setChat] = useState([{ from: "", to: "", messages: [] }]);
  const [searchChats, setSearchChats] = useState({messages :[]})
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(true)
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
  const { clientSocket } = useContext(SocketContext);
  const [isDel , setDel] = useState(false)
  var us = JSON.parse(localStorage.getItem("user"));
  const [messagesToDel, setMsgs] = useState([])
  //console.log("my socket", clientSocket);

  useEffect(() => {
    recipientInfo.current.name = localStorage.getItem("recName");
    recipientInfo.current.lang = localStorage.getItem("recLang");
    recipientInfo.current.url = localStorage.getItem("profileUrl");
    myChatsRoom.current = "mychats/" + localStorage.getItem("friendId");
    notificationRoom.current = "/" + id[1];
  }, []);

  const getData = () => {
    console.log("in get Data",user)
    recipient.current = id[0];
    user.current.uId = us.email;
    user.current.uName = us.firstName + " " + us.lastName;
    user.current.uImg = us.profileImg

    chatservice
      .getMessagesbyEmail(user.current.uId, recipient.current)
      .then((data) => {
        chats.current = data;
        console.log("Data", chats.current);
        if (chats) {
          chats.current.map((chat, index) => {
            dummy.push(chat);
          });
        } else {
          console.log("No chats or some error");
        }
        setChat({ messages: dummy });
      })
      .catch((err) => console.log("This is err" + err));
  };

  useEffect(() => {
    friendService.getAllFriends(us._id)
    .then((data)=>{
      friends.current = data
      friends.current.forEach((f) => {
        if(f.email !== recipient.current)
           setIsFriend(false)
        
      })
      })
      .catch((err=>{console.log(err)}))
    getData();
  }, []);

  let count = 0;
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
        console.log("Payload", payload.messageBody + " count: " + count);
        setChat((chatState) => {
          if (chatState.messages) {
            let newMessages = [...chatState.messages];
            newMessages = [...newMessages, payload];
            return { ...chatState, messages: newMessages };
          } else {
            return { messages: [payload] };
          }
        });
      });

      return function cleanup() {
        clientSocket.off("messageReceived");
        console.log("in cleanup");
      };
    }
  }, []);

  const sendMessage = (message) => {
    
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
    //axios.post('http://127.0.0.1:80/',data) // flask ka post method call kre ga
    //.then((response )=> {
    setLoading(false);
    // console.log(" Response" ,response.data);
    //returndata = response.data
    console.log("room", roomId.current);
    let messageS = {
      from: user.current.uId,
      to: recipient.current,
      userName: user.current.uName,
      room: roomId.current,
      messageBody: message,
      messageVideo: "returndata",
      time: new Date().toLocaleString(),
      type: "offline",
    };
    clientSocket.emit("messageSend", messageS, (err) => {
      if (!err) {
        console.log("message sent successfully");
        chatservice.createMessage(messageS)
            .then((response)=>console.log(response))
            .catch((err)=>console.log(err))
        //console.log("MsgS",messageS)
        if (chat.messages) {
          setChat({ messages: [...chat.messages, messageS] });
        } else {
          setChat({ messages: [messageS] });
        }
      } else {
        console.log("error sending message:", err);
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
  //}).catch((err)=>console.log(err))
    }
  };
  
  const chatDeleteHandler = (message)=>{
    console.log("Message",message)
    setMsgs(message)
}

  const searchChatHandler = (keywords)=>{
    setSearchTerm((term)=>{
      //console.log("keywords",term)
      term = keywords
      return term
    })
    
  }

  useEffect(() => {
    if(chat.messages){
      
    const list = chat.messages.filter(msg => msg.messageBody.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchChats({messages : list});
    }
    else{
      console.log("no chat")
    }
}, [searchTerm]);

  let elem = null;
  if (chat.messages === undefined) {
    elem = (
      <h5 style={{ textAlign: "center" }}>There are currently no Messages</h5>
    );
  } else {
    
    if(searchTerm !== "" && searchChats.messages !== undefined){
      console.log("yess",searchChats.messages)
      //elem = <SettingMessage chat={searchChats} user={user.current.uId} isDel={isDel} delHandler = {chatDeleteHandler}/>;
      elem = (searchChats.messages.map((msg) =>{
        return <SettingMessage message={msg} user={user.current.uId} isDel={isDel} delHandler = {chatDeleteHandler} term={searchTerm}/>;
      })
      )
    }
    else{
      console.log("nooooo",chat.messages)
      //elem = <SettingMessage chat={chat} user={user.current.uId} isDel={isDel} delHandler = {chatDeleteHandler}/>;
      elem = (chat.messages.map((msg) =>{
        return  <SettingMessage message={msg} user={user.current.uId} isDel={isDel} delHandler = {chatDeleteHandler}/>;
      })
      )
    }
    
  }

  
  return (    
    <RenderChat recipientInfo={recipientInfo.current} 
     element={elem}
     loading = {loading}
     sendMessage = {sendMessage}
     isDel ={isDel}
     setDel = {setDel}
     msgsToDel ={messagesToDel}
     isFriend = {isFriend}
     getData ={getData}
     searchTerm = {searchTerm}
     setTerm = {setSearchTerm}
     searchHandler ={searchChatHandler}
    />
  );
}