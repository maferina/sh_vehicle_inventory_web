import React, { useEffect, useState, useCallback } from 'react';
import '../styles/VehicleList.css';
import UserForm from '../components/UserForm';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../services/UserService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Grid, Select, MenuItem, FormControl, InputLabel, Pagination, PaginationItem } from '@mui/material';
import Modal from '../components/Modal';



const UserList = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        status: null,
        name: null,
        role: null
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [users, setusers] = useState([]);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [names, setNames] = useState([]);
    const roleUser = localStorage.getItem('role');

    const fetchUserData = useCallback(async () => {
        try {
            const userResponse = await getAllUsers({ ...filters, page: currentPage, limit: 15 });
            setusers(userResponse.data.users);
            setTotalRecords(userResponse.data.totalCount);
            setTotalPages(Math.ceil(userResponse.data.totalCount / 15));

            const uniqueNames = [...new Set(userResponse.data.users.map(user => user.name))];
            uniqueNames.sort((a, b) => a - b);
            setNames(uniqueNames);
        } catch (error) {
            console.error(error);
        }
    }, [filters, currentPage]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        console.log('name')
        console.log(name)
        console.log('value')
        console.log(value)
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value || null
        }));
    };


    const handleOpen = () => {
        setSelectedUserData(null);
        setOpen(true);
    };

    const handleClose = (shouldReload = false) => {
        setOpen(false);
        if (shouldReload) {
            fetchUserData();
        }
    };

    const openEditModal = (user) => {
        setSelectedUserData(user);
        setOpen(true);
    };

    const handleDelete = (userId) => {
        setDeleteUserId(userId);
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteUser(deleteUserId);
            setModalMessage(response?.data.message);
            setShowMessageModal(true);
            fetchUserData();
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Error al procesar el usuario';
            setModalMessage(errorMessage);
            setShowMessageModal(true);
        } finally {
            setConfirmDeleteOpen(false);
        }
    };

    const cancelDelete = () => {
        setConfirmDeleteOpen(false);
    };

    if (roleUser !== 'Administrador') {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem', color: 'red' }}>
                Usuario no tiene permiso para acceder a esta página.
            </div>
        );
    }

    return (
        <div className="container">
            <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                <Grid item>
                    <Button onClick={() => navigate('/dashboard')} variant="contained" color="primary">
                        <i className="fas fa-plus"></i> Home
                    </Button>
                </Grid>
            </Grid>
            <h1 className="text-center mb-4">Lista de Usuarios</h1>
            <div style={{ marginLeft: '30px', marginRight: '30px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Name</InputLabel>
                            <Select
                                name="name"
                                value={filters.name || ''}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                {names.map((name, index) => (
                                    <MenuItem key={index} value={name}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Rol</InputLabel>
                            <Select
                                name="role"
                                value={filters.role || ''}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                <MenuItem value="Administrador">Administrador</MenuItem>
                                <MenuItem value="Consulta">Consulta</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={filters.status || ''}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                <MenuItem value="Activo">Activo</MenuItem>
                                <MenuItem value="Inactivo">Inactivo</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                        <Grid item>
                            <Button onClick={handleOpen} variant="contained" color="success">
                                <i className="fas fa-plus"></i> Agregar Usuario
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <div style={{ marginBottom: '20px' }}></div>
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo Eléctronico</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                    <td>{user.name}</td>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>{user.status}</td>
                                    <td className="action-column">
                                        <button className="action-button" onClick={() => openEditModal(user)}>
                                            <FontAwesomeIcon icon={faEdit} className="edit-icon" title="Editar Usuario" />
                                        </button>
                                        <button className="action-button" onClick={() => handleDelete(user.id)}>
                                            <FontAwesomeIcon icon={faTrash} className="delete-icon" title="Eliminar Usuario" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center' }}>No existen registros</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, page) => handlePageChange(event, page)} 
                        renderItem={(item) => (
                            <PaginationItem
                                component={Button}
                                {...item}
                            />
                        )}
                    />
                    <p style={{ textAlign: 'right', margin: 0 }}>
                        Total Usuarios: {users.length} de {totalRecords}
                    </p>
                </div>
            </div>
            <Modal
                show={showMessageModal}
                message={modalMessage}
                onClose={() => setShowMessageModal(false)}
                form={false} />
            <Modal
                show={confirmDeleteOpen}
                onClose={cancelDelete}
                confirmDelete={confirmDelete}
                cancelDelete={cancelDelete}
            >
                <div className="modal-confirmDelete">
                    <h2>Confirmación de Eliminación</h2>
                    <p>¿Estás seguro de que quieres eliminar este usuario?</p>
                    <div className="modal-buttons">
                        <Button onClick={cancelDelete} variant="contained">
                            Cancelar
                        </Button>
                        <Button onClick={confirmDelete} variant="contained">
                            Eliminar
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal show={open} onClose={handleClose} form>
                {selectedUserData ? (
                    <UserForm handleClose={handleClose} initialData={selectedUserData} />
                ) : (
                    <UserForm handleClose={handleClose} />
                )}
            </Modal>
        </div>
    );
};

export default UserList;
