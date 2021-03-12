import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";
import authservice from "../services/AuthService";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import "./Login.css"
//import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
  },
  child: {
    width: "100%",
    marginLeft: "100px",
    marginTop: "40px",
  },
  usericon:{
    fontSize:"6rem",
    marginLeft:"150px",
    marginTop: "50px",
    color:"rgb(252, 250, 250)"
  }
  
}));
const Login = (props) => {
  const classes = useStyles();
  const [email, setEmail] = React.useState("zeniakiran50@gmail.com");
  const [password, setPassword] = React.useState("12345");
  return (
    <div id="bigdiv">
    <div className = "containerlogin" >
    <AccountCircleIcon className={classes.usericon}/>
      <div className={classes.child}>
      <input type="email" className="form-control" placeholder="Email" 
         className="tf" value ={email} onChange={(e) => {
          setEmail(e.target.value);
          }}></input>
        <br />
        <input type="password" className="form-control" placeholder="Password" 
         className="tf1" value ={password} onChange={(e) => {
            setPassword(e.target.value);
          }}></input>
        <br />
        
      </div>
      <Button id="btnlogin"
          variant="contained"
          
          onClick={(e) => {
            authservice
              .login(email, password)
              .then((data) => {
                console.log(" Data from login ",email);
                localStorage.setItem("userId",email)
                window.location.href = "/users";
              })
              .catch((err) => {
                console.log(err);
                //toast.error(err.response.data, {
                  //position: toast.POSITION.TOP_LEFT,
                //});
              });
          }}
        >
          Login
        </Button>
    </div>
    </div>
  );
};

export default Login;