import {
  Container,
  Typography,
  Button,
  Stack,
  TextField,
  Pagination,
  Box,
  Skeleton,
  Slider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  deleteUser,
  setPage,
  setSearch,
  setAgeFilter,
  setLoading,
  setShowSkeleton,
} from '../redux/userSlice';
import debounce from 'lodash/debounce';

export default function UserList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    users,
    page,
    limit,
    total,
    search,
    ageFilter,
    loading,
    showSkeleton,
  } = useSelector((state) => state.users);

  const totalPages = Math.ceil(total / limit);

  // Initial load with skeleton delay
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchUsers());
      dispatch(setShowSkeleton(false));
    }, 1500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Reload after add/edit
  useEffect(() => {
    if (location.state?.reload) {
      dispatch(setShowSkeleton(true));
      dispatch(fetchUsers()).then(() => {
        dispatch(setShowSkeleton(false));
        window.history.replaceState({}, document.title);
      });
    }
  }, [location.state, dispatch]);

  // Debounced search input (NO skeleton or spinner)
  const debouncedSearchChange = useCallback(
    debounce((value) => {
      dispatch(setSearch(value));
      dispatch(fetchUsers()); // no setLoading or skeleton
    },),
    []
  );

  // Debounced age slider (WITH skeleton)
  const debouncedAgeChange = useCallback(
    debounce((val) => {
      dispatch(setAgeFilter(val));
      dispatch(setShowSkeleton(true));
      dispatch(fetchUsers()).then(() => dispatch(setShowSkeleton(false)));
    }, 500),
    []
  );

  // Re-fetch on page, age (but NOT search)
  useEffect(() => {
    if (!showSkeleton && (page || ageFilter)) {
      dispatch(setLoading(true));
      dispatch(fetchUsers()).then(() => dispatch(setLoading(false)));
    }
  }, [dispatch, page, ageFilter, showSkeleton]);

  const handleDelete = (id) => dispatch(deleteUser(id));

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
        {showSkeleton ? (
          <Skeleton variant="text" width={180} height={40} />
        ) : (
          <Typography variant="h4" fontWeight={600}>User List</Typography>
        )}
        {showSkeleton ? (
          <Skeleton variant="rectangular" width={100} height={40} />
        ) : (
          <Button variant="contained" onClick={() => navigate('/users/add')}>
            + Add User
          </Button>
        )}
      </Stack>

      {/* Filters */}
      {showSkeleton ? (
        <Skeleton variant="rectangular" height={55} sx={{ mb: 3, borderRadius: 1 }} />
      ) : (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <TextField
            label="Search by name"
            variant="outlined"
            value={search}
            onChange={(e) => debouncedSearchChange(e.target.value)}
            sx={{ flex: 1 }}
          />

          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <Typography variant="body1" fontWeight={500}>Search by age:</Typography>
            <Slider
              min={18}
              max={60}
              step={1}
              value={ageFilter || 18}
              valueLabelDisplay="auto"
              onChangeCommitted={(e, val) => debouncedAgeChange(val)}
              sx={{ width: 150 }}
            />
            <TextField
              label="Selected Age"
              value={ageFilter || ''}
              variant="outlined"
              size="small"
              sx={{ width: 90 }}
              disabled
            />
            <Button
              size="small"
              onClick={() => {
                dispatch(setShowSkeleton(true));
                dispatch(setAgeFilter(''));
                dispatch(fetchUsers()).then(() => {
                  dispatch(setShowSkeleton(false));
                });
              }}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      )}

      {/* Spinner (only when loading and not searching) */}
      {loading && !showSkeleton && (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      )}

      {/* Filter Preview (Console/DevTool) */}
      {(!showSkeleton && (search || ageFilter)) && (
        <Box mb={2}>
          <Typography variant="subtitle1">
            Showing results
            {search && <> for <strong>"{search}"</strong></>}
            {ageFilter && <> aged <strong>{ageFilter}</strong></>}
          </Typography>
        </Box>
      )}

      {/* User Table */}
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>{showSkeleton ? <Skeleton width={80} /> : <strong>Full Name</strong>}</TableCell>
              <TableCell>{showSkeleton ? <Skeleton width={60} /> : <strong>Email</strong>}</TableCell>
              <TableCell>{showSkeleton ? <Skeleton width={40} /> : <strong>Age</strong>}</TableCell>
              <TableCell align="right">{showSkeleton ? <Skeleton width={70} /> : <strong>Actions</strong>}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showSkeleton ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width="80%" /></TableCell>
                  <TableCell><Skeleton width="90%" /></TableCell>
                  <TableCell><Skeleton width="50%" /></TableCell>
                  <TableCell align="right"><Skeleton width={60} height={36} /></TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No users found.</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/users/edit/${user.id}`, { state: { user } })}
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => {
            dispatch(setPage(value));
            dispatch(fetchUsers());
          }}
          color="primary"
        />
      </Box>
    </Container>
  );
}
