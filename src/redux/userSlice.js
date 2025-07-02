import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Thunk: Fetch Users with backend-based search + frontend age filtering
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState }) => {
    const { page, limit, search, ageFilter } = getState().users;

    let queryParams = [];

    if (search) {
      queryParams.push(`q=${encodeURIComponent(search)}`);
    }

    if (ageFilter !== '' && ageFilter !== null) {
      queryParams.push(`age=${encodeURIComponent(ageFilter)}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    const res = await api.get(`/users/search${queryString}`);
    let users = res.data.users || [];

  
    if (ageFilter !== '' && ageFilter !== null) {
      users = users.filter((user) => Number(user.age) === Number(ageFilter));
    }

    const total = users.length;
    const start = (page - 1) * limit;
    const paginated = users.slice(start, start + limit);

    return {
      users: paginated,
      total,
    };
  }
);

// Thunk: Add new user
export const addUser = createAsyncThunk('users/addUser', async (user) => {
  const res = await api.post('/users/add', user);
  return res.data;
});

// Thunk: Update existing user
export const updateUser = createAsyncThunk('users/updateUser', async ({ id, data }) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
});

// Thunk: Delete user
export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await api.delete(`/users/${id}`);
  return id;
});

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    total: 0,
    page: 1,
    limit: 10,
    search: '',
    ageFilter: '',
    loading: false,
    showSkeleton: true,
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setAgeFilter: (state, action) => {
      state.ageFilter = action.payload;
      state.page = 1;
      state.showSkeleton = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setShowSkeleton: (state, action) => {
      state.showSkeleton = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.total -= 1;
      });
  },
});

// Export actions and reducer
export const {
  setPage,
  setSearch,
  setAgeFilter,
  setLoading,
  setShowSkeleton,
} = userSlice.actions;

export default userSlice.reducer;
