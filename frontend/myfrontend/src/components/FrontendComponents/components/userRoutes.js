import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../clientStorages/auth";

const UserRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() && isAuthenticated().role === 0 ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default UserRoute;