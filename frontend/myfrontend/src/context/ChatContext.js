import React ,{createContext, useEffect, useState} from 'react'
import chatservice from '../services/ChatService'
//import {showNotification} from '../components/FrontendComponents/Alerts/showMessage'
//import Notification from '../components/FrontendComponents/Alerts/Notification'
import { toast } from 'react-toastify';
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import { isAuthenticated } from "../components/FrontendComponents/clientStorages/auth";
export const ChatContext = createContext();

export const ChatContextProvider = ({userId,isLogin, users, children}) =>{
    let elem = null
    let msg = ''
    let email;
    const [obj, setObj] = useState({})
    const [count,setCount]= useState(0)
    /* window.onload =()=>{
        email = JSON.parse(localStorage.getItem("user").email)
        getUnreadMsgs(email)
    } */
    useEffect(()=>{
        console.log("is Login",isLogin)
        if(isLogin){
            getUnreadMsgs(userId)
        }
        
    },[isLogin])

    useEffect(()=>{
        console.log("Users online:",users)
    },[isLogin])

    const getUnreadMsgs =(email)=>{
        chatservice.offlinemessages(email)
        .then((res)=>{
            if(res.count > 0){
                console.log("count",res.count)
                msg = 'You have '+res.count+ ' new messages!'
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
        <ChatContext.Provider value = {{getUnreadMsgs: getUnreadMsgs, count: count, obj:obj, setCounter : setCount}}>
        
            {children}
        </ChatContext.Provider>
    );
}
