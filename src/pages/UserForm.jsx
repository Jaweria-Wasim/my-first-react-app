import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  Divider,
  Checkbox,
  FormGroup,
  Autocomplete,
  Slider,
  Snackbar,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser, updateUser } from "../redux/userSlice";

export default function ProfileForm() {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const editingUser = location.state?.user;

  const universityOptions = [
    "Harvard University",
    "Stanford University",
    "Massachusetts Institute of Technology",
    "University of Oxford",
    "University of Cambridge",
  ];

  useEffect(() => {
    if (editingUser?.avatarUrl) {
      setAvatarUrl(editingUser.avatarUrl);
    }
  }, [editingUser]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: editingUser?.firstName || "",
      lastName: editingUser?.lastName || "",
      email: editingUser?.email || "",
      gender: editingUser?.gender || "",
      dob: editingUser?.dob ? new Date(editingUser.dob) : null,
      university: editingUser?.university || "",
      location: editingUser?.location || "",
      newsletter: editingUser?.newsletter || false,
      terms: editingUser?.terms || false,
      age: editingUser?.age || 25,
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      gender: Yup.string().required("Gender is required"),
      dob: Yup.date().required("Date of birth is required"),
      university: Yup.string().required("University is required"),
      location: Yup.string().required("Location is required"),
      terms: Yup.boolean().oneOf([true], "You must accept the terms"),
      age: Yup.number().min(18).max(100).required("Age is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const finalUser = {
        ...values,
        dob: values.dob?.toISOString(),
        avatarUrl,
      };

      try {
        if (editingUser?.id) {
          await dispatch(updateUser({ id: editingUser.id, data: finalUser }));
          showSnackbar("User updated!");
        } else {
          await dispatch(addUser(finalUser));
          showSnackbar("User added!");
        }
        setTimeout(() => navigate("/users"), 1000);
      } catch (error) {
        console.error("Save failed:", error);
        showSnackbar("Something went wrong!", "error");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().min(6).required("Password required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
    }),
    onSubmit: () => {
      showSnackbar("Password updated");
      setShowPasswordForm(false);
    },
  });

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f8f9fa">
      {/* Sidebar */}
      <Box
        width="220px"
        bgcolor="#1B263B"
        p={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ color: "#fff" }}
      >
        <Avatar
          src={
            avatarUrl ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRffynsRFNN4y-DlyuMLHMQl2ji-UvXKfwwGQ&s"
          }
          sx={{ width: 80, height: 80, mb: 1 }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="upload-avatar"
          onChange={handleAvatarUpload}
        />
        <label htmlFor="upload-avatar">
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: "#0D1B2A", mb: 2 }}
            component="span"
          >
            Upload
          </Button>
        </label>

        <Button
          variant="contained"
          fullWidth
          sx={{ mb: 1, bgcolor: "#0D1B2A" }}
          onClick={() => setShowPasswordForm(false)}
        >
          Personal Info
        </Button>
        <Button
          fullWidth
          sx={{ color: "#fff", bgcolor: "#0D1B2A", mb: 1 }}
          onClick={() => setShowPasswordForm(true)}
        >
          Change Password
        </Button>
        <Button
          fullWidth
          sx={{ color: "#fff", bgcolor: "#0D1B2A" }}
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={4}>
        {showPasswordForm ? (
          <form onSubmit={passwordFormik.handleSubmit}>
            <Typography variant="h6" mb={2}>
              Change Password
            </Typography>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              name="password"
              value={passwordFormik.values.password}
              onChange={passwordFormik.handleChange}
              error={
                passwordFormik.touched.password &&
                Boolean(passwordFormik.errors.password)
              }
              helperText={
                passwordFormik.touched.password &&
                passwordFormik.errors.password
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={passwordFormik.values.confirmPassword}
              onChange={passwordFormik.handleChange}
              error={
                passwordFormik.touched.confirmPassword &&
                Boolean(passwordFormik.errors.confirmPassword)
              }
              helperText={
                passwordFormik.touched.confirmPassword &&
                passwordFormik.errors.confirmPassword
              }
              sx={{ mb: 2 }}
            />
            <Box display="flex" gap={2}>
              <Button
                sx={{ bgcolor: "#1B263B", color: "white" }}
                onClick={() => setShowPasswordForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{ bgcolor: "#1B263B", color: "white" }}
              >
                Update
              </Button>
            </Box>
          </form>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6" mb={2}>
              Personal Information
            </Typography>

            <RadioGroup
              row
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
            {formik.touched.gender && formik.errors.gender && (
              <Typography color="error" fontSize="0.8rem">{formik.errors.gender}</Typography>
            )}

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={2}>
              <TextField
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                fullWidth
              />
              <TextField
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                fullWidth
              />
              <TextField
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
              />
              <Select
                name="location"
                displayEmpty
                value={formik.values.location}
                onChange={formik.handleChange}
                fullWidth
              >
                <MenuItem value="">Select Location</MenuItem>
                <MenuItem value="New York">New York</MenuItem>
                <MenuItem value="Los Angeles">Los Angeles</MenuItem>
              </Select>
              <DatePicker
                name="dob"
                label="Date of Birth"
                value={formik.values.dob}
                onChange={(date) => formik.setFieldValue("dob", date)}
                onBlur={() => formik.setFieldTouched("dob", true)} // <-- Add this
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="dob"
                    fullWidth
                    error={formik.touched.dob && Boolean(formik.errors.dob)}
                    helperText={formik.touched.dob && formik.errors.dob}
                  />
                )}
              />

              <Autocomplete
                name="university"
                options={universityOptions}
                value={formik.values.university}
                onChange={(e, val) => formik.setFieldValue("university", val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="University"
                    name="university"
                    fullWidth
                    error={formik.touched.university && Boolean(formik.errors.university)}
                    helperText={formik.touched.university && formik.errors.university}
                  />
                )}
              />
            </Box>

            <Box mt={3}>
              <Typography gutterBottom>Age</Typography>
              <Slider
                value={formik.values.age}
                onChange={(e, val) => formik.setFieldValue("age", val)}
                valueLabelDisplay="on"
                min={18}
                max={60}
              />
            </Box>

            <FormGroup row sx={{ mt: 2 }}>
              <FormControlLabel
                control={<Checkbox name="newsletter" checked={formik.values.newsletter} onChange={formik.handleChange} />}
                label="Subscribe to newsletter"
              />
              <FormControlLabel
                control={<Checkbox name="terms" checked={formik.values.terms} onChange={formik.handleChange} />}
                label="Accept Terms"
              />
            </FormGroup>
            {formik.touched.terms && formik.errors.terms && (
              <Typography color="error" fontSize="0.8rem">{formik.errors.terms}</Typography>
            )}

            <Divider sx={{ my: 3 }} />
            <Box display="flex" gap={2}>
              <Button variant="outlined" onClick={() => navigate("/users")}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{ bgcolor: "#1B263B" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : editingUser ? "Update User" : "Save User"}
              </Button>
            </Box>
          </form>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
