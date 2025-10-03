# Control de Personal - Sistema Completo

Sistema de gestión de personal desarrollado con Laravel (Backend) y React + TypeScript (Frontend).

## 📁 Estructura del Proyecto

```
Control_de_personal/
├── Backend/          # API Laravel con autenticación Sanctum
├── Frontend/         # Aplicación React + TypeScript
└── README.md         # Este archivo
```

## 🚀 Características

- **Autenticación**: Login seguro con Laravel Sanctum
- **Gestión de Empleados**: CRUD completo con búsqueda avanzada
- **Base de Datos**: PostgreSQL con relaciones optimizadas
- **Frontend Moderno**: React con TypeScript y Vite
- **API RESTful**: Endpoints estructurados y documentados

## 🛠️ Configuración e Instalación

### Backend (Laravel)
```bash
cd Backend
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend (React)
```bash
cd Frontend
npm install
npm run dev
```

## 📋 Funcionalidades

- ✅ Sistema de autenticación
- ✅ Gestión completa de empleados
- ✅ Búsqueda avanzada por nombre, apellido, CI
- ✅ Filtros por área y cargo
- ✅ Interface responsive
- ✅ API RESTful completa

## 🔧 Tecnologías Utilizadas

### Backend
- PHP 8.4
- Laravel 11
- PostgreSQL 9.6
- Laravel Sanctum

### Frontend
- React 18
- TypeScript
- Vite
- Axios
- CSS Modules

## 👤 Desarrollador

Desarrollado por José para el control eficiente de personal empresarial.
