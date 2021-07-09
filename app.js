var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var config = require("./config/dev");
var cors = require("cors")
var usersRouter = require('./routes/ApiRoutes/UsersApi');
var ChatApiRouter = require('./routes/ApiRoutes/ChatApi');
//var GroupApiRouter = require('./routes/ApiRoutes/GroupApi');
const ContactsApiRouter = require("./routes/ApiRoutes/ContactsApi");
const FriendsApiRouter= require("./routes/ApiRoutes/FriendsApi");

var app = express();
const server = require("http").createServer(app);
const socketListener = require("socket.io")(server);
const { socketHandler } = require("./socketHandler/ChatSockets.js");

//app.use(cors());
app.use(cors({origin: '*'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* app.get("/", (req, res) => {
  res.status(200).send("server is up and running");
});
 */
app.use('/api/users', usersRouter);
app.use('/api/chatapi', ChatApiRouter);
app.use('/api/contacts', ContactsApiRouter);
app.use('/api/friends', FriendsApiRouter);
app.use(express.static(path.join(__dirname, 'frontend/myfrontend/build')))
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/myfrontend/build/index.html'))
})
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there


mongoose.connect(config.mongoURI, 
{ useNewUrlParser: true , useUnifiedTopology: true })
.then(()=>{console.log("Connected to Database")})
.catch((err)=>{console.log(err + "Error in App")})
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

server.listen(port, () =>
  console.log(`Server up and running on port ${port} !`)
);
module.exports = app;
