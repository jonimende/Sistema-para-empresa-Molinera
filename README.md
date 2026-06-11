# 🌾 Molinera ERP & AI Management System

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)

Plataforma integral SaaS (Software as a Service) diseñada para la gestión operativa, logística y productiva de plantas molineras. Integra un asistente de Inteligencia Artificial capaz de analizar y cruzar datos en tiempo real de toda la empresa para brindar analítica predictiva y soporte gerencial.

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Estructura de la Base de Datos](#-estructura-de-la-base-de-datos)
- [El Asistente de IA (Omnisciente)](#-el-asistente-de-ia-omnisciente)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Diseño y UI/UX](#-diseño-y-uiux)
- [Desarrollador](#-desarrollador)

## 🚀 Características Principales

El sistema está dividido en tres módulos core empresariales, auditados transversalmente por el asistente de IA:

* **🚛 Logística y Flota:** * Seguimiento de Viajes (origen, destino, choferes, cargas).
  * Control de Cargas de Combustible (rendimiento L/100km, control de patentes).
  * Mantenimiento y Service (trazabilidad de costos, control de filtros, aceites y repuestos).
* **🔬 Calidad e Higiene:** * Recorridas Diarias (BPM, estado de planta, control de plagas, EPP).
  * Controles de Carga de Vehículos (inspección de big bags, humedad, limpieza).
  * Gestión de No Conformidades.
* **⚙️ Elaboración y Producción:** * Partes diarios de molino.
  * Cálculo automático de rendimientos, porcentajes de quiebre y métricas de zarandas/molinillos.
* **🤖 Asistente de IA Global:** Chatbot integrado capaz de responder consultas complejas de negocio cruzando información de todos los módulos.

## 🧠 El Asistente de IA (Omnisciente)

El proyecto utiliza el **SDK de Google Generative AI (Gemini Flash)**. 
A diferencia de los chatbots tradicionales, este sistema inyecta el **estado global de la base de datos** en la instrucción del sistema (`System Prompt`). Esto le otorga al modelo un contexto absoluto, permitiéndole responder consultas analíticas como:
> *"¿Cuál fue el camión que generó más gastos de mantenimiento este mes y cuál es su consumo promedio de combustible?"* o *"¿Existe alguna correlación entre las No Conformidades de humedad y el silo de origen en los últimos partes de elaboración?"*

## 🏗 Arquitectura del Sistema

* **Frontend:** SPA desarrollada en **Angular**, estilizada con **Tailwind CSS**. Enfoque *Mobile-First* utilizando componentes de tipo Card para una experiencia fluida en dispositivos móviles, y vistas de tabla densa (DataTables) para el Panel de Administrador en escritorio.
* **Backend:** API REST construida con **Node.js** y **Express**.
* **Base de Datos:** **PostgreSQL** alojada en **Supabase**.
* **ORM:** **Sequelize** para el modelado de datos, migraciones y asociaciones.
* **IA:** Integración directa con `generativelanguage.googleapis.com` vía `@google/generative-ai`.