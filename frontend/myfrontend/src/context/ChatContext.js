import React ,{createContext, useState, useReducer, useEffect} from 'react'
import  CartReducer from '../reducers/CartReducer'
export const ChatContext = createContext();

const ChatContextProvider = (props) =>{
    const [chat, dispatch] = useReducer(Chatreducer, [{messages:[]}])
    
    return (
        <ChatContext.Provider value = {{chat, dispatch}}>
            {props.children}
        </ChatContext.Provider>
    );
}

export default ChatContextProvider;