// src/components/Sidebar.jsx
import { Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/auth';

const drawerWidth = 220;

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#84AE92',
          color: 'white',
        },
      }}
    >
      <Box sx={{ mt: 8 }}>
        <List>
          <ListItem button component={Link} to="/">
            <ListItemText primary="User List" />
          </ListItem>
          <ListItem button component={Link} to="/add">
            <ListItemText primary="Add User" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
          >
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
