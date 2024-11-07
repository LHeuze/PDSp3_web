// src/pages/HomePage.jsx
import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function HomePage() {

  const navigate = useNavigate();

  const handleNavigateToLockers = () => {
    navigate('/lockers');
  };
  return (
    <Box 
      sx={{
        position: 'fixed',
        top: 64, // Adjust this value to match the height of your top bar
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f9f5e8',
        overflowY: 'auto', // Adds scrolling if content exceeds screen height
        px: { xs: 2, sm: 4, md: 6 }
      }}
    >
      {/* Main Menu */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" sx={{ color: '#3d3b4e', fontWeight: 'bold', mb: 4 }}>
          MENÚ PRINCIPAL
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen', height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">AGREGAR O AJUSTAR CASILLERO</Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: 'limegreen', color: '#3d3b4e' }}
                  onClick={handleNavigateToLockers}  // Redirect to LockersPage
                >
                  ABRIR
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen', height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">DASHBOARD</Typography>
                <Button variant="contained" fullWidth sx={{ mt: 2, backgroundColor: 'limegreen', color: '#3d3b4e' }}>
                  ABRIR
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen', height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">AGREGAR CONTROLADOR</Typography>
                <Button variant="contained" fullWidth sx={{ mt: 2, backgroundColor: 'limegreen', color: '#3d3b4e' }}>
                  ABRIR
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen', height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">ESTADO DEL SISTEMA</Typography>
                <Typography variant="body2" sx={{ color: 'red', fontWeight: 'bold', mt: 1 }}>
                  DESCONECTADO
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  ÚLTIMA SINCRONIZACIÓN
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>01/10/2024</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default HomePage;
