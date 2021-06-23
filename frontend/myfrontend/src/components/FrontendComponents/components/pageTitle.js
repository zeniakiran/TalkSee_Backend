import React from "react";
import {Grid,Typography} from "@material-ui/core";
 import {brown} from '@material-ui/core/colors';
const PageTitle = ({name}) => {
  return <div>
     <Grid container >
      <Grid item xs={1} sm={2} xm={5} md={4}></Grid>
      <Grid item xs={10} sm={8} xm={2} md={4}>
           <Typography variant="headline" 
         style={{ 
          marginTop:"0.5rem",
         textAlign:"center",
         fontSize:"4rem",
         color:brown[300],
         fontFamily:"Brush Script MT, Brush Script Std, cursive"}}
          component="h1">{name}</Typography>
        <hr style ={{marginBottom:"1rem"}}/>  
      </Grid>
      
    <Grid item  xs={1} sm={2} xm={5} md={4}></Grid>
    </Grid>
 
    </div>;
};

export default PageTitle;