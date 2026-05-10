import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NotificationResponse, UnreadNotificationResponse, Notification } from "../app/_interfaces/home";
import axios from "axios";

const initialState: { allNotification: Notification[] | null, unreadNotificationsCount: UnreadNotificationResponse | null } = {
  allNotification: null,
  unreadNotificationsCount: null,
}

export const getAllNotification = createAsyncThunk(
  "getAllNotification/notificationSlice",
  async (_, { rejectWithValue }) => {
    return axios
      .get(
        `https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=10`,
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
    return axios
      .get(
        `https://route-posts.routemisr.com/notifications/unread-count`,
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



const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllNotification.fulfilled, (state, action) => {
      console.log("notifications", action.payload);
      state.allNotification = action.payload.data.notifications;
      state.unreadNotificationsCount = action.payload;

    });
    builder.addCase(getAllNotification.rejected, (state, action) => {
      state.allNotification = null;
      state.unreadNotificationsCount = null;
    });
    builder.addCase(getUnreadNotificationCount.fulfilled, (state, action) => {
      state.unreadNotificationsCount = action.payload;
    });
    builder.addCase(getUnreadNotificationCount.rejected, (state, action) => {
      state.unreadNotificationsCount = null;
    });
  }

});

export const notificationReducer = notificationSlice.reducer;