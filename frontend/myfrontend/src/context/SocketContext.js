import React ,{createContext,useEffect,useState,useRef} from 'react'
import io from "socket.io-client";
import { toast } from 'react-toastify';
import { isAuthenticated } from "../components/FrontendComponents/clientStorages/auth";
import friendService from "../services/friendService";
import chatservice from '../services/ChatService';
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

export const SocketContext = createContext();
export function SocketProvider({id,email,isLogin,children}) {
  
  const [obj, setObj] = useState({})
  const [frndcounter,setFrndCounter]= useState(0)
  const [msgCount,setMsgCount]=useState(0);
  const [clientSocket, setSocket] = useState()
  //let msgCount = useRef(0)
  let count=0;
  let roomId = useRef()
  
  useEffect(() => {
    
    /* const socket = io(
      process.env.REACT_APP_IP_URL,
    ) */
    const socket = io(
      process.env.REACT_APP_IP_URL
    )
    setSocket(socket)
    return () => socket.close()
    
  }, [])

  useEffect(()=>{
    roomId.current= '/'+id
    console.log(roomId)
  },[])

  const messageCounter=()=>{

    chatservice.offlinemessages(email)
        .then((res)=>{  
          setObj((o)=>{
            o = {sender: res.info.sender, receiver: res.info.receiver}
            return o
          })
                setMsgCount((c)=>{   
                      c= res.count
                   return c
                })
                console.log("Message Count is",msgCount);
                 localStorage.setItem("messagecount",JSON.stringify(msgCount))
        })
        .catch((err)=>console.log(err))}

  //useEffect(()=>messageCounter,[])

  useEffect(()=>{
    console.log("is login", isLogin)
    if(isLogin){
    newMessageEvent()
    friendReqEvent()
    messageCounter()
    console.log("new message event mounted")
    }
    else{
      console.log("not mounted")
    }
  },[isLogin])
  

  const newMessageEvent = () => {
    let counter = JSON.parse(localStorage.getItem("messagecount"))
    console.log(" new msg event ")
    if(clientSocket){
      clientSocket.on("newMessage", (payload) => {
      toast(payload.RecipientName +':'+
        payload.payload.messageBody, {
          onOpen: () => console.log('Called when I open'),
          position: toast.POSITION.TOP_LEFT,
          //toastId: '007',
          transition: Bounce
        })
      //count=count+1
      console.log("new message",payload)
      //messageCounter();
      
      setMsgCount((c)=>{
        c =  c + 1
        localStorage.setItem("messagecount",JSON.stringify(c))
        localStorage.setItem("MyC",JSON.stringify(c))
        return c
      })
      })
    }
    else {
      console.log("no socket")
    }  
  //return () => {clientSocket.removeAllListeners("newMessage");}
  }

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
    friendService.getFriendRequest(id).then((data)=>{
      setFrndCounter(data.length);
      localStorage.setItem("friendRequests",JSON.stringify(data.length))
     })
     .catch((err=>{console.log(err)}))
}
  //useEffect(()=>getAllRequests,[frndcounter])

  const getFriendRequest = () => {
    if(clientSocket)
    {
    clientSocket.on("newRequest", () => getAllRequests())
    clientSocket.on("rejectRequest", (payload) => getAllRequests())
    }
    else
    console.log("no socket")
  }

  const friendReqEvent = () =>{
    console.log("friend Req event")
    if(clientSocket){
      clientSocket.on("newRequest", (payload) => {
          console.log("payload : ",payload)
          toast.info(
          payload.sender+ ' has sent you a friend request!', {
          position: toast.POSITION.TOP_LEFT,
          //toastId: '009',
          autoClose: 7000,
          transition: Bounce
        })
        setFrndCounter((c)=>{
          c =  c + 1
          localStorage.setItem("friendRequests",JSON.stringify(c))
          return c;
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
    msgNotify:messageCounter,
    obj : obj
  }
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )

  
}