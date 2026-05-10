import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { comments, commnetsReplyResponse, CreatedCommentResponse, createReplyCommentResponseType, DeleteCommentResponse, LikeAndUnlikeCommentResponse, UpdateCommentResponse, } from "../app/_interfaces/home";
import axios from "axios";

const initialState: { allPostComments: comments[] | null, createComment: CreatedCommentResponse | null, commentsReply: commnetsReplyResponse | null, createReplyComment: createReplyCommentResponseType | null, updateComment: UpdateCommentResponse | null, deleteComment: DeleteCommentResponse | null, likeAndUnlikeComment: LikeAndUnlikeCommentResponse | null } = {
  allPostComments: null,
  createComment: null,
  commentsReply: null,
  createReplyComment: null,
  updateComment: null,
  deleteComment: null,
  likeAndUnlikeComment: null,
};

export const getAllComments = createAsyncThunk(
  "getAllComments/commentsRepliesSlice",
  async (id: string, { rejectWithValue }) => {
    return axios
      .get(
        `https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`,
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

export const createNewComment = createAsyncThunk(
  "createNewComment/commentsRepliesSlice",
  async (payload: { id: string, data: FormData }, { rejectWithValue }) => {
    return axios
      .post(
        `https://route-posts.routemisr.com/posts/${payload.id}/comments`,
        payload.data,
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

export const commentsReplies = createAsyncThunk(
  "commentsReplies/commentsRepliesSlice",
  async (payload: { postId: string, commentId: string, data: FormData }, { rejectWithValue }) => {
    return axios
      .post(
        `https://route-posts.routemisr.com/posts/${payload.postId}/comments/${payload.commentId}/replies`,
        payload.data,
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

export const getCommentReplies = createAsyncThunk(
  "getCommentReplies/commentsRepliesSlice",
  async (payload: { postId: string, commentId: string }, { rejectWithValue }) => {
    return axios
      .get(
        `https://route-posts.routemisr.com/posts/${payload.postId}/comments/${payload.commentId}/replies?page=1&limit=10`,
        {
          headers: { token: localStorage.getItem("userToken") },
        },
      )
      .then((res) => {
        console.log("getCommentReplies", res.data);
        return res.data;
      })
      .catch((err) => {
        return rejectWithValue(err.response?.data || "Error");
      });
  },
);

export const createReplyComment = createAsyncThunk(
  "createReplyComment/commentsRepliesSlice",
  async (payload: { postId: string, commentId: string, data: FormData }, { rejectWithValue }) => {
    return axios
      .post(
        `https://route-posts.routemisr.com/posts/${payload.postId}/comments/${payload.commentId}/replies`,
        payload.data,
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

export const updateComment = createAsyncThunk(
  "updateComment/commentsRepliesSlice",
  async (payload: { postId: string, commentId: string, data: FormData }, { rejectWithValue }) => {
    return axios
      .put(
        `https://route-posts.routemisr.com/posts/${payload.postId}/comments/${payload.commentId}`,
        payload.data,
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

export const likeAndUnlikeComment = createAsyncThunk(
  "likeAndUnlikeComment/commentsRepliesSlice",
  async (payload: { postId: string, commentId: string }, { rejectWithValue }) => {
    return axios
      .put(
        `https://route-posts.routemisr.com/posts/${payload.postId}/comments/${payload.commentId}/like`,
        {},
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

export const deleteComment = createAsyncThunk(
  "deleteComment/commentsRepliesSlice",
  async (payload: { postId: string, commentId: string }, { rejectWithValue }) => {
    return axios
      .delete(
        `https://route-posts.routemisr.com/posts/${payload.postId}/comments/${payload.commentId}`,
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


let CommentsSlice = createSlice({
  name: "CommentsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllComments.fulfilled, (state, action) => {
      state.allPostComments = action.payload.data.comments;

      console.log("action", action.payload.data.comments);
    });
    builder.addCase(getAllComments.rejected, (state, action) => {
      console.log("action", action.payload);
    });
    builder.addCase(createNewComment.fulfilled, (state, action) => {
      state.createComment = action.payload.data.comment;

      console.log("action", action.payload.data.comment);
    });
    builder.addCase(createNewComment.rejected, (state, action) => {
      console.log("action", action.payload);
    });
    builder.addCase(commentsReplies.fulfilled, (state, action) => {
      state.commentsReply = action.payload.data.reply;

      console.log("action", action.payload.data.reply);
    });
    builder.addCase(commentsReplies.rejected, (state, action) => {
      console.log("action", action.payload);
    });
    builder.addCase(createReplyComment.fulfilled, (state, action) => {
      state.createReplyComment = action.payload.data.reply;

      console.log("action", action.payload.data.reply);
    });
    builder.addCase(createReplyComment.rejected, (state, action) => {
      console.log("action", action.payload);
    });
    builder.addCase(updateComment.fulfilled, (state, action) => {
      state.updateComment = action.payload.data.comment;

      console.log("action", action.payload.data.comment);
    });
    builder.addCase(updateComment.rejected, (state, action) => {
      console.log("action", action.payload);
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.deleteComment = action.payload.data;

      console.log("action", action.payload.data);
    });
    builder.addCase(deleteComment.rejected, (state, action) => {
      console.log("action", action.payload);
    });
    builder.addCase(likeAndUnlikeComment.fulfilled, (state, action) => {
      state.likeAndUnlikeComment = action.payload.data.comment;

      console.log("action", action.payload.data.comment);
    });
    builder.addCase(likeAndUnlikeComment.rejected, (state, action) => {
      console.log("action", action.payload);
    });
  },
});

export let commentsReducers = CommentsSlice.reducer;
