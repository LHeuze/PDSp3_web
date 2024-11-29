import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditLockerPage() {
  const { lockerId } = useParams();
  const [locker, setLocker] = useState(null);
  const [gestures, setGestures] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Fetch locker details
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/lockers/${lockerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLocker(response.data);
        setGestures(response.data.gestures || []); // Assuming gestures are part of locker data
      })
      .catch((error) => {
        console.error('Error fetching locker:', error);
        setError('Failed to fetch locker details.');
      });
  }, [lockerId]);

  const handleSave = () => {
    const payload = {
      password: locker.password,  // If password is an array, ensure it's formatted correctly
      owner_email: locker.owner_email,
    };
    axios
      .put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/lockers/${lockerId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        navigate(`/lockers/${lockerId}`);
      })
      .catch((error) => {
        console.error('Error updating locker:', error);
        setError('Failed to save changes.');
      });
  };

  const handlePasswordChange = (index, value) => {
    const newPassword = [...locker.password];
    newPassword[index] = value;
    setLocker({ ...locker, password: newPassword });
  };

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
      <Typography
        variant="h4"
        sx={{ color: '#3d3b4e', fontWeight: 'bold', marginBottom: 4 }}
      >
        Editar Casillero {locker.number}
      </Typography>

      {/* Error Display */}
      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      {/* Editable Fields */}
      <TextField
        label="Email"
        value={locker.owner_email || ''}
        onChange={(e) => setLocker({ ...locker, owner_email: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      {/* Password Modification */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2, color: 'black' }}>
        Gestos de la contraseña
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginTop: 2, justifyContent: 'center' }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <FormControl key={index} sx={{ minWidth: 120 }}>
            <InputLabel>Gesto {index + 1}</InputLabel>
            <Select
              value={locker.password[index] || ''}  // Default value is the current gesture
              label={`Gesto ${index + 1}`}
              onChange={(e) => handlePasswordChange(index, e.target.value)}  // Handle new selection
              disabled={!gestures.length}  // Disable if gestures are not loaded
              displayEmpty  // Show empty placeholder when no value is selected
            >
              {/* If no gesture has been selected yet, display a default prompt */}
              <MenuItem value="" disabled>
                {locker.password[index] ? `Seleccionado: ${locker.password[index]}` : 'Selecciona un gesto'}
              </MenuItem>

              {/* Display all available gestures */}
              {gestures.map((gesture) => (
                <MenuItem key={gesture.name} value={gesture.name}>
                  {gesture.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </Box>

      <Button
        variant="contained"
        sx={{ marginTop: 3, backgroundColor: 'limegreen', color: '#3d3b4e' }}
        onClick={handleSave}
        disabled={!gestures.length}
      >
        Guardar cambios
      </Button>

      <Button
        variant="contained"
        sx={{ marginTop: 2, backgroundColor: 'gray', color: '#f9f5e8' }}
        onClick={() => navigate(-1)}
      >
        Cancelar
      </Button>
    </Box>
  );
}

export default EditLockerPage;
