import './App.css';
import { Route, Switch,BrowserRouter as Router,Redirect } from "react-router-dom";
import UserDashboard from "./components/FrontendComponents/components/userDashboard";
import SignUp from "./components/FrontendComponents/components/SignUp";
import LogIn from "./components/FrontendComponents/components/LogIn";
import Activate from "./components/FrontendComponents/components/Activate";
import notFound from "./components/FrontendComponents/components/notFound";
import ForgotPassword from "./components/FrontendComponents/components/forgotPassword";
import ResetPassword from "./components/FrontendComponents/components/resetPassword";
import ProfileSetup from "./components/FrontendComponents/components/profileSetup";
import AllContact from "./components/FrontendComponents/components/AllContacts";
import AllFriendRequest from "./components/FrontendComponents/components/AllFriendRequest";
import AllFriends from "./components/FrontendComponents/components/AllFriends";
import UpdateProfileSetup from "./components/FrontendComponents/components/updateProfileSetup";
import Chat from "./components/ChatComponents/Chat";
import MyChats from "./components/ChatComponents/AllChats";
import Users from "./components/ChatComponents/Users";
import {SocketProvider} from './context/SocketContext';
import {MyChatsProvider} from './context/MyChatsContext';
//import {SocketContext} from './context/SocketContext';
import { ToastContainer } from 'react-toastify';
import {useState, useEffect, useContext } from 'react';

const App =() =>{
  const [userId,setId] = useState()
  const [dId,setDid] = useState()
  //const {messageEvent} = useContext(SocketContext);
  
  /* useEffect(()=>{
    messageEvent()

  },[]) */
  return (
    <div className="App">
    <MyChatsProvider userId={userId}>
    <SocketProvider id={dId} >
    <ToastContainer/>
    <Router>
      <Switch>
            <Route path="/" exact><LogIn onIdSubmit={setId} setId={setDid}/></Route>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login"><LogIn onIdSubmit={setId}  setId={setDid}/></Route>
            <Route exact path="/user/activate/:token" component={Activate} />
            <Route exact path="/dashboard/:id" ><UserDashboard/></Route>
            <Route exact path="/reset-password/:token" component={ResetPassword} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/profile-setup/:token" component={ProfileSetup}/>
            <Route exact path="/update-my-profile-setup/:id" component={UpdateProfileSetup}/>
            <Route exact path="/notfound" component={notFound} />
            <Route exact path ="/all-contacts/:id" component= {AllContact}/>
            <Route exact path = "/all-friend-requests/:id" component ={AllFriendRequest}/>
            <Route exact path ="/all-my-friends/:id"><AllFriends /></Route>

            <Route path="/chat/:id" render={(props) => (
              <Chat {...props} key={props.location.key} />
            )} exact>
            </Route>
            <Route path="/mychats/:id" render={(props) => (
              <MyChats {...props} key={props.location.key}/>
            )} exact>
            </Route>
            <Redirect to="/notfound" />  
      </Switch>
      </Router>
    </SocketProvider>
    </MyChatsProvider>
    </div>
  );
}

export default App;
