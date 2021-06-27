let users=[{username:"",id:""}];
const socketHandler = (clientSocket, serverSocket) => {
  
    clientSocket.on("roomJoin", (payload, acknowledgeCb) => {
      console.log("got a room join from client with data", payload,acknowledgeCb);
      let roomList = sortList([payload.from, payload.to]);
      console.log("list",roomList)
      let roomName = roomList[0] + "/" + roomList[1];
      clientSocket.join(roomName, (err) => {
        if (err) {
          console.log(err);
          acknowledgeCb({ error: err, room: undefined });
        }
        acknowledgeCb({ error: undefined, room: roomName });
      });
    });

    clientSocket.on("myChatsRoom", (payload, acknowledgeCb) => {
      console.log("got a room join from client with data", payload);
      clientSocket.join(payload.myChatsRoom, (err) => {
        if (err) {
          console.log(err);
          acknowledgeCb({ error: err, room: undefined });
        }
        acknowledgeCb({ error: undefined, room: payload.myChatsRoom });
      });
    });

    clientSocket.on("NotificationRoom", (payload, acknowledgeCb) => {
      console.log("got a room join from client with data", payload.myNotificationRoom);
      clientSocket.join(payload.myNotificationRoom, (err) => {
        if (err) {
          console.log(err);
          acknowledgeCb({ error: err, room: undefined });
        }
        acknowledgeCb({ error: undefined, room: payload.myNotificationRoom });
      });
    });

    let userExists=0;
    clientSocket.on("messageSend", (payload,cb) => {
      console.log("this is payload 1:",payload);
      console.log("send 2")
      console.log(users)
      users.map((u)=>{
          if(payload.to === u.username){
              console.log("emitted to",u.id,payload.to)
              uId= u.id
              clientSocket.to(payload.room).emit("messageReceived" , {
                from: payload.from,
                to: payload.to,
                userName: payload.userName,
                room: payload.room,
                messageBody: payload.messageBody,
                messageVideo: payload.messageVideo,
                translated: payload.translated,
                time: payload.time,
                type: "unread",
              })
              
              cb(undefined);
              /* serverSocket.to(u.id).emit("newMessage",{
                notification: payload
              }); */
              /* serverSocket.to(u.id).emit("newRecipient",{
                payload 
              });  */
          }
          else{
            console.log("no")
            userExists =userExists+1
          }
      })
      if(userExists >= users.length){
          console.log("user does not exists")
          console.log("room",payload.room)
          clientSocket.to(payload.room).emit("messageReceived", {
            from: payload.from,
            to: payload.to,
            userName: payload.userName,
            room: payload.room,
            messageBody: payload.messageBody,
            messageVideo: payload.messageVideo,
            translated: payload.translated,
            time: payload.time,
            type: "offline"
          })
          cb(undefined)
      }
      else{
        console.log("user exists",userExists,users.length)
      }
    });

    clientSocket.on("messageSend1", (payload,cb)  =>{  
      //users.map((u)=>{
          //if(payload.to === u.username){
            console.log()
            console.log("emitted 1",payload.roomId)
            serverSocket.to(payload.roomId).emit("newMessage",{
            payload : payload.message,
            RecipientName: payload.name
            });
            console.log(payload.name)
          //}
        //})
        cb(undefined)
    })

    clientSocket.on("myChats", (payload,cb) =>{  
      console.log("emitted myChats",payload.roomId)
      serverSocket.to(payload.roomId).emit("newRecipient",{
      message : payload.message,
      userImg : payload.userImg
      });
    cb(undefined)
    })

    clientSocket.on("friendRequest", (payload,cb) => {   
      console.log(payload)
      serverSocket.to(payload.roomId).emit("newRequest",{
        sender : payload.myName
        });
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
      //  console.log("lesss than 1")
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