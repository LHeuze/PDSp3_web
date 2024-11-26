import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, List, ListItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ShowLockerPage() {
  const { lockerId } = useParams();
  const [locker, setLocker] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/lockers/${lockerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setLocker(response.data);
      })
      .catch(error => {
        console.error("Error fetching locker:", error);
      });
  }, [lockerId]);

  if (!locker) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f9f5e8',
        minHeight: '100vh',
        width: '100vw',
        padding: 4,
        textAlign: 'center',
        paddingTop: '80px',
      }}
    >
      <Typography variant="h4" sx={{ color: '#3d3b4e', fontWeight: 'bold', marginBottom: 4 }}>
        Casillero {locker.number}
      </Typography>
      <Card sx={{ maxWidth: 500, width: '100%', backgroundColor: '#3d3b4e', color: '#f9f5e8' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ marginTop: 2 }}>
            {locker.name}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Dueño: {locker.owner_email}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Ultima apertura: {new Date(locker.last_opened).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Ultimo cierre: {new Date(locker.last_closed).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2, fontWeight: 'bold' }}>
            Contraseña:
          </Typography>
          <List sx={{ display: 'flex', justifyContent: 'center', padding: 0 }}>
            {locker.password.map((gesture, index) => (
              <ListItem key={index} sx={{ marginX: 1, padding: 0 }}>
                {gesture}
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            sx={{ marginTop: 2, backgroundColor: 'limegreen', color: '#3d3b4e' }}
            onClick={() => navigate(`/lockers/${lockerId}/log`)}
          >
            Ver Historial de Aperturas y Cierres
          </Button>
          <Button
            variant="contained"
            sx={{ marginTop: 2, backgroundColor: 'limegreen', color: '#3d3b4e' }}
            onClick={() => navigate(`/lockers/${lockerId}/edit`)}
          >
            Editar Casillero
          </Button>
        </CardContent>
      </Card>
      <Button
        variant="contained"
        sx={{ marginTop: 2, backgroundColor: 'limegreen', color: '#3d3b4e' }}
        onClick={() => navigate(`/locker_administrators/${locker.locker_administrator_id}/lockers`)}
      >
        Volver atrás
      </Button>
    </Box>
  );
}

export default ShowLockerPage;
