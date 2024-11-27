// src/pages/ModelManagement.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';

function ModelManagement() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/superuser/models`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setModels(response.data))
      .catch((error) => console.error('Error fetching models:', error));
  }, []);

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
          MANAGE MODELS
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Gestures</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>{model.id}</TableCell>
                  <TableCell>{model.name}</TableCell>
                  <TableCell>{model.gestures.join(', ')}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ mr: 2 }}
                    >
                      Edit
                    </Button>
                    <Button variant="outlined" color="error">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          sx={{ mt: 4, backgroundColor: '#f44336', color: '#fff', fontWeight: 'bold' }}
          onClick={() => navigate('/superuser/dashboard')}
        >
          Go Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
}

export default ModelManagement;
