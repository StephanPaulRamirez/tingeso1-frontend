import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, Slider, Paper } from '@mui/material';
import loanService from '../services/simulate.service';

const SimulateLoan = () => {
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('');
  const [rate, setRate] = useState(0);
  const [fee, setFee] = useState(null);
  const [error, setError] = useState('');
  const [loanType, setLoanType] = useState('Primera Vivienda');
  const [maxTerm, setMaxTerm] = useState(30);
  const [interestRateRange, setInterestRateRange] = useState([3.5, 5]);
  const [maxFinancing, setMaxFinancing] = useState(80);
  const [documentRequirements, setDocumentRequirements] = useState('');

  const loanDetails = {
    'Primera Vivienda': {
      maxTerm: 30,
      interestRateRange: [3.5, 5],
      maxFinancing: 80,
      documents: `- Comprobante de ingresos
- Certificado de avalúo
- Historial crediticio`,
    },
    'Segunda Vivienda': {
      maxTerm: 20,
      interestRateRange: [4, 6],
      maxFinancing: 70,
      documents: `- Comprobante de ingresos
- Certificado de avalúo
- Escritura de la primera vivienda
- Historial crediticio`,
    },
    'Propiedades Comerciales': {
      maxTerm: 25,
      interestRateRange: [5, 7],
      maxFinancing: 60,
      documents: `- Estado financiero del negocio
- Comprobante de ingresos
- Certificado de avalúo
- Plan de negocios`,
    },
    'Remodelación': {
      maxTerm: 15,
      interestRateRange: [4.5, 6],
      maxFinancing: 50,
      documents: `- Comprobante de ingresos
- Presupuesto de la remodelación
- Certificado de avalúo actualizado`,
    },

    'Local Comercial': {
      maxTerm: 15,
      interestRateRange: [4.5, 6],
      maxFinancing: 50,
      documents: `- Comprobante de ingresos
- Presupuesto de la remodelación
- Certificado de avalúo actualizado`,
    },
  };

  useEffect(() => {
    const selectedLoan = loanDetails[loanType];
    setMaxTerm(selectedLoan.maxTerm);
    setInterestRateRange(selectedLoan.interestRateRange);
    setRate(selectedLoan.interestRateRange[0]);
    setMaxFinancing(selectedLoan.maxFinancing);
    setDocumentRequirements(selectedLoan.documents);
  }, [loanType]);

  const handleSimulate = async (event) => {
    event.preventDefault();

    if (!amount || !period || !rate) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await loanService.simulateLoan(parseFloat(amount), parseFloat(period), parseFloat(rate));
      setFee(response.data);
      setError('');
    } catch (error) {
      console.error("Error al simular el crédito:", error);
      setError('Error al simular el crédito. Verifica los datos e inténtalo de nuevo.');
    }
  };

  return (
    <Paper style={{ padding: '2em', marginTop: '2em' }}>
      <Box sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Simulación de Crédito Hipotecario
        </Typography>
        <form onSubmit={handleSimulate}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="loan-type-label">Tipo de Vivienda</InputLabel>
            <Select
              labelId="loan-type-label"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              label="Tipo de Vivienda"
            >
              {Object.keys(loanDetails).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Monto del Crédito"
            variant="outlined"
            margin="normal"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ min: 100000 , max: 10000000000000}}
            required
          />
          
          <TextField
            fullWidth
            label="Periodo (en años)"
            variant="outlined"
            margin="normal"
            type="number"
            value={period}
            inputProps={{ max: maxTerm , min: 1}}
            
            onChange={(e) => {
              const value = e.target.value;
              if (value <= maxTerm) {
                setPeriod(value);
              }
            }}
            required
            helperText={`El periodo no puede exceder el plazo máximo de ${maxTerm} años.`}
          />

          <Typography gutterBottom>Tasa de Interés Anual (%)</Typography>
          <Slider
            value={rate}
            onChange={(e, newValue) => setRate(newValue)}
            min={interestRateRange[0]}
            max={interestRateRange[1]}
            step={0.1}
            marks
            valueLabelDisplay="auto"
          />

          <TextField
            fullWidth
            label="Monto Máximo de Financiamiento (%)"
            variant="outlined"
            margin="normal"
            type="number"
            value={maxFinancing}
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            fullWidth
            label="Documentos Requeridos"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            value={documentRequirements}
            InputProps={{
              readOnly: true,
            }}
          />

          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
            Simular Crédito
          </Button>
        </form>
        {fee !== null && (
          <Typography variant="h6" color="success.main" sx={{ mt: 4 }}>
            Cuota mensual estimada: ${fee}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default SimulateLoan;
