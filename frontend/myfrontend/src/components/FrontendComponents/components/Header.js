import React, { Fragment,useContext } from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import { isAuthenticated, logout } from "../clientStorages/auth";
import {SocketContext} from '../../../context/SocketContext';
import { Grid ,Typography} from "@material-ui/core"
import { brown } from "@material-ui/core/colors";
const Header = ({ history,setLogin }) => {
  history = useHistory();
  const firstName= isAuthenticated().firstName;
  const lastName = isAuthenticated().lastName;
  const myId = isAuthenticated()._id;
  const myEmail = isAuthenticated().email
  const myProfileImg =isAuthenticated().profileImg;
  const {clientSocket} = useContext(SocketContext);
  const handleLogOut = (evt) => {
    logout(() => { 
      //setLogin(false)'
      localStorage.setItem('isLogin',false)
      if(clientSocket!==undefined){
        clientSocket.emit("removeuser",{id:clientSocket.id, name: myEmail})
        clientSocket.off("newMessage");
        clientSocket.off("newrequest");
        clientSocket.off("messageSend1");
      }
      else{
        console.log("no socket")
      }
      history.push("/login");
    });
  };

  const showNavbar = () => (
    <div>
      {/* <Grid item xs={1} sm={2} xm={5} md={4}></Grid>
      <Grid item xs={10} sm={8} xm={2} md={6}>
        
     <Typography variant="headline" 
         style={{ 
          marginTop:"1rem",
         position: "relative",
         fontSize:"2rem",
         color:brown[300],
          marginBottom:"1rem",
         fontFamily:"Brush Script MT, Brush Script Std, cursive"}}
          component="h1">
               <img className="loginImg" src={process.env.PUBLIC_URL + '/images/logo.png'} />TalkSee
          </Typography>
      
      </Grid> */}
      <nav id="nav" className="navbar navbar-expand-lg navbar-light mt-0">
         
        <div className="navbar-brand"> 
       <Link to={{ pathname: `/update-my-profile-setup/${myId}` }} style={{textDecoration:"none"}}>
        <img
          src= {myProfileImg}
          alt="Profile"
           
          style={{ height: "50px", width: "50px", borderRadius: "50%",display:"inline" }}
         onclick={()=>history.push('/update-my-profile-setup/'+myId)}
        /> </Link> 
        <span className="header_name">{firstName +" " + lastName}</span>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button> 
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul
            className="
              navbar-nav
              ml-auto
              mt-2
              mt-lg-0"
           
          >
            

            {isAuthenticated() && isAuthenticated().role === 0 && (
              <Fragment>
                <li className="nav-item">
                  <Link to="/notFound" className="nav-link ">
                     
                  </Link>
                </li>
                 <li className="nav-item" style ={{marginRight:"1rem"}}>
                  <Link to={{pathname: '/dashboard/'+myId}} className="nav-link">
                     <i className="fa fa-home" aria-hidden="true"></i>  Dashboard
                  </Link>
                </li>
                 <li className="nav-item">
                  <button
                    className="btn text-decoration-none btn-link   pl-0 nav-link"
                    style={{textDecoration:"none"}}
                    onClick={handleLogOut}
                  >
                    <i className="fas fa-sign-out-alt" aria-hidden="true"></i> Logout
                  </button> 
                </li>
              </Fragment>
            )}
             
            
          </ul>
        </div>
      </nav>
    </div>
  );
  return <header>{showNavbar()}</header>;
};

export default withRouter(Header);