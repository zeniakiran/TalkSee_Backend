import React, { useState, useEffect } from "react";
import clsx from 'clsx';
import {
  TextField,
  Grid,
  Button,
  InputAdornment,
  InputLabel,
  FormControl,
  Input,
  IconButton,
  Typography,
  FormLabel,
  FormControlLabel,
  Radio,
  Paper,
  RadioGroup,
} from "@material-ui/core";
import LogoPage from "./LogoPage"
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { Link, useHistory } from "react-router-dom";
import { grey, cyan} from '@material-ui/core/colors';
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import equals from "validator/lib/equals";
import LinearBuffer from "../Alerts/ProgressBar";
import AlertBar from "../Alerts/AlertBar";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { signup } from "../api/auth";
import PageTitle from "./pageTitle";
import { isAuthenticated } from "../clientStorages/auth";
 

const useStyles = makeStyles((theme) => ({
   
  textfield: {
     marginTop: theme.spacing(2.5),
  },
  margin:{
         marginTop: theme.spacing(2.5),
  }
   
}));
const SignUp = () => {
  const classes = useStyles();
  let history = useHistory();
  useEffect(() => {
    if (isAuthenticated() && isAuthenticated().role === 1)
      history.push("/dashboard");
    else if (isAuthenticated() && isAuthenticated().role === 0)
      history.push("/dashboard");
  }, [history]);
  const [values, setValues] = useState({
    firstName: "",
    lastName:"",
    email: "",
    gender:"",
    password: "",
    confirmPassword: "",
    errorMessage: "",
    successMsg: "",
    showPassword: false,
    showPassword1: false,
    loading: false,
  });
  const {
    firstName,
    lastName,
    email,
    gender,
    password,
    confirmPassword,
    errorMessage,
    successMsg,
    loading,
  } = values;
  const handleChange = (prop) => (event) => {
    setValues({
      ...values,
      [prop]: event.target.value,
      errorMessage: "",
      successMsg: "",
    });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showPassword1: !values.showPassword1 });
  };
   
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleTextChange = (evt) => {
    setValues({
      ...values,
      [evt.target.name]: evt.target.value,
      errorMessage: "",
      successMsg: "",
    });
  };
  const Register = (event) => {
    event.preventDefault();
    if (
      isEmpty(firstName) ||
      isEmpty(lastName) ||
      isEmpty(email) ||
      isEmpty(password) ||
      isEmpty(confirmPassword)||isEmpty(gender)) 
      {
      setValues({ ...values, errorMessage: "All fields are required" });
      } else if (!isEmail(email)) {
      setValues({ ...values, errorMessage: "Invalid Email" });
      } else if (!equals(password, confirmPassword)) {
      setValues({ ...values, errorMessage: "Password do not matched" });
      } else {
      const { firstName,lastName, email, password ,gender} = values;
      const data = { firstName,lastName,  email, password ,gender};
      setValues({ ...values, loading: true });
      signup(data)
        .then((response) => {
          setValues({
            ...values,
            firstName: "",
            lastName:"",
            email: "",
            password: "",
            confirmPassword: "",
            gender:"",
            errorMessage: false,
            successMsg: response.data.successMessage,
            loading: false,
          });
        })
        .catch((err) => {
          console.log(err);
          setValues({
            ...values,
            loading: false,
            errorMessage: err.response.data.errorMessage,
          });
        });
    }
  };
    
  const SignUpForm = () => (
    <div className="signup-container">
      <Grid container>
        <Grid item xs={1} sm={3} md={4}></Grid>
        <Grid item xs={10} sm ={6} md={4}>
        <Paper  className="Login-container" style={{padding: '30px 30px'}} >
              <Grid container style={{textAlign:"center"}}>
          <Grid item xs={6} >
            <Link className="header"  to="/login">Sign In</Link>      
          </Grid>
          <Grid item xs={6}>
            <Link className="active-header" to="/signup">Sign Up</Link>
          </Grid>

        </Grid>
          <TextField
            className={classes.textfield}
            id="filled-start-adornment"
             
            value={values.firstName}
            label= {
              <div> 
             <Typography variant="headline" style={{fontWeight:"bold",fontStyle:"italic"  }}> firstName </Typography>
             <Typography variant="headline" style={{color:"red"}}>*</Typography>
                  </div>
            }
            name="firstName"
            
            fullWidth
            onChange={handleTextChange}
             InputProps={{
          startAdornment: (
            <InputAdornment position="start">
             <AccountCircleIcon style={{ color: grey[600] }}/>
            </InputAdornment>
          ),
        }}
          />
           <TextField
            className={classes.textfield}
            id="filled-start-adornment1"
            value={values.lastName}
            label= {
              <div> 
             <Typography variant="headline" style={{fontWeight:"bold",fontStyle:"italic"  }}> lastName </Typography>
             <Typography variant="headline" style={{color:"red"}}>*</Typography>
                  </div>
            }
            name="lastName"
            
            fullWidth
            onChange={handleTextChange}
             InputProps={{
          startAdornment: (
            <InputAdornment position="start">
             <AccountCircleIcon style={{ color: grey[600] }}/>
            </InputAdornment>
          ),
        }}
          />
          <TextField
            className={classes.textfield}
            label= {
              <div> 
             <Typography variant="headline" style={{fontWeight:"bold",fontStyle:"italic" }}> Email Address </Typography>
             <Typography variant="headline" style={{color:"red"  }}>*</Typography>
                  </div>
            }
            id="filled-start-adornment1"
            
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
             <Typography variant="headline" style={{color:"red",marginLeft:"0.4rem" }}>*</Typography>
         </InputLabel>
                    <Input
            id="standard-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            name="password"
            value={values.password}
            onChange={handleChange('password')}
              
          startAdornment= {
            <InputAdornment position="start">
             <LockIcon style={{ color: grey[600] }}/>
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
         
          <FormControl className={clsx(classes.margin, classes.textField)} fullWidth>
                 <InputLabel htmlFor="standard-adornment-password"> 
             <Typography variant="headline" style={{fontWeight:"bold",fontStyle:"italic"  }}> Confirm Password</Typography>
             <Typography variant="headline" style={{color:"red",marginLeft:"0.4rem" }}>*</Typography>
         </InputLabel>
           <Input
            id="standard-adornment-confirmPassword"
            type={values.showPassword1 ? 'text' : 'password'}
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange('confirmPassword')}
             startAdornment= {
            <InputAdornment position="start">
             <VpnKeyIcon style={{ color: grey[600] }}/>
            </InputAdornment>
          }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword1 ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
    <FormControl component="fieldset" className={classes.margin}>
      <FormLabel component="legend">  
            <Typography variant="headline" style={{fontWeight:"bold",fontStyle:"italic", fontSize:"0.9rem",marginLeft:"0.4rem"  }}> Gender</Typography>
             <Typography variant="headline" style={{color:"red",marginLeft:"0.4rem" }}>*</Typography>
             </FormLabel>
      <RadioGroup aria-label="gender" name="gender1" style={{display:'initial',marginLeft:"4rem"}} value={values.gender} onChange={handleChange('gender')}>
        <FormControlLabel value="female" control={<Radio style={{color:cyan[900]}} />} label="Female" />
        <FormControlLabel value="male" control={<Radio style={{color:cyan[900]}}/>} label="Male" />
        <FormControlLabel value="other" control={<Radio style={{color:cyan[900]}} />} label="Other" />
      </RadioGroup>
    </FormControl>
         <Button
             style={{ color: grey[50],
              backgroundColor:cyan[600],
              fontWeight:"bold", 
              borderRadius:"1rem" , 
             
              padding: "0.5rem",}}
            className= "loginbtn"
            variant="contained"
            fullWidth
            onClick={Register}
          >
            Next
          </Button>
          </Paper>
        </Grid>
        <Grid item xs={1} sm={3} md={4}></Grid>
      </Grid>
    </div>
  );
  return (
    <div className="signup_div">
      {loading && <LinearBuffer />}
      {errorMessage && (
        <AlertBar type="error" message={errorMessage} autoClose={4000} />
      )}
      {successMsg && (
        <AlertBar type="success" message={successMsg} autoClose={4000} />
      )}
       <LogoPage className="title" name= {"TalkSee"} logo={true}/>
      {SignUpForm()}
    </div>
  );
};

export default SignUp;