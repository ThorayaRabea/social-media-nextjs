"use client";
import React, { useEffect } from "react";
import { Box, Typography, Container, Paper, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/store";
import { getAllNotification, makeNotificationRead, resetUnreadCount } from "../../lib/notificationSlice";
import NotificationItem from "../_components/navbar/NotificationItem";

export default function NotificationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { allNotification } = useSelector((state: RootState) => state.notification);

  useEffect(() => {
    dispatch(getAllNotification());
    dispatch(makeNotificationRead());
    dispatch(resetUnreadCount());
  }, [dispatch]);

  return (
    <Container maxWidth="md" sx={{ py: 4, display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: 600 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: "#1976d2" }}>
          Notifications
        </Typography>
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", bgcolor: "white", border: "1px solid #e0e0e0" }}>
          {allNotification ? (
            allNotification.length > 0 ? (
              allNotification.map((notification: any, index: number) => (
                <NotificationItem 
                  key={notification._id || index} 
                  notification={notification} 
                />
              ))
            ) : (
              <Box sx={{ p: 6, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  You have no notifications yet.
                </Typography>
              </Box>
            )
          ) : (
            <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={30} />
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
