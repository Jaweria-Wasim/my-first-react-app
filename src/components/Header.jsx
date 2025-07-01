
import { AppBar, Toolbar, Typography } from '@mui/material';

export default function Header() {
  return (
    <AppBar position="static" sx={{ bgcolor: '#84AE92' }}>
      <Toolbar>
        <Typography variant="h6">Full Stack Dashboard</Typography>
      </Toolbar>
    </AppBar>
  );
}
