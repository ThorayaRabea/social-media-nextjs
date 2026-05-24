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
  rawServerUnreadCount: number;
} = {
  allNotification: null,
  unreadNotificationsCount: null,
  makeNotificationRead: null,
  rawServerUnreadCount: 0,
};

export const getAllNotification = createAsyncThunk(
  "getAllNotification/notificationSlice",
  async (_, { rejectWithValue }) => {
    return axios
      .get(`https://route-posts.routemisr.com/notifications?page=1&limit=10`, {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response?.data || "Error"));
  },
);

export const getUnreadNotificationCount = createAsyncThunk(
  "getUnreadNotificationCount/notificationSlice",
  async (_, { rejectWithValue }) => {
    return axios
      .get(`https://route-posts.routemisr.com/notifications/unread-count`, {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response?.data || "Error"));
  },
);

export const makeNotificationRead = createAsyncThunk(
  "makeNotificationRead/notificationSlice",
  async (_, { rejectWithValue }) => {
    return axios
      .patch(
        `/api/notifications/read-all`,
        {},
        { headers: { token: localStorage.getItem("userToken") } },
      )
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response?.data || "Error"));
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
    // Get All Notifications
    builder.addCase(getAllNotification.fulfilled, (state, action) => {
      state.allNotification = action.payload.data.notifications;
    });
    builder.addCase(getAllNotification.rejected, (state) => {
      state.allNotification = null;
    });

    // Get Unread Count
    builder.addCase(getUnreadNotificationCount.fulfilled, (state, action) => {
      const serverCount = action.payload?.data?.unreadCount || 0;
      state.rawServerUnreadCount = serverCount;
      state.unreadNotificationsCount = action.payload;
    });
    builder.addCase(getUnreadNotificationCount.rejected, (state) => {
      state.unreadNotificationsCount = null;
    });

    // Make Notification Read
    builder.addCase(makeNotificationRead.fulfilled, (state) => {
      state.unreadNotificationsCount = {
        success: true,
        message: "",
        data: { unreadCount: 0 },
      };
    });
    builder.addCase(makeNotificationRead.rejected, (state) => {
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
