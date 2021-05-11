import React ,{createContext, useRef,useEffect,useState} from 'react'
import chatservice from "../services/ChatService"
import userservice from "../services/UserService"
import { v4 as uuidv4 } from 'uuid';

export const MyChatsContext = createContext();
export function MyChatsProvider({userId,children}) {
    const [chatRecipients,setChatRecipients] = useState([])
    let recData = []
    let recMsgs = []
    let msgType = []
    let recName = []
    let recId=[]
    let imgUrl =[]
    useEffect(()=>{
        //userId.current = localStorage.getItem("userId")
        if(userId !== undefined){
        getRecData(userId,undefined)
        //console.log(userId)
        }
        console.log("undefined")
        
    },[userId])

    const getRecData = (uId)=>{
         recData = []; recName =[]; recMsgs = []; msgType = []; imgUrl=[]; recId=[]
        //console.log("in getdata")
        chatservice.getChatRecipients(uId).then((data)=>{    
            if(data.length>0){
                //console.log("data getchat",data)
                /* dataFromDb.push(data)
                console.log("data from db getchat",dataFromDb) */
                data.map((rec) =>{
                    //console.log('single rec',rec)
                    return recData.push(rec)
                })
                console.log("rec data",recData)
                recData = Array.from(new Set(recData));
                console.log("rec data updated",recData)
                setChatRecipients((r)=>{
                    r.Rname=recData
                    //console.log(chatRecipients)
                    return r
                })
                chatRecipients.Rname.map((r)=>{
                    //console.log("r",r)
                    chatservice.getLastMsg(uId, r)
                    .then((data1)=>{
                        //console.log("data",data1.type)
                        recMsgs.push(data1.lastMsg)
                        msgType.push(data1.type)
                        //return {recMsgs,msgType}
                    })
                    .catch((err)=>console.log(err))

                    userservice.getUserByEmail(r).then((data2)=>{
                        //console.log("data 2",data2)
                        recId.push(data2[0]._id)
                        imgUrl.push(data2[0].profileImg)
                        recName.push(data2[0].firstName+' '+data2[0].lastName)
                        setChatRecipients((r)=>{
                            r.lastMsg = recMsgs
                            r.msgType = msgType
                            r.recId = recId
                            r.imgUrl= imgUrl
                            r.name = recName
                            console.log(chatRecipients)
                            return r
                        })
                       /*  if(cb === undefined)
                            console.log("do nothing")
                        else
                            cb() */
                    }).catch((err)=>console.log(err))
                })
                
            }
            else
                console.log("no data")
            
            })
            .catch((err)=>console.log(err))
            return chatRecipients
    }

    /* useEffect(()=>{
        
    },[chatRecipients]) */
    //getRecData()
  const value = {
      chatRecipients : chatRecipients,
      getRecData : getRecData,
      setRecipients : setChatRecipients,
      /* setuuIdFunc : setuuId,
      uuId : uuId */
  }
  return (
    <MyChatsContext.Provider value={value}>
      {children}
    </MyChatsContext.Provider>
  )
}

