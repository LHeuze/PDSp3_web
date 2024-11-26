import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, TextField, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function LockersPage() {
  const [lockers, setLockers] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null); // ID of the locker being edited
  const [editedName, setEditedName] = useState(''); // Temporary name for editing
  const navigate = useNavigate();
  const { adminId } = useParams(); // Get the locker administrator ID from the URL

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/locker_administrators/${adminId}/lockers`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setLockers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching lockers:', error);
        setError('Failed to load lockers. Please try again.');
      });
  }, [adminId]);

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditedName(currentName);
  };

  const handleSave = (id) => {
    const token = localStorage.getItem('authToken');

    axios
      .patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/lockers/${id}`,
        { name: editedName },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setLockers((prevLockers) =>
          prevLockers.map((locker) =>
            locker.id === id ? { ...locker, name: response.data.name } : locker
          )
        );
        setEditingId(null); // Exit edit mode
      })
      .catch((error) => {
        console.error('Error updating locker name:', error);
        setError('Failed to update the name. Please try again.');
      });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedName('');
  };
  
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

      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      {lockers.length === 0 && !error && (
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          No se encontraron casilleros.
        </Typography>
      )}

      <Grid container spacing={3} justifyContent="center">
        {lockers.map((locker) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={locker.id}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: '#f9f5e8', padding: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                {editingId === locker.id ? (
                  <Box>
                    <TextField
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{ marginBottom: 2, backgroundColor: '#fff', borderRadius: 1 }}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: 'limegreen',
                        color: '#3d3b4e',
                        marginRight: 1,
                      }}
                      onClick={() => handleSave(locker.id)}
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#f44336',
                        color: '#fff',
                      }}
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {locker.name}
                    <IconButton
                      sx={{ color: 'limegreen' }}
                      onClick={() => handleEdit(locker.id, locker.name)}
                    >
                      <Edit />
                    </IconButton>
                  </Typography>
                )}

                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  Última apertura: {new Date(locker.last_opened).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  Último cierre: {new Date(locker.last_closed).toLocaleString()}
                </Typography>
              </CardContent>
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
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        sx={{ marginTop: 2, backgroundColor: 'limegreen', color: '#3d3b4e' }}
        onClick={() => navigate('/locker_administrators')}
      >
        Volver atrás
      </Button>
    </Box>
  );
}

export default LockersPage;
