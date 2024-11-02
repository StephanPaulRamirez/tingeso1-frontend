import httpClient from "../http-common";

const simulateLoan = (amount, period, rate) => {
    return httpClient.get('/api/v1/loan_requests/simulate', {
        params: {
            amount: amount,
            period: period,
            rate: rate,
        },
    });
};

export default { simulateLoan };
