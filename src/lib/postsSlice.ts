import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreatePostPayload, DeletePostResponse, LikeAndUnlikePostResponse, PostCreatedResponse, PostType, SharePostResponse, UpdatePostResponse } from "../app/_interfaces/home";
import axios from "axios";

const initialState: {
  allPosts: PostType[] | null;
  singlePost: PostType | null | undefined;
  postCreated: PostCreatedResponse | null;
  updatePost: UpdatePostResponse | null;
  deletePost: DeletePostResponse | null;
  likeAndUnlikePost: LikeAndUnlikePostResponse | null;
  sharePost: SharePostResponse | null;
} = {
  allPosts: null,
  singlePost: null,
  postCreated: null,
  updatePost: null,
  deletePost: null,
  likeAndUnlikePost: null,
  sharePost: null,
};

export const getAllPosts = createAsyncThunk(
  "getAllPosts/postsSlice",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`https://route-posts.routemisr.com/posts`, {
        headers: {
          token: token,
        },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  },
);

export const getSinglePost = createAsyncThunk(
  "getSinglePost/postsSlice",
  async (id: string, { rejectWithValue }) => {
    return axios
      .get(`https://route-posts.routemisr.com/posts/${id}`, {
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


export const createPost = createAsyncThunk(
  "createPost/postsSlice",
  async (payload: FormData, { rejectWithValue }) => {
    return axios
      .post(`https://route-posts.routemisr.com/posts`, payload, {
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

export const updatePost = createAsyncThunk(
  "updatePost/postsSlice",
  async (payload: { id: string, data: FormData }, { rejectWithValue }) => {
    const { id, data } = payload;
    return axios
      .put(`https://route-posts.routemisr.com/posts/${id}`, data, {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response?.data || "Error"));
  },
);

export const deletePost = createAsyncThunk(
  "deletePost/postsSlice",
  async (id: string, { rejectWithValue }) => {
    return axios
      .delete(`https://route-posts.routemisr.com/posts/${id}`, {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response?.data || "Error"));
  },
);

export const likeAndUnlikePost = createAsyncThunk(
  "likeAndUnlikePost/postsSlice",
  async (postId: string, { rejectWithValue }) => {
    return axios
      .put(`https://route-posts.routemisr.com/posts/${postId}/like`, null, {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response?.data || "Error"));
  },
);

export const sharePost = createAsyncThunk(
  "sharePost/postsSlice",
  async (payload: { postId: string, body: { body?: string } }, { rejectWithValue }) => {
    const { postId, body } = payload;
    return axios
      .post(`https://route-posts.routemisr.com/posts/${postId}/share`, body, {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response?.data || "Error"));
  },
);


let postsSlice = createSlice({
  name: "postsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPosts.fulfilled, (state, action) => {
      state.allPosts = action.payload.data.posts;

      // console.log("action", action.payload.data.posts);
    });
    builder.addCase(getAllPosts.rejected, (state, action) => {
      console.log("action", action.payload);
    });
    builder.addCase(getSinglePost.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.singlePost = action.payload.data.post;
    });
    builder.addCase(getSinglePost.rejected, (state, action) => {
      console.log("action", action.payload);
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      //console.log(action.payload);
      state.postCreated = action.payload;
    });
    builder.addCase(createPost.rejected, (state, action) => {
      // console.log("action", action.payload);
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.updatePost = action.payload;
    });
    builder.addCase(updatePost.rejected, (state, action) => {
      // console.log("action", action.payload);
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.deletePost = action.payload;
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      //console.log("action", action.payload);
    });
    builder.addCase(likeAndUnlikePost.fulfilled, (state, action) => {
      //console.log(action.payload);
      state.likeAndUnlikePost = action.payload;
    });
    builder.addCase(likeAndUnlikePost.rejected, (state, action) => {
      // console.log("action", action.payload);
    });
    builder.addCase(sharePost.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.sharePost = action.payload;
    });
    builder.addCase(sharePost.rejected, (state, action) => {
      // console.log("action", action.payload);
    });
  },
});

export let postReducers = postsSlice.reducer;
