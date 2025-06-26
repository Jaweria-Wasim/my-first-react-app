import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser } from '../redux/userSlice';

export default function UserForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { users } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  // If editing, prefill form with user data
  useEffect(() => {
    if (isEdit) {
      const existingUser = users.find((u) => String(u.id) === id);
      if (existingUser) {
        setFormData({
          firstName: existingUser.firstName || '',
          lastName: existingUser.lastName || '',
          email: existingUser.email || '',
        });
      }
    }
  }, [id, users]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      await dispatch(updateUser({ id: Number(id), data: formData }));
    } else {
      await dispatch(addUser(formData));
    }

    navigate('/users');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {isEdit ? 'Edit User' : 'Add User'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            fullWidth
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            fullWidth
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            label="Email"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {isEdit ? 'Update' : 'Add'} User
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
