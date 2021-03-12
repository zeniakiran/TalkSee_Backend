const socketHandler = (clientSocket, serverSocket) => {
    //
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
  
    clientSocket.on("messageSend", (payload, cb) => {
      //console.log("this is payload:",payload);
      clientSocket.to(payload.room).emit("messageReceived", {
        from: payload.from,
        to: payload.to,
        room: payload.room,
        messageBody: payload.messageBody,
        translated: payload.translated,
        time: payload.time,
        type: "received",
      });
      console.log("this is payload from msg received:",payload);
      cb(undefined);
      console.log("cb: ",cb)
    });
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
  