// src/pages/SuperuserDashboard.jsx
import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SuperuserDashboard() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f9f5e8',
        overflowY: 'auto',
        px: { xs: 2, sm: 4, md: 6 }
      }}
    >
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" sx={{ color: '#3d3b4e', fontWeight: 'bold', mb: 4 }}>
          SUPERUSER DASHBOARD
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen', height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Manage Users</Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: 'limegreen', color: '#3d3b4e' }}
                  onClick={() => navigate('/superuser/users')}
                >
                  Go to Users
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen', height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Manage Models</Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: 'limegreen', color: '#3d3b4e' }}
                  onClick={() => navigate('/models')}
                >
                  Go to Models
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          sx={{ mt: 4, backgroundColor: '#f44336', color: '#fff', fontWeight: 'bold' }}
          onClick={() => navigate('/')}
        >
          Go Back to Home
        </Button>
      </Box>
    </Box>
  );
}

export default SuperuserDashboard;
