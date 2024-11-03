import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, Slider, Alert, Paper } from '@mui/material';
import loanService from '../services/loanrequest.service';
import documentService from '../services/document.service';
import { useAuth } from '../context/AuthContext';

const LoanRequest = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    userRut: '',
    requestedAmount: '',
    status: 'En Revisión Inicial',
    period: '',
    loanType: 'Primera Vivienda',
    interestRate: 3.5,
    maxTerm: 30,
    maxFinancing: 80,
    documentRequirements: '',
    clientMonthlyIncome: '',
    savingsCapacity: 'Insuficiente',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [documents, setDocuments] = useState({});
  const [errors, setErrors] = useState({});

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
  };

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        userRut: user.rut,
      }));
    }
  }, [user]);

  useEffect(() => {
    const selectedLoan = loanDetails[formData.loanType];
    setFormData((prevData) => ({
      ...prevData,
      maxTerm: selectedLoan.maxTerm,
      interestRate: selectedLoan.interestRateRange[0],
      maxFinancing: selectedLoan.maxFinancing,
      documentRequirements: selectedLoan.documents,
    }));
    setDocuments({});
    setErrors({});
  }, [formData.loanType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInterestRateChange = (e, newValue) => {
    setFormData({
      ...formData,
      interestRate: newValue,
    });
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];

    if (file && file.type !== 'application/pdf') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        files: `El archivo para "${docType}" debe ser un PDF.`,
      }));
      return;
    }
    
    setDocuments((prevDocs) => ({
      ...prevDocs,
      [docType]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredDocuments = formData.documentRequirements.split('\n').map(doc => doc.trim());
    const missingDocuments = requiredDocuments.filter(doc => !documents[doc]);

    if (missingDocuments.length > 0) {
      setErrors({ files: `Faltan documentos: ${missingDocuments.join(', ')}` });
      return;
    }
    else {
      setErrors({});
    }
    
    try {
      const response = await loanService.requestLoan(formData);
      console.log('Solicitud de préstamo enviada:', response.data);

      setSuccessMessage('Solicitud enviada con éxito');

      for (const [docType, file] of Object.entries(documents)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('loanRequestId', response.data.id);
        formData.append('type', docType);

        await documentService.uploadDocument(formData);
      }

      setFormData({
        userRut: user.rut || '',
        requestedAmount: '',
        status: 'En Revisión Inicial',
        period: '',
        loanType: 'Primera Vivienda',
        interestRate: 3.5,
        maxTerm: 30,
        maxFinancing: 80,
        documentRequirements: `- Comprobante de ingresos
- Certificado de avalúo
- Historial crediticio`,
        clientMonthlyIncome: '',
        savingsCapacity: '',
      });
      setDocuments({});
      e.target.reset();
    } catch (error) {
      console.error('Error al enviar la solicitud de préstamo:', error);
    }
  };

  return (
    <Paper style={{ padding: '2em', marginTop: '2em' }}>
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Solicitar Crédito Hipotecario
        </Typography>
        
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errors.files && <Alert severity="error">{errors.files}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="RUT"
            variant="outlined"
            margin="normal"
            name="userRut"
            value={formData.userRut}
            InputProps={{
              readOnly: true,
            }}
          />
          
          <TextField
            fullWidth
            label="Monto Solicitado"
            variant="outlined"
            margin="normal"
            type="number"
            required
            name="requestedAmount"
            inputProps={{ min: 100000 , max: 10000000000000}}
            value={formData.requestedAmount}
            onChange={handleInputChange}
          />
          
          <TextField
            fullWidth
            label="Ingresos Mensuales del Cliente"
            variant="outlined"
            margin="normal"
            type="number"
            required
            name="clientMonthlyIncome"
            inputProps={{ min: 100000 , max: 100000000}}
            value={formData.clientMonthlyIncome}
            onChange={handleInputChange}
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="loan-type-label">Tipo de Préstamo</InputLabel>
            <Select
              labelId="loan-type-label"
              name="loanType"
              value={formData.loanType}
              onChange={handleInputChange}
              label="Tipo de Préstamo"
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
            label="Periodo (años)"
            variant="outlined"
            margin="normal"
            type="number"
            required
            name="period"
            inputProps={{ min: 1, max: formData.maxTerm }}
            value={formData.period}
            onChange={(e) => {
              const value = e.target.value;
              if (value <= formData.maxTerm) {
                setFormData({
                  ...formData,
                  period: value,
                });
              }
            }}
            helperText={`El periodo no puede exceder el plazo máximo de ${formData.maxTerm} años.`}
          />
          
          <Typography gutterBottom>Tasa de Interés Anual (%)</Typography>
          <Slider
            value={formData.interestRate}
            onChange={handleInterestRateChange}
            min={loanDetails[formData.loanType].interestRateRange[0]}
            max={loanDetails[formData.loanType].interestRateRange[1]}
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
            value={formData.maxFinancing}
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
            name="documentRequirements"
            value={formData.documentRequirements}
            InputProps={{
              readOnly: true,
            }}
          />
          
          <div>
            <Typography variant="h5" gutterBottom>
              Adjuntar Documentos tipo PDF porfavor
            </Typography>
          </div>

          {formData.documentRequirements.split('\n').map((docType) => (
            <div key={docType} style={{ marginTop: '1em' }}>
              <Typography variant="subtitle1">{docType}</Typography>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, docType.trim())}
              />
            </div>
          ))}
          
          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            fullWidth 
            sx={{ mt: 3 }}
          >
            Enviar Solicitud
          </Button>
        </form>
      </Box>
    </Paper>
  );
};

export default LoanRequest;
