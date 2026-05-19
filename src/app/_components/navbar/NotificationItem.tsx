import React from "react";
import { Box, Typography, Avatar, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../lib/store";
import { makeNotificationRead, resetUnreadCount } from "../../../lib/notificationSlice";

interface NotificationItemProps {
  notification: any;
  onClick?: () => void;
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Extract user details safely
  const user = notification.actor || notification.user || notification.creator || notification.sender;
  const userName = user?.name || "A user";
  const userPhoto = user?.photo || "";

  // Notification text/action logic
  // Prefer server-provided content which correctly describes the context
  // (e.g. "replied to your comment" vs "commented on your post")
  let content = notification.content || notification.message || "";
  if (!content || content.trim() === "") {
    // Only use fallbacks when server provides no text at all
    switch (notification.type) {
      case "like":
      case "like_post":
        content = "liked your post.";
        break;
      case "comment":
      case "comment_post":
        content = "commented on a post.";
        break;
      case "reply":
      case "reply_comment":
        content = "replied to your comment.";
        break;
      case "follow":
      case "follow_user":
        content = "started following you.";
        break;
      default:
        content = "interacted with you.";
    }
  }

  // Format date
  const time = notification.createdAt
    ? new Date(notification.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  // Determine link based on notification properties
  // Deep search for post ID to avoid using comment ID
  const postId = 
    // 1. Direct post field
    notification.post?._id || 
    notification.post?.id || 
    (typeof notification.post === 'string' ? notification.post : null) ||
    // 2. Nested post inside entity (common for comments)
    notification.entity?.post?._id ||
    notification.entity?.post?.id ||
    (typeof notification.entity?.post === 'string' ? notification.entity?.post : null) ||
    // 3. Fallback only if not a follow notification
    (!notification.type?.includes("follow") ? (notification.entityId || notification.entity?._id) : null);

  // For profile links (like follow notifications), find the user ID robustly
  const profileId = user?._id || user?.id || notification.entityId || notification.entity?._id || "";
  const linkHref = postId ? `/singlePost/${postId}` : `/user/${profileId}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Mark all as read when any notification is clicked
    dispatch(resetUnreadCount());
    dispatch(makeNotificationRead());

    if (onClick) onClick();
    if (linkHref && linkHref !== "#" && linkHref !== "/profile/") {
      router.push(linkHref);
    } else {
      console.log("Could not find a valid link for this notification. Notification data:\n" + JSON.stringify(notification, null, 2));
    }
  };

  return (
    <MenuItem
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        py: 2,
        px: 2.5,
        borderBottom: "1px solid #f0f0f0",
        whiteSpace: "normal",
        gap: 2,
        backgroundColor: notification.isRead === false ? "rgba(25, 118, 210, 0.05)" : "transparent",
        transition: "background-color 0.2s",
        "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
      }}
    >
      <Avatar src={userPhoto} alt={userName} sx={{ width: 44, height: 44, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ color: "#333", fontSize: "0.9rem", lineHeight: 1.4 }}>
          <Box component="span" sx={{ fontWeight: 700, mr: 0.5 }}>
            {userName}
          </Box>
          {content}
        </Typography>
        <Typography variant="caption" sx={{ color: "#888", display: "block", mt: 0.5, fontWeight: 500 }}>
          {time}
        </Typography>
      </Box>
    </MenuItem>
  );
}
