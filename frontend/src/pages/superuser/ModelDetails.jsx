import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button, Card, CardContent, CardMedia } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ModelDetails() {
  const { id } = useParams(); // Get model ID from the URL
  const [model, setModel] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/superuser/models/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModel(response.data);
      })
      .catch((err) => {
        console.error("Error fetching model details:", err);
        setError("No se pudieron cargar los detalles del modelo. Intenta nuevamente.");
      });
  }, [id]);

  if (!model) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: '100vw',
          minHeight: "100vh",
          backgroundColor: "#f9f5e8",
        }}
      >
        {error ? (
          <Typography variant="body1" sx={{ color: "red", fontWeight: "bold" }}>
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
        width: '100vw',
        backgroundColor: "#f9f5e8",
        padding: 4,
        paddingTop: "80px",
      }}
    >
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

      <Grid container spacing={3} justifyContent="center">
        {model.gestures.map((gesture, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                backgroundColor: "#3d3b4e",
                color: "#f9f5e8",
                textAlign: "center",
                display: "flex",
                flexDirection: "column", // Ensures vertical stacking
                height: "100%", // Consistent card height
                overflow: "hidden", // Prevents content from spilling
              }}
            >
              {/* Image Section */}
              <CardMedia
                component="img"
                image={`${import.meta.env.VITE_API_BASE_URL}${gesture.image_url}`} // Use the correct key returned from the backend
                alt={`Gesto ${gesture.name}`}
                sx={{
                  height: "200px",
                  width: "100%",
                  objectFit: "contain",
                  backgroundColor: "#f9f5e8",
                  padding: "10px",
                }}
              />
              {/* Text Section */}
              <CardContent
                sx={{
                  padding: 2,
                  flexGrow: 1, // Ensures this section expands properly
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {gesture.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
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
