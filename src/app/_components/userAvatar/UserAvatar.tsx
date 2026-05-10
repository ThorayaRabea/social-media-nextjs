"use client";
import React from 'react';
import { Avatar, SxProps, Theme } from '@mui/material';
import { useRouter } from 'next/navigation';

interface UserAvatarProps {
  userId: string;
  userName: string;
  userPhoto?: string;
  sx?: SxProps<Theme>;
}

export default function UserAvatar({ userId, userName, userPhoto, sx }: UserAvatarProps) {
  const router = useRouter();

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/user/${userId}`);
  };

  return (
    <Avatar
      src={userPhoto || ''}
      onClick={handleNavigate}
      sx={{
        cursor: 'pointer',
        transition: 'opacity 0.2s',
        '&:hover': {
          opacity: 0.8,
        },
        ...sx,
      }}
      alt={userName}
    >
      {userName?.charAt(0).toUpperCase() || 'U'}
    </Avatar>
  );
}
