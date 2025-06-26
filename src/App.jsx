// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './auth/Login';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/add" element={<UserForm />} />
        <Route path="users/edit/:id" element={<UserForm />} /> 
      </Route>
    </Routes>
  );
}

export default App;
