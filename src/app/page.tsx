"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Grid from "@mui/material/Grid";
import Post from "./_components/post/post";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../lib/postsSlice";
import { useEffect } from "react";
import { store } from "../lib/store";
import { PostType } from "./_interfaces/home";
import Loading from "../loading";

import { useRouter } from "next/navigation";

export default function Home() {
  let dispatch = useDispatch<typeof store.dispatch>();
  const router = useRouter();

  const { allPosts } = useSelector(
    (state: ReturnType<typeof store.getState>) => {
      return state.posts;
    },
  );

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (userToken && userToken !== "undefined") {
      console.log("Dispatching with token:", userToken);
      dispatch(getAllPosts(userToken));
    } else {
      router.push("/login");
    }
  }, [dispatch, router]);

  return (
    <>
      {allPosts ? (
        <Grid
          container
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{ minHeight: "calc(100vh - 64px)" }}
          width={"100%"}
        >
          <Grid size={{ xs: 12, md: 3 }}></Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {allPosts?.map((postObj: PostType) => {
              return (
                <Post
                  postObject={postObj}
                  key={postObj._id}
                  allComments={false}
                />
              );
            })}
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}></Grid>
        </Grid>
      ) : (
        <Loading />
      )}
    </>
  );
}
