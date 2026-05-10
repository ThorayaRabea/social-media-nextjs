"use client";

import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { handleSignUp } from "../../lib/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../lib/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  let dispatch = useDispatch<typeof store.dispatch>();

  const { isLoading } = useSelector(
    (state: ReturnType<typeof store.getState>) => {
      return state.auth;
    },
  );

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("name is requried")
      .min(3, "must be atleast 3 characters")
      .max(20, "max letters is 20"),
    email: Yup.string().required("email is requried").email("invalid email"),
    password: Yup.string().required("password is requried"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "password must match")
      .required("confirm password is requried"),
    dateOfBirth: Yup.string().nullable().required("date of birth is requried"),
    gender: Yup.string().required("gender is requried"),
  });

  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      dispatch(handleSignUp(values))
        .unwrap()
        .then((response) => {
          if (response.success == true) {
            
            toast.success("Account created successfully 🎉");
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          }
        })
        .catch((err) => {
          toast.error(err || "Registration failed please try again");
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
              id="name"
              label="full name..."
              variant="outlined"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              sx={{ marginBottom: "10px" }}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
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
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              type="password"
              id="password"
              label="password..."
              name="password"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              fullWidth
              sx={{ marginBottom: "10px" }}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              type="password"
              id="rePassword"
              label="rePassword..."
              name="rePassword"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rePassword}
              fullWidth
              sx={{ marginBottom: "10px" }}
              error={
                formik.touched.rePassword && Boolean(formik.errors.rePassword)
              }
              helperText={formik.touched.rePassword && formik.errors.rePassword}
            />
            <TextField
              type="date"
              id="dateOfBirth"
              label="Date Of Birth..."
              name="dateOfBirth"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dateOfBirth}
              fullWidth
              sx={{ marginBottom: "10px" }}
              InputLabelProps={{ shrink: true }}
              error={
                formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)
              }
              helperText={
                formik.touched.dateOfBirth && formik.errors.dateOfBirth
              }
            />

            <FormControl
              error={formik.touched.gender && Boolean(formik.errors.gender)}
            >
              <FormLabel id="demo-controlled-radio-buttons-group">
                Gender
              </FormLabel>
              <RadioGroup
                id="gender"
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
              {formik.touched.gender && formik.errors.gender && (
                <FormHelperText>{formik.errors.gender}</FormHelperText>
              )}
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!(formik.isValid && formik.dirty)}
              sx={{
                marginTop: "10px",
                borderRadius: "15px",
                backgroundColor:
                  formik.isValid && formik.dirty ? "#1976d2" : "#ccc",
                color: "#fff",
                ":hover": {
                  backgroundColor:
                    formik.isValid && formik.dirty ? "#115293" : "#ccc",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress
                  size={24}
                  sx={{ color: "white" }}
                ></CircularProgress>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}
