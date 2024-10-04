import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Component for handling user registration. Users can enter a username and password
 * to create an account. Successful registration redirects to the login page.
 */
function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /**
   * Handles form submission for registering a new user.
   * Submits username and password to the server and handles the response.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Make a POST request to the registration endpoint
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Attempts to parse the error message from JSON if registration fails
        let errorMsg = 'Failed to register';
        try {
          const errorData = await response.json(); // Attempt to parse JSON
          errorMsg = errorData.message || errorMsg; // Use the error message from JSON if available
        } catch (parseError) {
          // Logs JSON parsing errors and does not modify the displayed error message
          console.error('Error parsing JSON:', parseError);
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('Signup successful', data);
      navigate('/login'); // Navigate to login on success
    } catch (error) {
      setError(error.message);
      console.error('Signup error:', error);
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
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p>{error}</p>}
    </div>
    </div>
  );
}

export default SignupPage;
