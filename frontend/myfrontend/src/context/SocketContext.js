import React ,{createContext,useEffect,useState,useRef} from 'react'
import io from "socket.io-client";
import { toast } from 'react-toastify';
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

export const SocketContext = createContext();
export function SocketProvider({id,children}) {
  
  const [clientSocket, setSocket] = useState()
  let count=0;
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

  const newMessageEvent = ()=>{
    count=0;
    if(clientSocket){
      clientSocket.on("newMessage", (payload) => {
      <button onClick={()=>console.log("clicked")}>{toast(payload.RecipientName +':'+
        payload.payload.messageBody, {
          onOpen: () => console.log('Called when I open'),
          position: toast.POSITION.TOP_LEFT,
          toastId: '007',
          transition: Bounce
        })}
      </button>
      //count=count+1
      console.log("new message",payload)
      })
    }
    else{
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
  

  let value={
    clientSocket : clientSocket,
    setSocket : setSocket,
    messageEvent : newMessageEvent,
    roomJoin: roomJoin
  }
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )

  
}

