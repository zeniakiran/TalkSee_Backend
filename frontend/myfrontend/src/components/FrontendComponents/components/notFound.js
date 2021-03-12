import React from "react";
import {Grid} from  "@material-ui/core";
const notFound = () => {
  return <div style={{marginTop:"10rem"}}>
    <Grid container > 
   <Grid item xs={1} sm={3} md={4}></Grid>
        <Grid item xs={10} sm={6} md={4}>
    <h1  > Error 404</h1>
    <h5 style ={{marginLeft:"2rem"}}>Page Not Found</h5>
    </Grid>
     <Grid item xs={1} sm={3} md={4}></Grid>
    </Grid>
    </div>;
};

export default notFound;
