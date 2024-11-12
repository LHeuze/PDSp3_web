// src/pages/ShowLockerPage.jsx

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, List, ListItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, LockOpen } from '@mui/icons-material';

function ShowLockerPage() {
  const { lockerId } = useParams();
  const [locker, setLocker] = useState(null);
  const navigate = useNavigate();

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
        paddingTop:'80px'
      }}
    >
      <Typography variant="h4" sx={{ color: '#3d3b4e', fontWeight: 'bold', marginBottom: 4 }}>
        {locker.number}
      </Typography>
      <Card sx={{ maxWidth: 500, width: '100%', backgroundColor: '#3d3b4e', color: '#f9f5e8' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {locker.status === 'locked' ? "Locked" : "Unlocked"}
          </Typography>
          {locker.status === 'locked' ? (
            <Lock sx={{ fontSize: 50, color: '#ffffff', marginY: 2 }} />
          ) : (
            <LockOpen sx={{ fontSize: 50, color: 'limegreen', marginY: 2 }} />
          )}
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Owner: {locker.owner.email}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Last Accessed: {new Date(locker.last_accessed).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Model Version: {locker.model_version}
          </Typography>
          
          <Typography variant="body1" sx={{ marginTop: 2, fontWeight: 'bold' }}>
            Password:
          </Typography>
          <List sx={{ display: 'flex', justifyContent: 'center', padding: 0 }}>
            {locker.password.map((gesture, index) => (
              <ListItem key={index} sx={{ marginX: 1, padding: 0 }}>
                {gesture}
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, marginTop: 2 }}>
            <Button
                variant="contained"
                sx={{ marginTop: 3, backgroundColor: 'limegreen', color: '#3d3b4e' }}
                onClick={() => navigate(`/lockers/${lockerId}/edit`)} // Navigate to EditLockerPage
            >
                Edit Locker
            </Button>

            <Button
                variant="contained"
                sx={{ marginTop: 2, backgroundColor: 'limegreen', color: '#3d3b4e' }}
                onClick={() => navigate(-1)} // Navigate back to the previous page
            >
                Go Back
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ShowLockerPage;
