import React ,{createContext, useRef,useEffect,useState} from 'react'
import io from "socket.io-client";

//export let clientSocket = useRef(null);
export const SocketContext = createContext();
export function SocketProvider({id,children}) {
  /* const clientSocket = io("http://127.0.0.1:5000", );
  clientSocket.on('connect' , () => {
    console.log(clientSocket.id);
  }); */
  //const clientSocket = useRef(null);
  const [clientSocket, setSocket] = useState()
  useEffect(() => {
    const socket = io(
      'http://localhost:5000',
      //{ query: { id } }
    )
    setSocket(socket)
    return () => socket.close()
  }, [])
  return (
    <SocketContext.Provider value={clientSocket}>
      {children}
    </SocketContext.Provider>
  )
}

