# Proyecto de Gestión de Vehículos

## Descripción General

Este proyecto es una aplicación web para la gestión de inventario de vehículos, que cuenta con un dashboard dividido en vehículo, configuración de marcas-modelos y gestión de usuarios. La aplicación permite listar ,insertar, actualizar y eliminar vehículos, usuario, marcas y modelos. Para el modulo de vehiculos se le agregó imágenes que se pueden visualizar a través de un carrusel. Existen 2 tipos de roles de usuarios, rol administrador encargado de realizar todas las operaciones y  rol de consulta que solo podra visualizar los vehículos, no tendra acceso a insertar, ni editar ni eliminar vehículos asi como tampoco tendra acceso al módulo de configuración y usuario.Se ingresa a la aplicación a través del correo electronico y password, se debe ingresa un correo valido y el password debe tener minimo 6 caracteres.

## Características

- **Formulario de Vehículo**:
  - Insertar un nuevo vehículo con imágenes.
  - Listar todos los vehículos.
  - Filtra los vehículo por marca, modelo, año y estatus.
  - Actualizar la información de un vehículo existente.
  - Eliminar un vehículo.

- **Formulario de Configuración**:
   - Insertar un nueva marca o modelo de vehículo.
   - Listar todos las marcas y modelos de vehículos.
   - Actualizar la información de una marca o modelo existente.
   - Eliminar una marca o modelo de vehículo siempre y cuando no este asociado a un registro existente.

- **Formulario de Usuarios**:
  - Insertar un nuevo usuario.
  - Listar todos los usuario.
  - Filtra los usuarios por nombre, rol,  y estatus.
  - Actualizar la información de un usuario existente.
  - Eliminar un usuario.

- **Header**:
  - Presente en todas las páginas excepto en la página de inicio de sesión.

## Requisitos del Sistema

- Node.js
- npm (Node Package Manager)
- React
- react-router-dom
- Material-UI 

## Instalación

1. Clonar el repositorio:  
   git clone https://github.com/tuusuario/tu-repositorio.git;
2. Navegar al directorio del proyecto:
    cd tu-repositorio
3. Instalar las dependencias
   npm install

## Uso
1. Iniciar la aplicación
   npm start
2. Abrir el navegador y navegar a http://localhost:3000

## Estructura del Proyecto
├── public
├── src
│   ├── assets
│   │   ├── img
│   ├── components
│   │   ├── Header.js
│   │   ├── Modal.js
│   │   ├── ProtectedRoute.js
│   │   ├── UserForm.js
│   │   ├── VehicleForm.js
│   ├── pages
│   │   ├── Configuration.js
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── UserList.js
│   │   ├── VehicleList.js
│   ├── services
│   │   ├── BrandVehicleService.js
│   │   ├── LoginService.js
│   │   ├── ModelVehicleService.js
│   │   ├── UserService.js
│   │   ├── VehicleService.js
│   ├── App.js
│   ├── index.js
│   ├── ProtectedRoute.js
└── package.json


## Autor
  Maria Fernanda Bello Hernanez