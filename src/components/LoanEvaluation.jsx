import React, { useState } from 'react';
import loanService from '../services/loanrequest.service';
import { Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoanSearch = () => {
  const [rut, setRut] = useState('');
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await loanService.tracking(rut);
      setLoanRequests(response.data);
      if (response.data.length === 0) {
        setError('No se encontraron solicitudes para el RUT ingresado.');
      }
    } catch (err) {
      setError('Error al buscar las solicitudes.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = (id) => {
    navigate(`/evaluate/${id}`);
  };

  return (
    <Paper style={{ padding: '2em', marginTop: '2em' }}>
      <div style={{ marginTop: '2em' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Buscar Solicitudes por RUT
        </Typography>
        <TextField
          label="RUT"
          variant="outlined"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          fullWidth
          disabled={loading || !rut}
        >
          Buscar
        </Button>

        {loading && <Typography variant="h6">Cargando...</Typography>}
        {error && <Alert severity="error">{error}</Alert>}

        {loanRequests.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Costos Finales</TableCell>
                  <TableCell>Cuota Mensual</TableCell>
                  <TableCell>Evaluar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loanRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.loanType}</TableCell>
                    <TableCell>{request.requestedAmount}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>{request.finalCosts}</TableCell>
                    <TableCell>{request.monthlyInstallment}</TableCell>
                    <TableCell>
                      {request.status !== 'Cancelada por el Cliente' &&
                       request.status !== 'Rechazada' &&
                       request.status !== 'En Desembolso' && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleEvaluate(request.id)}
                        >
                          Evaluar
                        </Button>
                      )}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </Paper>
  );
};

export default LoanSearch;
