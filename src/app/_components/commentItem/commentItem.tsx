"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
  Button,
  Collapse,
  Menu,
  MenuItem,
} from "@mui/material";
import { red } from "@mui/material/colors";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UserAvatar from "../userAvatar/UserAvatar";
import { CommentItemProps, CreatedCommentType } from "../../_interfaces/home";
import { useDispatch } from "react-redux";
import { store } from "../../../lib/store";
import {
  createReplyComment,
  getCommentReplies,
  updateComment,
  deleteComment,
  likeAndUnlikeComment,
} from "../../../lib/commentsRepliesSlice";
import toast from "react-hot-toast";

export default function CommentItem({
  comment,
  isTopComment = false,
  isReply = false,
  onDeleteReply,
}: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CreatedCommentType[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [localRepliesCount, setLocalRepliesCount] = useState(
    comment.repliesCount || 0,
  );

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(comment.content);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(
    (comment as any).likesCount || 0,
  );

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(
          decoded?.user?._id ||
            decoded?.user ||
            decoded?.id ||
            decoded?._id ||
            decoded?.userId,
        );
      } catch (e) {
        console.error("Error decoding token", e);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUserId && (comment as any).likes) {
      const userHasLiked = (comment as any).likes.some(
        (like: any) => like === currentUserId || like._id === currentUserId,
      );
      setIsLiked(userHasLiked);
    }
  }, [currentUserId, comment]);

  const dispatch = useDispatch<typeof store.dispatch>();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
    setEditContent(localContent);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteComment({ postId: comment.post, commentId: comment._id }),
      ).unwrap();
      toast.success("Comment deleted");
      setIsDeleted(true);
      if (isReply && onDeleteReply) {
        onDeleteReply(comment._id);
      }
    } catch (e) {
      toast.error("Failed to delete comment");
    }
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("content", editContent);
    try {
      await dispatch(
        updateComment({
          postId: comment.post,
          commentId: comment._id,
          data: formData,
        }),
      ).unwrap();
      toast.success("Comment updated");
      setLocalContent(editContent);
      setIsEditing(false);
    } catch (e) {
      toast.error("Failed to update comment");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLikeToggle = async () => {
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount((prev: number) => (wasLiked ? prev - 1 : prev + 1));

    try {
      await dispatch(
        likeAndUnlikeComment({ postId: comment.post, commentId: comment._id }),
      ).unwrap();
    } catch (e) {
      setIsLiked(wasLiked);
      setLikesCount((prev: number) => (wasLiked ? prev + 1 : prev - 1));
      toast.error("Failed to like comment");
    }
  };

  const isMyComment = currentUserId === comment.commentCreator._id;

  if (isDeleted) return null;

  const handleToggleReplies = async () => {
    if (!showReplies) {
      if (replies.length === 0 && localRepliesCount > 0) {
        setIsLoadingReplies(true);
        try {
          const res = await dispatch(
            getCommentReplies({ postId: comment.post, commentId: comment._id }),
          ).unwrap();
          const fetchedReplies =
            res?.replies ||
            res?.data?.replies ||
            res?.comments ||
            res?.data?.comments ||
            res?.data ||
            [];
          setReplies(Array.isArray(fetchedReplies) ? fetchedReplies : []);
        } catch (error) {
          toast.error("Failed to load replies");
        } finally {
          setIsLoadingReplies(false);
        }
      }
      setShowReplies(true);
    } else {
      setShowReplies(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    setIsSubmittingReply(true);

    // اعملي الـ reply محلياً فوراً ⚡
    const optimisticReply: any = {
      _id: `temp-${Date.now()}`,
      content: replyContent,
      commentCreator: {
        _id: currentUserId || "",
        name: "You",
        photo: "",
      },
      post: comment.post,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isReply: true,
    };

    setReplies((prev) => [...prev, optimisticReply]);
    setShowReplies(true);
    setLocalRepliesCount((prev) => prev + 1);
    setReplyContent("");
    setShowReplyInput(false);

    const formData = new FormData();
    formData.append("content", replyContent);

    try {
      const res = await dispatch(
        createReplyComment({
          postId: comment.post,
          commentId: comment._id,
          data: formData,
        }),
      ).unwrap();

      const newReply =
        res?.data?.reply || res?.data?.comment || res?.reply || res?.comment;

      // استبدلي الـ temp بالـ reply الحقيقي من الـ server ✅
      if (newReply && newReply._id) {
        setReplies((prev) =>
          prev.map((r) => (r._id === optimisticReply._id ? newReply : r)),
        );
      }
    } catch (e: any) {
      // لو فشل — شيلي الـ reply وارجعي الـ count ❌
      setReplies((prev) => prev.filter((r) => r._id !== optimisticReply._id));
      setLocalRepliesCount((prev) => Math.max(0, prev - 1));
      toast.error(typeof e === "string" ? e : "Failed to add reply.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <Box
      sx={{
        mt: 1.5,
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background: (theme) =>
          isTopComment
            ? theme.palette.mode === "dark"
              ? "linear-gradient(145deg, rgba(25,118,210,0.12) 0%, rgba(0,0,0,0.2) 100%)"
              : "linear-gradient(145deg, rgba(25,118,210,0.08) 0%, #ffffff 55%)"
            : theme.palette.background.paper,
        boxShadow: "0 2px 12px rgba(15, 23, 42, 0.06)",
      }}
    >
      <Stack direction="row" spacing={1.75} alignItems="flex-start">
        <UserAvatar
          userId={comment.commentCreator._id}
          userName={comment.commentCreator.name}
          userPhoto={comment.commentCreator.photo}
          sx={{
            bgcolor: red[400],
            width: 40,
            height: 40,
            flexShrink: 0,
            border: "2px solid",
            borderColor: "background.paper",
          }}
        />

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Stack
              direction="row"
              alignItems="baseline"
              spacing={1}
              flexWrap="wrap"
              sx={{ mb: 0.5 }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, color: "text.primary" }}
              >
                {comment.commentCreator.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {comment.createdAt}
              </Typography>
            </Stack>

            {isMyComment && (
              <Box>
                <IconButton
                  size="small"
                  onClick={handleMenuClick}
                  sx={{ color: "text.secondary", padding: 0.5 }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleUpdateClick}>Edit</MenuItem>
                  <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                    Delete
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Stack>

          {isEditing ? (
            <Box
              sx={{
                mt: 1,
                mb: 1,
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                size="small"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                disabled={isUpdating}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
              />
              <IconButton
                color="primary"
                onClick={handleEditSubmit}
                disabled={!editContent.trim() || isUpdating}
                sx={{ width: 32, height: 32 }}
              >
                {isUpdating ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SendIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
              <Button
                size="small"
                onClick={() => setIsEditing(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                lineHeight: 1.6,
                fontSize: 14,
                whiteSpace: "pre-wrap",
                borderLeft: isTopComment ? "3px solid" : "none",
                borderColor: "primary.light",
                pl: isTopComment ? 1.25 : 0,
              }}
            >
              {localContent}
            </Typography>
          )}

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 1, alignItems: "center" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                size="small"
                onClick={handleLikeToggle}
                sx={{
                  color: isLiked ? "primary.main" : "text.secondary",
                  p: 0.5,
                  mr: 0.5,
                }}
                disableRipple
              >
                <ThumbUpIcon fontSize="small" />
              </IconButton>
              {likesCount > 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: 12 }}
                >
                  {likesCount}
                </Typography>
              )}
            </Box>

            {!isReply && (
              <>
                <Button
                  size="small"
                  startIcon={<ReplyIcon fontSize="small" />}
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  sx={{
                    textTransform: "none",
                    color: showReplyInput ? "primary.main" : "text.secondary",
                    fontWeight: 600,
                    fontSize: 12,
                    minWidth: 0,
                    p: 0,
                    "&:hover": {
                      bgcolor: "transparent",
                      color: "primary.main",
                    },
                  }}
                  disableRipple
                >
                  Reply
                </Button>

                {localRepliesCount > 0 && (
                  <Button
                    size="small"
                    startIcon={
                      showReplies ? (
                        <KeyboardArrowUpIcon fontSize="small" />
                      ) : (
                        <KeyboardArrowDownIcon fontSize="small" />
                      )
                    }
                    onClick={handleToggleReplies}
                    disabled={isLoadingReplies}
                    sx={{
                      textTransform: "none",
                      color: "primary.main",
                      fontWeight: 600,
                      fontSize: 12,
                      minWidth: 0,
                      p: 0,
                      "&:hover": {
                        bgcolor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                    disableRipple
                  >
                    {isLoadingReplies ? (
                      <CircularProgress size={12} sx={{ mr: 1 }} />
                    ) : null}
                    {showReplies
                      ? "Hide replies"
                      : `View ${localRepliesCount} ${localRepliesCount === 1 ? "reply" : "replies"}`}
                  </Button>
                )}
              </>
            )}
          </Stack>

          {!isReply && (
            <Collapse in={showReplyInput}>
              <Box
                sx={{ mt: 1.5, display: "flex", gap: 1, alignItems: "center" }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Write a reply..."
                  variant="outlined"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleReplySubmit();
                  }}
                  disabled={isSubmittingReply}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(0,0,0,0.2)"
                          : "background.paper",
                      fontSize: 13,
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleReplySubmit}
                  disabled={!replyContent.trim() || isSubmittingReply}
                  sx={{
                    bgcolor: "primary.light",
                    color: "white",
                    "&:hover": { bgcolor: "primary.main" },
                    width: 32,
                    height: 32,
                  }}
                >
                  {isSubmittingReply ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <SendIcon sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
              </Box>
            </Collapse>
          )}

          {!isReply && (
            <Collapse in={showReplies}>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {replies.map((reply) => (
                  <CommentItem
                    key={reply._id || Math.random().toString()}
                    comment={reply as any}
                    isReply={true}
                    onDeleteReply={(replyId) => {
                      setReplies((prev) =>
                        prev.filter((r) => r._id !== replyId),
                      );
                      setLocalRepliesCount((prev) => Math.max(0, prev - 1));
                      if (replies.length <= 1) setShowReplies(false);
                    }}
                  />
                ))}
              </Box>
            </Collapse>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
