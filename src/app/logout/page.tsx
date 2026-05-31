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
  Typography,
  Box,
  Collapse,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { handleSignUp } from "../../lib/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../lib/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const [passwordFocused, setPasswordFocused] = useState(false);
  let dispatch = useDispatch<typeof store.dispatch>();

  const { isLoading } = useSelector(
    (state: ReturnType<typeof store.getState>) => {
      return state.auth;
    },
  );

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Must be at least 3 characters")
      .max(20, "Max 20 characters"),
    email: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter (A-Z)")
      .matches(/[a-z]/, "Must contain at least one lowercase letter (a-z)")
      .matches(/[0-9]/, "Must contain at least one number (0-9)")
      .matches(
        /[#?!@$%^&*-]/,
        "Must contain at least one special character (#?!@$%^&*-)",
      ),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    dateOfBirth: Yup.string().nullable().required("Date of birth is required"),
    gender: Yup.string().required("Gender is required"),
  });

  const requirements = [
    { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
    {
      label: "One uppercase letter (A-Z)",
      test: (v: string) => /[A-Z]/.test(v),
    },
    {
      label: "One lowercase letter (a-z)",
      test: (v: string) => /[a-z]/.test(v),
    },
    { label: "One number (0-9)", test: (v: string) => /[0-9]/.test(v) },
    {
      label: "One special character (#?!@$%^&*-)",
      test: (v: string) => /[#?!@$%^&*-]/.test(v),
    },
  ];

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
          toast.error(err || "Registration failed, please try again");
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
              label="Full Name..."
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
              label="Email..."
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

            {/* Password field */}
            <TextField
              type="password"
              id="password"
              label="Password..."
              name="password"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                // لو الـ password كامل وصح — اخبي الـ box
                if (!formik.errors.password) setPasswordFocused(false);
              }}
              onFocus={() => setPasswordFocused(true)}
              value={formik.values.password}
              fullWidth
              sx={{ marginBottom: "8px" }}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />

            {/* Password Requirements Box مع Animation */}
            <Collapse
              in={
                passwordFocused ||
                (formik.touched.password && Boolean(formik.errors.password))
              }
            >
              <Box
                sx={{
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#f9fafb",
                  border: "1px solid #e0e0e0",
                  transition: "all 0.3s ease",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  fontWeight="700"
                  mb={0.5}
                >
                  Password must contain:
                </Typography>
                {requirements.map((req) => {
                  const passed = req.test(formik.values.password);
                  return (
                    <Typography
                      key={req.label}
                      variant="caption"
                      display="block"
                      sx={{
                        color: formik.values.password
                          ? passed
                            ? "success.main"
                            : "error.main"
                          : "text.secondary",
                        fontWeight: 500,
                        transition: "color 0.3s ease",
                        py: 0.2,
                      }}
                    >
                      {formik.values.password ? (passed ? "✅" : "❌") : "•"}{" "}
                      {req.label}
                    </Typography>
                  );
                })}
              </Box>
            </Collapse>

            <TextField
              type="password"
              id="rePassword"
              label="Confirm Password..."
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
                <CircularProgress size={24} sx={{ color: "white" }} />
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
