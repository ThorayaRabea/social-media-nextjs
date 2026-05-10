"use client";

import {
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../lib/authSlice";
import { store } from "../../lib/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LogIn() {
  const { isLoading } = useSelector(
    (state: ReturnType<typeof store.getState>) => {
      return state.auth;
    },
  );
  let router = useRouter();

  const { userToken } = useSelector(
    (state: ReturnType<typeof store.getState>) => {
      return state.auth;
    },
  );

  let dispatch = useDispatch<typeof store.dispatch>();

  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values);
      dispatch(userLogin(values))
        .unwrap()
        .then((response) => {
          const token = response?.data?.token ?? response?.token ?? null;
          if (response.success == true) {
            if (token && token !== "undefined" && token !== "null") {
              localStorage.setItem("userToken", token);
            }
            router.push("/");
          }
        })
        .catch((err) => {
          toast.error(err?.message);
        });
    },
  });

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          marginTop: "-64px",
        }}
      >
        <Paper elevation={10} sx={{ width: "70%", padding: "15px" }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              id="email"
              label="email..."
              variant="outlined"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              id="password"
              label="password..."
              name="password"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              fullWidth
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                marginTop: "10px",
                borderRadius: "5px",
                color: "#1976d2",
                backgroundColor: "#fff",
                border: "1px solid #8d888803",
                ":hover": {
                  color: "#fff",
                  backgroundColor: "#1976d2",
                  border: "1px solid #1976d2",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress
                  size={24}
                  sx={{ color: "white" }}
                ></CircularProgress>
              ) : (
                "LogIn"
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}
