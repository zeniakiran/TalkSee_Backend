import React, { useState, useEffect ,useContext} from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from 'clsx';
import {
  TextField,
  Grid,
  Button,
  FormControl,
  Input,
  InputAdornment,
  Typography,
  Paper,
  IconButton,
  InputLabel
} from "@material-ui/core";
import { grey, cyan} from '@material-ui/core/colors';
import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import AlertBar from "../Alerts/AlertBar";
import LinearBuffer from "../Alerts/ProgressBar";
import { login } from "../api/auth";
import PageTitle from "./pageTitle";
//import { toast } from "react-toastify";

import {SocketContext} from '../../../context/SocketContext';
//import { v4 as uuidv4 } from 'uuid';

import { authentication, isAuthenticated } from "../clientStorages/auth";
 
const useStyles = makeStyles((theme) => ({
   textField: {
    marginTop: theme.spacing(2),
  },
  margin:{
    marginBottom: theme.spacing(2),
    
  }
}));
const LogIn = ({onIdSubmit,setId}) => {
  const classes = useStyles();
  let history = useHistory();
  const {messageEvent} = useContext(SocketContext);
  useEffect(() => {
    if (isAuthenticated() && isAuthenticated().role === 1)
      history.push("/admin/dashboard");
    else if (isAuthenticated() && isAuthenticated().role === 0)
      history.push("/user/dashboard");
     
      
  }, [history]);
  window.onload= ()=>{
    //messageEvent()
    console.log("in load")
  }

  useEffect(()=>{
    //messageEvent()
  },[])
  const [values, setValues] = useState({
    email: "",
    password: "",
    errorMessage: "",
    showPassword: false,
    loading: false,
  });
  const { email, password, errorMessage, loading } = values;
  const handleChange = (prop) => (event) => {
    setValues({
      ...values,
      [prop]: event.target.value,
      errorMessage: "",
    });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
   const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleTextChange = (evt) => {
    setValues({
      ...values,
      [evt.target.name]: evt.target.value,
      errorMessage: "",
    });
  };
  const Register = (event) => {
    event.preventDefault();
    if (isEmpty(email) || isEmpty(password)) {
      setValues({ ...values, errorMessage: "Both fields are required" });
    } else if (!isEmail(email)) {
      setValues({ ...values, errorMessage: "Invalid Email" });
    } else {
      setValues({ ...values, loading: true });
      const { email, password } = values;
      const data = { email, password };

      login(data)
        .then((response) => {
          authentication(response.data.token, response.data.user);
          console.log(response)
          if (isAuthenticated() && isAuthenticated().role === 1)
            history.push("/dashboard/"+isAuthenticated()._id);
          else {
        history.push("/dashboard/"+isAuthenticated()._id);};
          setValues({ ...values, loading: false });
          console.log(isAuthenticated()._id)
          setId(isAuthenticated()._id)
        })
        .catch((err) => {
          setValues({
            ...values,
            password:"",
            loading: false,
            errorMessage: err.response.data.errorMessage,
          });
        });
        //var id 
        onIdSubmit(email)
        
        console.log("email",email)
        //generateUU(uuidv4())
    }
  };
  
  const LogInForm = () => (
    <div className="Login-container">
      <Grid container>
        <Grid item xs={1} sm={3} md={4}></Grid>
        <Grid item xs={10} sm={6} md={4}>
           <Paper style={{padding: '30px 50px'}} > 
            <Grid container style={{textAlign:"center"}}>
          <Grid item xs={6} >
            <Link className="active-header"  to="/login">Sign In</Link>      
          </Grid>
          <Grid item xs={6}>
            <Link className="header" to="/signup">Sign Up</Link>
          </Grid>

        </Grid>
           <TextField
           className={classes.textField}
           style={{marginTop:"2rem"}}
            label={
              <div> 
             <Typography variant="headline" style={{fontWeight:"bold",fontStyle:"italic"  }}> Email Address </Typography>
             <Typography variant="headline" style={{color:"red"}}>*</Typography>
                  </div>
                  }
            id="email-field"
            name="email"
            value={values.email}
            fullWidth
            onChange={handleTextChange}
             InputProps={{
          startAdornment: (
            <InputAdornment position="start">
             <EmailIcon style={{ color: grey[600] }}/>
            </InputAdornment>
          ),
         }}
          />
          
         <FormControl className={clsx(classes.margin, classes.textField)} fullWidth>
         <InputLabel htmlFor="standard-adornment-password"> 
             <Typography variant="headline" style={{fontWeight:"bold",fontStyle:"italic"  }}> Password</Typography>
             <Typography variant="headline" style={{color:"red",marginLeft:"0.4rem"}}>*</Typography>
         </InputLabel>
                    <Input
            id="standard-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            name="password"
            value={values.password}
            onChange={handleChange('password')}
              
          startAdornment= {
            <InputAdornment position="start">
             <VpnKeyIcon style={{ color: grey[600] }}/>
            </InputAdornment>
          }
        
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
         </FormControl>
            <Button
             style={{ color: grey[50],
              backgroundColor:cyan[600],
              fontWeight:"bold", 
              borderRadius:"1rem" , 
              marginBottom: "1.2rem",
              padding: "0.5rem",
               }}
            className= "loginbtn"
            variant="contained"
            fullWidth
            onClick={Register}
          >
            Sign in
          </Button>
           <Link to="/forgot-password" style={{textDecoration:"none",marginLeft:"1rem auto"}}  >Forgot Password?</Link>
   </Paper>
         </Grid>
        <Grid item xs={1} sm={3} md={4}></Grid>
      </Grid>
    </div>
  );
  return (
    <div>
      {loading && <LinearBuffer />}
     
             <PageTitle name= {"TalkSee"}/>
      {LogInForm()}
      
     
      {errorMessage && (
        <AlertBar type="error" message={errorMessage} autoClose={4000} />
      )}
       
    </div>
  );
};

export default LogIn;