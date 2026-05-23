"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Container,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { PhotoCamera, LockReset, Article, People } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { store } from "../../lib/store";
import { useFormik } from "formik";
import UserAvatar from "../_components/userAvatar/UserAvatar";
import FollowingUserCard from "../_components/followingUserCard/FollowingUserCard";
import Post from "../_components/post/post";
import {
  changePassword,
  followUserAndUnfollow,
  getFollowSuggestions,
  getMyPosts,
  getMyProfile,
  uploadProfilePhoto,
  getUserProfile,
} from "../../lib/authSlice";
import toast from "react-hot-toast";

export default function Profile() {
  const auth = useSelector(
    (state: ReturnType<typeof store.getState>) => state.auth,
  );
  const { myProfile, myPosts, followSuggestions, userProfile } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.auth,
  );

  const [tabIndex, setTabIndex] = useState(0);

  const dispatch = useDispatch<typeof store.dispatch>();

  const formik = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
    },
    onSubmit: (values) => {
      dispatch(changePassword(values))
        .unwrap()
        .then((response) => {
          if (response.success === true) {
            toast.success("Password changed successfully");
            formik.resetForm();
          } else {
            toast.success(response.message || "Password changed successfully");
          }
        })
        .catch((err) => {
          toast.error(err?.message || "Failed to change password");
        });
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      dispatch(uploadProfilePhoto(event.target.files[0]))
        .unwrap()
        .then((response) => {
          if (response.success === true) {
            toast.success("Profile photo uploaded successfully");
          } else {
            toast.success(
              response.message || "Profile photo uploaded successfully",
            );
          }
        })
        .catch((err) => {
          toast.error(err?.message || "Failed to upload profile photo");
        });
    }
  };

  function handleFollowAndUnfollow(userId: string) {
    dispatch(followUserAndUnfollow(userId))
      .unwrap()
      .then((response) => {
        if (response.success === true) {
          toast.success("Action successful");
          dispatch(getFollowSuggestions());
          if (myProfile?._id) {
            dispatch(getUserProfile(myProfile._id));
            dispatch(getMyProfile()); // 👈 بيحدث الـ followers/following count
          }
        } else {
          toast.success(response.message || "Action successful");
        }
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to follow and unfollow");
      });
  }

  useEffect(() => {
    dispatch(getMyProfile());
  }, [myProfile?.photo]);

  useEffect(() => {
    if (myProfile?._id) {
      dispatch(getMyPosts(myProfile._id));
      dispatch(getUserProfile(myProfile._id));
    }
  }, [myProfile?._id]);

  useEffect(() => {
    dispatch(getFollowSuggestions());
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Cover Photo & Avatar Section */}
      <Card elevation={3} sx={{ borderRadius: 3, overflow: "hidden", mb: 4 }}>
        <Box
          sx={{
            height: 200,
            background: "linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)",
            position: "relative",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: -8,
            pb: 4,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={myProfile?.photo || ""}
              alt={myProfile?.name || "User"}
              sx={{
                width: 150,
                height: 150,
                border: "4px solid white",
                boxShadow: 2,
                bgcolor: "primary.main",
                fontSize: "4rem",
              }}
            >
              {myProfile?.name ? myProfile.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="icon-button-file"
              type="file"
              onChange={handlePhotoUpload}
            />
            <label htmlFor="icon-button-file">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                  boxShadow: 1,
                }}
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
            {myProfile?.name || "User Name"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {myProfile?.username || "Username"}
          </Typography>
          <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold">
                {myProfile?.followersCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Followers
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold">
                {myProfile?.followingCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Following
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            icon={<Article />}
            label="My Posts"
            iconPosition="start"
            sx={{ fontWeight: "bold" }}
          />
          <Tab
            icon={<People />}
            label="Following"
            iconPosition="start"
            sx={{ fontWeight: "bold" }}
          />
          <Tab
            icon={<LockReset />}
            label="Security"
            iconPosition="start"
            sx={{ fontWeight: "bold" }}
          />
        </Tabs>
      </Box>

      {/* My Posts Tab */}
      {tabIndex === 0 && (
        <Box>
          {/* Follow Suggestions */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h6"
              fontWeight="800"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              ✨ People You May Know
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                pb: 2,
                px: 1,
                "&::-webkit-scrollbar": { height: 6 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#dcdcdc",
                  borderRadius: 4,
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
              }}
            >
              {followSuggestions?.data?.suggestions.map((suggestion) => (
                <Card
                  key={suggestion._id}
                  variant="outlined"
                  sx={{
                    minWidth: 150,
                    maxWidth: 150,
                    textAlign: "center",
                    p: 2,
                    borderRadius: 4,
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "all 0.2s ease-in-out",
                    borderColor: "divider",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "primary.main",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <UserAvatar
                    userId={suggestion._id}
                    userName={suggestion.name}
                    userPhoto={suggestion.photo}
                    sx={{
                      width: 70,
                      height: 70,
                      mb: 1.5,
                      border: "2px solid",
                      borderColor: "primary.light",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    fontWeight="700"
                    noWrap
                    sx={{ width: "100%" }}
                  >
                    {suggestion.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    noWrap
                    sx={{ width: "100%", mb: 1 }}
                  >
                    @{suggestion.username}
                  </Typography>
                  <Box
                    sx={{
                      mt: "auto",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="600"
                    >
                      {suggestion.followersCount} Followers
                    </Typography>
                    {suggestion.mutualFollowersCount > 0 && (
                      <Typography
                        variant="caption"
                        color="primary"
                        fontWeight="600"
                      >
                        {suggestion.mutualFollowersCount} Mutual
                      </Typography>
                    )}
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={() => handleFollowAndUnfollow(suggestion._id)}
                    sx={{
                      width: "100%",
                      borderRadius: 20,
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Follow
                  </Button>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Posts Feed */}
          <Typography
            variant="h6"
            fontWeight="800"
            sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
          >
            📝 Recent Activity
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            {myPosts?.data?.posts.map((post: any) => (
              <Box key={post._id} sx={{ width: "100%", maxWidth: 600 }}>
                <Post postObject={post} allComments={false} />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Following Tab */}
      {tabIndex === 1 && (
        <Box>
          <Typography
            variant="h6"
            fontWeight="800"
            sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
          >
            👥 People You Follow
          </Typography>

          {!userProfile?.data?.user?.following ||
          userProfile.data.user.following.length === 0 ? (
            <Card
              variant="outlined"
              sx={{
                borderRadius: 4,
                p: 4,
                textAlign: "center",
                borderColor: "divider",
                bgcolor: "#fafafa",
              }}
            >
              <Typography
                variant="h2"
                color="primary.main"
                fontWeight="900"
                sx={{ mb: 1 }}
              >
                0
              </Typography>
              <Typography
                variant="h6"
                color="text.primary"
                fontWeight="700"
                sx={{ mb: 1 }}
              >
                Following
              </Typography>
              <Typography variant="body2" color="text.secondary">
                أنت لا تتابع أي شخص حالياً.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {userProfile.data.user.following.map((followedUser) => (
                <Grid item xs={12} sm={6} md={4} key={followedUser._id}>
                  <FollowingUserCard
                    followedUser={followedUser}
                    onUnfollow={handleFollowAndUnfollow}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Security Tab */}
      {tabIndex === 2 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              width: "100%",
              maxWidth: 500,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  gap: 1,
                }}
              >
                <LockReset color="primary" fontSize="large" />
                <Typography variant="h6" fontWeight="bold">
                  Change Password
                </Typography>
              </Box>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  variant="outlined"
                  margin="normal"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  variant="outlined"
                  margin="normal"
                  id="newPassword"
                  name="newPassword"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={auth.isLoading}
                  sx={{ mt: 4, py: 1.5, borderRadius: 2, fontWeight: "bold" }}
                >
                  {auth.isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
}
