import React, { useState, useEffect } from 'react';
import loanService from '../services/loanrequest.service';
import documentService from '../services/document.service';
import { Typography, Checkbox, FormControlLabel, FormGroup, MenuItem, TextField, Button, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';

const LoanEvaluation = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);

  const statusOptions = [
    'En Revisión Inicial', 'En Evaluación', 'Pre-Aprobada', 'En Aprobación Final',
    'Aprobada', 'Rechazada', 'En Desembolso',
  ];

  const savingsOptions = ['Sólida', 'Moderada', 'Insuficiente'];

  const loanDetails = {
    'Primera Vivienda': ['- Comprobante de ingresos', '- Certificado de avalúo', '- Historial crediticio'],
    'Segunda Vivienda': ['- Comprobante de ingresos', '- Certificado de avalúo', '- Escritura de la primera vivienda', '- Historial crediticio'],
    'Propiedades Comerciales': ['- Estado financiero del negocio', '- Comprobante de ingresos', '- Certificado de avalúo', '- Plan de negocios'],
    'Remodelación': ['- Comprobante de ingresos', '- Presupuesto de la remodelación', '- Certificado de avalúo actualizado'],
  };

  const fieldLabels = {
    installmentToServiceRatio: 'Relación Cuota/Ingreso',
    creditHistory: 'Historial Crediticio del Cliente',
    employmentStability: 'Antigüedad Laboral y Estabilidad',
    debtToIncomeRatio: 'Relación Deuda/Ingreso',
    maximumFinancingAmount: 'Monto Máximo de Financiamiento',
    applicantAge: 'Edad del Solicitante',
  };

  const savingsCriteria = {
    minimumRequiredBalance: 'Saldo Mínimo Requerido',
    consistentSavingsHistory: 'Historial de Ahorro Consistente',
    periodicDeposits: 'Depósitos Periódicos',
    balanceToAgeRelationship: 'Relación Saldo/Años de Antigüedad',
    recentWithdrawals: 'Retiros Recientes',
  };

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await loanService.getLoanDetails(id);
        setLoan(response.data);
        
        const loanTypeDocuments = loanDetails[response.data.loanType] || [];
        setDocuments(loanTypeDocuments);

      } catch (error) {
        console.error('Error al cargar la solicitud:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoanDetails();
  }, [id]);

  const handleBooleanChange = (field) => {
    setLoan((prevLoan) => {
      const updatedLoan = { ...prevLoan, [field]: !prevLoan[field] };
      const criteriaMet = Object.keys(savingsCriteria).filter((key) => updatedLoan[key]).length;
      if (criteriaMet === 5) {
        updatedLoan.savingsCapacity = 'Sólida';
      } else if (criteriaMet >= 3) {
        updatedLoan.savingsCapacity = 'Moderada';
      } else {
        updatedLoan.savingsCapacity = 'Insuficiente';
      }
      return updatedLoan;
    });
  };

  const handleStatusChange = (event) => {
    setLoan((prevLoan) => ({
      ...prevLoan,
      status: event.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await loanService.updateLoan(id, loan);
      alert('Solicitud actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la solicitud:', error);
      alert('Error al actualizar la solicitud');
    }
  };

  const handleDownload = async (type) => {
    try {
      const data = await documentService.getDocumentByLoanId(id, type);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el documento:', error);
      alert('No se pudo descargar el documento.');
    }
  };

  if (loading) {
    return <Typography variant="h6">Cargando...</Typography>;
  }

  return (
    <Paper style={{ padding: '2em', marginTop: '2em' }}>
      <Typography variant="h4" gutterBottom>
        Evaluación de Solicitud
      </Typography>

      <Typography variant="body2" color="textSecondary" style={{ marginBottom: '8px' }}>
        Relación cuota-ingreso segun lo ingresado manualmente por el cliente: {loan.ratio} %
      </Typography>

      <FormGroup>
        {['installmentToServiceRatio', 'creditHistory', 'employmentStability', 'debtToIncomeRatio', 'maximumFinancingAmount', 'applicantAge'].map((field) => (
          <FormControlLabel
            key={field}
            control={
              <Checkbox
                checked={loan[field] || false}
                onChange={() => handleBooleanChange(field)}
              />
            }
            label={fieldLabels[field]}
          />
        ))}
      </FormGroup>

      <TextField
        label="Capacidad de Ahorro"
        value={loan.savingsCapacity || ''}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      >
        {savingsOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <FormGroup style={{ marginLeft: '2em' }}>
        <Typography variant="h6" gutterBottom>
          Criterios de Ahorro
        </Typography>
        {Object.keys(savingsCriteria).map((field) => (
          <FormControlLabel
            key={field}
            control={
              <Checkbox
                checked={loan[field] || false}
                onChange={() => handleBooleanChange(field)}
              />
            }
            label={savingsCriteria[field]}
          />
        ))}
      </FormGroup>

      <TextField
        label="Estado de la Solicitud"
        select
        value={loan.status || ''}
        onChange={handleStatusChange}
        fullWidth
        margin="normal"
      >
        {statusOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
        Guardar Cambios
      </Button>

      <Typography variant="h5" gutterBottom style={{ marginTop: '2em' }}>
        Documentos Adjuntos
      </Typography>
      <List>
        {documents.map((type) => (
          <ListItem key={type} disableGutters>
            <ListItemText primary={type} />
            <IconButton onClick={() => handleDownload(type)} color="primary">
              <DownloadIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default LoanEvaluation;
