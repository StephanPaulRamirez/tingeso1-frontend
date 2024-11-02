import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import SimCardIcon from "@mui/icons-material/SimCard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidemenu({ open, toggleDrawer }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const listOptions = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        <ListItemButton onClick={() => navigate("/home")}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <Divider />

        {user && (
          <>
            <ListItemButton onClick={() => navigate("/simulate")}>
              <ListItemIcon>
                <SimCardIcon />
              </ListItemIcon>
              <ListItemText primary="Simular Préstamo" />
            </ListItemButton>

            <ListItemButton onClick={() => navigate("/loanRequest")}>
              <ListItemIcon>
                <AssignmentTurnedInIcon />
              </ListItemIcon>
              <ListItemText primary="Solicitar Préstamo" />
            </ListItemButton>

            <ListItemButton onClick={() => navigate("/requestTracking")}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Seguimiento de Solicitud" />
            </ListItemButton>

          </>
        )}

        <Divider />

        {user && user.role === 'ejecutivo' && (
          <ListItemButton onClick={() => navigate("/loanEvaluation")}>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Evaluación de Crédito" />
          </ListItemButton>
        )}

      </List>

      <Divider />
    </Box>
  );

  return (
    <div>
      <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
        {listOptions()}
      </Drawer>
    </div>
  );
}
