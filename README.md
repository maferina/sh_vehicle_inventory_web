# Proyecto de Gestión de Vehículos

## Descripción General

Este proyecto es una aplicación web para la gestión de inventario de vehículos, que cuenta con un dashboard dividido en vehículo, configuración de marcas-modelos y gestión de usuarios. La aplicación permite listar ,insertar, actualizar y eliminar vehículos, usuario, marcas y modelos.

## Características

- Formulario de Vehículo
- Formulario de Configuración
- Formulario de Usuarios  

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

## Despliegue 
1. Azure Subscription: Se necesita una suscripción de Azure para desplegar los contenedores y configurar otros recursos necesarios.
2. Azure Static Web Apps CLI

## Pipeline
Configuración del Pipeline de Azure
El archivo azure-pipelines.yml contiene la configuración del pipeline que automatiza el despliegue
 ## trigger: - master: ## 
 Este bloque configura el pipeline para que se ejecute automáticamente cada vez que haya un push a la rama master
 ## pool: local : ## 
 se configuro de esa manera porque la cuenta de la suscripcion es gratuita , pedi aumento de el paralelismo a traves de correo pero a la fecha no han ejecutado el requerimiento
 ## group: project-vars: ##
 Este bloque define un grupo de variables que se utilizarán en el pipeline. project-vars es un grupo predefinido de variables que contienen valores sensibles como contraseñas y secretos.
 ## Steps :##  Instalación de Node.js
- task: NodeTool@0
  inputs:
    versionSpec: '20.x'
  displayName: 'Install Node.js'
 ## Instalación de Dependencias del Proyecto
 - script: |
    npm install
  displayName: 'npm install'
 ## Construcción del Proyecto React
 - script: |
    npm run build
  displayName: 'npm build react'
 ## Instalación de Azure Static Web Apps CLI
 - script: |
    npm install -g @azure/static-web-apps-cli
  displayName: Installing SWA CLI
 ## Despliegue de la Aplicación
 - task: AzureCLI@2
  displayName: Deploying app to AZ Static Web App
  inputs:
    azureSubscription: SubMafer
    scriptType: ps
    scriptLocation: inlineScript
    inlineScript: |
      swa deploy --app-name VehicleInvWeb --env production
  env:
    SWA_CLI_DEPLOYMENT_TOKEN: $(staticwebappkey)

 ## Despliegue de Cambios
 git add .
 git commit -m "Descripción del cambio"
 git pull
 git push



## Autor
  Maria Fernanda Bello Hernanez