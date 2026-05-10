import { configureStore } from "@reduxjs/toolkit";
import { authReducers } from "./authSlice";
import { postReducers } from "./postsSlice";
import { commentsReducers } from "./commentsRepliesSlice";
import { notificationReducer } from "./notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducers,
    posts: postReducers,
    comments: commentsReducers,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
