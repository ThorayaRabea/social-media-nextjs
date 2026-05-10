import axios from "axios";

import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { SignUpPayload, UserType, SignUpResponse, LoginPayload, LoginResponse, AuthState, ChangePasswordType } from "../app/_interfaces/home";


const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as
      | { error?: string; errors?: string[] | string }
      | undefined;

    if (Array.isArray(apiError?.errors)) {
      return apiError.errors.join(", ");
    }

    if (typeof apiError?.errors === "string") {
      return apiError.errors;
    }

    if (typeof apiError?.error === "string") {
      return apiError.error;
    }
  }

  return "Something went wrong. Please try again.";
};

const initialState: AuthState = {
  userToken: null,
  userData: null,
  isError: null,
  isLoading: false,
  myProfile: null,
  myPosts: null,
  followSuggestions: null,
  followUserAndUnfollow: null,
  userProfile: null,
};

const extractToken = (payload: LoginResponse): string | null => {
  const token = payload?.data?.token ?? payload?.token ?? null;
  return token && token !== "undefined" && token !== "null" ? token : null;
};

export const handleSignUp = createAsyncThunk<
  SignUpResponse,
  SignUpPayload,
  { rejectValue: string }
>(
  "authSlice/handleSignUp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        userData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const userLogin = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>(
  "authSlice/userLogin",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        userData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);



export const changePassword = createAsyncThunk(
  "authSlice/changePassword",
  async (userData: ChangePasswordType, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        '/api/change-password',
        userData,
        {
          headers: {
            token: localStorage.getItem("userToken")!,
          },

        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);


export const getMyProfile = createAsyncThunk(
  "authSlice/getMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://route-posts.routemisr.com/users/profile-data',
        {
          headers: {
            token: localStorage.getItem("userToken")!,
          },

        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);


export const getMyPosts = createAsyncThunk(
  "authSlice/getMyPosts",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/posts`,
        {
          headers: {
            token: localStorage.getItem("userToken")!,
          },

        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);



export const uploadProfilePhoto = createAsyncThunk(
  "authSlice/uploadProfilePhoto",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const response = await axios.put(
        'https://route-posts.routemisr.com/users/upload-photo',
        formData,
        {
          headers: {
            token: localStorage.getItem("userToken")!,
          },

        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getFollowSuggestions = createAsyncThunk(
  "authSlice/getFollowSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://route-posts.routemisr.com/users/suggestions?limit=10',
        {
          headers: {
            token: localStorage.getItem("userToken")!,
          },

        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const followUserAndUnfollow = createAsyncThunk(
  "authSlice/followUserAndUnfollow",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        {
          headers: {
            token: localStorage.getItem("userToken")!,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "authSlice/getUserProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/profile`,
        {
          headers: {
            token: localStorage.getItem("userToken")!,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);



const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserType | null>) => {
      state.userData = action.payload;
    },
    clearData: (state) => {
      state.userToken = null;
      state.userData = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.userToken = extractToken(action.payload);
      state.isLoading = false;
      state.isError = null;
    });
    builder.addCase(userLogin.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.isError = action.payload ?? "Login failed.";
      state.isLoading = false;
    });

    builder.addCase(handleSignUp.fulfilled, (state) => {
      state.isLoading = false;
      state.isError = null;
    });
    builder.addCase(handleSignUp.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(handleSignUp.rejected, (state, action) => {
      state.isError = action.payload ?? "Sign up failed.";
      state.isLoading = false;
    });

    builder.addCase(changePassword.fulfilled, (state, action) => {
      //  console.log("changePassword.fulfilled", action.payload);
      state.isLoading = false;
      state.isError = null;
      //  console.log("action.payload", action.payload);
      const newToken = action.payload?.data?.token;
      if (newToken) {
        state.userToken = newToken;
        localStorage.setItem('userToken', newToken);
      }
    });
    builder.addCase(changePassword.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      // console.log("changePassword.rejected", action.payload);
      state.isError = action.payload ?? "Change password failed.";
      state.isLoading = false;
    });

    builder.addCase(getMyProfile.fulfilled, (state, action) => {
      //console.log("getMyProfile.fulfilled", action.payload.data.user);
      state.isLoading = false;
      state.isError = null;
      //console.log("getMyProfile.payload", action.payload.data);
      state.myProfile = action.payload.data.user;
    });
    builder.addCase(getMyProfile.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(getMyProfile.rejected, (state, action) => {
      console.log("getMyProfile.rejected", action.payload);
      state.isError = action.payload ?? "Get my profile failed.";
      state.isLoading = false;
    });

    builder.addCase(uploadProfilePhoto.fulfilled, (state, action) => {
      // console.log("uploadProfilePhoto.fulfilled", action.payload);
      state.isLoading = false;
      state.isError = null;
      //console.log("action.payload", action.payload.data);
      state.myProfile.photo = action.payload.data.photo;
    });
    builder.addCase(uploadProfilePhoto.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(uploadProfilePhoto.rejected, (state, action) => {
      // console.log("uploadProfilePhoto.rejected", action.payload);
      state.isError = action.payload ?? "Upload profile photo failed.";
      state.isLoading = false;
    });


    builder.addCase(getMyPosts.fulfilled, (state, action) => {
      // console.log("getMyPosts.fulfilled", action.payload);
      state.isLoading = false;
      state.isError = null;
      // console.log("action.payload", action.payload.data.posts);
      state.myPosts = action.payload;
    });
    builder.addCase(getMyPosts.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(getMyPosts.rejected, (state, action) => {
      //  console.log("getMyPosts.rejected", action.payload);
      state.isError = action.payload ?? "Get my posts failed.";
      state.isLoading = false;
    });

    builder.addCase(getFollowSuggestions.fulfilled, (state, action) => {
      // console.log("getFollowSuggestions.fulfilled", action.payload);
      state.isLoading = false;
      state.isError = null;
      // console.log("action.payload", action.payload.data);
      state.followSuggestions = action.payload;
    });
    builder.addCase(getFollowSuggestions.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(getFollowSuggestions.rejected, (state, action) => {
      // console.log("getFollowSuggestions.rejected", action.payload);
      state.isError = action.payload ?? "Get follow suggestions failed.";
      state.isLoading = false;
    });

    builder.addCase(followUserAndUnfollow.fulfilled, (state, action) => {
      // console.log("followUserAndUnfollow.fulfilled", action.payload);
      state.isLoading = false;
      state.isError = null;
      state.followUserAndUnfollow = action.payload;
    });
    builder.addCase(followUserAndUnfollow.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(followUserAndUnfollow.rejected, (state, action) => {
      // console.log("followUserAndUnfollow.rejected", action.payload);
      state.isError = action.payload ?? "Follow and unfollow user failed.";
      state.isLoading = false;
    });

    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      //console.log("getUserProfile.fulfilled", action.payload);
      state.isLoading = false;
      state.isError = null;
      state.userProfile = action.payload;
    });
    builder.addCase(getUserProfile.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      //console.log("getUserProfile.rejected", action.payload);
      state.isError = action.payload ?? "Get user profile failed.";
      state.isLoading = false;
    });

  },
});

export const authReducers = authSlice.reducer;
export const { clearData, setUserData } = authSlice.actions;
