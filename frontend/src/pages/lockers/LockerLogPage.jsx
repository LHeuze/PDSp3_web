import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function LockerLogPage() {
  const { lockerId } = useParams();
  const [logEntries, setLogEntries] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/lockers/${lockerId}/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setLogEntries(response.data);
      })
      .catch(error => {
        console.error("Error fetching locker log:", error);
      });
  }, [lockerId]);

  // Format function for DD/MM/YY and HH:MM:SS
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const formattedTime = date.toLocaleTimeString(); // HH:MM:SS
    return `${formattedDate} ${formattedTime}`;
  };

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
        Historial de Aperturas y Cierres - Casillero {lockerId}
      </Typography>
      <List sx={{ maxWidth: 600, width: '100%', backgroundColor: '#ffffff', borderRadius: 2, padding: 2 }}>
        {logEntries.map((entry, index) => (
          <ListItem key={index} sx={{ borderBottom: '1px solid #e0e0e0' }}>
            <ListItemText
              primary={`${entry.event_type === 'opened' ? 'Apertura' : 'Cierre'}`}
              secondary={`Fecha y Hora: ${formatDateTime(entry.event_timestamp)}`}
              primaryTypographyProps={{ sx: { color: '#3d3b4e', fontWeight: 'bold' } }}
              secondaryTypographyProps={{ sx: { color: '#3d3b4e' } }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default LockerLogPage;
