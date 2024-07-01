import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionManager = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        if (token && tokenExpiration) {
            const expirationDate = new Date(tokenExpiration);
            if (expirationDate <= new Date()) {
                // Token ha expirado
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiration');
                navigate('/'); 
            }
        } else {        
            navigate('/');
        }
    }, [navigate]);

    return null; 
};

export default SessionManager;
