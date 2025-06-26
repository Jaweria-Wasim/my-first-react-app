import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CssBaseline,
  Button,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 240;

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Top Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          bgcolor: '#0D1B2A',
          color: 'white',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">
            Admin Dashboard
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography sx={{ mr: 2 }}>
              Welcome, <strong>{user?.firstName || 'Guest'}</strong>
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleLogout}
              sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: '#5A827E' } }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#0D1B2A',
            color: 'white',
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/')}>
              <DashboardIcon sx={{ mr: 2 }} />
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/users')}>
              <PeopleIcon sx={{ mr: 2 }} />
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f4f6f8',
          minHeight: '100vh',
          p: 3, // Padding only, no margin-left
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
