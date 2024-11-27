import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddNewLockerAdmin() {
  const [name, setName] = useState('');
  const [baseTopic, setBaseTopic] = useState('');
  const [amountOfLockers, setAmountOfLockers] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/locker_administrators`,
        {
          name,
          base_topic: baseTopic,
          amount_of_lockers: amountOfLockers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setSuccess(true);
        setError('');
        setTimeout(() => navigate('/locker_administrators'), 2000); // Redirect after 2 seconds
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to create a new locker administrator. Please try again.');
        setSuccess(false);
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f9f5e8',
        paddingTop: '100px'
      }}
    >
      <Typography variant="h4" sx={{ color: '#3d3b4e', fontWeight: 'bold', mb: 4 }}>
        Agregar Nuevo Administrador de casilleros
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>Locker Administrator created successfully!</Alert>}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <TextField
          label="Nombre"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Topico base"
          variant="outlined"
          value={baseTopic}
          onChange={(e) => setBaseTopic(e.target.value)}
          required
        />
        <TextField
          label="Cantidad de casilleros"
          variant="outlined"
          type="number"
          value={amountOfLockers}
          onChange={(e) => setAmountOfLockers(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ fontWeight: 'bold' }}
        >
          AGREGAR ADMINISTRADOR DE CASILLEROS
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ fontWeight: 'bold' }}
          onClick={() => navigate('/locker_administrators')}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}

export default AddNewLockerAdmin;
