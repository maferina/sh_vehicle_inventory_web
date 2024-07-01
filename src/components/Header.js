import React, { useState } from 'react';
import '../styles/Header.css';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [showLogoutButton, setShowLogoutButton] = useState(false);

    const handleMouseEnter = () => {
        setShowLogoutButton(true);
    };

    const handleMouseLeave = () => {
        setShowLogoutButton(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/');
    };

    const username = localStorage.getItem('username');

    return (
        <header className="header">
            <div className="header-content">
                <div className="left-content">
                    <div className="title">
                    </div>
                </div>
                <div className="right-content">
                    <div className="user-info" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <Avatar alt="Usuario" className="avatar" />
                        {username && (
                            <>
                                <span>{username}</span>
                                {showLogoutButton && <br />}
                                {showLogoutButton && <button onClick={handleLogout}>Cerrar Sesión</button>}
                            </>
                        )}
                    </div>
                </div>                
            </div>
        </header>
    );
};

export default Header;
