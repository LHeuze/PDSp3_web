// src/pages/EditLockerPage.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditLockerPage() {
  const { lockerId } = useParams();
  const [locker, setLocker] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  
  // Define available gestures
  const gestures = ["fist", "five", "peace", "rad", "C", "thumb"];

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/lockers/${lockerId}`, {
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

  const handleSave = () => {
    // Only send permitted fields
    const payload = {
      password: locker.password,
      model_version: locker.model_version,
      owner_email: locker.owner_email
    };
    axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/lockers/${lockerId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        navigate(`/lockers/${lockerId}`);
      })
      .catch(error => {
        console.error("Error updating locker:", error);
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
        paddingTop: '80px'
      }}
    >
      <Typography variant="h4" sx={{ color: '#3d3b4e', fontWeight: 'bold', marginBottom: 4 }}>
        Editar Casillero {locker.number}
      </Typography>

      {/* Editable Fields */}
      <TextField
        label="Email"
        value={locker.owner_email || ""}
        onChange={(e) => setLocker({ ...locker, owner_email: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      {/* <TextField
        label="Model Version"
        value={locker.model_version}
        onChange={(e) => setLocker({ ...locker, model_version: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
    /> */}

      {/* Password Modification */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2, color: 'black' }}>
        Gestos de la contraseña
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginTop: 2, justifyContent: 'center' }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <FormControl key={index} sx={{ minWidth: 80 }}>
            <InputLabel>Gesto {index + 1}</InputLabel>
            <Select
              value={locker.password[index] || ""}
              label={`Gesture ${index + 1}`}
              onChange={(e) => handlePasswordChange(index, e.target.value)}
            >
              {gestures.map((gesture) => (
                <MenuItem key={gesture} value={gesture}>
                  {gesture}
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
