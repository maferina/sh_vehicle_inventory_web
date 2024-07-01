import React from 'react';
import { useNavigate } from 'react-router-dom';
import user from '../assets/img/user_icon.png';
import configuration from '../assets/img/configuration_icon.png';
import vehicle from '../assets/img/vehicle_icon.png';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); 

  const handleVehicleClick = () => {
    navigate('/vehicle'); 
  };

  const handleConfigurationClick = () => {
    navigate('/configuration'); 
  };

  const handleUserClick = () => {
    navigate('/user'); 
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Sistema de Inventario de Vehículos</h1>
      <div className="dashboard-card" onClick={handleVehicleClick}>
        <div className="title">Vehículos</div>
        <img src={vehicle} alt="vehicle" />
        <h3>Vehículos</h3>
      </div>
      {role === 'Administrador' && (
        <>
          <div className="dashboard-card" onClick={handleConfigurationClick}>
            <div className="title">Configuración</div>
            <img src={configuration} alt="configuration" />
            <h3>Configuración</h3>
          </div>
          <div className="dashboard-card" onClick={handleUserClick}>
            <div className="title">Usuarios</div>
            <img src={user} alt="user" />
            <h3>Usuarios</h3>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;