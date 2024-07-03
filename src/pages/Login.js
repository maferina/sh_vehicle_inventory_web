import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/login.png'
import '../styles/Login.css';
import { login } from '../services/LoginService';
import Modal from '../components/Modal';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const userData = { email, password };
            const response = await login(userData);
            console.log(response)
            if (response && response.token) {
                const { token, user ,tokenExpiration} = response;
                localStorage.setItem('token', token);
                localStorage.setItem('username', user.username);
                localStorage.setItem('role', user.role);
                localStorage.setItem('tokenExpiration',tokenExpiration);
                navigate('/dashboard'); 
            } else {
                alert(response.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Error al procesar usuario';
            setModalMessage(errorMessage);
            setShowMessageModal(true);
        }
    };

  

    return (
        <div className="login-container">
            <div className="login-form">
                <img src={logo} alt="Logo" className="logo" />
                <h2 className="login-header">Iniciar sesión</h2>
                <form>
                    <div className="input-group">
                        <label htmlFor="email" className="input-label">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleLogin(e);
                                }
                            }}
                        />
                    </div>
                    <button type="button" className="login-button" onClick={handleLogin}>Iniciar sesión</button>
                </form>
                <Modal
                show={showMessageModal}
                message={modalMessage}
                onClose={() => setShowMessageModal(false)}
                form={false} />
            </div>
        </div>
    );
};

export default LoginForm;

