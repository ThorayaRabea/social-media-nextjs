"use client";
import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TextsmsIcon from "@mui/icons-material/Textsms";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import { PostType } from "../../_interfaces/home";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Avatar } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { updatePost, deletePost, getAllPosts, likeAndUnlikePost, sharePost } from "../../../lib/postsSlice";
import { getMyPosts } from "../../../lib/authSlice";
import toast from "react-hot-toast";
import { store } from "../../../lib/store";
import CommentItem from "../commentItem/commentItem";
import UserAvatar from "../userAvatar/UserAvatar";
import ShareModal from "../shareModal/shareModal";
import { createNewComment, getAllComments } from "../../../lib/commentsRepliesSlice";


export default function Post({
  postObject,
  allComments = false,
}: {
  postObject: PostType;
  allComments: boolean;
}) {
  const router = useRouter();
  const topComment = postObject?.topComment;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [updateBody, setUpdateBody] = useState(postObject.body || "");
  const [updateImage, setUpdateImage] = useState<File | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(postObject.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  React.useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(
          decoded?.user?._id || decoded?.user || decoded?.id || decoded?._id || decoded?.userId
        );
      } catch (e) {
        console.error("Error decoding token", e);
      }
    }
  }, []);

  React.useEffect(() => {
    if (currentUserId && postObject.likes) {
      const userHasLiked = postObject.likes.some(
        (like: any) => like === currentUserId || like._id === currentUserId
      );
      setIsLiked(userHasLiked);
    }
  }, [currentUserId, postObject.likes]);

  React.useEffect(() => {
    setLikesCount(postObject.likesCount || 0);
  }, [postObject.likesCount]);

  const dispatch = useDispatch<typeof store.dispatch>();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateClick = () => {
    setOpenUpdateModal(true);
    handleMenuClose();
  };

  const handleUpdateClose = () => {
    setOpenUpdateModal(false);
    setUpdateImage(null);
    setUpdateBody(postObject.body || "");
  };

  const handleUpdateSubmit = async () => {
    if (!updateBody.trim()) return;

    const formData = new FormData();
    formData.append("body", updateBody);
    if (updateImage) {
      formData.append("image", updateImage);
    }

    await dispatch(updatePost({ id: postObject._id, data: formData }));
    const token = localStorage.getItem("userToken");
    if (token) {
      dispatch(getAllPosts(token));
      if (currentUserId) dispatch(getMyPosts(currentUserId));
    }
    handleUpdateClose();
  };

  const handleDelete = async () => {
    await dispatch(deletePost(postObject._id));
    const token = localStorage.getItem("userToken");
    if (token) {
      dispatch(getAllPosts(token));
      if (currentUserId) dispatch(getMyPosts(currentUserId));
    }
    handleMenuClose();
  };

  const handleLikeToggle = async () => {
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      await dispatch(likeAndUnlikePost(postObject._id)).unwrap();
      const token = localStorage.getItem("userToken");
      if (token) {
        dispatch(getAllPosts(token));
        if (currentUserId) dispatch(getMyPosts(currentUserId));
      }
    } catch (e) {
      setIsLiked(wasLiked);
      setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  };

  const handleShare = async (body: string) => {
    try {
      await dispatch(sharePost({
        postId: postObject._id,
        body: body ? { body } : {}
      })).unwrap();
      const token = localStorage.getItem("userToken");
      if (token) {
        dispatch(getAllPosts(token));
        if (currentUserId) dispatch(getMyPosts(currentUserId));
      }
      toast.success("Post shared successfully!");
    } catch (e: any) {
      toast.error(typeof e === "string" ? e : "Failed to share post.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;
    setIsSubmittingComment(true);

    const formData = new FormData();
    formData.append("content", commentContent);

    try {
      await dispatch(createNewComment({ id: postObject._id, data: formData })).unwrap();
      setCommentContent("");

      const token = localStorage.getItem("userToken");
      if (token) {
        if (allComments) {
          dispatch(getAllComments(postObject._id));
        } else {
          dispatch(getAllPosts(token));
          if (currentUserId) dispatch(getMyPosts(currentUserId));
        }
      }
      toast.success("Comment added successfully!");
    } catch (e: any) {
      toast.error(typeof e === "string" ? e : "Failed to add comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const staticIconButtonSx = {
    color: "text.secondary",
    "&:hover": {
      backgroundColor: "transparent",
      color: "text.secondary",
    },
  };

  const { allPostComments } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.comments,
  );

  function handelNavigateToUserProfile(userId: string) {
    router.push(`/user/${userId}`);
  }

  function handelNavigateToSinglePost(postId: string) {
    router.push(`/singlePost/${postId}`);
  }



  const isMyPost = currentUserId === postObject.user._id;

  return (
    <Card
      sx={{
        width: "100%",
        mt: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        overflow: "hidden",
      }}
    >
      <CardHeader
        sx={{ pb: 1.5 }}
        avatar={
          <UserAvatar
            userId={postObject.user._id}
            userName={postObject.user.name}
            userPhoto={postObject.user.photo}
            sx={{
              bgcolor: red[500],
              width: 46,
              height: 46,
              border: "2px solid white",
              boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
            }}
          />
        }
        action={
          isMyPost ? (
            <>
              <IconButton sx={staticIconButtonSx} disableRipple onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleUpdateClick}>Update</MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                  Delete
                </MenuItem>
              </Menu>
            </>
          ) : null
        }
        title={postObject?.user?.name}
        subheader={postObject?.createdAt}
        titleTypographyProps={{
          sx: { cursor: "pointer", width: "fit-content", fontWeight: 700 },
          onClick: () => handelNavigateToUserProfile(postObject.user._id),
        }}
        subheaderTypographyProps={{
          sx: { fontSize: 12, color: "text.secondary" },
        }}
      />

      <CardContent sx={{ pt: 0, pb: 2 }}>
        <Typography
          variant="body1"
          sx={{
            color: "text.primary",
            lineHeight: 1.8,
            fontSize: 15,
            whiteSpace: "pre-wrap",
          }}
        >
          {postObject?.body}
        </Typography>

        {/* Shared Post Preview */}
        {postObject.isShare && postObject.sharedPost && (
          <Card
            variant="outlined"
            sx={{ mt: 2, borderRadius: 3, borderColor: "divider", bgcolor: "grey.50" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Avatar
                  src={postObject.sharedPost.user.photo}
                  sx={{ width: 32, height: 32 }}
                >
                  {postObject.sharedPost.user.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography fontWeight="bold" fontSize={13}>
                    {postObject.sharedPost.user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    @{postObject.sharedPost.user.username}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2">{postObject.sharedPost.body}</Typography>

              {postObject.sharedPost.user.photo && (
                <Box
                  component="img"
                  src={postObject.sharedPost.user.photo}
                  alt="shared post"
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    mt: 1,
                    maxHeight: 300,
                    objectFit: "cover",
                  }}
                />
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>

      {/* Update Modal */}
      <Dialog open={openUpdateModal} onClose={handleUpdateClose} fullWidth maxWidth="sm">
        <DialogTitle>Update Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="What's on your mind?"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={updateBody}
            onChange={(e) => setUpdateBody(e.target.value)}
          />
          <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id={`update-icon-button-file-${postObject._id}`}
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUpdateImage(e.target.files[0]);
                }
              }}
            />
            <label htmlFor={`update-icon-button-file-${postObject._id}`}>
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            {updateImage ? (
              <span style={{ marginLeft: 8 }}>{updateImage.name}</span>
            ) : postObject?.image ? (
              <span style={{ marginLeft: 8, color: "gray" }}>
                Current image will be kept if no new image is selected
              </span>
            ) : null}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose}>Cancel</Button>
          <Button onClick={handleUpdateSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Modal */}
      <ShareModal
        open={openShareModal}
        onClose={() => setOpenShareModal(false)}
        onShare={handleShare}
        post={postObject}
      />

      {postObject?.image && (
        <Box sx={{ px: 2, pb: 1 }}>
          <CardMedia
            component="img"
            image={postObject.image}
            alt="Post image"
            sx={{
              borderRadius: 3,
              width: "100%",
              maxHeight: 420,
              objectFit: "contain",
              backgroundColor: "#f4f6f8",
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        </Box>
      )}

      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-around",
          py: 1.2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            sx={{
              ...staticIconButtonSx,
              color: isLiked ? "primary.main" : "text.secondary",
            }}
            disableRipple
            onClick={handleLikeToggle}
          >
            <ThumbUpIcon />
          </IconButton>
          {likesCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {likesCount}
            </Typography>
          )}
        </Box>

        <IconButton
          sx={{
            ...staticIconButtonSx,
            color: showCommentInput ? "primary.main" : "text.secondary",
          }}
          disableRipple
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          <TextsmsIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            sx={staticIconButtonSx}
            disableRipple
            onClick={() => setOpenShareModal(true)}
          >
            <ShareIcon />
          </IconButton>
          {postObject?.sharesCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {postObject.sharesCount}
            </Typography>
          )}
        </Box>
      </CardActions>

      {/* Comment Input Section */}
      {showCommentInput && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "grey.50",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            variant="outlined"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {

                handleCommentSubmit();
              }
            }}
            disabled={isSubmittingComment}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 5,
                bgcolor: "background.paper",
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleCommentSubmit}
            disabled={!commentContent.trim() || isSubmittingComment}
            sx={{
              bgcolor: "primary.light",
              color: "white",
              "&:hover": { bgcolor: "primary.main" },
              width: 40,
              height: 40
            }}
          >
            {isSubmittingComment ? <CircularProgress size={20} color="inherit" /> : <SendIcon fontSize="small" />}
          </IconButton>
        </Box>
      )}

      {postObject?.commentsCount > 0 && (
        <Box
          sx={{
            px: 2,
            pb: 2,
            pt: 0.5,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "grey.50",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 600,
              mt: 1.5,
              display: "block",
              cursor: "pointer",
              "&:hover": { color: "primary.main" },
            }}
            onClick={() => handelNavigateToSinglePost(postObject._id)}
          >
            {postObject?.commentsCount}{" "}
            {postObject?.commentsCount === 1 ? "comment" : "comments"}
          </Typography>

          {allComments && allPostComments
            ? allPostComments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))
            : topComment && (
              <CommentItem comment={topComment as any} isTopComment={true} />
            )}
        </Box>
      )}
    </Card>
  );
}