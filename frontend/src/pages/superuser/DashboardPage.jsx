// src/pages/SuperuserDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Grid, Card, CardContent, Button, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SuperuserDashboard() {
  const [metrics, setMetrics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/superuser/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        console.log(response.data)
        setMetrics(response.data);
      })
      .catch(error => {
        console.error('Error fetching metrics:', error);
      });
  }, []);

  if (!metrics) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#f9f5e8',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Prepare data for charts
  const totalOpeningsData = {
    labels: Object.keys(metrics.total_openings_last_7_days),
    datasets: [
      {
        label: 'Aperturas Totales',
        data: Object.values(metrics.total_openings_last_7_days),
        fill: false,
        backgroundColor: 'limegreen',
        borderColor: 'limegreen',
      },
    ],
  };

  const peakUsageData = {
    labels: Object.keys(metrics.peak_usage_hours).map(hour => `${hour}:00`),
    datasets: [
      {
        label: 'Cantidad de Aperturas',
        data: Object.values(metrics.peak_usage_hours),
        backgroundColor: 'limegreen',
      },
    ],
  };

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
        px: { xs: 2, sm: 4, md: 6 },
        pb: 6
      }}
    >
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" sx={{ color: '#3d3b4e', fontWeight: 'bold', mb: 4 }}>
          SUPERUSER DASHBOARD
        </Typography>
        {/* Active Counts */}
        <Grid container spacing={3} justifyContent="center">
          {/* Existing Cards for Gestionar Usuarios and Modelos */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen', height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Gestionar Usuarios</Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: 'limegreen', color: '#3d3b4e' }}
                  onClick={() => navigate('/superuser/users')}
                >
                  Ver Usuarios
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen', height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Gestionar Modelos</Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: 'limegreen', color: '#3d3b4e' }}
                  onClick={() => navigate('/models')}
                >
                  Ver Modelos
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* New Metrics Cards */}
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Usuarios Activos</Typography>
                <Typography variant="h3" sx={{ mt: 2 }}>
                  {metrics.active_users_count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Controladores Activos</Typography>
                <Typography variant="h3" sx={{ mt: 2 }}>
                  {metrics.active_controllers_count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Casilleros Activos</Typography>
                <Typography variant="h3" sx={{ mt: 2 }}>
                  {metrics.active_lockers_count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Tiempo Promedio de Apertura</Typography>
                <Typography variant="h3" sx={{ mt: 2 }}>
                  {metrics.average_open_time} min
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Charts */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ color: '#3d3b4e', fontWeight: 'bold', mb: 2 }}>
            Aperturas Totales de Casilleros en los Últimos 7 Días
          </Typography>
          <Bar data={totalOpeningsData} options={{ responsive: true }} />
        </Box>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ color: '#3d3b4e', fontWeight: 'bold', mb: 2 }}>
            Horas Pico de Uso de Casilleros
          </Typography>
          <Bar data={peakUsageData} options={{ responsive: true }} />
        </Box>
        {/* Top Lockers by Openings */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ color: '#3d3b4e', fontWeight: 'bold', mb: 2 }}>
            Top Casilleros por Aperturas
          </Typography>
          <Card sx={{ backgroundColor: '#3d3b4e', color: 'limegreen', maxWidth: 600, margin: '0 auto' }}>
            <CardContent>
              {metrics.top_lockers_by_openings.map((locker, index) => (
                <Typography key={index} variant="h6">
                  {index + 1}. {locker.locker_name} - {locker.openings} aperturas
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Box>
        {/* Back Button */}
        <Button
          variant="contained"
          sx={{ mt: 4, backgroundColor: '#3d3b4e', color: '#fff', fontWeight: 'bold' }}
          onClick={() => navigate('/')}
        >
          Volver
        </Button>
      </Box>
    </Box>
  );
}

export default SuperuserDashboard;
