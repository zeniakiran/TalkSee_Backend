import './App.css';
import { Route, Switch,BrowserRouter as Router,Redirect } from "react-router-dom";
import UserDashboard from "./components/FrontendComponents/components/userDashboard";
import SignUp from "./components/FrontendComponents/components/SignUp";
import LogIn from "./components/FrontendComponents/components/LogIn";
import Login from "./components/Login";
import Activate from "./components/FrontendComponents/components/Activate";
import notFound from "./components/FrontendComponents/components/notFound";
import ForgotPassword from "./components/FrontendComponents/components/forgotPassword";
import ResetPassword from "./components/FrontendComponents/components/resetPassword";
import ProfileSetup from "./components/FrontendComponents/components/profileSetup";
import Chat from "./components/ChatComponents/Chat";
import ChatPage from "./components/ChatComponents/ChatPage";
import Users from "./components/ChatComponents/Users";
import GroupChat from "./components/ChatComponents/GroupChat";
import io from "socket.io-client";
import { useEffect,useRef,useState } from 'react';
const App =() =>{
  let clientSocket = useRef(null);
  /* let childComp ="none"
  const childCompHandler = (child) =>{
      childComp=child
      console.log("child",child)
  } */
  useEffect(()=>{
    clientSocket.current = io("http://127.0.0.1:5000");
    clientSocket.current.on('connect' , () => {
      console.log(clientSocket.current.id);
    });
    //console.log("fghbnj",clientSocket.current.id)
    /* clientSocket.current.on("newMessage", (payload) => {
      alert(payload.notification)
      console.log("Message:",payload)
    }) */
    //clientSocket.current.emit("adduser",)
    //return () => clientSocket.close()
    //console.log("id:",localStorage.getItem("userId"))
  
  },[])
  const myFunc = (data) =>{
    alert("New Message: ",data)
  }
  return (
    <div className="App">
    <Router>
      <Switch>
            <Route path="/" exact><LogIn/></Route>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={LogIn} />
            <Route exact path="/user/activate/:token" component={Activate} />
            <Route exact path="/dashboard" component={UserDashboard} />
            <Route exact path="/reset-password/:token" component={ResetPassword} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/profile-setup/:token" component={ProfileSetup}/>
            <Route exact path="/notfound" component={notFound} />
            
            <Route path="/chat/:id" render={(props) => (
              <Chat {...props} key={props.location.key} clientSocket={clientSocket} appFunc={myFunc}/>
            )} exact>
            </Route>
            <Route path="/groupchat/:id" render={(props) => (
              <GroupChat {...props} key={props.location.key} />
            )} exact>
            </Route> 
            <Route path="/users" exact ><Users clientSocket={clientSocket}/></Route>
            <Route path="/mychats" exact ><ChatPage /></Route>
            {<Redirect to="/notfound" /> }     
      </Switch>
      </Router>
    </div>
  );
}

export default App;
