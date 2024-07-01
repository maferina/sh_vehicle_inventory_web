import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import Modal from '../components/Modal';
import { createVehicle, updateVehicle } from '../services/VehicleService';
import { getAllBrandVehicles } from '../services/BrandVehicleService';
import { getAllModelVehicles } from '../services/ModelVehicleService';
import '../styles/VehicleForm.css';

const VehicleForm = ({ handleClose, initialData }) => {
    const [vehicle, setVehicle] = useState({
        brand_Id: '',
        model_Id: '',
        status: '',
        tuition: '',
        year: '',
        images: [],
        id: ''
    });
    const [images, setImages] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [originalModels, setOriginalModels] = useState([]); 
    const [formErrors, setFormErrors] = useState({});
    const [formValid, setFormValid] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const brandResponse = await getAllBrandVehicles();
                setBrands(brandResponse.data);

                const modelResponse = await getAllModelVehicles();
                const allModels = modelResponse.data;
                setModels(allModels);
                setOriginalModels(allModels); 
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (initialData) {
            setVehicle({
                brand_Id: initialData.brand_Id || '',
                model_Id: initialData.model_Id || '',
                status: initialData.status || '',
                year: initialData.year || '',
                tuition: initialData.tuition || '',
                id: initialData.id || '',
                images: initialData.images || [],
            });
            setImages(initialData.images || []);           
        }
    }, [initialData,originalModels]);

    useEffect(() => {
        const validateForm = () => {
            const errors = {};
            if (!vehicle.brand_Id) errors.brand = 'La marca es obligatoria';
            if (!vehicle.model_Id) errors.model = 'El modelo es obligatorio';
            if (!vehicle.status) errors.status = 'El estatus es obligatorio';
            if (!vehicle.year) errors.year = 'El año es obligatorio';
            if (!vehicle.tuition.trim()) errors.tuition = 'La placa es obligatoria';
            if (vehicle.images.length === 0 && images.length === 0) errors.images = 'Al menos una imagen es requerida';
            setFormErrors(errors);
            setFormValid(Object.keys(errors).length === 0);
        };
        validateForm();
    }, [vehicle, images]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'brand_Id') {
            const selectedbrand_Id = value;
            setModels(originalModels);
            const filteredModels = originalModels.filter(model => model.brand_Id === selectedbrand_Id);
            setModels(filteredModels);
            if (!filteredModels.some(model => model.id === vehicle.model_Id)) {
                setVehicle(prevVehicle => ({
                    ...prevVehicle,
                    model_Id: '',
                }));
            }
        }

        setVehicle(prevVehicle => ({
            ...prevVehicle,
            [name]: value,
        }));
    };


    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= 1900; i--) {
            years.push(i);
        }
        return years;
    };

    const handleImageChange = (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                images: 'Error: Archivos no válidos. Asegúrate de que sean imágenes (jpeg, png, gif, bmp, webp).',
            }));
        } else {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                images: '',
            }));

            const files = acceptedFiles.map(file => ({
                file: file,
                preview: URL.createObjectURL(file)
            }));
            setImages(prevImages => [...prevImages, ...files]);
        }
    };

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setImages(arrayMoveImmutable(images, oldIndex, newIndex));
    };

    const removeImage = (image) => {
        if (vehicle.images.some(img => img._id === image._id)) {
            setVehicle(prevVehicle => ({
                ...prevVehicle,
                images: prevVehicle.images.filter(img => img._id !== image._id),
            }));
        } else {
            setImages(prevImages => prevImages.filter(img => img !== image));
        }
    };

    const SortableImage = SortableElement(({ image, index }) => {
        return (
            <div className="sortable-image">
                <img src={image.preview || image.url} alt={`Thumbnail ${index}`} className="thumbnail" />
                <button onClick={() => removeImage(image)}>Eliminar</button>
            </div>
        );
    });

    const SortableImageList = SortableContainer(({ images }) => {
        return (
            <div className="sortable-image-list">
                {images.map((image, index) => (
                    <SortableImage key={`item-${index}`} index={index} image={image} />
                ))}
            </div>
        );
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleImageChange,
        accept: 'image/jpeg, image/png, image/gif, image/bmp, image/webp',
        multiple: true,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true);

        if (!formValid) {
            return;
        }

        const formData = new FormData();
        formData.append('brand_Id', vehicle.brand_Id);
        formData.append('model_Id', vehicle.model_Id);
        formData.append('tuition', vehicle.tuition);
        formData.append('year', vehicle.year);
        formData.append('status', vehicle.status);

        if (images && images.length > 0) {
            images.forEach((image) => {
                if (image.url) {
                    formData.append('existingImage', image.id);
                } else {
                    formData.append('images', image.file);
                }
            });
        }

        try {
            let response;
            if (initialData) {
                formData.append('id', vehicle.id);
                response = await updateVehicle(formData);
            } else {
                console.log('entro aqui create')
                response = await createVehicle(formData);
            }
            if (response.status === 200) {
                setModalMessage(response?.data?.message);
                setShowModal(true);
                setVehicle({
                    brand_Id: '',
                    model_Id: '',
                    status: '',
                    year: '',
                    tuition: '',
                    images: [],
                });
                setImages([]);
                setFormErrors({});
                setFormValid(false);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message|| 'Error al procesar el vehiculo';
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
                {initialData ? 'Editar Vehículo' : 'Crear Vehículo'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Marca</InputLabel>
                            <Select
                                name="brand_Id"
                                value={vehicle.brand_Id}
                                onChange={handleChange}
                                error={!!formErrors.brand && formSubmitted}
                            >
                                <MenuItem value="">
                                    <em>Seleccione</em>
                                </MenuItem>
                                {brands.map((brand) => (
                                    <MenuItem key={brand.id} value={brand.id}>
                                        {brand.description}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText error={!!formErrors.brand && formSubmitted}>
                                {formErrors.brand}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Modelo</InputLabel>
                            <Select
                                name="model_Id"
                                value={vehicle.model_Id}
                                onChange={handleChange}
                                error={!!formErrors.model && formSubmitted}
                            >
                                <MenuItem value="">
                                    <em>Seleccione</em>
                                </MenuItem>
                                {models.map((model) => (
                                    <MenuItem key={model.id} value={model.id}>
                                        {model.description}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText error={!!formErrors.model && formSubmitted}>
                                {formErrors.model}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Año</InputLabel>
                            <Select
                                name="year"
                                value={vehicle.year}
                                onChange={handleChange}
                                error={!!formErrors.year && formSubmitted}
                            >
                                <MenuItem value="">
                                    <em>Seleccione</em>
                                </MenuItem>
                                {generateYearOptions().map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText error={!!formErrors.year && formSubmitted}>
                                {formErrors.year}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="tuition"
                            label="Matrícula"
                            value={vehicle.tuition}
                            onChange={handleChange}
                            error={!!formErrors.tuition && formSubmitted}
                            helperText={formErrors.tuition}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth error={!!formErrors.status && formSubmitted}>
                            <InputLabel>Estatus</InputLabel>
                            <Select
                                name="status"
                                value={vehicle.status}
                                onChange={handleChange}
                            >
                                <MenuItem value="Disponible">Disponible</MenuItem>
                                <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                                <MenuItem value="Fuera de servicio">Fuera de servicio</MenuItem>
                            </Select>
                            {formErrors.status && <FormHelperText>{formErrors.status}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <div className="dropzone" {...getRootProps()}>
                            <input {...getInputProps()} />
                            {
                                isDragActive ?
                                    <p>Suelta los archivos aquí ...</p> :
                                    <p>Arrastra y suelta algunas imágenes aquí, o haz clic para seleccionar archivos</p>
                            }
                        </div>
                        {formErrors.images && <FormHelperText error>{formErrors.images}</FormHelperText>}
                    </Grid>
                    <Grid item xs={12}>
                        <SortableImageList images={images} onSortEnd={onSortEnd} useDragHandle />
                    </Grid>
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
                form={false} />


        </Container>
    );
};

export default VehicleForm;









