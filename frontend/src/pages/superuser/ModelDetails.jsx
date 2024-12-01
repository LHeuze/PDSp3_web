import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  TextField,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

function ModelDetails() {
  const { id } = useParams(); // Get model ID from the URL
  const [model, setModel] = useState(null);
  const [error, setError] = useState("");
  const [editingModel, setEditingModel] = useState(false);
  const [modelName, setModelName] = useState("");
  const [modelFile, setModelFile] = useState(null);
  const [gestureEdits, setGestureEdits] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchModelDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchModelDetails = () => {
    const token = localStorage.getItem("authToken");

    axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/superuser/models/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setModel(response.data);
        setModelName(response.data.name);
      })
      .catch((err) => {
        console.error("Error fetching model details:", err);
        setError(
          "No se pudieron cargar los detalles del modelo. Intenta nuevamente."
        );
      });
  };

  const handleModelEditToggle = () => {
    setEditingModel(!editingModel);
  };

  const handleModelSave = () => {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("model[name]", modelName);
    if (modelFile) {
      formData.append("model[file]", modelFile);
    }

    axios
      .put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/superuser/models/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        setEditingModel(false);
        fetchModelDetails();
      })
      .catch((err) => {
        console.error("Error updating model:", err);
        setError("Error actualizando el modelo. Intenta nuevamente.");
      });
  };

  const handleGestureChange = (gestureId, field, value) => {
    setGestureEdits((prevEdits) => ({
      ...prevEdits,
      [gestureId]: {
        ...prevEdits[gestureId],
        [field]: value,
      },
    }));
  };

  const handleGestureSave = (gestureId) => {
    const token = localStorage.getItem("authToken");
    const gestureEdit = gestureEdits[gestureId];
    const formData = new FormData();
    if (gestureEdit.name !== undefined) {
      formData.append("gesture[name]", gestureEdit.name);
    }
    if (gestureEdit.image !== undefined) {
      formData.append("gesture[image]", gestureEdit.image);
    }

    axios
      .put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/superuser/gestures/${gestureId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        // Remove the edits for this gesture
        setGestureEdits((prevEdits) => {
          const newEdits = { ...prevEdits };
          delete newEdits[gestureId];
          return newEdits;
        });
        fetchModelDetails();
      })
      .catch((err) => {
        console.error("Error updating gesture:", err);
        setError("Error actualizando el gesto. Intenta nuevamente.");
      });
  };

  if (!model) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          minHeight: "100vh",
          backgroundColor: "#f9f5e8",
        }}
      >
        {error ? (
          <Typography
            variant="body1"
            sx={{ color: "red", fontWeight: "bold" }}
          >
            {error}
          </Typography>
        ) : (
          <Typography variant="h6">Cargando detalles del modelo...</Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f9f5e8",
        padding: 4,
        paddingTop: "80px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {editingModel ? (
          <TextField
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            label="Nombre del Modelo"
            variant="outlined"
            sx={{ mr: 2 }}
          />
        ) : (
          <Typography
            variant="h4"
            sx={{
              color: "#3d3b4e",
              fontWeight: "bold",
              mb: 4,
              textAlign: "center",
            }}
          >
            Detalles del Modelo: {model.name}
          </Typography>
        )}
        <IconButton
          onClick={editingModel ? handleModelSave : handleModelEditToggle}
        >
          {editingModel ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>
      {editingModel && (
        <Box sx={{ mb: 4 }}>
          <input
            type="file"
            onChange={(e) => setModelFile(e.target.files[0])}
          />
        </Box>
      )}
      <Grid container spacing={3} justifyContent="center">
        {model.gestures.map((gesture) => {
          const isEditingGesture = !!gestureEdits[gesture.id];
          const gestureEdit = gestureEdits[gesture.id] || {};
          return (
            <Grid item xs={12} sm={6} md={4} key={gesture.id}>
              <Card
                sx={{
                  backgroundColor: "#3d3b4e",
                  color: "#f9f5e8",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                {/* Image Section */}
                {isEditingGesture && gestureEdit.image ? (
                  <CardMedia
                    component="img"
                    image={URL.createObjectURL(gestureEdit.image)}
                    alt={`Gesto ${gesture.name}`}
                    sx={{
                      height: "200px",
                      width: "100%",
                      objectFit: "contain",
                      backgroundColor: "#f9f5e8",
                      padding: "10px",
                    }}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    image={`${import.meta.env.VITE_API_BASE_URL}${gesture.image_url}`}
                    alt={`Gesto ${gesture.name}`}
                    sx={{
                      height: "200px",
                      width: "100%",
                      objectFit: "contain",
                      backgroundColor: "#f9f5e8",
                      padding: "10px",
                    }}
                  />
                )}
                {/* Text Section */}
                <CardContent
                  sx={{
                    padding: 2,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {isEditingGesture ? (
                    <>
                      <TextField
                        value={gestureEdit.name || gesture.name}
                        onChange={(e) =>
                          handleGestureChange(
                            gesture.id,
                            "name",
                            e.target.value
                          )
                        }
                        label="Nombre del Gesto"
                        variant="outlined"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleGestureChange(
                            gesture.id,
                            "image",
                            e.target.files[0]
                          )
                        }
                      />
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => handleGestureSave(gesture.id)}
                      >
                        Guardar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {gesture.name}
                      </Typography>
                      <Button
                        variant="text"
                        startIcon={<EditIcon />}
                        onClick={() =>
                          setGestureEdits({
                            ...gestureEdits,
                            [gesture.id]: { name: gesture.name },
                          })
                        }
                        sx={{ mt: 2, color: "#f9f5e8" }}
                      >
                        Editar
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Button
        variant="contained"
        sx={{
          mt: 4,
          backgroundColor: "limegreen",
          color: "black",
          fontWeight: "bold",
        }}
        onClick={() => navigate("/models")}
      >
        Volver a la Gestión de Modelos
      </Button>
    </Box>
  );
}

export default ModelDetails;
