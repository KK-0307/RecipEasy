import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LoginPage component that handles user authentication.
 * Users can enter their username and password to log in.
 * Successful login redirects the user to the homepage and stores user data locally.
 */
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  /**
   * Handles the form submission for login.
   * Sends username and password to the server and processes the response.
   */
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // If login is successful, store the token and username in local storage
        localStorage.setItem('token', data.token);  // Save the token locally
        localStorage.setItem('username', data.username); // Store the username in the local storage
        navigate('/');  // redirect to the homepage
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'white',
        padding: '40px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#FFA500',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Log In</button>
      </form>
      {error && <p>{error}</p>}
    </div>
</div>
  );
}

export default LoginPage;
