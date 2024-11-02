import httpClient from "../http-common";

const getDocumentByLoanId = async (loanRequestId, type) => {
  const response = await httpClient.get(`/api/v1/documents/getByLoanId/${loanRequestId}`, {
    params: { type },
    responseType: 'blob',
  });
  return response.data;
};

const uploadDocument = (formData) => {
  return httpClient.post('/api/v1/documents/upload', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default {
  getDocumentByLoanId,
  uploadDocument,
};