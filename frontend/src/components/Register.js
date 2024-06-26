import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box, Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { email, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data.msg === 'User already exists') {
        alert('Registration failed. User already exists.');
      } else {
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
          <Typography variant="h4">Join TodoApp</Typography>
          <Typography variant="body1">Manage your tasks efficiently</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField 
            label="Email" 
            variant="outlined" 
            margin="normal" 
            fullWidth 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <TextField 
            label="Password" 
            variant="outlined" 
            margin="normal" 
            fullWidth 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            InputProps={{
              endAdornment: (
                <FontAwesomeIcon 
                  icon={showPassword ? faEyeSlash : faEye} 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={{ cursor: 'pointer' }} 
                />
              )
            }}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>
          <Box textAlign="center">
            <Typography variant="body2">Already have an account? <Link to="/login">Login</Link></Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default Register;
