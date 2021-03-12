import TypeMessage from "./TypeMessage";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import chatservice from "../../services/ChatService";
import userservice from "../../services/UserService";
import "./chat.css"
import SettingMessage from "./SettingMessage"
export default function SingleChat(props) {
  
  console.log("Pr",props)
  const [chat, setChat] = useState([{ from: "", to: "", messages: [] }]);
  /* const [recipientName, setRecName]=useState("")
  const [recipientLang, setRecLang]=useState("") */
  let chats = useRef([])
  let x = [];
  let dummy = [];
  let userId = useRef("");
  let recipient = useRef("");
  let recipientName = useRef("");
  let recipientLang = useRef("")
  let roomId = useRef("");
  let clientSocket = useRef(null);
  let indexOfChat = useRef(0);
  let data;
  let returndata;

  let elem1;
  useEffect (()=>{
    /* userservice.getUserByEmail(recipient.current).
    then((data) =>{
    recipientName.current = data[0].firstName+' '+data[0].lastName
    recipientLang.current = data[0].langPreference
    elem1 =(<div className="recName">
    {recipientName.current}
    <br/>
    </div>)
    console.log(recipientName.current)
    console.log(recipientLang.current)
  },[recipientName])
  .catch((err)=>console.log(err)) */
  recipientName.current= localStorage.getItem("recName")
  recipientLang.current = localStorage.getItem("recLang")
  },[])
useEffect(() => {

 const getData = () => { 
  
  let recaddress = props.match.params.id
  console.log(recaddress)
  recipient.current = recaddress
  userId.current = localStorage.getItem("userId");   
    chatservice.getMessagesbyEmail(userId.current,recipient.current)
   .then((data) => { 
              chats.current = data;
              console.log("Data",chats.current)
              if (chats) {
                console.log("in Chat",chats.current)
                chats.current.map((chat, index) => {
                   dummy.push(chat)
               });
              }
              else{
                console.log("No chats or some error")
              }
              console.log("dummy",dummy)
              setChat({messages:dummy})
              console.log("chat again",chat)
              clientSocket.current = io("http://127.0.0.1:5000");
              clientSocket.current.emit(
                "roomJoin",
                { from: userId.current, to: recipient.current },
                ({ error, room }) => {
                  if (!error) {
                    roomId.current = room;
                    console.log("joined room with id", room);
                  } else {
                    console.log("error joining room", error);
                  }
                }
              );

              clientSocket.current.on("messageReceived", (payload) => {
                console.log("Payload",payload)
              
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
                console.log("Received chat",chat)
              });

              
    })
   .catch((err) => console.log("This is err"+ err));
}
getData();
    
}, []);



  const sendMessage = (message) => {
    data = { 'msg' : message, 'lang':recipientLang};
          //axios.post('http://127.0.0.1:80/',data) // flask ka post method call kre ga
     // .then(response => {
          //console.log(" Response" ,response.data);
          //returndata = response.data
          let messageS = {
            from: userId.current,
            to: recipient.current,
            room: roomId.current,
            messageBody: message,
            //translated: returndata,
            time: new Date().toLocaleString(),
            type: "sent"
          };
          clientSocket.current.emit("messageSend", messageS, (err) => {
            if (!err) {
                    console.log("message sent successfully");
                    chatservice.createMessage(messageS)
                    .then((response)=>console.log(response))
                    .catch((err)=>console.log(err))
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
         //})
      
    
  };

  let elem = null;
  if(!chat.messages){
      console.log("in if part")
    elem = <h5 style = {{textAlign:"center"}}>There are currently no Messages</h5>
  }
  else{
    console.log("in else")
      elem = (
        <SettingMessage chat={chat}/>
      )
  }
  return (
    <React.Fragment>
      <div className="singleChatContainer">
        <div className="mesgs">
          <div className="msg_history">
          <div className="recName">
            {recipientName.current}
            <br/>
            </div>
            <hr/>
            {elem}
          </div>
          <TypeMessage sendMessage={sendMessage} />
        </div>
      </div>
    </React.Fragment>
  );
}
