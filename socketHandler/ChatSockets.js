let users=[{username:"",id:""}];
const socketHandler = (clientSocket, serverSocket,id) => {

    clientSocket.on("messageSend", (payload,cb) => {
      console.log("this is payload 1:",payload);
      console.log("send 2")
      console.log(users)
      users.map((u)=>{
          if(payload.to === u.username){
              console.log("emitted to",u.id,payload.to)
              clientSocket.to(u.id).emit("messageReceived", {
                from: payload.from,
                to: payload.to,
                //room: payload.room,
                messageBody: payload.messageBody,
                messageVideo: payload.messageVideo,
                translated: payload.translated,
                time: payload.time,
                type: "received",
              })
              
              cb(undefined);
              /* serverSocket.to(u.id).emit("newMessage",{
                notification: payload
              }); */
              serverSocket.to(u.id).emit("newRecipient",{
                payload
              });
          }
          else{
            console.log("no")
          }
      })
    });

    clientSocket.on("messageSend1", (payload,cb) => {  
      users.map((u)=>{
          if(payload.to === u.username){
            console.log("emitted 1")
            serverSocket.to(u.id).emit("newMessage",{
            notification: payload
            });
          }
        })
        cb(undefined)
    })

    clientSocket.on('adduser', (payload)=> {
      console.log("in add user",payload.id)
      let flag=0
      if(users.length>1){
        console.log("Length > 1")
        users.map((u,index)=>{
          if(u.username === payload.name && u.id === payload.id)
            flag++
          else if(u.username === payload.name && u.id !== payload.id){
            var index=users.findIndex((o) => o.id === u.id)
            console.log("replaced user",users[index])
            let obj= {username: payload.name, id:payload.id}
            users[index] = obj;
            flag++
            //console.log("update users",users)
          }
          
        })
        if(flag === 0){
            let obj= {username: payload.name, id:payload.id}
            users.push(obj);
            console.log("in user",users)
        }
        else if(flag>0){
          console.log("in user else",users)
        }
      }
      else if(users.length===1){
        console.log("lesss than 1")
        let obj= {username: payload.name, id:payload.id}
        users.push(obj);
      }
      else{
        console.log("length",users.length)
      }
    })
  };
  
  const sortList = (list) => {
    list.sort(function (a, b) {
      if (a > b) {
        return -1;
      }
      if (b > a) {
        return 1;
      }
      return 0;
    });
    return list;
  };
  
  module.exports = { socketHandler };
  