import React,{useEffect,useContext} from 'react';
import { Link, withRouter, useHistory } from "react-router-dom";
import {SocketContext} from '../../../context/SocketContext';
import { isAuthenticated, logout } from "../clientStorages/auth";
 

const SideBar = ({ history }) => {
     history = useHistory();
    
      const myId = isAuthenticated()._id;
      const myProfileImg =isAuthenticated().profileImg;
    
const firstName= isAuthenticated().firstName;
  const lastName = isAuthenticated().lastName;
  const {clientSocket,setSocket,messageEvent,roomJoin,friendReq,getRequest,frndcounter,msgCounter} = useContext(SocketContext);
     const handleLogOut = (evt) => {
    logout(() => {
      history.push("/login");
    });
  };
  useEffect(()=>{
    getRequest()
  },[frndcounter])
     useEffect (()=>{
    roomJoin(myId)
  },[]);
  
    return (<div class="wrapper">
    <div class="sidebar">
         <div id ="profile_div">
        <img
          src= {myProfileImg}
          alt="Profile"
          style={{ height: "90px", width: "90px", borderRadius: "50%" ,cursor:"pointer" }}
         onClick={()=>history.push('/update-my-profile-setup/'+myId)}
        /> 
        </div>  
         <h4>{firstName +" "+lastName}</h4>
        <ul>
          
            <li>
               
                 {msgCounter >= 1 ?
                 <Link to={{pathname: '/mychats/'+myId}} style={{textDecoration:"none"}}  >
                     <i class="fas fa-comments"  ><span className="friendCounter">{msgCounter}</span></i> My Chats
                  </Link>
                  :<Link to={{pathname: '/mychats/'+myId}} style={{textDecoration:"none"}}  >
                     <i class="fas fa-comments"  ></i> My Chats
                  </Link>}
                 
            </li>
            <li> 
                <Link to={{pathname: `/update-my-profile-setup/${myId}`}} style={{textDecoration:"none"}} >
                     <i class="fas fa-user-cog"  ></i> Profile Setting
                  </Link>
            </li>
            <li>
              {frndcounter >=1   ?
               <Link to={{pathname: '/my-contact-list/'+myId}} style={{textDecoration:"none"}}  >
                     <i class="fas fa-address-book"  ><span className="friendCounter">{frndcounter}</span></i> Contacts
                  </Link>:
                   
                <Link to={{pathname: '/my-contact-list/'+myId}} style={{textDecoration:"none"}}  >
                     <i class="fas fa-address-book"></i> Contacts
                  </Link>}
            </li>
            
            
        </ul> 
        <div class="social_media">
        <button
                    className="btn text-decoration-none btn-link"
                    onClick={handleLogOut}
                  >
                    <i className="fas fa-sign-out-alt" ></i> Logout
                  </button> 
          
      </div>
    </div>
   {/*  <div class="main_content">
        <div class="header">Welcome!! Have a nice day.</div>  
        <div class="info">
           
                </div>
    </div>  */}
</div>  );
}
 
export default  withRouter(SideBar);