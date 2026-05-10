"use client";
import React, { useEffect, useState } from "react";
import { Card, Box, Typography, Button, Skeleton } from "@mui/material";
import axios from "axios";
import UserAvatar from "../userAvatar/UserAvatar";

interface FollowedUser {
  _id: string;
  name: string;
  photo?: string;
}

interface FollowingUserCardProps {
  followedUser: FollowedUser;
  onUnfollow: (userId: string) => void;
}

export default function FollowingUserCard({
  followedUser,
  onUnfollow,
}: FollowingUserCardProps) {
  const [stats, setStats] = useState({ followersCount: 0, followingCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        const response = await axios.get(
          `https://route-posts.routemisr.com/users/${followedUser._id}/profile`,
          {
            headers: { token },
          }
        );

        if (isMounted && response.data?.success) {
          setStats({
            followersCount: response.data.data.user.followersCount || 0,
            followingCount: response.data.data.user.followingCount || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user stats", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserStats();

    return () => {
      isMounted = false;
    };
  }, [followedUser._id]);

  return (
    <Card
      variant="outlined"
      sx={{
        textAlign: "center",
        p: 2,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderColor: "divider",
        transition: "all 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: "primary.main",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        },
      }}
    >
      <UserAvatar
        userId={followedUser._id}
        userName={followedUser.name}
        userPhoto={followedUser.photo}
        sx={{
          width: 70,
          height: 70,
          mb: 1.5,
          border: "2px solid",
          borderColor: "primary.light",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      />
      <Typography variant="subtitle2" fontWeight="700" noWrap sx={{ width: "100%", mb: 1 }}>
        {followedUser.name}
      </Typography>

      <Box sx={{ mt: 1, mb: 2, width: "100%", display: "flex", justifyContent: "center", gap: 2 }}>
        <Box>
          {loading ? (
            <Skeleton variant="text" width={20} sx={{ mx: "auto", mb: 0.5 }} />
          ) : (
            <Typography variant="body2" fontWeight="bold" color="primary.main">
              {stats.followersCount}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            Followers
          </Typography>
        </Box>
        <Box>
          {loading ? (
            <Skeleton variant="text" width={20} sx={{ mx: "auto", mb: 0.5 }} />
          ) : (
            <Typography variant="body2" fontWeight="bold">
              {stats.followingCount}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            Following
          </Typography>
        </Box>
      </Box>

      <Button
        size="small"
        variant="outlined"
        color="primary"
        disableElevation
        onClick={() => onUnfollow(followedUser._id)}
        sx={{
          width: "100%",
          borderRadius: 20,
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": { bgcolor: "error.50", color: "error.main", borderColor: "error.main" },
        }}
      >
        Unfollow
      </Button>
    </Card>
  );
}
