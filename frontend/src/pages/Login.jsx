import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// simple helper to check localStorage for userFlag
const isLoggedIn = () => !!localStorage.getItem('userFlag');

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/'); // redirect if already logged in
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Save userFlag in localStorage to mark logged in
      localStorage.setItem('userFlag', JSON.stringify(data.user));

      navigate('/'); // redirect on successful login
    } 
    // eslint-disable-next-line no-unused-vars
    catch (err) {
      setError('Network error');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Username: 
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br/>

        <label>
          Password: 
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br/>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
