// src/pages/Dashboard.jsx
import { Box, Typography, Paper, useTheme, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();

  // Reusable clickable card component
  const Card = ({ icon: Icon, title, description, borderColor, onClick }) => (
    <Paper
      elevation={3}
      onClick={onClick}
      sx={{
        p: 3,
        borderLeft: `6px solid ${borderColor}`,
        bgcolor: 'white',
        cursor: onClick ? 'pointer' : 'default',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Icon fontSize="large" sx={{ color: borderColor }} />
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)', // minus AppBar height
        bgcolor: '#f4f6f8',
        px: 3,
        py: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          mb: 4,
        }}
      >
        Welcome to the Dashboard
      </Typography>

      <Grid container spacing={3} justifyContent="center" maxWidth="lg">
        <Grid item xs={12} sm={6} md={4}>
          <Card
            icon={GroupIcon}
            title="Users"
            description="Manage all registered users"
            borderColor="#1976d2"
            onClick={() => navigate('/users')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            icon={AssessmentIcon}
            title="Analytics"
            description="View reports and metrics"
            borderColor="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            icon={EmojiEventsIcon}
            title="Achievements"
            description="Track system milestones"
            borderColor="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            icon={TrendingUpIcon}
            title="Active Sessions"
            description="Users currently online"
            borderColor="#009688"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            icon={MonetizationOnIcon}
            title="Revenue"
            description="Track income and sales"
            borderColor="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            icon={SupportAgentIcon}
            title="Support Tickets"
            description="Pending customer issues"
            borderColor="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            icon={WorkOutlineIcon}
            title="Projects"
            description="Ongoing and upcoming tasks"
            borderColor="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            icon={NotificationsActiveIcon}
            title="Notifications"
            description="New system alerts"
            borderColor="#ff5722"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
