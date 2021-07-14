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
import UserProfile from './components/FrontendComponents/components/userProfile';
const App =() =>{
  const [userId,setId] = useState()
  const [dId,setDid] = useState()
  const [isLogin,setLogin] = useState(false)
  const [users, setUsers] = useState([])
  const IP_URL = 'http://192.168.10.4:5000/';
  const IP = 'http://192.168.10.4:'
  localStorage.setItem('IP_URL',IP_URL)
  localStorage.setItem('IP',IP)
   /*const [msg, setMsg] = useState()
  //const {messageEvent} = useContext(SocketContext);
  useEffect(()=>{
    messageEvent()

  },[]) */


  return (
    <div className="App"> 
    <ChatContextProvider userId={userId} isLogin={isLogin} users={users}>
    <SocketProvider id={dId} email={userId} isLogin={isLogin}>
    <DeletePermissionProvider> 
  <ToastContainer/>
    <Router>
      <Switch>
            <Route path="/" exact><LogIn onIdSubmit={setId} setId={setDid} isLogin={isLogin} setLogin={setLogin}/></Route>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login"><LogIn onIdSubmit={setId}  setId={setDid} isLogin={isLogin} setLogin={setLogin}/></Route>
            <Route exact path="/user/activate/:token" component={Activate} />
            <UserRoute exact path="/dashboard/:id"><UserDashboard setLogin={setLogin} setUsers={setUsers} IP_URL={IP_URL}/></UserRoute>
            <Route exact path="/reset-password/:token" component={ResetPassword} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/profile-setup/:token" component={ProfileSetup}></Route>
            <UserRoute exact path ="/my-account-settings/:id" component ={Settings} />
            <UserRoute path="/update-my-profile-setup/:id" render={(props) => (
              <UpdateProfileSetup {...props} key={props.location.key}/>
            )} exact component={UpdateProfileSetup}>
            </UserRoute>
            <UserRoute path ="/all-contacts/:id" render={(props) => (
              <AllContact {...props} key={props.location.key}/>
            )} exact component={AllContact}>
            </UserRoute>
            <UserRoute path = "/all-friend-requests/:id"
            render={(props) => (
              <AllFriendRequest {...props} key={props.location.key}/>
            )} exact component={AllFriendRequest}>
            </UserRoute>
            <UserRoute path ="/all-my-friends/:id"
              render={(props) => (
                <AllFriends {...props} key={props.location.key}/>
              )} exact component={AllFriends}>
              </UserRoute>
             <UserRoute exact path ="/profile/:id/:id" component ={Profile} />
            <UserRoute exact path="/notfound" component={notFound} />
            <UserRoute path="/chat/:id" render={(props) => (
              <Chat {...props} key={props.location.key}/>
            )} exact component={Chat}>
            </UserRoute>
            <UserRoute path="/mychats/:id" render={(props) => (
              <MyChats {...props} key={props.location.key} users = {users}/>
            )} exact component={MyChats}>
            </UserRoute>
            <UserRoute exact path ="/my-contact-list/:id" component ={ContactManagement} />
             <UserRoute exact path ="/user-profile/:id" component ={UserProfile} />
            <Redirect to="/notfound" />  
      </Switch>
      </Router>
       </DeletePermissionProvider>  
    </SocketProvider>
    </ChatContextProvider>
  
    </div>
  );
}

export default App;
