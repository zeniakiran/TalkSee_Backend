import React ,{createContext, useRef,useEffect,useState} from 'react'
import chatservice from "../services/ChatService"

export const MyChatsContext = createContext();
export function MyChatsProvider({userId,children}) {
    const [chatRecipients,setChatRecipients] = useState(['hy'])
    //let userId=useRef("")
    let recData = []
    let recMsgs = []
    useEffect(()=>{
        //userId.current = localStorage.getItem("userId")
        getRecData(userId)
        console.log(userId)
        
        
    },[userId])

    const getRecData = (uId)=>{
         recData = []
         recMsgs = []
        console.log("in getdata")
        chatservice.getChatRecipients(uId).then((data)=>{    
            if(data.length>0){
                console.log("data getchat",data)
                data.map((rec) =>{
                    return recData.push(rec)
                })
                setChatRecipients((r)=>{
                    r.Rname=recData
                    console.log(chatRecipients)
                    return r
                })
                chatRecipients.Rname.map((r)=>{
                    console.log(r)
                    chatservice.getLastMsg(uId, r)
                    .then((data)=>{
                        console.log("data",data)
                        recMsgs.push(data)
                        return recMsgs
                    })
                    .catch((err)=>console.log(err))
                })
                setChatRecipients((r)=>{
                    r.lastMsg=recMsgs
                    console.log(chatRecipients)
                    return r
                })
            }
            else
                console.log("no data")
            
            })
            .catch((err)=>console.log(err))
    }

    /* useEffect(()=>{
        
    },[chatRecipients]) */
    //getRecData()
  const value = {
      chatRecipients : chatRecipients,
      getRecData : getRecData,
      setRecipients : setChatRecipients
  }
  return (
    <MyChatsContext.Provider value={value}>
      {children}
    </MyChatsContext.Provider>
  )
}

