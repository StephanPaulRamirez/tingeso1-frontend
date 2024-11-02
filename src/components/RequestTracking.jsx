import React, { useState, useEffect } from 'react';
import loanService from '../services/loanrequest.service';
import { useAuth } from '../context/AuthContext';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const RequestTracking = () => {
  const { user } = useAuth();
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        setLoading(true);
        const response = await loanService.tracking(user.rut);
        setLoanRequests(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.rut) {
      fetchLoanRequests();
    }
  }, [user]);

  const handleAcceptTerms = async (id) => {
    try {
      const confirmed = window.confirm("¿Estás seguro de querer aceptar los terminos? Esto implica aceptar costos finales como cuota mensual");

      if (!confirmed) {
        return;
      }
      const response = await loanService.getLoanDetails(id);
      const currentLoan = response.data;

      const updatedLoan = { ...currentLoan, status: 'En Aprobación Final' };
      await loanService.updateLoan(id, updatedLoan);

      setLoanRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: 'En Aprobación Final' } : request
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado de la solicitud:", error);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      const confirmed = window.confirm("¿Estás seguro de querer cancelar esta solicitud?");

      if (!confirmed) {
        return;
      }
      const response = await loanService.getLoanDetails(id);
      const currentLoan = response.data;

      const excludedStatuses = ['Aprobada', 'Rechazada', 'Cancelada por el Cliente', 'En Desembolso'];
      if (!excludedStatuses.includes(currentLoan.status)) {
        const updatedLoan = { ...currentLoan, status: 'Cancelada por el Cliente' };
        await loanService.updateLoan(id, updatedLoan);

        setLoanRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === id ? { ...request, status: 'Cancelada por el Cliente' } : request
          )
        );
      } else {
        console.log("No se puede cancelar la solicitud, ya tiene un estado excluido.");
      }
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
    }
  };

  if (loading) {
    return <Typography variant="h6">Cargando solicitudes...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">Error: {error}</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Costos Finales</TableCell>
            <TableCell>Cuota Mensual</TableCell>
            <TableCell>Acciones Necesarias</TableCell>
            <TableCell>Cancelar Solicitud</TableCell>
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
                {request.status === 'Pre-Aprobada' && (
                  <Button onClick={() => handleAcceptTerms(request.id)}>Aceptar Términos</Button>
                )}
              </TableCell>

              <TableCell>
                {!['Aprobada', 'Rechazada', 'Cancelada por el Cliente', 'En Desembolso'].includes(request.status) && (
                  <Button onClick={() => handleRejectRequest(request.id)}>Cancelar Solicitud</Button>
                )}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestTracking;
