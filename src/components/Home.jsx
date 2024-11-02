import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>PrestaBanco: Sistema de Gestión de Préstamos Hipotecarios</h1>
      <p>
        Esta es una aplicación web para gestionar solicitudes de préstamos
        hipotecarios. Esta aplicación ha sido desarrollada usando tecnologías como{" "}
        <a href="https://spring.io/projects/spring-boot">Spring Boot</a> (para
        el backend), <a href="https://reactjs.org/">React</a> (para el Frontend)
        y <a href="https://www.postgresql.org/">PostgreSQL</a> (para la
        base de datos).
      </p>

      {!user && (
        <h2>
          Regístrese e inicie sesión para tener acceso a todas las funcionalidades!
        </h2>
      )}

      {user && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => navigate("/simulate")}>Simular Préstamo</button>
          <button onClick={() => navigate("/loanRequest")}>Solicitar Préstamo</button>
          <button onClick={() => navigate("/requestTracking")}>Seguimiento de Solicitud</button>
        </div>
      )}

      {user && user.role === 'ejecutivo' && (
        <button onClick={() => navigate("/loanEvaluation")}>Evaluar Préstamo</button>
      )}
      
    </div>
  );
};

export default Home;

