import React, { useEffect, useState, useRef } from "react";
import "./chat.css";
import {Grid} from "@material-ui/core";
import { useSelector, useDispatch } from 'react-redux'
import  getChats from "../../Redux/actions/chat_actions"
import chatservice from "../../services/ChatService";
import Chats from "./Chats"
import SingleChat from "./SingleChat"
import SettingMessage from "./SettingMessage"
import SendMessage from "./SendMessage"
import TypeMessage from "./TypeMessage"
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import axios from "axios";
import io from "socket.io-client";

import { makeStyles } from '@material-ui/core/styles';

import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
    
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '50%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    }
  },
  btn:{
    float:"right"
  }
}));

//import Chats from "./Chats";
//import SingleChat from "./SingleChat";

export default function ChatPage(props) {
  const [chat, setChat] = useState([{ from: "", to: "", messages: [] }]);
  const [activeChat, setActiveChat] = useState({messages:[]});
  const [rec,setRec] = useState({recipients:[]})
  const [lastmsgs,setLastMsgs] = useState([])
  let userId = localStorage.getItem("userId")
  let chatsfromdb = useRef([])
  let dummy = []
  let recipients = []
  let chatsfromdb1 = useRef([])
  let dummy1 = []
  /* const mychats = useSelector(state => state.chats)
  const dispatch = useDispatch() */
  const classes = useStyles();
  const [show,setShow] = useState(false)
  const [flag,setFlag] = useState(false)
  let recipientId = useRef("")
  const [message, setMessage] = useState("");
  let roomId = useRef("");
  let clientSocket = useRef(null);

  const activeChatHandler = (rid) => {
    setShow(true)
    console.log("active chat handler called with", rid);
    recipientId.current=rid
    chatservice.getMessagesbyEmail(userId,rid).
    then((data)=> {
      console.log(data)
      chatsfromdb1.current = data;
              console.log("Data",chatsfromdb1.current)
              if (chatsfromdb1) {
                //console.log("in Chat",chatsfromdb1.current)
                chatsfromdb1.current.map((chat, index) => {
                   dummy1.push(chat)
                   
               });
              }
              else{
                console.log("No chats or some error")
              }
              setActiveChat({messages:dummy1})
              //activeCht.current.messages = dummy1
              console.log("dummy",dummy1)
              //console.log("activechat",activeChat)
              console.log("activechat",activeChat)
              /* console.log("dummy",dummy1)
              setActiveChat({messages:dummy1}) */
    }).
    catch((err)=>console.log(err))
    /* chats.map((chat) => {
      if (chat.to === rid) {
        console.log("true");
        setActiveChat(chat);
      }
    }); */
    clientSocket.current = io("http://127.0.0.1:5000");
            clientSocket.current.emit(
              "roomJoin",
              { from: userId, to: recipientId.current },
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

  };
 
  useEffect(() => {
          chatservice.getMessagesbyUserId(userId).
          then((response) => {
                if(response){
                chatsfromdb.current = response
                chatsfromdb.current.map((chat)=>{
                      dummy.push(chat.to)
                      dummy.push(chat.from)
                })
                const array = Array.from(new Set(dummy));
                array.map((r)=>{
                    if(r === userId)
                      console.log("matched")
                    else
                      recipients.push(r)
                })
                setRec({recipients:recipients})
                localStorage.setItem("recipients",rec.recipients)
                
                }
          }).
          catch(err => console.log(err));

//console.log("Chats",dispatch(getChats()))
    //console.log(activeCht)
                
  
  },[]);   

  useEffect(() => {
    
          

}, [activeChatHandler]);
              
  const sendMessage = (message)=>{
      let messageS = {
        from: userId,
        to: recipientId.current,
        room: roomId.current,
        messageBody: message,
        //translated: returndata,
        time: new Date().toLocaleString(),
        type: "sent"
      };
      clientSocket.current.emit("messageSend", messageS, (err) => {
        if (!err) {
                console.log("message sent successfully");
                setFlag(true)
                //chatservice.createMessage(messageS)
                //.then((response)=>{
               /*  setElem (
                  <div class="outgoing_msg">
                    {console.log("type",messageS.type,messageS.messageBody)}
                    <div class="sent_msg">
                      <p>{messageS.messageBody}</p>
                      <span class="time_date"> {messageS.time}</span>
                    </div>
                  </div>
                  ) */
               // })
                //.catch((err)=>console.log(err))
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
  }            

  let elem = null;
  if(!chat.messages){
      console.log("in if part")
  }
  else{
    console.log("in else")
      elem = (
        <SettingMessage chat={chat}/>
      )
  }
  
  return (
    <div>
    {console.log("return")}
      
         
        <div  >
        <h3 className="text-center">Chats</h3>
        <Grid container>
         
        <Grid item xs={7} md={3} style={{borderRight:"lightgray 2px solid",height:"100vh"}} >
            <Chats   recipients = {rec.recipients} setActiveChat={activeChatHandler}/> 
            </Grid> 
            <Grid item xs={5}  md={9} > 
            {
              activeChat.messages != undefined ?
                    <div>
                    <SingleChat activeChat={activeChat} userId = {userId} />
                    </div>
                    :
                    console.log("nope")
            }
             
            {elem}
            
            {show?
             <div>
                  
                  <InputBase
                    placeholder="Type a message"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'type' }}
                    value = {message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button className = {classes.btn} 
                  variant="contained" 
                  color="primary"
                  onClick = {()=>sendMessage(message)}
                  >
                  Send</Button>
                  
             </div> :
             null
             
            }
            </Grid>
            
           
          </Grid>
          
        </div>
      
      
    </div>
  );
}
