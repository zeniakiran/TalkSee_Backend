import React,{useState} from "react";
import accountService from "../../../services/accountService";
import {Grid,Button, Typography, InputAdornment,TextField,Paper} from "@material-ui/core";
import { grey, cyan,indigo} from '@material-ui/core/colors';
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import LinearBuffer from "../Alerts/ProgressBar";
import AlertBar from "../Alerts/AlertBar";
import EmailIcon from '@material-ui/icons/Email';
import PageTitle from "./pageTitle";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
 
const ForgotPassword = () => {
      
 const [values, setValues] = useState({
    email: "",
    errorMessage: "",
    successMsg:"",
    loading: false,
  });
  const { email, successMsg, errorMessage, loading } = values;

 const handleTextChange = (evt) => {
    setValues({
      ...values,
      [evt.target.name]: evt.target.value,
      errorMessage: "",
      successMsg: "",
    });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    if (isEmpty(email)   ) {
      setValues({ ...values, errorMessage: "Field is required" });
    } else if (!isEmail(email)) {
      setValues({ ...values, errorMessage: "Invalid Email  syntax" });
    } else {
      const { email} = values;
      setValues({ ...values, loading: true });
        accountService.forgotPassword({email})
        .then((response) => {
          setValues({
            ...values,
            email: "",
            errorMessage: false,
            successMsg: response.successMessage,
            loading: false,
          });
        })
        .catch((err) => {
          setValues({
            ...values,
            loading: false,
            email: "",
            successMsg:false,
            errorMessage: err.response.data.errorMessage,
          });
        });
    }
  };
 
const ResetPageForm = () =>(
<div>
    <Grid container >
          <Grid item xs={1} sm={3} md={4}></Grid>
          <Grid item xs={10} sm ={6} md={4} >
        <Paper className="Login-container" style={{padding: '30px 50px'}} >
          <Button  
            className= "loginbtn"
            href="/login"
            color="primary"
           style={{marginBottom:"2rem" ,paddingLeft:"0rem",color:indigo[800]  }}
          >
            <ArrowBackIcon style={{fontWeight:"bold",marginRight:"0.3rem"}}/> Go Back
          </Button>
              <TextField
            label= {
              <div> 
             <Typography variant="headline" style={{fontWeight:"bold",fontStyle:"italic" }}> Email Address </Typography>
             <Typography variant="headline" style={{color:"red"  }}>*</Typography>
                  </div>
            }
            id="filled-start-adornment1"
             variant="outlined"
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
              <Button
             style={{ color: grey[50],
              backgroundColor:cyan[600],
              fontWeight:"bold", 
              borderRadius:"12rem" , 
              marginTop: "1.5rem",
              padding: "0.5rem",
               }}
            className= "loginbtn"
            variant="contained"
             fullWidth
            onClick={onSubmit}
          >
           Submit  
          </Button>
                </Paper>
          </Grid>
          <Grid item xs={1} sm={3} md={4}></Grid>
    </Grid>
</div>
)
return (<div className="login_div">
    
    {loading && <LinearBuffer />}
     <PageTitle  className="title" name= {"Forgot Password"}/>
      {errorMessage && (
        <AlertBar type="error" message={errorMessage} autoClose={4000} />
      )}
      {successMsg && (
        <AlertBar type="success" message={successMsg} autoClose={4000} />
      )}
      {ResetPageForm()}
    </div>
    )
};

export default ForgotPassword;