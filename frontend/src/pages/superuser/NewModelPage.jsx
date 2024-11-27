import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewModelForm() {
  const [name, setName] = useState("");
  const [gestures, setGestures] = useState(["", "", "", "", "", ""]);
  const [gestureImages, setGestureImages] = useState([]);
  const [file, setFile] = useState(null);
  const [fileAdded, setFileAdded] = useState(false); // State for model file
  const [imagesAdded, setImagesAdded] = useState(Array(6).fill(false)); // State for gesture images
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleGestureChange = (index, value) => {
    const updatedGestures = [...gestures];
    updatedGestures[index] = value;
    setGestures(updatedGestures);
  };

  const handleGestureImageChange = (index, file) => {
    if (file) {
      const updatedImages = [...gestureImages];
      updatedImages[index] = file;
      setGestureImages(updatedImages);
    } else {
      console.error("Invalid file input");
    }
  };
  

  const handleFileChange = (file) => {
    setFile(file);
    setFileAdded(true); // Indicate the model file was added
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (gestureImages.length !== 6) {
      setError("Debe proporcionar exactamente 6 imágenes para los gestos.");
      return;
    }
    if (gestures.some((gesture) => gesture.trim() === "")) {
      setError("Debe proporcionar exactamente 6 gestos.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    gestures.forEach((gesture, index) =>
      formData.append(`gestures[${index}]`, gesture)
    );
    gestureImages.forEach((image, index) =>
      formData.append(`gesture_images[${index}]`, image)
    );
    formData.append("file", file);

    const token = localStorage.getItem("authToken");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/superuser/models`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess(true);
      setError("");
      setTimeout(() => navigate("/models"), 2000); // Redirect after success
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el modelo. Intente nuevamente.");
      setSuccess(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f9f5e8",
        paddingTop: "80px",
      }}
    >
      <Typography
        variant="h4"
        sx={{ color: "#3d3b4e", fontWeight: "bold", mb: 4 }}
      >
        Crear Nuevo Modelo
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ¡Modelo creado con éxito!
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: 600,
        }}
      >
        <TextField
          label="Nombre del Modelo"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#3d3b4e" }}>
          Gestos
        </Typography>
        <Grid container spacing={2}>
          {gestures.map((gesture, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <TextField
                label={`Gesto ${index + 1}`}
                variant="outlined"
                value={gesture}
                onChange={(e) => handleGestureChange(index, e.target.value)}
                required
              />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#3d3b4e" }}>
          Imágenes de Gestos
        </Typography>
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  textAlign: "center",
                  backgroundColor: imagesAdded[index] ? "limegreen" : "inherit",
                  color: imagesAdded[index] ? "white" : "inherit",
                }}
              >
                {imagesAdded[index] ? "Imagen Subida" : `Subir Imagen ${index + 1}`}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      handleGestureImageChange(index, e.target.files[0]);
                    }
                  }}
                />
              </Button>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#3d3b4e" }}>
          Archivo del Modelo
        </Typography>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{
            backgroundColor: fileAdded ? "limegreen" : "inherit",
            color: fileAdded ? "White" : "inherit",
          }}
        >
          {fileAdded ? "Archivo Subido" : "Subir Archivo"}
          <input
            type="file"
            hidden
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ fontWeight: "bold", mt: 3 }}
        >
          Crear Modelo
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ fontWeight: "bold", mt: 1 }}
          onClick={() => navigate("/models")}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}

export default NewModelForm;
