import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LockersPage() {
  const [lockers, setLockers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/lockers`)
      .then(response => {
        setLockers(response.data);
      })
      .catch(error => {
        console.error("Error fetching lockers:", error);
      });
  }, []);

  const handleViewDetails = (lockerId) => {
    navigate(`/lockers/${lockerId}`);
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#f9f5e8',
        minHeight: '100vh',
        width: '100vw',
        paddingTop: '80px',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" sx={{ color: '#3d3b4e', fontWeight: 'bold', marginBottom: 4 }}>
        CASILLEROS
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {lockers.map((locker) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={locker.id}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: '#f9f5e8', padding: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                  {locker.number}
                </Typography>
                {locker.status === 'locked' ? (
                  <Lock sx={{ fontSize: 50, color: '#ffffff', marginY: 2 }} />
                ) : (
                  <LockOpen sx={{ fontSize: 50, color: 'limegreen', marginY: 2 }} />
                )}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    marginTop: 2,
                    backgroundColor: 'limegreen',
                    color: '#3d3b4e',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    padding: '10px 0',
                  }}
                  onClick={() => handleViewDetails(locker.id)}
                >
                  VER DETALLES
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default LockersPage;
