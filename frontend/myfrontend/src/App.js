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
import {SocketProvider} from './context/SocketContext';
import {MyChatsProvider} from './context/MyChatsContext';
import {ChatContextProvider} from './context/ChatContext';
import 'bootstrap/dist/css/bootstrap.min.css';
//import Notification from './components/FrontendComponents/Alerts/Notification'
//import Users from "./components/ChatComponents/Users";
//import {SocketContext} from './context/SocketContext';
import { ToastContainer } from 'react-toastify';
import {useState} from 'react';
import Profile from './components/FrontendComponents/components/Profile';
import DeletePermissionProvider from './context/DeletePermissionContext';
import UserRoute from './components/FrontendComponents/components/userRoutes';
import ContactManagement from './components/FrontendComponents/components/ContactManagement';
import Settings from './components/FrontendComponents/components/Settings';

const App =() =>{
  const [userId,setId] = useState()
  const [dId,setDid] = useState()
   /*const [msg, setMsg] = useState()
  //const {messageEvent} = useContext(SocketContext);
  useEffect(()=>{
    messageEvent()

  },[]) */
  return (
    <div className="App"> 
    <MyChatsProvider userId={userId} >
    <ChatContextProvider userId={userId} >
    <SocketProvider id={dId} >
    <DeletePermissionProvider> 
    <ToastContainer/>
    <Router>
      <Switch>
            <Route path="/" exact><LogIn onIdSubmit={setId} setId={setDid}/></Route>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login"><LogIn onIdSubmit={setId}  setId={setDid}/></Route>
            <Route exact path="/user/activate/:token" component={Activate} />
            <UserRoute exact path="/dashboard/:id"  component ={UserDashboard} />
            <Route exact path="/reset-password/:token" component={ResetPassword} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/profile-setup/:token" component={ProfileSetup}/>
            <UserRoute exact path="/update-my-profile-setup/:id" component={UpdateProfileSetup}/>
            <UserRoute exact path ="/all-contacts/:id" component= {AllContact}/>
            <UserRoute exact path = "/all-friend-requests/:id" component ={AllFriendRequest}/>
            <UserRoute exact path ="/all-my-friends/:id" component ={AllFriends} />
             <UserRoute exact path ="/profile/:id/:id" component ={Profile} />
            <UserRoute exact path ="/my-contact-list/:id" component ={ContactManagement} />
            <UserRoute exact path ="/my-account-settings/:id" component ={Settings} />
            <Route exact path="/notfound" component={notFound} />
            <UserRoute path="/chat/:id" render={(props) => (
              <Chat {...props} key={props.location.key} />
            )} exact component={Chat}>
            </UserRoute>
            <UserRoute path="/mychats/:id" render={(props) => (
              <MyChats {...props} key={props.location.key}/>
            )} exact component={MyChats}>
            </UserRoute>
            <Redirect to="/notfound" />  
      </Switch>
      </Router>
       </DeletePermissionProvider>  
    </SocketProvider>
    </ChatContextProvider>
    </MyChatsProvider>
  
    </div>
  );
}

export default App;
