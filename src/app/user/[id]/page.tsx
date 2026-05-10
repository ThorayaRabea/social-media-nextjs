'use client'
import React, { useEffect } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  Container,
  CircularProgress
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { store } from '../../../lib/store'
import { followUserAndUnfollow, getMyPosts, getUserProfile } from '../../../lib/authSlice'
import toast from 'react-hot-toast'
import Post from '../../_components/post/post'

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { id } = params
  const auth = useSelector((state: ReturnType<typeof store.getState>) => state.auth)
  const { userProfile, myPosts } = auth

  const dispatch = useDispatch<typeof store.dispatch>()

  useEffect(() => {
    if (id) {
      dispatch(getUserProfile(id))
      dispatch(getMyPosts(id))
    }
  }, [id, dispatch])

  function handleFollowAndUnfollow() {
    dispatch(followUserAndUnfollow(id))
      .unwrap()
      .then((response) => {
        if (response.success === true) {
          toast.success('Action successful')
          dispatch(getUserProfile(id)) // Refresh stats after action
        } else {
          toast.success(response.message || 'Action successful')
        }
      })
      .catch((err) => {
        toast.error(err?.message || 'Failed to perform action')
      })
  }

  if (auth.isLoading && !userProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  const profileData = userProfile?.data?.user
  const isFollowing = userProfile?.data?.isFollowing

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Cover Photo & Avatar Section */}
      <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
        <Box
          sx={{
            height: 200,
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            position: 'relative',
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -8, pb: 4 }}>
          <Avatar
            src={profileData?.photo || ''}
            alt={profileData?.name || 'User'}
            sx={{
              width: 150,
              height: 150,
              border: '4px solid white',
              boxShadow: 2,
              bgcolor: 'primary.main',
              fontSize: '4rem',
            }}
          >
            {profileData?.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
            {profileData?.name || 'User Name'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            @{profileData?.username || 'username'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">{profileData?.followersCount || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Followers</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">{profileData?.followingCount || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Following</Typography>
            </Box>
          </Box>

          <Button 
            variant={isFollowing ? "outlined" : "contained"} 
            color="primary" 
            size="large"
            disableElevation
            onClick={handleFollowAndUnfollow}
            sx={{ borderRadius: 20, px: 4, fontWeight: 'bold', textTransform: 'none' }}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </Box>
      </Card>

      {/* Posts Section */}
      <Typography variant="h6" fontWeight="800" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        📝 Recent Activity
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {myPosts?.data?.posts && myPosts.data.posts.length > 0 ? (
          myPosts.data.posts.map((post) => (
            <Post key={post._id} postObject={post} allComments={false} />
          ))
        ) : (
          <Typography color="text.secondary" sx={{ mt: 2, p: 4, bgcolor: '#fafafa', borderRadius: 2, width: '100%', textAlign: 'center' }}>
            لا توجد بوستات لعرضها حالياً.
          </Typography>
        )}
      </Box>

    </Container>
  )
}
