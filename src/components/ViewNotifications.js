import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const ViewNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications data from the server
    axios.get("http://localhost:4000/notifications").then((response) => {
      setNotifications(response.data);
      console.log(response.data);
    });
  }, []);

  const handleDeleteNotification = (id) => {
    axios.delete(`http://localhost:4000/notifications/${id}`).then((response) => {
      console.log("Notification deleted successfully");
      axios.get("http://localhost:4000/notifications").then((response) => {
        setNotifications(response.data);
      });
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      {notifications.length === 0 ? (
        <Typography variant="body1">No notifications found.</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notification, index) => (
                <TableRow key={index}>
                  <TableCell>{notification.title}</TableCell>
                  <TableCell>{notification.url}</TableCell>
                  <TableCell>{notification.date}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteNotification(notification._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ViewNotifications;
