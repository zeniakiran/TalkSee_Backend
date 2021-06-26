import React, { Fragment } from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import { isAuthenticated, logout } from "../clientStorages/auth";
const Header = ({ history }) => {
  history = useHistory();
  const firstName= isAuthenticated().firstName;
  const lastName = isAuthenticated().lastName;
  const myId = isAuthenticated()._id;
const myProfileImg =isAuthenticated().profileImg;
  const handleLogOut = (evt) => {
    logout(() => {
      history.push("/login");
    });
  };

  const showNavbar = () => (
    <div>
      <nav id="nav" className="navbar navbar-expand-lg navbar-light mt-0">
         
        <div className="navbar-brand"> 
       <Link to={{ pathname: `/update-my-profile-setup/${myId}` }} style={{textDecoration:"none"}}>
        <img
          src= {myProfileImg}
          alt="Profile"
          style={{ height: "50px", width: "50px", borderRadius: "50%",display:"inline"}}
         onclick={()=>history.push('/update-my-profile-setup/'+myId)}
        /> </Link> 
        <span className="header_name">{firstName +" " + lastName}</span></div>
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
                     <i className="fa fa-home" aria-hidden="true"> </i>  Dashboard
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