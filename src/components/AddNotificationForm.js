import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  CssBaseline,
  FormControl,
  FormHelperText,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { Link } from "react-router-dom";

const AddNotificationForm = () => {
  const initialFormValues = {
    title: "",
    url: "",
    date: "",
    error: "",
  };

  const [values, setValues] = useState(initialFormValues);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!values.title || !values.url || !values.date) {
      setValues({ ...values, error: "Title, URL, and date are required" });
      return;
    }
    setValues({ ...values, error: "" });

    axios
      .post("http://localhost:4000/add_notification", {
        title: values.title,
        url: values.url,
        date: values.date,
      })
      .then((response) => {
        setSnackbarSeverity("success");
        setSnackbarMessage("Notification added successfully");
        setSnackbarOpen(true);
        setValues(initialFormValues); // Reset form values
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setSnackbarSeverity("error");
          setSnackbarMessage("Notification already exists");
        } else {
          console.error("Error adding notification:", error);
        }
        setSnackbarOpen(true);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5" align="center">
          Add Notification
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                autoComplete="title"
                value={values.title}
                onChange={handleChange("title")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="url"
                label="URL"
                name="url"
                autoComplete="url"
                value={values.url}
                onChange={handleChange("url")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="date"
                label="Date"
                type="date"
                name="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={values.date}
                onChange={handleChange("date")}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Notification
          </Button>
          <FormControl error fullWidth>
            <FormHelperText>{values.error}</FormHelperText>
          </FormControl>
        </form>
        <Button
          component={Link}
          to="/view-notifications"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          View Notifications
        </Button>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default AddNotificationForm;
