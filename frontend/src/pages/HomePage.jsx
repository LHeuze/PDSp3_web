import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function HomePage() {
  const [lockerAdmins, setLockerAdmins] = useState([]);
  const [selectedAdminIndex, setSelectedAdminIndex] = useState(0);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNavigateToLockers = () => {
    navigate('/locker_administrators');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    // Fetch locker administrators
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/locker_administrators`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLockerAdmins(response.data);
        if (response.data.length > 0) {
          fetchMetrics(response.data[0].id); // Load metrics for the first admin by default
        }
      })
      .catch(() => {
        setError('Error al cargar los administradores de casilleros.');
        setLoading(false);
      });
  }, []);

  const fetchMetrics = (adminId) => {
    setLoading(true);
    const token = localStorage.getItem('authToken');

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/locker_stats/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMetrics(response.data || {});
        setLoading(false);
      })
      .catch(() => {
        setMetrics({});
        setError('Error al cargar las métricas.');
        setLoading(false);
      });
  };

  const handleTabChange = (event, newIndex) => {
    setSelectedAdminIndex(newIndex);
    const selectedAdmin = lockerAdmins[newIndex];
    fetchMetrics(selectedAdmin.id);
  };

  const generateBarChart = (data = {}) => ({
    labels: Object.keys(data || {}),
    datasets: [
      {
        label: 'Aperturas Totales por Día',
        data: Object.values(data || {}),
        backgroundColor: 'limegreen',
      },
    ],
  });

  const generateLineChart = (data = {}) => ({
    labels: Object.keys(data || {}),
    datasets: [
      {
        label: 'Hora de Apertura Más Común',
        data: Object.values(data || {}),
        borderColor: 'limegreen',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        fill: true,
      },
    ],
  });

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f9f5e8',
      minHeight: '100vh',
      width: '100vw',
      padding: 4,
      textAlign: 'center',
      paddingTop: '80px',
    }}>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="success"
          sx={{ fontSize: '1rem', fontWeight: 'bold', padding: '10px 20px', marginBottom: '20px' }}
          onClick={() => navigate('/superuser/dashboard')}
        >
          Superuser Dashboard
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            padding: '10px 20px',
            marginBottom: '20px',
            marginLeft: '20px',
          }}
          onClick={handleNavigateToLockers}
        >
          Ver administradores de casilleros
        </Button>
      </Box>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 'bold', color: '#3d3b4e', textAlign: 'center' }}
      >
        Métricas de Administradores de Casilleros
      </Typography>

      {lockerAdmins.length > 0 ? (
        <>
          <Tabs
            value={selectedAdminIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ marginBottom: 3, backgroundColor: '#fff', borderRadius: 1 }}
          >
            {lockerAdmins.map((admin, index) => (
              <Tab
                key={admin.id}
                label={admin.name}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  color: index === selectedAdminIndex ? 'limegreen' : '#3d3b4e',
                }}
              />
            ))}
          </Tabs>

          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {Object.entries(metrics).length > 0 ? (
                Object.entries(metrics).map(([lockerName, data]) => (
                  <Grid item xs={12} md={6} key={lockerName}>
                    <Card sx={{ backgroundColor: '#3d3b4e', color: '#f9f5e8', padding: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                          {lockerName}
                        </Typography>

                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Aperturas Totales por Día
                        </Typography>
                        <Bar
                          key={`bar-chart-${lockerName}`}
                          data={generateBarChart(data?.total_openings_per_day || {})}
                        />

                        <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                          Hora de Apertura Más Común
                        </Typography>
                        {data?.hourly_opening_counts ? (
                          <Bar
                            key={`bar-chart-hourly-opening-${lockerName}`}
                            data={{
                              labels: Object.keys(data.hourly_opening_counts), // e.g., ["0", "1", "2", ..., "23"]
                              datasets: [
                                {
                                  label: 'Cantidad de Aperturas',
                                  data: Object.values(data.hourly_opening_counts), // e.g., [5, 10, 0, ..., 8]
                                  backgroundColor: 'limegreen',
                                },
                              ],
                            }}
                            options={{
                              scales: {
                                x: {
                                  title: {
                                    display: true,
                                    text: 'Hora del Día',
                                  },
                                },
                                y: {
                                  title: {
                                    display: true,
                                    text: 'Cantidad de Aperturas',
                                  },
                                },
                              },
                            }}
                          />
                        ) : (
                          <Typography variant="body2">No disponible</Typography>
                        )}

                        <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                          Intervalo de Tiempo Promedio Entre Aperturas
                        </Typography>
                        <Typography variant="body2">
                          {data?.average_interval_between_openings
                            ? `${data.average_interval_between_openings} minutos`
                            : 'No disponible'}
                        </Typography>

                        <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                          Tiempo Promedio Que Queda Abierto
                        </Typography>
                        <Typography variant="body2">
                          {data?.average_open_time
                            ? `${data.average_open_time} minutos`
                            : 'No disponible'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No hay métricas disponibles para este administrador.
                </Typography>
              )}
            </Grid>
          )}

        </>
      ) : (
        <Typography variant="body1">No hay administradores de casilleros disponibles.</Typography>
      )}
    </Box>
  );
}

export default HomePage;
