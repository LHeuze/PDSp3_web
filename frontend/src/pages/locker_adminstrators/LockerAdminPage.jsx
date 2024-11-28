import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LockerAdministratorsPage() {
  const [administrators, setAdministrators] = useState([]);
  const [currentModel, setCurrentModel] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    const handleEdit = (id, currentName) => {
      setEditingId(id);
      setEditedName(currentName);
    };
  
    const handleSave = (id) => {
      const token = localStorage.getItem('authToken');
  
      axios
        .patch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/locker_administrators/${id}`,
          { name: editedName },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((response) => {
          setAdministrators((prevAdmins) =>
            prevAdmins.map((admin) =>
              admin.id === id ? { ...admin, name: response.data.name } : admin
            )
          );
          setEditingId(null); // Exit edit mode
        })
        .catch((error) => {
          console.error('Error updating locker administrator:', error);
          setError('Failed to update the name. Please try again.');
        });
    };
  
    const handleCancel = () => {
      setEditingId(null);
      setEditedName('');
    };

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/locker_administrators`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => setAdministrators(response.data))
      .catch((error) => {
        console.error('Error fetching locker administrators:', error);
        setError('Failed to load locker administrators. Please try again.');
      });

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/models`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setModels(response.data.models);
        setCurrentModel(response.data.current_model);
      })
      .catch((error) => {
        console.error('Error fetching models:', error);
        setError('Failed to load model information. Please try again.');
      });
  }, []);

  const handleChangeModel = () => {
    const token = localStorage.getItem('authToken');
    axios
      .patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/update_model`,
        { model_id: selectedModelId },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setCurrentModel(models.find((model) => model.id === selectedModelId));
        setError('');
        alert('Model updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating model:', error);
        setError('Failed to update the model. Please try again.');
      });
  };

  const handleAddAdministrator = () => {
    navigate('/locker_administrators/new');
  };

  const handleViewLockers = (lockerAdministratorId) => {
    navigate(`/locker_administrators/${lockerAdministratorId}/lockers`);
  };

  const handleBack = () => {
    navigate('/');
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
      <Typography
        variant="h4"
        sx={{ color: '#3d3b4e', fontWeight: 'bold', marginBottom: 4 }}
      >
        ADMINISTRADORES DE CASILLEROS
      </Typography>

      {/* Current Model Section */}
      <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
        {currentModel ? (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="select-model-label">
              Modelo Actual: {currentModel?.name}
            </InputLabel>
            <Select
              labelId="select-model-label"
              value={selectedModelId || currentModel?.id}
              onChange={(e) => setSelectedModelId(e.target.value)}
            >
              {models.map((model) => (
                <MenuItem key={model.id} value={model.id}>
                  {model.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3d3b4e' }}>
            Cargando modelo actual...
          </Typography>
        )}
        <Button
          variant="contained"
          sx={{
            marginTop: 2,
            backgroundColor: 'limegreen',
            color: '#3d3b4e',
            marginLeft:'20px'
          }}
          onClick={handleChangeModel}
          disabled={!selectedModelId || selectedModelId === currentModel?.id}
        >
          Guardar Modelo
        </Button>
      </Box>

      {/* Error Display */}
      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      {/* Locker Administrators Section */}
      <Grid container spacing={3} justifyContent="center">
        {administrators.map((admin) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={admin.id}>
            <Card sx={{ backgroundColor: '#3d3b4e', color: '#f9f5e8', padding: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                {editingId === admin.id ? (
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
                      onClick={() => handleSave(admin.id)}
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
                  <>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                      {admin.name}<IconButton
                      sx={{ color: 'limegreen' }}
                      onClick={() => handleEdit(admin.id, admin.name)}
                    >
                      <Edit />
                    </IconButton>
                    </Typography>
                    
                  </>
                )}
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  Casilleros activos: {admin.amount_of_lockers || 'No especificado'}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: 'italic',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: admin.status === 'connected' ? 'limegreen' : 'red',
                    fontWeight: 'bold',
                    marginTop: 2, // Optional spacing adjustment
                  }}
                >
                  Estado: 
                  {admin.status === 'connected' ? (
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          backgroundColor: 'limegreen',
                          borderRadius: '50%',
                          marginRight: 1,
                        }}
                      />
                      Conectado
                    </Box>
                  ) : (
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          backgroundColor: 'red',
                          borderRadius: '50%',
                          marginRight: 1,
                        }}
                      />
                      No conectado
                    </Box>
                  )}
                </Typography>


              </CardContent>
              <Button
                variant="contained"
                sx={{
                  marginRight: 2,
                  backgroundColor: 'limegreen',
                  color: '#3d3b4e',
                  fontWeight: 'bold',
                }}
                onClick={() => handleViewLockers(admin.id)} // Corrected onClick
              >
                VER CASILLEROS
              </Button>

            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'limegreen',
            color: '#3d3b4e',
            fontWeight: 'bold',
            marginRight: 2,
          }}
          onClick={handleAddAdministrator}
        >
          AGREGAR CONTROLADOR
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#3d3b4e',
            color: '#f9f5e8',
            fontWeight: 'bold',
          }}
          onClick={handleBack}
        >
          VOLVER ATRÁS
        </Button>
      </Box>
    </Box>
  );
}

export default LockerAdministratorsPage;
