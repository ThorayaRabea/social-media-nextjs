import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  NotificationResponse,
  UnreadNotificationResponse,
  Notification,
} from "../app/_interfaces/home";
import axios from "axios";

const initialState: {
  allNotification: Notification[] | null;
  unreadNotificationsCount: UnreadNotificationResponse | null;
  makeNotificationRead: UnreadNotificationResponse | null;
} = {
  allNotification: null,
  unreadNotificationsCount: null,
  makeNotificationRead: null,
};

export const getAllNotification = createAsyncThunk(
  "getAllNotification/notificationSlice",
  async (_, { rejectWithValue }) => {
    return axios
      .get(
        `https://route-posts.routemisr.com/notifications?page=1&limit=10`,
        {
          headers: { token: localStorage.getItem("userToken") },
        },
      )
      .then((res) => {
        console.log(res.data);

        return res.data;
      })
      .catch((err) => {
        return rejectWithValue(err.response?.data || "Error");
      });
  },
);

export const getUnreadNotificationCount = createAsyncThunk(
  "getUnreadNotificationCount/notificationSlice",
  async (_, { rejectWithValue }) => {
    // Check if user recently marked notifications as read (persists across reloads)
    const markedReadAt = localStorage.getItem("ag_marked_read");
    if (markedReadAt) {
      const elapsed = Date.now() - parseInt(markedReadAt);
      if (elapsed < 24 * 60 * 60 * 1000) {
        // Within 24h of marking as read → return 0 without hitting server
        return { success: true, message: "", data: { unreadCount: 0 } };
      } else {
        // Flag expired → clear it and fetch normally
        localStorage.removeItem("ag_marked_read");
      }
    }
    return axios
      .get(`https://route-posts.routemisr.com/notifications/unread-count`, {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch((err) => {
        return rejectWithValue(err.response?.data || "Error");
      });
  },
);

export const makeNotificationRead = createAsyncThunk(
  "makeNotificationRead/notificationSlice",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("userToken");
    return axios
      .patch(
        `https://route-posts.routemisr.com/notifications/read-all`,
        {},
        {
          headers: { token },
        },
      )
      .then((res) => {
        console.log("Read all response:", res.data);
        // Server confirmed → clear the local flag
        localStorage.removeItem("ag_marked_read");
        return res.data;
      })
      .catch((err) => {
        console.error("Read all error:", err.response?.status, err.response?.data);
        // Even if server fails, keep the local flag so badge stays 0
        return rejectWithValue(err.response?.data || "Error");
      });
  },
);

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState,
  reducers: {
    resetUnreadCount: (state) => {
      state.unreadNotificationsCount = {
        success: true,
        message: "",
        data: { unreadCount: 0 },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllNotification.fulfilled, (state, action) => {
      console.log("notifications", action.payload);
      state.allNotification = action.payload.data.notifications;
    });
    builder.addCase(getAllNotification.rejected, (state) => {
      state.allNotification = null;
    });
    builder.addCase(getUnreadNotificationCount.fulfilled, (state, action) => {
      console.log("unreadNotificationsCount", action.payload);
      state.unreadNotificationsCount = action.payload;
    });
    builder.addCase(getUnreadNotificationCount.rejected, (state, action) => {
      state.unreadNotificationsCount = null;
    });
    builder.addCase(makeNotificationRead.fulfilled, (state) => {
      // Zero out the badge count immediately
      state.unreadNotificationsCount = {
        success: true,
        message: "",
        data: { unreadCount: 0 },
      };
    });
    builder.addCase(makeNotificationRead.rejected, (state) => {
      // Still zero out to keep UI clean, server will sync next time
      state.unreadNotificationsCount = {
        success: true,
        message: "",
        data: { unreadCount: 0 },
      };
    });
  },
});

export const { resetUnreadCount } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
