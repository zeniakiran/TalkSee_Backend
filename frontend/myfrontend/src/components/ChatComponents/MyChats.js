import React, { useEffect, useRef,useContext,useState } from "react";
import {MyChatsContext} from '../../context/MyChatsContext';
import {SocketContext} from '../../context/SocketContext';
import {Grid} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import PageTitle from "../FrontendComponents/components/pageTitle";
import Header from "../FrontendComponents/components/Header";
import { useHistory } from 'react-router-dom';
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
    margin: theme.spacing(0, 3, 0, 1)
  },
  listText:{
    fontSize : '1.5rem',
    fontFamily : 'Roboto',
    marginLeft:"40px"
  }
  ,listText1:{
    fontSize : '1.2rem',
    fontFamily : 'Roboto',
    color : 'gray',
    marginLeft:"40px"
  }
  , listBtn:{
    backgroundColor: 'rgb(0, 172, 193)',
    color : 'white',
    fontSize : '1rem'
  },
  mygrid:{
    marginTop:'50px',
    marginLeft: '350px',
    width:'650px'
  },
  mygrid1 :{
    padding:"20px"
  },
  img:{
    width:"4rem",
    height:"4rem",
    borderRadius:"60px"
  }
}));
const MyChats = (props)=> {
  const classes = useStyles();
  let history = useHistory()
  const {chatRecipients,getRecData,setRecipients} = useContext(MyChatsContext);
  const [loaded,isLoaded]= useState("hi")
  const {clientSocket} = useContext(SocketContext);
  let uId = JSON.parse(localStorage.getItem("user"))
  let roomId = useRef()
  let count = useRef(0)
  roomId.current = 'chit-chat/'+props.match.params.id
  let recData = []
  let recMsgs = []
  let msgType = []
  let recName = []
  let recId=[]
  let imgUrl =[]

  window.onload = () => {
    console.log(uId.email)
    /* getRecData(uId.email)
    if(chatRecipients.Rname !== undefined)
        setMyChats()
    else
        console.log("no array") 
        getRecData(uId.email,setMyChats)  */ 
        /* recData = []; recName =[]; recMsgs = []; msgType = []; imgUrl=[]; recId=[]
        //console.log("in getdata")
        chatservice.getChatRecipients(uId.email).then((data)=>{    
            if(data.length>0){
                console.log("data getchat",data)
                data.map((rec) =>{
                    //console.log('single rec',rec)
                    return recData.push(rec)
                })
                console.log("rec data",recData)
                recData = Array.from(new Set(recData));
                console.log("rec data updated",recData)
                setRecipients((r)=>{
                    r.Rname=recData
                    //console.log(chatRecipients)
                    return r
                })
                chatRecipients.Rname.map((r)=>{
                    //console.log("r",r)
                    chatservice.getLastMsg(uId.email, r)
                    .then((data1)=>{
                        //console.log("data",data1.type)
                        recMsgs.push(data1.lastMsg)
                        msgType.push(data1.type)
                        //return {recMsgs,msgType}
                    })
                    .catch((err)=>console.log(err))

                    userservice.getUserByEmail(r).then((data2)=>{
                        //console.log("data 2",data2)
                        recId.push(data2[0]._id)
                        imgUrl.push(data2[0].profileImg)
                        recName.push(data2[0].firstName+' '+data2[0].lastName)
                        setRecipients((r)=>{
                            r.lastMsg = recMsgs
                            r.msgType = msgType
                            r.recId = recId
                            r.imgUrl= imgUrl
                            r.name = recName
                            //console.log(chatRecipients)
                            return r
                        })
                        setMyChats()
                    }).catch((err)=>console.log(err))
                })
                
            }
            else
                console.log("no data")
            
            })
            .catch((err)=>console.log(err)) */
  };

  const setRecArray = (index,msg,type)=>{
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

  const setNewRecipient = (rec,msg,type)=> {
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
    console.log("component mounted")
    getRecData(uId.email)
    //console.log("id user",uId.email)
    console.log("chat frm Mychats",chatRecipients)
    
  },[chatRecipients] )

  useEffect(()=>{
    if(clientSocket){
      clientSocket.emit(
        "myChatsRoom",
        { myChatsRoom : roomId.current},
        ({error,room}) => {
          if (!error) {
            console.log("joined room with id", room);
          } else {
            console.log("error joining room", error);
          }
        }
      );

      clientSocket.on("newRecipient", (payload) => {
        console.log("new rec",payload.message)
        let index;
      
      if(chatRecipients.Rname && chatRecipients.lastMsg){
        console.log(chatRecipients)
        count.current=0
        chatRecipients.Rname = Array.from(new Set(chatRecipients.Rname));
        chatRecipients.Rname.map((r,indx)=>{
        console.log(payload.message.from)
        if(payload.message.from ===r){
          
          index = indx
          console.log("index: ",index)
          count.current = count.current+1
         
        }
        else{
          console.log("false",payload.message.from,r)
        }
        })
        if(count.current >=1){
            setRecArray(index,payload.message.messageBody,payload.message.type)
            console.log("After state",chatRecipients)
        }
        else if(count.current === 0){
            setNewRecipient(payload.message.from,payload.message.messageBody)
            console.log("After new state",chatRecipients)
        }
      }
      else{
        console.log("no chat")
      }
        })
    }

  },[])
 
 const setMyChats = ()=>(
   //console.log("in function",chatRecipients.Rname)
  //if(chatRecipients.Rname !== undefined){
      <div>
        {
          chatRecipients.Rname.map((r,index)=>{
              console.log("in setChatss",chatRecipients)
              console.log("r: ",r+" index:",index)
              console.log("chats url:",chatRecipients.imgUrl[index],index)
              console.log("chats msg:",chatRecipients.lastMsg[index],index)
              console.log("chats name:",chatRecipients.name[index], index)
            return (<Grid xs={6}>
            <ListItem
              button
              onClick={(()=> history.push('/chat/'+r))}
              
            >
            <ListItemAvatar>
                <img src={chatRecipients.imgUrl[index]} alt="img"  className={classes.img}/>
            </ListItemAvatar> 
              <ListItemText>
                 {/*  {setText(r,chatRecipients.lastMsg[index],chatRecipients.msgType[index])}
                  {elem} */}
                  <Typography className={classes.listText}>{r}</Typography>
                  <Typography className={classes.listText1}>{chatRecipients.lastMsg[index]}</Typography>
              </ListItemText>
            <Divider/> 
           </ListItem>
           <Divider/>
            </Grid>
            )
            })
          
        }
      </div>
 )
  
  return (
    <div>
    <Header/>
    <PageTitle name= {"My Chats"}/>
      <Paper md={8} xs ={4} className={classes.mygrid}>
      
      {console.log("in return",loaded)}
          {chatRecipients.Rname !== undefined? 
          <div>
            {setMyChats()}
            
            </div>
          :
          console.log("no final array")
          } 
          
      </Paper>
    </div>
  )
}
export default MyChats;