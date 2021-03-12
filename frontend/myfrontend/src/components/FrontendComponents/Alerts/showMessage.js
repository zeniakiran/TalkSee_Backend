import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Grid } from "@material-ui/core";
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
