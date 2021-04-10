let users=[{username:"",id:""}];
const socketHandler = (clientSocket, serverSocket) => {
  
  //let obj={username:"",id:""}
  console.log("users:",users)
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
  
    clientSocket.on("messageSend", (payload,cb) => {
      //console.log("this is payload id:",id);
      users.map((u)=>{
          if(payload.to === u.username){
              console.log("matched user")
              clientSocket.to(u.id).emit("messageReceived", {
                from: payload.from,
                to: payload.to,
                room: payload.room,
                messageBody: payload.messageBody,
                //messageVideo: payload.messageVideo,
                translated: payload.translated,
                time: payload.time,
                type: "received",
              })

              serverSocket.to(u.id).emit("newMessage",{
                notification: "You have a new message!"
              });
          }
          else{
            console.log("no matched user")
          }
      })
      /* clientSocket.to(payload.room).emit("messageReceived", {
        from: payload.from,
        to: payload.to,
        room: payload.room,
        messageBody: payload.messageBody,
        //messageVideo: payload.messageVideo,
        translated: payload.translated,
        time: payload.time,
        type: "received",
      }
      ); 
      console.log("this is payload from msg received:",payload);
      cb(undefined);
      console.log("cb: ",cb)
      if(serverSocket.sockets.adapter.rooms[payload.room] !== undefined){
      var socketArray = Object.keys(serverSocket.sockets.adapter.rooms[payload.room].sockets)
      console.log("server:",socketArray)
      var socketClient = ""
      for( var i = 0; i < socketArray.length; i++){ 
        if ( socketArray[i] !== clientSocket.id) { 
          socketClient = socketArray[i]
        }
    }
    console.log("socket:",socketClient)
    console.log("client:",clientSocket.id)
    serverSocket.to(socketClient).emit("newMessage",{
      notification: "You have a new message!"
    });
  }
  else{
    console.log("none")
  }*/
    });

    clientSocket.on('adduser', (payload)=> {
      let flag=0
      if(users.length>1){
        console.log("Length > 1")
        users.map((u,index)=>{
          if(u.username === payload.name)
            flag++
          
        })
        if(flag === 0){
            let obj= {username: payload.name, id:payload.id}
            users.push(obj);
            console.log("in user",users)
        }
        else{
          console.log("in user",users)
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
      // attempt to clean up
      /* socket.once('disconnect', function () {
        var pos = users.indexOf(name);
      }) */
    })
    
    //   serverSocket.emit();
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
  