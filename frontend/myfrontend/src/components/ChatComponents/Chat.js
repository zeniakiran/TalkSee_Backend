import React, { useEffect, useState, useRef, useContext } from "react";
import chatservice from "../../services/ChatService";
import userservice from "../../services/UserService";
import "./chat.css";
import SettingMessage from "./SettingMessage";
import { SocketContext } from "../../context/SocketContext";
import RenderChat from './RenderChat'

export default function SingleChat(props) {
  const [chat, setChat] = useState([{ from: "", to: "", messages: [] }]);
  const [loading, setLoading] = useState(false);
  let chats = useRef([]);
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
  console.log("my socket", clientSocket);

  useEffect(() => {
    recipientInfo.current.name = localStorage.getItem("recName");
    recipientInfo.current.lang = localStorage.getItem("recLang");
    recipientInfo.current.url = localStorage.getItem("profileUrl");
    myChatsRoom.current = "mychats/" + localStorage.getItem("friendId");
    notificationRoom.current = "/" + id[1];
  }, []);

  const getData = () => {
    console.log("in get Data")
    recipient.current = id[0];
    user.current.uId = us.email;
    user.current.uName = us.firstName + " " + us.lastName;
    userservice
      .getUserByEmail(user.current.uId)
      .then((data) => {
        user.current.uImg = data[0].profileImg;
      })
      .catch((err) => console.log("Err in UserService", err));

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
    setLoading(true);
    let data = {
      msg: message,
      lang: recipientInfo.current.lang,
      userImgUrl: user.current.uImg,
    };
    //console.log(data)
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
      messageVideo: returndata,
      time: new Date().toLocaleString(),
      type: "sent",
    };
    clientSocket.emit("messageSend", messageS, (err) => {
      console.log("in send");
      if (!err) {
        console.log("message sent successfully");
        /* chatservice.createMessage(messageS)
            .then((response)=>console.log(response))
            .catch((err)=>console.log(err)) */
        //console.log("MsgS",messageS)
        if (chat.messages) {
          setChat({ messages: [...chat.messages, messageS] });
          console.log("sent chat", chat);
        } else {
          setChat({ messages: [messageS] });
          console.log("first message " + chat);
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
  };
  
  const chatDeleteHandler = (message)=>{
    console.log(message)
    setMsgs(message)
}

  let elem = null;
  if (!chat.messages) {
    console.log("in if part");
    elem = (
      <h5 style={{ textAlign: "center" }}>There are currently no Messages</h5>
    );
  } else {
    console.log("in else");
    elem = <SettingMessage chat={chat} user={user.current.uId} isDel={isDel} delHandler = {chatDeleteHandler}/>;
  }

  
  return (    
    <RenderChat recipientInfo={recipientInfo.current} 
     element={elem}
     loading = {loading}
     sendMessage = {sendMessage}
     isDel ={isDel}
     setDel = {setDel}
     msgsToDel ={messagesToDel}
     getData ={getData}
    />
  );
}
