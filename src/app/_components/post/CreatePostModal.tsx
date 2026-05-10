"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useDispatch } from "react-redux";
import { createPost, getAllPosts } from "../../../lib/postsSlice";
import { store } from "../../../lib/store";
import { usePathname } from "next/navigation";
import { getMyPosts } from "../../../lib/authSlice";

export default function CreatePostModal() {
  const [open, setOpen] = useState(false);// is modal open or not
  const [body, setBody] = useState("");// post body
  const [image, setImage] = useState<File | null>(null);// post image optional

  const dispatch = useDispatch<typeof store.dispatch>();

  const handleOpen = () => setOpen(true);//open modal

  const handleClose = () => {
    setOpen(false);
    setBody("");
    setImage(null);
  };//close modal and clear data

  const pathname = usePathname();

  const refreshData = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    if (pathname === "/") {
      dispatch(getAllPosts(token));
    } else if (pathname === "/profile") {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const currentUserId =
          decoded?.user?._id || decoded?.user || decoded?.id || decoded?._id || decoded?.userId;
        if (currentUserId) {
          dispatch(getMyPosts(currentUserId));
        }
      } catch (e) {
        console.error("Error decoding token", e);
      }
    }
  };

  const handleSubmit = async () => {
    if (!body.trim()) return;

    const formData = new FormData();
    formData.append("body", body);
    if (image) {
      formData.append("image", image);
    }

    await dispatch(createPost(formData));
    refreshData();
    handleClose();
  };

  return (
    <>
      <Tooltip title="Add Post" arrow placement="bottom" sx={{ fontSize: '1.1rem' }}>
        <IconButton size="large" color="inherit" onClick={handleOpen} sx={{ transition: "all 0.2s", "&:hover": { color: "#1976d2", transform: "scale(1.1)" } }}>
          <AddIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create a New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="What's on your mind?"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="create-post-file"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="create-post-file">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            {image && <span style={{ marginLeft: 8 }}>{image.name}</span>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
