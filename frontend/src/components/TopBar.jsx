// src/components/TopBar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

function TopBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#3d3b4e' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="user">
          <AccountCircle sx={{ color: 'limegreen' }} />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'limegreen' }}>
          USERNAME
        </Typography>
        <Button
          color="inherit"
          onClick={handleMenuOpen}
          sx={{ textTransform: 'none', fontWeight: 'bold' }}
        >
          MENU
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Dashboard</MenuItem>
          <MenuItem onClick={handleMenuClose}>Agregar Controlador</MenuItem>
          <MenuItem onClick={handleMenuClose}>Agregar o Ajustar Casillero</MenuItem>
        </Menu>
        <Button color="inherit" variant="outlined" sx={{ ml: 2 }}>
          SIGN IN
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
