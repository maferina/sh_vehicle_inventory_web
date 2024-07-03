import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import Modal from '../components/Modal';
import { createUser, updateUser } from '../services/UserService';
import '../styles/VehicleForm.css'; 

const UserForm = ({ handleClose, initialData }) => {
    const [user, setUser] = useState({
        name: '',
        username: '',
        password: '',
        role: 'Administrador',
        status: 'Activo', 
        id: '', 
    });

    const [formErrors, setFormErrors] = useState({});
    const [formValid, setFormValid] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (initialData) {
            setUser({
                name: initialData.name || '',
                username: initialData.username || '',
                password: '', 
                role: initialData.role || '',
                status: initialData.status || '',
                id: initialData.id || '',
            });
        }
    }, [initialData]);

    useEffect(() => {
        const validateForm = () => {
            const errors = {};

          
            if (!user.name.trim()) {errors.name = 'El nombre es obligatorio';
            }
            // Validar email
            if (!user.username.trim()) {
                errors.username = 'El email es obligatorio';
            } else if (!/\S+@\S+\.\S+/.test(user.username)) {
                errors.username = 'El email no es válido';
            }
            // Validar password solo si no es edición o si el usuario proporciona uno nuevo
            if (!initialData || user.password.trim()) {
                if (!user.password.trim()) {
                    errors.password = 'El password es obligatorio';
                } else if (user.password.length < 6) {
                    errors.password = 'El password debe tener al menos 6 caracteres';
                }
            }
          
            if (!user.role) {errors.role = 'El rol es obligatorio';}
            if (!user.status) {errors.status = 'El estatus es obligatorio';}
            setFormErrors(errors);
            setFormValid(Object.keys(errors).length === 0);
        };
        validateForm();
    }, [user, initialData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true);

        if (!formValid) {
            return;
        }

        const formData = {
            name: user.name,
            username: user.username,
            role: user.role,
            status: user.status,
        };

        // Solo incluir password si el usuario ha proporcionado uno nuevo
        if (user.password.trim()) {
            formData.password = user.password;
        }

        try {
            let response;
            if (initialData) {
                formData.id = user.id;
                response = await updateUser(formData);
            } else {
                response = await createUser(formData);
            }

            if (response.status === 200) {
                setModalMessage(response?.data.message);
                setShowModal(true);
                setUser({
                    name: '',
                    username: '',
                    password: '',
                    role: '',
                    status: 'Disponible',
                });
                setFormErrors({});
                setFormValid(false);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Error al procesar el usuario';
            setModalMessage(errorMessage);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        handleClose(true); 
    };

    return (
        <Container>
            <Typography variant="h5" component="h1">
                {initialData ? 'Editar Usuario' : 'Crear Usuario'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="name"
                            label="Nombre"
                            value={user.name}
                            onChange={handleChange}
                            error={!!formErrors.name && formSubmitted}
                            helperText={formErrors.name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="username"
                            label="Email"
                            value={user.username}
                            onChange={handleChange}
                            error={!!formErrors.username && formSubmitted}
                            helperText={formErrors.username}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            type="password"
                            name="password"
                            label={initialData ? 'Nuevo Password (opcional)' : 'Password'}
                            value={user.password}
                            onChange={handleChange}
                            error={!!formErrors.password && formSubmitted}
                            helperText={formErrors.password}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <FormControl fullWidth error={!!formErrors.role && formSubmitted}>
                            <InputLabel>Rol</InputLabel>
                            <Select
                                name="role"
                                value={user.role}
                                onChange={handleChange}
                            >
                                <MenuItem value="Administrador">Administrador</MenuItem>
                                <MenuItem value="Consulta">Consulta</MenuItem>
                            </Select>
                            {formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    {initialData && (
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!formErrors.status && formSubmitted}>
                                <InputLabel>Estatus</InputLabel>
                                <Select
                                    name="status"
                                    value={user.status}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Activo">Activo</MenuItem>
                                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                                </Select>
                                {formErrors.status && <FormHelperText>{formErrors.status}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" disabled={!formValid}>
                            {initialData ? 'Actualizar' : 'Crear'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Modal
                show={showModal}
                message={modalMessage}
                onClose={closeModal}
                form={false} 
            />
        </Container>
    );
};

export default UserForm;