import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

function TopBar({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();

  // Open menu for logged-in user
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogoutClick = () => {
    handleMenuClose();
    onLogout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#3d3b4e' }}>
      <Toolbar>
        {user ? (
          <>
            <IconButton edge="start" color="inherit" aria-label="user">
              <AccountCircle sx={{ color: 'limegreen' }} />
            </IconButton>

            <Typography variant="h6" sx={{ flexGrow: 1, color: 'limegreen' }}>
              Bienvenido {user.name || user.email}
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
              {/* Lockers link */}
              <MenuItem component={Link} to="/lockers" onClick={handleMenuClose}>
                CASILLEROS
              </MenuItem>

              {/* Logout option */}
              <MenuItem onClick={handleLogoutClick}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'limegreen' }}>
              Bienvenido
            </Typography>

            <Button
              color="inherit"
              variant="outlined"
              sx={{ ml: 2 }}
              component={Link}
              to="/login"
            >
              LOG IN
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
