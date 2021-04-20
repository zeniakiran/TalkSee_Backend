import React, { useEffect, useRef,useContext,useState } from "react";
import io from "socket.io-client";
import {MyChatsContext} from '../../context/MyChatsContext';
import {SocketContext} from '../../context/SocketContext';
import {Grid} from "@material-ui/core";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import FaceIcon from '@material-ui/icons/Face';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import "./chat.css"

const useStyles = makeStyles((theme) => ({
  subheader: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  globe: {
    backgroundColor: theme.palette.primary.dark,
  },
  subheaderText: {
    color: theme.palette.primary.dark,
  },
  list: {
    maxHeight: "calc(100vh - 112px)",
    overflowY: "auto",
    
  },
  avatar: {
    margin: theme.spacing(0, 3, 0, 1),
  },
  listText:{
    fontSize : '1.3rem',
    fontFamily : 'Roboto'
  }
  ,listText1:{
    fontSize : '1rem',
    fontFamily : 'Roboto',
    color : 'gray'
  }
  , listBtn:{
    backgroundColor: 'rgb(0, 172, 193)',
    color : 'white',
    fontSize : '1rem'
  },
  mygrid:{
    marginTop:'100px'
  }
}));
const MyChats = ()=> {
  const classes = useStyles();
  const {chatRecipients,getRecData,setRecipients} = useContext(MyChatsContext);
  const clientSocket = useContext(SocketContext);
  const [newMsg,setNewMsg]=useState(false)
  let uId = JSON.parse(localStorage.getItem("user"))
  let recName = []
  let recMsg = []
  let dummy = []
  //const [recArray,setRecArray] = useState([])

  const setRecArray = (index,msg)=>{
    let items = [...chatRecipients.lastMsg];
    items[index] = msg;
    console.log("items",items)
    setRecipients((r)=>{
      /* let newR = [...r.lastMsg]
      newR = [...newR,items]
      console.log(r) */
      return {...r,lastMsg:items}
    });
     
  }

  const setNewRecipient = (rec,msg)=>{
    setRecipients((r)=>{
      let newR = [...r.Rname]
      newR = [...newR,rec]
      let newMsg = [...r.lastMsg]
      newMsg = [...newMsg,msg]
      console.log(newR,newMsg)
      return {...r,Rname:newR,lastMsg:newMsg}
    });

  }
  useEffect(()=>{
    getRecData(uId.email)
    console.log("id user",uId.email)
    console.log("chat",chatRecipients.Rname)
    
  },[chatRecipients])

  useEffect(()=>{
    clientSocket.on("newRecipient", (payload) => {
      console.log("IN NEW REc",payload)
      let index;
      let count=0;
      if(chatRecipients.Rname && chatRecipients.lastMsg){
        console.log(chatRecipients)
        chatRecipients.Rname.map((r,indx)=>{
        console.log(payload.payload.from)
        if(payload.payload.from ===r){
          index = indx
          count = count+1
          //setIsRec(count)
        }
        else{
          console.log("false",payload.payload.from,r)
        }
        })
        if(count >=1)
            setRecArray(index,payload.payload.messageBody)
        else if(count === 0)
            setNewRecipient(payload.payload.from,payload.payload.messageBody)
        console.log("After state",chatRecipients)
      }
      else{
        console.log("no chat")
      }

  })
  },[])
  return (
    <div>
          {chatRecipients.Rname !== undefined ? 
            chatRecipients.Rname.map((r,index)=>{
            return (<Grid className={classes.mygrid} xs={12}>
            <ListItem
              button
            >
            <ListItemAvatar>
             <Avatar className={classes.globe}>
                <FaceIcon/>
             </Avatar>
            </ListItemAvatar> 
              <ListItemText>
                <Typography>{r}</Typography>
                <Typography>{chatRecipients.lastMsg[index]}</Typography>
              </ListItemText>
            <Divider/> 
           </ListItem>
            </Grid>
            )
            })
          :
          console.log("no final array")
          }
      </div>
  )
}
export default MyChats;