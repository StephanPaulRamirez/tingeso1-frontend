import React, { useState } from 'react';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import userService from '../services/user.service';
import { Link } from 'react-router-dom';

const Register = () => {
  const [role, setRole] = useState('');
  const [rut, setRut] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/;
    if (!rutRegex.test(rut)) {
      setError("El RUT debe seguir el formato xx.xxx.xxx-x");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un correo electrónico válido.");
      return;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      setError("El nombre solo debe contener letras y espacios.");
      return;
    }
    
    const newUser = {
      rut,
      name,
      email,
      password,
      role,
    };

    try {
      const response = await userService.register(newUser);
      console.log("Usuario registrado:", response.data);

      if (!response.data) {
        setError("El usuario con este RUT ya existe.");
        setSuccess(false);
        return;
      }

      setSuccess(true);

      setRut('');
      setName('');
      setEmail('');
      setPassword('');
      setRole('');
      setError('');
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setError("Error al registrar el usuario. Por favor, inténtelo de nuevo.");
      setSuccess(false);
    }
  };

  return (
    <Paper style={{ padding: '2em', marginTop: '2em' }}>
      <Box sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Registrarse
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && (
          <Box sx={{ mb: 2 }}>
            <Typography color="success.main">¡Usuario registrado exitosamente!</Typography>
            <Typography>
              Ahora puedes <Link to="/login">iniciar sesión</Link>.
            </Typography>
          </Box>
        )}
        <form onSubmit={handleRegister}>
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
            label="Nombre"
            variant="outlined"
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Correo Electrónico"
            variant="outlined"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="role-label">Rol</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Rol"
            >
              <MenuItem value="cliente">Cliente</MenuItem>
              <MenuItem value="ejecutivo">Ejecutivo</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Registrarse
          </Button>
        </form>
      </Box>
    </Paper>
  );
};

export default Register;
