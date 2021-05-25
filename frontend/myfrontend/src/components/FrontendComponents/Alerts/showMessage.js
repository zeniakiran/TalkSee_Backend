import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Grid } from "@material-ui/core";
import Toast from 'react-bootstrap/Toast'

export const showErrorMessage = (msg) => (
  <Grid container>
    <Grid item xs={3} md={4}></Grid>
    <Grid item xs={6} md={4}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {msg}
      </Alert>
    </Grid>
    <Grid item xs={3} md={4}></Grid>
  </Grid>
);
export const showSuccessMessage = (msg) => (
  <Grid container>
    <Grid item xs={3} md={4}></Grid>
    <Grid item xs={6} md={4}>
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        {msg}
      </Alert>
    </Grid>
    <Grid item xs={3} md={4}></Grid>
  </Grid>
);
export const showWarningMessage = (msg) => (
  <Grid container>
    <Grid item xs={3} md={4}></Grid>
    <Grid item xs={6} md={4}>
      <Alert severity="warning">
        <AlertTitle>Warning</AlertTitle>
        {msg}
      </Alert>
    </Grid>
    <Grid item xs={3} md={4}></Grid>
  </Grid>
);

export const showNotification =(count)=>{
  <Toast>
  <Toast.Header>
    <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
    <strong className="mr-auto">TalkSee</strong>
  </Toast.Header>
  <Toast.Body>Hey, You have {count} new messages!</Toast.Body>
</Toast>
}
