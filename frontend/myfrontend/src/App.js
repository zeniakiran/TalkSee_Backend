import './App.css';
/* import { Route, Switch,BrowserRouter as Router,Redirect } from "react-router-dom";
import UserDashboard from "./components/FrontendComponents/components/userDashboard";
import SignUp from "./components/FrontendComponents/components/SignUp";
import LogIn from "./components/FrontendComponents/components/LogIn";
import Login from "./components/Login";
import Activate from "./components/FrontendComponents/components/Activate";
import notFound from "./components/FrontendComponents/components/notFound";
import resetPassword from "./components/FrontendComponents/components/resetPassword";
import Chat from "./components/ChatComponents/Chat";
import ChatPage from "./components/ChatComponents/ChatPage";
import Users from "./components/ChatComponents/Users";
import GroupChat from "./components/ChatComponents/GroupChat"; */
const App =() =>{
  return (
    <div className="App">
    hello
    {/* <Router>
      <Switch>
            <Route path="/" exact><Login/></Route>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={LogIn} />
            <Route exact path="/user/activate/:token" component={Activate} />
            <Route exact path="/dashboard" component={UserDashboard} />
            <Route exact path="/resetPasscode" component={resetPassword} />
            <Route exact path="/notfound" component={notFound} />
            <Route path="/chat/:id" render={(props) => (
              <Chat {...props} key={props.location.key} />
            )} exact>
            </Route>
            <Route path="/groupchat/:id" render={(props) => (
              <GroupChat {...props} key={props.location.key} />
            )} exact>
            </Route> 
            <Route path="/users" exact><Users/></Route>
            <Route path="/mychats" exact><ChatPage/></Route>
            {<Redirect to="/notfound" /> }     
      </Switch>
      </Router>*/ }
    </div>
  );
}

export default App;
