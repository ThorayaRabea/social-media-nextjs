"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { store } from "../../../lib/store";
import { useDispatch, useSelector } from "react-redux";
import Post from "../../_components/post/post";
import { getSinglePost } from "../../../lib/postsSlice";
import { Container, Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loading from "../../../loading";
import {
  getAllComments,
  clearComments,
} from "../../../lib/commentsRepliesSlice";

export default function SinglePost() {
  const { id } = useParams();
  const dispatch = useDispatch<typeof store.dispatch>();
  const { singlePost } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.posts,
  );

  const router = useRouter();
  const [isError, setIsError] = React.useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (userToken && userToken !== "undefined") {
      if (id) {
        setIsError(false);
        dispatch(clearComments()); // 👈 صفري الكومنتات القديمة الأول
        dispatch(getSinglePost(id as string))
          .unwrap()
          .catch(() => setIsError(true));
        dispatch(getAllComments(id as string));
      }
    } else {
      router.push("/logout");
    }
  }, [dispatch, id, router]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        {isError ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: "white",
              borderRadius: 4,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h5"
              color="text.secondary"
              fontWeight="bold"
              gutterBottom
            >
              Post Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              This post may have been deleted or does not exist.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/")}
              sx={{ borderRadius: 8, px: 3 }}
            >
              Go Back Home
            </Button>
          </Box>
        ) : singlePost ? (
          <Post postObject={singlePost} allComments={true} />
        ) : (
          <Loading />
        )}
      </Box>
    </Container>
  );
}
