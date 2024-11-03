import './App.css';
import React from 'react';
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import SimulateLoan from './components/SimulateLoan';
import LoanRequest from './components/LoanRequest';
import RequestTracking from './components/RequestTracking';
import LoanSearch from './components/LoanEvaluation';
import LoanEvaluation from './components/Evaluate';
import { AuthProvider } from './context/AuthContext'; 

function App() {
  return (
    <AuthProvider>
      <Router>
          <div className="container">
          <Navbar></Navbar>
            <Routes>
              <Route path="/home" element={<Home/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/simulate" element={<SimulateLoan />} />
              <Route path="/loanRequest" element={<LoanRequest />} />
              <Route path="/requestTracking" element={<RequestTracking />} />
              <Route path="/loanEvaluation" element={<LoanSearch />} />
              <Route path="/evaluate/:id" element={<LoanEvaluation />} />             
              <Route path="*" element={<Home/>} />
            </Routes>
          </div>
      </Router>
    </AuthProvider>
  );
}

export default App
