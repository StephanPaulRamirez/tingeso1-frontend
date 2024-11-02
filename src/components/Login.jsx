import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper} from '@mui/material';
import userService from '../services/user.service';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();

    const credentials = {
      rut,
      password,
    };

    try {
      const response = await userService.login(credentials);
      console.log("Inicio de sesión exitoso:", response.data);

      if (!response.data) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }

      login(response.data);
      navigate('/home'); 

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <Paper style={{ padding: '2em', marginTop: '2em' }}>
      <Box sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Iniciar Sesión
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Rut"
            variant="outlined"
            margin="normal"
            required
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Iniciar Sesión
          </Button>
        </form>
      </Box>
    </Paper>
  );
};

export default Login;
