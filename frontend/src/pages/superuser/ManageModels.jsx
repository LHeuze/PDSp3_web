import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ManageModels() {
  const [models, setModels] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDeleteModel = (modelId) => {
    const token = localStorage.getItem("authToken");
  
    axios
      .delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/superuser/models/${modelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Remove the deleted model from the state
        setModels((prevModels) => prevModels.filter((model) => model.id !== modelId));
        setError('');
      })
      .catch((err) => {
        console.error("Error deleting model:", err);
        setError("No se pudo eliminar el modelo. Intenta nuevamente.");
      });
  };
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/superuser/models`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModels(response.data);
        console.log(response.data)
      })
      .catch((err) => {
        console.error("Error fetching models:", err);
        setError("No se pudieron cargar los modelos. Intenta nuevamente.");
      });
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#f9f5e8",
        overflowY: "auto",
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography
          variant="h4"
          sx={{ color: "#3d3b4e", fontWeight: "bold", mb: 4 }}
        >
          Gestión de Modelos
        </Typography>

        <Button
          variant="contained"
          color="success"
          sx={{ fontWeight: "bold", fontSize: "1rem", mb: 3 }}
          onClick={() => navigate("/models/new")}
        >
          Crear Nuevo Modelo
        </Button>

        {error && (
          <Typography
            variant="body1"
            sx={{
              color: "red",
              fontWeight: "bold",
              mb: 3,
            }}
          >
            {error}
          </Typography>
        )}

        <TableContainer
          component={Paper}
          sx={{
            maxWidth: "100%",
            overflowX: "auto",
            margin: "auto",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Table>
            <TableHead
              sx={{
                backgroundColor: "#3d3b4e",
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    color: "#f9f5e8",
                    fontWeight: "bold",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f9f5e8",
                    fontWeight: "bold",
                  }}
                >
                  Nombre
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f9f5e8",
                    fontWeight: "bold",
                  }}
                >
                  Gestos
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f9f5e8",
                    fontWeight: "bold",
                  }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>{model.id}</TableCell>
                  <TableCell>{model.name}</TableCell>
                  {/* Display the gestures names */}
                  <TableCell>{model.gestures.map((gesture) => gesture.name).join(", ")}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => navigate(`/models/${model.id}/details`)}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteModel(model.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          sx={{
            mt: 4,
            backgroundColor: "#3d3b4e",
            color: "#f9f5e8",
            fontWeight: "bold",
          }}
          onClick={() => navigate("/superuser/dashboard")}
        >
          Volver al Dashboard
        </Button>
      </Box>
    </Box>
  );
}

export default ManageModels;
