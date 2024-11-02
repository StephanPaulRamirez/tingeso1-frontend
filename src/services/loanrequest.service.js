import httpClient from "../http-common";

const requestLoan = (data) => {
  return httpClient.post('/api/v1/loan_requests/', data);
};
  
const tracking = (rut) => {
    return httpClient.get(`/api/v1/loan_requests/rut/${rut}`);
};

const getLoanDetails = (id) => {
    return httpClient.get(`/api/v1/loan_requests/id/${id}`);
};

const updateLoan = (id, data) => {
    return httpClient.put(`/api/v1/loan_requests/`, data);
};


export default {
  requestLoan,
  tracking,
  getLoanDetails,
  updateLoan,
};
