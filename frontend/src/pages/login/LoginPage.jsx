// src/pages/login/Login.jsx

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/sign_in`, {
        user: { email, password }
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
        setError('Login failed: No token received.');
      }
    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

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
    <Container 
      maxWidth="sm" 
      sx={{ 
        background: 'white', 
        marginTop: '100px', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: 3 
      }}
    >
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#3d3b4e', fontWeight: 'bold' }}>
        Login
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
          sx={{ mt: 3, mb: 2, padding: '10px' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>

      <Typography variant="body1" align="center" sx={{ mb: 2 }}>
        OR
      </Typography>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
        useOneTap
      />

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Don't have an account?{' '}
        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate('/signup')}
          sx={{ textTransform: 'none' }}
        >
          Sign Up
        </Button>
      </Typography>
    </Container>
  );
};

export default Login;
