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
import AllContact from "./components/FrontendComponents/components/AllContacts";
import AllFriendRequest from "./components/FrontendComponents/components/AllFriendRequest";
import AllFriends from "./components/FrontendComponents/components/AllFriends";
import Chat from "./components/ChatComponents/Chat";
import MyChats from "./components/ChatComponents/MyChats";
import Users from "./components/ChatComponents/Users";
//import GroupChat from "./components/ChatComponents/GroupChat";
import io from "socket.io-client";
import {SocketProvider} from './context/SocketContext';
import {MyChatsProvider} from './context/MyChatsContext';
import { useEffect,useRef,useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
const App =() =>{
  
  const [userId,setId] = useState()
  return (
    <div className="App">
    <MyChatsProvider userId={userId}>
    <SocketProvider >
    <Router>
      <Switch>
            <Route path="/" exact><LogIn onIdSubmit={setId} /></Route>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login"><LogIn onIdSubmit={setId} /></Route>
            <Route exact path="/user/activate/:token" component={Activate} />
            <Route exact path="/dashboard" component={UserDashboard} />
            <Route exact path="/reset-password/:token" component={ResetPassword} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/profile-setup/:token" component={ProfileSetup}/>
            <Route exact path="/notfound" component={notFound} />
            <Route exact path ="/all-contacts" component= {AllContact}/>
            <Route exact path = "/all-friend-requests" component ={AllFriendRequest}/>
            <Route exact path ="/all-my-friends" component= {AllFriends}/>
            <Route path="/chat/:id" render={(props) => (
              <Chat {...props} key={props.location.key} clientSocket={SocketProvider.clientSocket} />
            )} exact>
            </Route>
            {/* <Route path="/groupchat/:id" render={(props) => (
              <GroupChat {...props} key={props.location.key} />
            )} exact>
            </Route>  */}
            <Route path="/users" exact ><Users clientSocket={SocketProvider.clientSocket}/></Route>
            <Route path="/mychats" exact ><MyChats /></Route>
            {<Redirect to="/notfound" /> }     
      </Switch>
      </Router>
    </SocketProvider>
    </MyChatsProvider>
    </div>
  );
}

export default App;
