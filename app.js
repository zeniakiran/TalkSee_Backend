var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var mongoose = require("mongoose");
var config = require("./config/dev");
var cors = require("cors")
const connectDB = require("./db/db");

var usersRouter = require('./routes/ApiRoutes/UsersApi');
var ChatApiRouter = require('./routes/ApiRoutes/ChatApi');
//var GroupApiRouter = require('./routes/ApiRoutes/GroupApi');
const ContactsApiRouter = require("./routes/ApiRoutes/ContactsApi");
const FriendsApiRouter= require("./routes/ApiRoutes/FriendsApi");

var app = express();
const server = require("http").createServer(app);
const socketListener = require("socket.io")(server);
const { socketHandler } = require("./socketHandler/ChatSockets.js");
app.use(cors());
connectDB();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
 
app.use('/api/users', usersRouter); 
app.use('/api/chatapi', ChatApiRouter);
app.use('/api/contacts', ContactsApiRouter);
app.use('/api/friends', FriendsApiRouter);
// Serve static files from the React frontend app
if(process.env.NODE_ENV == "production"){
app.use(express.static(path.join(__dirname, 'frontend/myfrontend/build')))
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/myfrontend/build/index.html'))
})
}
 
var i =0
socketListener.on("connection", (clientSocket) => {
  i=i+1
  //const id = clientSocket.handshake.query.id
  console.log("a socket connected with id:", clientSocket.id, i);
 // console.log("sockets",socketListener.username)
 socketListener.setMaxListeners(5)
  
  socketHandler(clientSocket, socketListener);
});
socketListener.on('disconnect', () => {
  socketListener.removeAllListeners();
});
const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there

server.listen(port, () =>
  console.log(`Server up and running on port ${port} !`)
);
module.exports = app;
