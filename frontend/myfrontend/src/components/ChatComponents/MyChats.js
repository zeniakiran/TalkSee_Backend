import React, { useEffect, useRef,useContext,useState } from "react";
import io from "socket.io-client";
import {MyChatsContext} from '../../context/MyChatsContext';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import "./chat.css"
const MyChats = ()=> {
  const {chatRecipients,getRecData} = useContext(MyChatsContext);
  const [show,setshow]=useState(false)
  let uId = localStorage.getItem("userId")
  let recName = []
  let recMsg = []
  let dummy = []
  const [recArray,setRecArray] = useState([])
  let value;
  //console.log(chatRecipients)
  useEffect(()=>{
    recName = []
    recMsg = []
    dummy=[]
    //recArray = []
    setRecArray([])
    getRecData(uId)
    //setshow(!show)
    console.log("id user",uId)
    console.log("chat",chatRecipients.Rname)
    chatRecipients.Rname.map((r)=>recName.push(r))
    chatRecipients.lastMsg.map((m)=>recMsg.push(m))
    console.log(recName.length)
    for(var i=0; i<recName.length; i++){
        //recArray[i]= recName[i]+","+recMsg[i]
        dummy.push(recName[i]+","+recMsg[i])
    }
    setRecArray(dummy)
    console.log("final array",recArray)
    //console.log("Recname",recName)
    //console.log("Recmsg",recMsg)
  },[])
  return (
    <div>
        {console.log("in return",recArray)}
          {recArray.length ? 
            recArray.map((r)=>{
            return (<div>
              {value =r.split(",")}
              {console.log(value)}
            <ListItem
              button
            >
              <ListItemText>
                <Typography>{value[0]}</Typography>
                <Typography >{value[1]}</Typography>
              </ListItemText>
            <Divider/> 
           </ListItem>
            </div>
            )
            })
          :
          console.log("no final array")
          }
      </div>
  )
}
export default MyChats;