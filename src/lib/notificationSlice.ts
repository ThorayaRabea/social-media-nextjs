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
      .get(
        `https://route-posts.routemisr.com/notifications?page=1&limit=10`,
        {
          headers: { token: localStorage.getItem("userToken") },
        },
      )
      .then((res) => {
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
      .get(`https://route-posts.routemisr.com/notifications/unread-count`, {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return rejectWithValue(err.response?.data || "Error");
      });
  },
);

export const forceRefreshUnreadCount = createAsyncThunk(
  "forceRefreshUnreadCount/notificationSlice",
  async (_, { rejectWithValue }) => {
    return axios
      .get(`https://route-posts.routemisr.com/notifications/unread-count`, {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => {
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
        return res.data;
      })
      .catch((err) => {
        console.error("Read all error:", err.response?.status, err.response?.data);
        return rejectWithValue(err.response?.data || "Error");
      });
  },
);

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState,
  reducers: {
    resetUnreadCount: (state) => {
      // Save the current raw server count as the "cleared" baseline
      if (state.rawServerUnreadCount > 0) {
        localStorage.setItem("cleared_notification_count", state.rawServerUnreadCount.toString());
      }
      
      state.unreadNotificationsCount = {
        success: true,
        message: "",
        data: { unreadCount: 0 },
      };
    },
    clearMarkedRead: (state) => {
      localStorage.removeItem("cleared_notification_count");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllNotification.fulfilled, (state, action) => {
      state.allNotification = action.payload.data.notifications;
    });
    builder.addCase(getAllNotification.rejected, (state) => {
      state.allNotification = null;
    });
    
    const handleUnreadCount = (state: any, action: any) => {
      const serverCount = action.payload?.data?.unreadCount || 0;
      state.rawServerUnreadCount = serverCount;
      
      const clearedCountStr = localStorage.getItem("cleared_notification_count");
      const clearedCount = clearedCountStr ? parseInt(clearedCountStr) : 0;
      
      let finalCount = serverCount;
      
      if (serverCount > 0 && clearedCount > 0) {
        if (serverCount >= clearedCount) {
          // Subtract the ones we already "cleared" locally
          finalCount = serverCount - clearedCount;
        } else {
          // Server count dropped below our cleared count (e.g. backend finally reset it)
          // So our baseline is no longer valid
          localStorage.removeItem("cleared_notification_count");
        }
      } else if (serverCount === 0 && clearedCount > 0) {
        // Server reset it, remove our local hack
        localStorage.removeItem("cleared_notification_count");
      }
      
      state.unreadNotificationsCount = {
        ...action.payload,
        data: { ...action.payload?.data, unreadCount: finalCount },
      };
    };

    builder.addCase(getUnreadNotificationCount.fulfilled, handleUnreadCount);
    builder.addCase(getUnreadNotificationCount.rejected, (state) => {
      state.unreadNotificationsCount = null;
    });
    builder.addCase(forceRefreshUnreadCount.fulfilled, handleUnreadCount);
    
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

export const { resetUnreadCount, clearMarkedRead } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;

