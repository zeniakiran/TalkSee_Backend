import React ,{createContext, useEffect} from 'react'
import chatservice from '../services/ChatService'
//import {showNotification} from '../components/FrontendComponents/Alerts/showMessage'
//import Notification from '../components/FrontendComponents/Alerts/Notification'
import { toast } from 'react-toastify';
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
export const ChatContext = createContext();

export const ChatContextProvider = ({userId,setMsg,children}) =>{
    let elem = null
    let msg = ''
    useEffect(()=>{
        getUnreadMsgs(userId)
    },[userId])
    const getUnreadMsgs =(email)=>{
        chatservice.offlinemessages(email)
        .then((res)=>{
            if(res.count > 0){
                console.log("count",res.count)
                msg = 'You have '+res.count+ ' new messages!'
                /* elem = (
                    <Notification msg = {msg}/>
                ) */
                //setMsg(msg)
                if(res.info.sender[0] !== userId){
                    console.log("sender",res.info.sender)
                    console.log("user",userId)
                toast.info(msg,{
                position: toast.POSITION.TOP_LEFT,
                transition: Zoom
            })
                }
                else{
                    console.log("is sender")
                }
        
            }
        })
        .catch((err)=>console.log(err))
    }
    
    return (
        <ChatContext.Provider value = {{getUnreadMsgs: getUnreadMsgs}}>
        
            {children}
        </ChatContext.Provider>
    );
}
