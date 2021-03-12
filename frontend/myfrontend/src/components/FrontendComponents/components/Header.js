import React, { Fragment, useContext } from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import { isAuthenticated, logout } from "../clientStorages/auth";
 

const Header = ({ history }) => {
  history = useHistory();

  const handleLogOut = (evt) => {
    logout(() => {
      history.push("/login");
    });
  };

  const showNavbar = () => (
    <div>
      <nav id="nav" className="navbar navbar-expand-lg navbar-light mt-0">

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
            style={{ padding: "0.6rem" }}
          >
            

            {isAuthenticated() && isAuthenticated().role === 0 && (
              <Fragment>
                <li className="nav-item">
                  <Link to="/notFound" className="nav-link ">
                     
                  </Link>
                </li>
                <li className="nav-item ">
                  <Link to="/"  className="nav-link " >
                     
                  </Link>
                </li>
                 <li className="nav-item">
                  <button
                    className="btn text-decoration-none btn-link   pl-0"
                    style={{textDecoration:"none"}}
                    onClick={handleLogOut}
                  >
                    <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
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
