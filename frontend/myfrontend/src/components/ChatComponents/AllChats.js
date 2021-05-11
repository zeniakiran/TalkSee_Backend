import React, { useEffect, useRef, useContext, useState } from "react";
import { MyChatsContext } from "../../context/MyChatsContext";
import { SocketContext } from "../../context/SocketContext";
import SingleChat from './SingleChat'
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import PageTitle from "../FrontendComponents/components/pageTitle";
import Header from "../FrontendComponents/components/Header";
import { useHistory } from "react-router-dom";
import chatservice from "../../services/ChatService";
import userservice from "../../services/UserService";


import "./chat.css";

const useStyles = makeStyles((theme) => ({
  
  mygrid: {
    marginTop: "50px",
    marginLeft: "350px",
    width: "650px",
  }
}));
const AllChats = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const {clientSocket} = useContext(SocketContext);
  let uId = JSON.parse(localStorage.getItem("user")).email;
  /* const [email,setEmail]= useState([])
  const [lastMsg,setlastMsg]= useState([])
  const [id,setId]= useState([])
  const [url,setUrl]= useState([])
  const [name,setName]= useState([]) */
  let emails = useRef([])
  //let usersData = useRef([])
  const [usersData, setData] = useState([])
  const [lastMsg, setLastMsg] = useState({msgs: [], emails:[]})
  //const [recipients, setRecipients] = useState([])
  let roomId = useRef()
  let count = useRef(0);
  let notPresent = useRef(0)
  roomId.current = 'mychats/'+props.match.params.id
  let recData = [];
  let recMsgs = [];
  let dummy=[]  

  const getRecData = (uId) => {
    chatservice
      .getChatRecipients(uId)
      .then((data) =>{
        if (data.length > 0) {
          console.log("emails before sorting", data)
          emails.current = data.sort()
          console.log("emails after sorting", emails.current)
          /* setRecipients((r)=>{
            r.email = emails.current
            //console.log("r emails", r)
          }) */
          //console.log("data",emails)
          userservice
          .getUserByEmail(emails.current).then((datafromdb)=> {
            recData=datafromdb
            setData((d)=>{
              d = recData
              return d
            })
          })
         // let index = 0
    emails.current.forEach((r,index)=>{
      
      chatservice.getLastMsg(uId, r)
      .then((data1)=>{
        /* console.log("r :",r)
        console.log("data last msg",data1.lastMsg) */
          /* recMsgs.push(data1.lastMsg)
          console.log(recMsgs)  */
          ///console.log("data 1",data)
          //console.log("Last Msg length", lastMsg.length, lastMsg)
          /* if(lastMsg.msgs.length >=1){
            console.log("in if",lastMsg)
            setLastMsg({msgs : [...lastMsg.msgs, data.lastMsg]})
          }
          else{
            
            setLastMsg({ msgs: [data.lastMsg] });
            console.log("first msg",lastMsg)
          } */
          setLastMsg((msg) => {
            if (msg.msgs.length>=1 && msg.emails.length>=1) {
              let newMsg = [...msg.msgs];
              let newR = [...msg.emails]
              newMsg = [...newMsg, data1.lastMsg];
              newR = [...newR, r]
              console.log("newMsg: ",newR)
              return { ...msg, msgs: newMsg, emails: newR };
            } else {
              console.log("first: ",data1.lastMsg,r)
              return { msgs: [data1.lastMsg], emails: [r] };

            }
          });
       }).catch((err)=>console.log(err))
       
    })
         
          //setLastMsg(recMsgs)
          
          //console.log("recipients",recipients) 
          
        } else console.log("no data");
      })
      .catch((err) => console.log(err));
  };

  
  useEffect(() => {
    console.log("in useEffect 1")
    getRecData(uId); 
    console.log("usersData 1",usersData)
  }, []);

  useEffect(()=>{
    console.log("in useEffect 2")
    
  },[])

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
      
      if(usersData.length !==0 && lastMsg.msgs.length !==0 ){
        console.log("check:",usersData)
        count.current = 0
        /* present.current =0
        notPresent.current =0 */
        usersData.forEach((u,indx) => {
          console.log("in map") 
        console.log("emails from map",payload.message.from, u.email)
        if(payload.message.from === u.email){
          
          index = indx
          console.log("index: ",index)
          count.current = count.current+1
          console.log("count: ",count.current)
        }
        else{
          //count.current.current = notPresent.current + 1 ;
          console.log("false",count.current)
        }
        
        })
        if(count.current !==0){
          console.log("in setRecArray",count.current)
            setRecArray(index,payload.message.messageBody,payload.message.type)
        }
        else if(count.current === 0){
            setNewRecipient(payload.message.from,payload.message.messageBody,payload.userImg)
            console.log("in setNewArray",count.current)
        }
        else
        console.log("nothing ",count.current )
       }
      else{
        console.log("no chat")
        console.log("usersData 1",usersData)
      }
       })
    }

  },[usersData,lastMsg.msgs])

  const setRecArray = (index,msg,type)=>{
    //if(lastMsg)
    let items = [...lastMsg.msgs];
      console.log("items before change",items,lastMsg.msgs)
      items[index] = msg;
      console.log("items",items)
    setLastMsg((m)=>{
      //if(lastMsg.msgs.length !== 0){
      
      //console.log("items",items)
      //console.log("users Msgs",m)
      return {...m,msgs : items}
      //}
    });

  }

  const setNewRecipient = (rec,msg,type)=> {
    /* setRecipients((r)=>{
      let newR = [...r.Rname]
      newR = [...newR,rec]
      let newMsg = [...r.lastMsg]
      newMsg = [...newMsg,msg]
      console.log(newR,newMsg)
      return {...r,Rname:newR,lastMsg:newMsg}
    }); */
    /* setData((d)=>{
      let newR = [...d.email]
      newR = [...newR,rec]
      return {...d,Rname:newR,lastMsg:newMsg}
    }) */

  }


  return (
    <div>
      <Header />
      <PageTitle name={"My Chats"} />
      
        {console.log("in return")}
        {usersData.length !== 0? (
          <Paper md={8} xs={4} className={classes.mygrid}>
              <SingleChat recipients = {usersData} lastMsg={lastMsg}/>
          </Paper>
        ) : (
          <h5 style={{ textAlign: "center" }}>No Chats Yet!</h5>
        )}
      
    </div>
  );
};
export default AllChats;
