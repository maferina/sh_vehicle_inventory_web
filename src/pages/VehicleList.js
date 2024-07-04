import React, { useEffect, useState, useCallback } from 'react';
import '../styles/VehicleList.css';
import VehicleForm from '../components/VehicleForm';
import { getAllBrandVehicles } from '../services/BrandVehicleService';
import { getModelVehicleByBrand } from '../services/ModelVehicleService';
import { getAllVehicles, deleteVehicle } from '../services/VehicleService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Grid, Select, MenuItem, FormControl, InputLabel, Pagination, PaginationItem } from '@mui/material';
import Modal from '../components/Modal';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const VehicleList = () => {
    const roleUser = localStorage.getItem('role');
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        brand_Id: null,
        model_Id: null,
        year: null,
        status: null
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [vehicles, setVehicles] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedVehicleData, setSelectedVehicleData] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [deleteVehicleId, setDeleteVehicleId] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const fetchVehicleData = useCallback(async () => {
        try {
            const vehicleResponse = await getAllVehicles({ ...filters, page: currentPage, limit: 15 });
            setVehicles(vehicleResponse.data.vehicles);
            setTotalRecords(vehicleResponse.data.totalCount);
            setTotalPages(Math.ceil(vehicleResponse.data.totalCount / 15));

            console.log('vehicleResponse')
            console.log(vehicleResponse)

            const brandResponse = await getAllBrandVehicles();
            setBrands(brandResponse.data);

            const uniqueYears = [...new Set(vehicleResponse.data.vehicles.map(vehicle => vehicle.year))];
            uniqueYears.sort((a, b) => a - b);
            setYears(uniqueYears);
        } catch (error) {
            console.error(error);
        }
    }, [filters, currentPage]);

    useEffect(() => {
        fetchVehicleData();
    }, [fetchVehicleData]);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value || null
        }));
    };


    const handleBrandChange = async (event) => {
        const selectedbrand_Id = event.target.value || null;
        setFilters(prevFilters => ({
            ...prevFilters,
            brandId: selectedbrand_Id,
            modelId: null
        }));
        if (selectedbrand_Id != null) {
            try {
                const modelResponse = await getModelVehicleByBrand(selectedbrand_Id);
                const modelsData = modelResponse.data;
                setModels(modelsData);
            } catch (error) {
                console.error(error);
            }
        } else {
            setModels([]);
        }
    };

    const handleOpen = () => {
        setSelectedVehicleData(null);
        setOpen(true);
    };

    const handleClose = (shouldReload = false) => {
        setOpen(false);
        if (shouldReload) {
            fetchVehicleData();
        }
    };

    const handleImageClick = (images) => {
        setSelectedImages(images);
        setShowImageModal(true);
    };

    const openEditModal = (vehicle) => {
        setSelectedVehicleData(vehicle);
        setOpen(true);
    };

    const handleDelete = (vehicleId) => {
        setDeleteVehicleId(vehicleId);
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteVehicle(deleteVehicleId);
            setModalMessage(response?.data?.message);
            setShowMessageModal(true);
            fetchVehicleData();
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Error al procesar el vehículo';
            setModalMessage(errorMessage);
            setShowMessageModal(true);
        } finally {
            setConfirmDeleteOpen(false);
        }
    };

    const cancelDelete = () => {
        setConfirmDeleteOpen(false);
    };

    //Carrusel de imagenes
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        adaptiveHeight: true,
        arrows: false,
        centerMode: true,
        centerPadding: '0px',
        appendDots: dots => (
            <div style={{ position: 'absolute', top: '90%', left: '50%', transform: 'translateX(-50%)' }}>
                <ul style={{ margin: '0', padding: '0', listStyle: 'none', display: 'flex', justifyContent: 'center' }}>
                    {dots}
                </ul>
            </div>
        ),
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false,
                },
            },
        ],
    };
    //Carrusel de imagenes de la modal
    const modalSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        adaptiveHeight: true,
        arrows: false,
    };

    return (
        <div className="container">
            <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                <Grid item>
                    <Button onClick={() => navigate('/dashboard')} variant="contained" color="primary">
                        <i className="fas fa-plus"></i> Home
                    </Button>
                </Grid>
            </Grid>
            <h1 className="text-center mb-4">Lista de Vehículos</h1>
            <div style={{ marginLeft: '30px', marginRight: '30px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel>Marca</InputLabel>
                            <Select
                                name="brandId"
                                value={filters.brandId || ''}
                                onChange={handleBrandChange}
                                label="Marca"
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                {brands.map((brand) => (
                                    <MenuItem key={brand.id} value={brand.id}>
                                        {brand.description}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel>Modelo</InputLabel>
                            <Select
                                name="modelId"
                                value={filters.modelId || ''}
                                onChange={handleChange}
                                label="Modelo"
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                {models.map((model) => (
                                    <MenuItem key={model.id} value={model.id}>
                                        {model.description}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel>Año</InputLabel>
                            <Select
                                name="year"
                                value={filters.year || ''}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                {years.map((year, index) => (
                                    <MenuItem key={index} value={year}>{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={filters.status || ''}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                <MenuItem value="Disponible">Disponible</MenuItem>
                                <MenuItem value="Usado">Mantenimiento</MenuItem>
                                <MenuItem value="Fuera de servicio">Fuera de servicio</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                        <Grid item>
                            {roleUser === 'Administrador' && (
                                <Grid item>
                                    <Button onClick={handleOpen} variant="contained" color="success">
                                        <i className="fas fa-plus"></i> Agregar Vehículo
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <div style={{ marginBottom: '20px' }}></div>
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Año</th>
                            <th>Placa</th>
                            <th>Status</th>
                            <th>Imagen</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.length > 0 ? (
                            vehicles.map((vehicle, index) => (
                                <tr key={vehicle.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                    <td>{vehicle.brandName}</td>
                                    <td>{vehicle.modelName}</td>
                                    <td>{vehicle.year}</td>
                                    <td>{vehicle.tuition}</td>
                                    <td>{vehicle.status}</td>
                                    <td style={{ maxWidth: '90px', textAlign: 'center' }}>
                                        {vehicle.images && vehicle.images.length > 0 && (
                                            <div>
                                                <Slider {...settings}>
                                                    {vehicle.images.map((image, index) => (
                                                        <div key={index} onClick={() => handleImageClick(vehicle.images)}>
                                                            <img
                                                                src={image.url}
                                                                alt={`Imagen ${index}`}
                                                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                            />
                                                        </div>
                                                    ))}
                                                </Slider>
                                            </div>
                                        )}
                                    </td>

                                    <td className="action-column">
                                        {roleUser === 'Administrador' && (
                                            <>
                                                <button className="action-button" onClick={() => openEditModal(vehicle)}>
                                                    <FontAwesomeIcon icon={faEdit} className="edit-icon" title="Editar Vehículo" />
                                                </button>
                                                <button className="action-button" onClick={() => handleDelete(vehicle.id)}>
                                                    <FontAwesomeIcon icon={faTrash} className="delete-icon" title="Eliminar Vehículo" />
                                                </button>
                                            </>
                                        )}
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
                        Total Vehículos: {vehicles.length} de {totalRecords}
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
            <Modal show={open} onClose={handleClose} form>
                {selectedVehicleData ? (
                    <VehicleForm handleClose={handleClose} initialData={selectedVehicleData} />
                ) : (
                    <VehicleForm handleClose={handleClose} />
                )}
            </Modal>
            <Modal show={showImageModal} onClose={() => setShowImageModal(false)} images>
                <div className="modal-content">
                    {selectedImages.length > 0 && (
                        <Slider {...modalSettings}>
                            {selectedImages.map((image, index) => (
                                <div key={index}>
                                    <img
                                        src={image.url}
                                        alt={`Imagen ${index}`}
                                        style={{ maxWidth: '100%', maxHeight: '90vh', margin: '0 auto' }}
                                    />
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default VehicleList;
