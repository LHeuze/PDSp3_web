// src/pages/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/superuser/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
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
          GESTIONAR USUARIOS
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Mail</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/superuser/users/${user.id}/edit`)}
                    >
                      Editar
                    </Button>
                    <Button variant="outlined" color="error" sx={{ ml: 2 }}>
                      BORRAR
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
          VOLVER AL DASHBOARD
        </Button>
      </Box>
    </Box>
  );
}

export default UserManagement;
