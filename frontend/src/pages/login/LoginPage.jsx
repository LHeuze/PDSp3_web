import React, { useState } from 'react';
import { Container, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      const { credential } = credentialResponse;
      if (credential) {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/google_sign_in`, {
          token: credential
        });

        const token = response.data['token'];
        if (token) {
          localStorage.setItem('authToken', token);
          const user = response.data.user;

          if (user) {
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/');
          } else {
            const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/current_user`);
            setUser(userResponse.data);
            localStorage.setItem('user', JSON.stringify(userResponse.data));
            navigate('/');
          }
        } else {
          setError('Google login failed: No token received.');
        }
      } else {
        setError('Google login failed: No credential received.');
      }
    } catch (err) {
      setError('Google login failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Login Error:', error);
    setError('Google login failed. Please try again.');
  };

  return (
    <Box 
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f5e8'
      }}
    >
      <Container 
        maxWidth="xs"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: 3
        }}
      >
        <Box sx={{ textAlign: 'center', marginBottom: '24px' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#3d3b4e' }}>
            Bienvenido!
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Porfavor conectate con Google para continuar
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <CircularProgress sx={{ color: '#3d3b4e', margin: '20px' }} />
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            useOneTap
            render={(renderProps) => (
              <Box
                component="button"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                sx={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#4285F4',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: 1,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    backgroundColor: '#357ae8'
                  }
                }}
              >
                Conéctate con Google
              </Box>
            )}
          />
        )}
      </Container>
    </Box>
  );
};

export default Login;
