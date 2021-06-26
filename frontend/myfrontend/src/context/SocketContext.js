import React ,{createContext,useEffect,useState,useRef} from 'react'
import io from "socket.io-client";
import { toast } from 'react-toastify';
import {  Bounce } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { isAuthenticated } from "../components/FrontendComponents/clientStorages/auth";
import friendService from "../services/friendService";
import chatservice from '../services/ChatService';
import { Button } from '@material-ui/core';
export const SocketContext = createContext();
export function SocketProvider({id,children}) {
   
  const [frndcounter,setFrndCounter]= useState(0)
  const [msgCount,setMsgCount]=useState(0);
  const [clientSocket, setSocket] = useState()
  let roomId = useRef()
  

  useEffect(() => {
    const socket = io(
      'http://localhost:5000',
)
    setSocket(socket)
    return () => socket.close()
    /* clientSocket.current = io("http://127.0.0.1:5000");
    clientSocket.current.on('connect' , () => {
      console.log(clientSocket.current.id);
    }); */
  }, [])

  useEffect(()=>{
    roomId.current= '/'+id
    console.log(roomId)
  },[])
  const messageCounter=()=>{

    chatservice.offlinemessages(isAuthenticated().email)
        .then((res)=>{  
                setMsgCount(res.count)
                 localStorage.setItem("messagecount",JSON.stringify(res.count))
        })
        .catch((err)=>console.log(err))}
  useEffect(()=>messageCounter,[msgCount])
  const newMessageEvent = () => {
    if(clientSocket){
      clientSocket.on("newMessage", (payload) => {
      <Button onClick={()=>console.log("clicked")}>
        {toast(payload.RecipientName +':'+
        payload.payload.messageBody, {
          onOpen: () => console.log('Called when I open'),
          position: toast.POSITION.TOP_LEFT,
          toastId: '007',
          transition: Bounce
        })}
      </Button>
      //count=count+1
      console.log("new message",payload)
      messageCounter();
      })
    }
    else {
      console.log("no socket")
    }  
  //return () => {clientSocket.removeAllListeners("newMessage");}
  }

  /* useEffect(()=>{
    newMessageEvent()
    console.log("2")
  },[])
 */
  const roomJoin = (did) =>{
    //did = did || roomId.current
    did = '/'+did
    if(clientSocket){
      clientSocket.emit(
        "NotificationRoom",
        { myNotificationRoom : did},
        ({error,room}) => {
          if (!error) {
            console.log("joined room with id", room);
          } else {
            console.log("error joining room", error);
          }
        }
      );
    }
  }
  const getAllRequests=()=>{
           friendService.getFriendRequest(isAuthenticated()._id).then((data)=>{
             setFrndCounter(data.length);
             localStorage.setItem("friendRequests",JSON.stringify(data.length))
            })
            .catch((err=>{console.log(err)}))
  }
  useEffect(()=>getAllRequests,[frndcounter])
 const getFriendRequest = () => {
    if(clientSocket)
    {
       clientSocket.on("newRequest", (payload) => getAllRequests())
       clientSocket.on("rejectRequest", (payload) => getAllRequests())
    }
    else
      console.log("no socket")}
     
  const friendReqEvent = () =>{
    if(clientSocket){
      clientSocket.on("newRequest", (payload) => {
          toast.info(
          payload.sender+ ' has sent you a friend request!', {
          position: toast.POSITION.TOP_LEFT,
          //toastId: '009',
          autoClose: 7000,
          transition: Bounce
        })
      
      })
    }
    else{
      console.log("no socket")
    }
  }
  

  let value={
    clientSocket : clientSocket,
    setSocket : setSocket,
    messageEvent : newMessageEvent,
    roomJoin : roomJoin,
    friendReq : friendReqEvent,
    getRequest: getFriendRequest,
    frndcounter:frndcounter,
    acceptRejectCounter:getAllRequests,
    msgCounter:msgCount,
    msgNotify:messageCounter
  }
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )

  
}