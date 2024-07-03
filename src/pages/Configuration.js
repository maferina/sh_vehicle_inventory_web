import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Grid } from '@mui/material';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import {
    getAllBrandVehicles,
    createBrandVehicle,
    updateBrandVehicle,
    deleteBrandVehicle
} from '../services/BrandVehicleService';
import {
    getAllModelVehicles,
    createModelVehicle,
    updateModelVehicle,
    deleteModelVehicle
} from '../services/ModelVehicleService';
import '../styles/Configuration.css';

const Configuration = () => {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [currentBrand, setCurrentBrand] = useState({ id: '', description: '' });
    const [currentModel, setCurrentModel] = useState({ id: '', description: '', brandId: '', brandName: '' });
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteItemName, setDeleteItemName] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const role = localStorage.getItem('role');


    const fetchData = async () => {
        try {
            const brandResponse = await getAllBrandVehicles();
            setBrands(brandResponse.data);

            const modelResponse = await getAllModelVehicles();
            setModels(modelResponse.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBrandInputChange = (event) => {
        const { value } = event.target;
        setCurrentBrand({ ...currentBrand, description: value });
    };

    const handleModelInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentModel({ ...currentModel, [name]: value });
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleCreateBrand = async () => {
        if (currentBrand.description.trim() === '') return;

        try {
            const response = await createBrandVehicle({
                description: currentBrand.description.trim()
            });
            // Fetch updated data    
            //st brandResponse = await getAllBrandVehicles();
            //setBrands(brandResponse.data);
            setShowModal(true);
            setModalMessage(response?.data.message);
            fetchData();
            setCurrentBrand({ id: '', description: '' });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Error al procesar marca';
            setModalMessage(errorMessage);
            setShowModal(true);
        }
    };

    const handleCreateModel = async () => {
        if (currentModel.description.trim() === '' || currentModel.brandId === '') return;

        try {
            const response = await createModelVehicle({
                description: currentModel.description.trim(),
                brandId: currentModel.brandId
            });
            const modelResponse = await getAllModelVehicles();
            setModels(modelResponse.data);
            setShowModal(true);
            setModalMessage(response?.data.message);
            setCurrentModel({ id: '', description: '', brandId: '', brandName: '' });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Error al procesar modelo';
            setModalMessage(errorMessage);
            setShowModal(true);
        }
    };

    const handleEditBrand = (id) => {
        const brandToEdit = brands.find((brand) => brand.id === id);
        console.log('brandToEdit')
        console.log(brandToEdit)
        if (brandToEdit) {
            setCurrentBrand({ id: brandToEdit.id, description: brandToEdit.description });
            setEditMode(true);
        }
    };

    const handleEditModel = (id) => {
        const modelToEdit = models.find((model) => model.id === id);

        if (modelToEdit) {
            setCurrentModel({ id: modelToEdit.id, description: modelToEdit.description, brandId: modelToEdit.brandId, brandName: modelToEdit.brandName });
            setEditMode(true);
        }
    };

    const handleUpdateBrand = async () => {
        if (currentBrand.description.trim() === '') return;

        try {
            const response = await updateBrandVehicle({
                id: currentBrand.id,
                description: currentBrand.description.trim()
            });
            // Usar los valores actuales de currentBrand para actualizar la lista de mmarcas
            const updatedBrands = brands.map((brand) =>
                brand.id === currentBrand.id
                    ? { ...brand, description: currentBrand.description }
                    : brand
            );

            setBrands(updatedBrands);
            setShowModal(true);
            setModalMessage(response?.data.message);

            // Mantener los valores actuales en los inputs
            setCurrentBrand((prevState) => ({
                ...prevState,
                description: ''
            }));

            setEditMode(false);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Error al procesar marca';
            setModalMessage(errorMessage);
            setShowModal(true);
        }
    };

    const handleUpdateModel = async () => {
        if (currentModel.description.trim() === '' || currentModel.brandId === '') return;

        try {
            const response = await updateModelVehicle({
                id: currentModel.id,
                description: currentModel.description.trim(),
                brandId: currentModel.brandId
            });
            // Usar los valores actuales de currentModel para actualizar la lista de modelos
            const updatedModels = models.map((model) =>
                model.id === currentModel.id
                    ? { ...model, description: currentModel.description, brandId: currentModel.brandId, brandName: currentModel.brandName }
                    : model
            );

            setModels(updatedModels);
            setShowModal(true);
            setModalMessage(response?.data.message);

            // Mantener los valores actuales en los inputs
            setCurrentModel((prevState) => ({
                ...prevState,
                description: '',
                brandId: '',
                brandName: ''
            }));

            setEditMode(false);

        } catch (error) {
            const errorMessage = error.response?.data?.error|| 'Error al procesar modelo';
            setModalMessage(errorMessage);
            setShowModal(true);
        }
    };



    const handleDelete = (id, filtyerType) => {
        setDeleteItemId(id);
        setDeleteItemName(filtyerType)
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (deleteItemName === 'brand') {
                const response = await deleteBrandVehicle(deleteItemId);
                const filteredBrands = brands.filter((brand) => brand.id !== deleteItemId);
                setBrands(filteredBrands);
                setModalMessage(response?.data.message);
            } else if (deleteItemName === 'model') {
                const response = await deleteModelVehicle(deleteItemId);
                const filteredModels = models.filter((model) => model.id !== deleteItemId);
                setModels(filteredModels);
                setModalMessage(response?.data.message);
            }
            setShowModal(true);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Error al procesar';
            setModalMessage(errorMessage);
            setShowModal(true);
        } finally {
            setConfirmDeleteOpen(false);
            setDeleteItemId('');
        }
    };


    const cancelDelete = () => {
        setConfirmDeleteOpen(false);
    };

    const handleCancelEdit = () => {
        setCurrentBrand({ id: '', description: '' });
        setCurrentModel({ id: '', description: '', brandId: '', brandName: '' });
        setEditMode(false);
    };

    if (role !== 'Administrador') {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem', color: 'red' }}>
                Usuario no tiene permiso para acceder a esta página.
            </div>
        );
    }

    return (
        <div className="root-configuration">
            <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                <Grid item>
                    <Button onClick={() => navigate('/dashboard')} variant="contained" color="primary">
                        <i className="fas fa-plus"></i> Home
                    </Button>
                </Grid>
            </Grid>
            <h1 className="text-left mb-4">Configuración de Filtros</h1>
            <div className="forms-container">
                <div className="form-column">
                    <div className="column-title">Marca</div>
                    <form className="form-configuration" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="text"
                            name="description"
                            placeholder="Marca"
                            value={currentBrand.description}
                            onChange={handleBrandInputChange}
                            className="textField"
                        />
                        <div className="button-group">
                            <Button
                                type="button"
                                variant="contained"
                                color="success"
                                onClick={editMode ? handleUpdateBrand : handleCreateBrand}
                            >
                                {editMode ? 'Actualizar' : 'Crear'}
                            </Button>
                            {editMode && (
                                <Button type="button" variant="contained" onClick={handleCancelEdit} className="cancel-button">
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </form>

                    <h4>Listado de Marcas</h4>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Marca</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map((brand) => (
                                <tr key={brand.id}>
                                    <td>{brand.description}</td>
                                    <td className="action-column">
                                        <button className="action-button" onClick={() => handleEditBrand(brand.id)}>
                                            <FontAwesomeIcon icon={faEdit} className="edit-icon" title="Editar Marca" />
                                        </button>
                                        <button className="action-button" onClick={() => handleDelete(brand.id, 'brand')}>
                                            <FontAwesomeIcon icon={faTrash} className="delete-icon" title="Eliminar Marca" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="form-column">
                    <div className="column-title">Modelo</div>
                    <form className="form-configuration" onSubmit={(e) => e.preventDefault()}>
                        <div className="select-container">
                            <select
                                name="brandId"
                                value={currentModel.brandId}
                                onChange={handleModelInputChange}
                                className="textField"
                            >
                                <option value="">Seleccionar Marca</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>{brand.description}</option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="text"
                            name="description"
                            placeholder="Modelo"
                            value={currentModel.description}
                            onChange={handleModelInputChange}
                            className="textField"
                        />
                        <div className="button-group">
                            <Button
                                type="button"
                                variant="contained"
                                color="success"
                                onClick={editMode ? handleUpdateModel : handleCreateModel}
                            >
                                {editMode ? 'Actualizar' : 'Crear'}
                            </Button>
                            {editMode && (
                                <Button type="button" variant="contained" onClick={handleCancelEdit} className="cancel-button">
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </form>

                    <h4>Listado de Modelos</h4>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Modelo</th>
                                <th>Marca</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.map((model) => (
                                <tr key={model.id}>
                                    <td>{model.description}</td>
                                    <td>{brands.find((brand) => brand.id === model.brandId)?.description}</td>
                                    <td className="action-column">
                                        <button className="action-button" onClick={() => handleEditModel(model.id)}>
                                            <FontAwesomeIcon icon={faEdit} className="edit-icon" title="Editar Modelo" />
                                        </button>
                                        <button className="action-button" onClick={() => handleDelete(model.id, 'model')}>
                                            <FontAwesomeIcon icon={faTrash} className="delete-icon" title="Eliminar Modelo" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <Modal
                    show={showModal}
                    message={modalMessage}
                    onClose={closeModal}
                    form={false}
                />
            )}
            <Modal
                show={confirmDeleteOpen}
                onClose={cancelDelete}
                confirmDelete={confirmDelete}
                cancelDelete={cancelDelete}
            >
                <div className="modal-confirmDelete">
                    <h2>Confirmación de Eliminación</h2>
                    <p>¿Estás seguro de que quieres eliminar este vehículo?</p>
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
        </div>
    );
};

export default Configuration;
