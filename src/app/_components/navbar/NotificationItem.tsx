import React from "react";
import { Box, Typography, Avatar, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: any;
  onClick?: () => void;
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const router = useRouter();

  // Extract user details safely
  const user = notification.actor || notification.user || notification.creator || notification.sender;
  const userName = user?.name || "A user";
  const userPhoto = user?.photo || "";

  // Notification text/action logic
  let content = notification.content || notification.message || "";
  if (!content) {
    if (notification.type === "like" || notification.type === "like_post") content = "liked your post.";
    else if (notification.type === "comment" || notification.type === "comment_post") content = "commented on your post.";
    else if (notification.type === "follow" || notification.type === "follow_user") content = "started following you.";
    else content = "interacted with you.";
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
  const postId = notification.entityId || notification.entity?._id || notification.post?._id || (typeof notification.post === 'string' ? notification.post : null);
  const linkHref = postId ? `/singlePost/${postId}` : `/profile/${user?._id || ""}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
