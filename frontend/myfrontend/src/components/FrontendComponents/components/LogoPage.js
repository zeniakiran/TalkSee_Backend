import React from "react"
import { Grid ,Typography} from "@material-ui/core"
import { brown } from "@material-ui/core/colors";

const LogoPage = ({ name }) => {
return(
 <Grid container >
      <Grid item xs={1} sm={2} xm={5} md={4}></Grid>
      <Grid item xs={10} sm={8} xm={2} md={6}>
        
     <Typography variant="headline" 
         style={{ 
          marginTop:"1rem",
         position: "relative",
         fontSize:"5rem",
         color:brown[300],
          marginBottom:"1rem",
         fontFamily:"Brush Script MT, Brush Script Std, cursive"}}
          component="h1">
               <img className="loginImg" src={process.env.PUBLIC_URL + '/images/logo.png'} />{name}
          </Typography>
      
      </Grid>
      
    <Grid item  xs={1} sm={2} xm={5} md={2}></Grid>
    </Grid>
    )}
export default LogoPage;