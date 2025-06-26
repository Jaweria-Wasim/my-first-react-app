import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// ✅ Load ALL users from DummyJSON (loop through paginated results)
export const loadInitialUsers = createAsyncThunk(
  'users/loadInitialUsers',
  async () => {
    let allUsers = [];
    let skip = 0;
    const limit = 100;
    let total = 0;

    do {
      const res = await api.get(`/users?limit=${limit}&skip=${skip}`);
      const { users, total: totalFromAPI } = res.data;
      allUsers = [...allUsers, ...users];
      total = totalFromAPI;
      skip += limit;
    } while (allUsers.length < total);

    return allUsers;
  }
);

// ✅ Paginate + search from local allUsers
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState }) => {
    const { allUsers, page, limit, search } = getState().users;

    let filtered = allUsers;
    if (search) {
      filtered = filtered.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      users: filtered.slice(start, end),
      total: filtered.length,
    };
  }
);

// ✅ Simulate Add User
export const addUser = createAsyncThunk(
  'users/addUser',
  async (user, { dispatch }) => {
    const newUser = { ...user, id: Date.now() };
    dispatch(addUserToState(newUser));
    dispatch(fetchUsers());
    return newUser;
  }
);

// ✅ Simulate Update User
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }, { dispatch }) => {
    dispatch(updateUserInState({ id, data }));
    dispatch(fetchUsers());
    return { id, data };
  }
);

// ✅ Simulate Delete User
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { dispatch }) => {
    dispatch(deleteUserFromState(id));
    dispatch(fetchUsers());
    return id;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    allUsers: [],
    users: [],
    total: 0,
    page: 1,
    limit: 10,
    search: '',
    loading: false,
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
    addUserToState: (state, action) => {
      state.allUsers.unshift(action.payload);
    },
    updateUserInState: (state, action) => {
      const { id, data } = action.payload;
      const index = state.allUsers.findIndex((u) => u.id === id);
      if (index !== -1) {
        state.allUsers[index] = { ...state.allUsers[index], ...data };
      }
    },
    deleteUserFromState: (state, action) => {
      state.allUsers = state.allUsers.filter((u) => u.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInitialUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadInitialUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(loadInitialUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setPage,
  setSearch,
  addUserToState,
  updateUserInState,
  deleteUserFromState,
} = userSlice.actions;

export default userSlice.reducer;
