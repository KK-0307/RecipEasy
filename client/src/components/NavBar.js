import React from 'react';
import { AppBar, Container, Toolbar, Typography, Button, useMediaQuery, useTheme } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';

/**
 * Custom Button styled for navigation using MUI's Button component.
 * @param {string} href - URL path for the navigation link.
 * @param {string} text - Text to display on the button.
 * @param {boolean} isMain - Determines if the button is for the main section.
 */
function NavButton({ href, text, isMain }) {
  return (
    <Button
      component={NavLink}
      to={href}
      color="inherit"
      sx={{
        mr: 3,
        fontFamily: 'monospace',
        fontWeight: isMain ? 700 : 500,
        letterSpacing: '.2rem',
        textTransform: 'none',
      }}
      exact
    >
      {text}
    </Button>
  );
}

/**
 * Navigation bar component that responds to screen size changes and user authentication state.
 * Displays different navigation links based on whether the user is logged in or not and adjusts layout for mobile screens.
 */
export default function NavBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // Retrieve username from local storage

  /**
   * Handles user logout: clears local storage and redirects to the login page.
   */
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <NavButton href="/" text="RecipEasy" isMain />
          {!isMobile && (
            <>
              <NavButton href="/ingredients" text="Ingredients" />
              <NavButton href="/contributors" text="Contributors" />
              <NavButton href="/stats" text="Stats" />
              <NavButton href="/search" text="Search Recipe" />
              {username ? (
                <>
                  <Typography variant="h6" style={{ flexGrow: 1, fontFamily: 'monospace', marginLeft: 'auto', letterSpacing: '.1rem' }}>
                    Welcome, {username}
                  </Typography>
                  <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <NavButton href='/login' text='Login' style={{ marginLeft: 'auto' }} />
                  <NavButton href='/signup' text='Sign Up' />
                </>
              )}
            </>
          )}
          {isMobile && (
            // Placeholder for mobile menu (e.g., Drawer or IconButton with Menu)
            <Button
              color="inherit"
              aria-label="open drawer"
              edge="end"
              sx={{ ml: 'auto' }}
            >
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
