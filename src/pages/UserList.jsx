import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
  TextField,
  Pagination,
  Box,
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  deleteUser,
  setPage,
  setSearch,
  loadInitialUsers,
} from '../redux/userSlice';

export default function UserList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, page, limit, total, search, loading, allUsers } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(loadInitialUsers()).then(() => {
      dispatch(fetchUsers());
    });
  }, [dispatch]);

  useEffect(() => {
    if (allUsers.length > 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, page, search, allUsers.length]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearch(e.target.value));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h4">User List</Typography>
        <Button variant="contained" onClick={() => navigate('/users/add')}>
          + Add User
        </Button>
      </Stack>

      <TextField
        label="Search by name"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Typography>Loading...</Typography>
      ) : users.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        <List sx={{ border: '1px solid #ddd', borderRadius: 2 }}>
          {users.map((user) => (
            <ListItem
              key={user.id}
              sx={{
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <ListItemText
                primary={`${user.firstName ?? ''} ${user.lastName ?? ''}`}
                secondary={user.email}
              />
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    navigate(`/users/edit/${user.id}`, { state: { user } })
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </Stack>
            </ListItem>
          ))}
        </List>
      )}

      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => dispatch(setPage(value))}
          color="primary"
        />
      </Box>
    </Container>
  );
}
