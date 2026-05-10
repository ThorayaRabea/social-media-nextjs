// "use client"

// import React, { useEffect } from 'react'
// import { useParams } from 'next/navigation';
// import { store } from '../../../lib/store';
// import { useDispatch, useSelector } from 'react-redux';

// import Post from '../../_components/post/post';
// import { getSinglePost } from '../../../lib/postsSlice';

// export default function SinglePost({ params }: { params: { id: string } }) {
//    const dispatch=useDispatch<typeof store.dispatch>()
//    const {singlePost}=useSelector((state :ReturnType <typeof store.getState>)=>state.posts)

//     useEffect(() => {
//       console.log('uesEffect')
//       dispatch(getSinglePost(params.id))
//       console.log(singlePost);
//     }, []);

//   return singlePost? <Post postObject={singlePost}/>:"hello this is single post"
// }

"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { store } from "../../../lib/store";
import { useDispatch, useSelector } from "react-redux";
import Post from "../../_components/post/post";
import { getSinglePost } from "../../../lib/postsSlice";
import { Container, Box } from "@mui/material";
import Loading from "../../../loading";
import { getAllComments } from "../../../lib/commentsRepliesSlice";

export default function SinglePost() {
  const { id } = useParams();
  const dispatch = useDispatch<typeof store.dispatch>();
  const { singlePost } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.posts,
  );

  useEffect(() => {
    if (id) {
      dispatch(getSinglePost(id as string));

      dispatch(getAllComments(id as string));
    }
  }, [dispatch, id]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        {singlePost ? (
          <Post postObject={singlePost} allComments={true} />
        ) : (
          <Loading />
        )}
      </Box>
    </Container>
  );
}
