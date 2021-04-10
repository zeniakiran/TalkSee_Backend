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
var GroupApiRouter = require('./routes/ApiRoutes/GroupApi');
//var UserInfoApiRouter = require('./routes/ApiRoutes/UserInfoApi')
var app = express();
const server = require("http").createServer(app);
const socketListener = require("socket.io")(server);
const { socketHandler } = require("./socketHandler/ChatSockets.js");
// view engine setup



app.use(cors());
 /* app.use(cors(),(req, res, next) => {
  res.header('Access-Control-Allow-Origin',"*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.sendStatus(200);
  
}); */


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));



app.get("/", (req, res) => {
  res.status(200).send("server is up and running");
});

app.use('/api/users', usersRouter);
//app.use('/api/usersapi', UserApiRouter);
app.use('/api/chatapi', ChatApiRouter);
app.use('/api/chatapi/groupchat', GroupApiRouter);
//app.use('/api/userinfoapi', UserInfoApiRouter);


// catch 404 and forward to error handler
/* app.use(function(req, res, next) {
  next(createError(404));
}); */
 
// error handler
/* app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); */
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there


mongoose.connect(config.mongoURI, 
{ useNewUrlParser: true , useUnifiedTopology: true })
.then(()=>{console.log("Connected to Database")})
.catch((err)=>{console.log(err + "Error in App")})

socketListener.on("connection", (clientSocket) => {
  var users=[]
  var obj={}
  console.log("a socket connected with id:", clientSocket.id);
 // console.log("sockets",socketListener.username)
 socketListener.setMaxListeners(5)
  
  socketHandler(clientSocket, socketListener);
  //clientSocket.send("hello")
  //console.log("Users",users)
});
/* socketListener.on('disconnect', () => {
  socketListener.removeAllListeners();
}); */

server.listen(port, () =>
  console.log(`Server up and running on port ${port} !`)
);
module.exports = app;
