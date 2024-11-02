import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Sidemenu from "./Sidemenu";
import { Link } from "react-router-dom";
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const toggleDrawer = (open) => (event) => {
    setOpen(open);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PrestaBanco: Sistema de Gestión de préstamos hipotecarios
          </Typography>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <AccountCircle />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {user.name} ({user.rut})
              </Typography>
              <Button color="inherit" onClick={logout}>Cerrar Sesión</Button>
            </Box>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Iniciar sesión</Button>
              <Button color="inherit" component={Link} to="/register">Registrarse</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Sidemenu open={open} toggleDrawer={toggleDrawer}></Sidemenu>
    </Box>
  );
}
