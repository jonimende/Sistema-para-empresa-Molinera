# 🚛 Paoloni - Sistema Integral de Gestión Logística con IA

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Plataforma operativa Fullstack diseñada para el control, administración y seguimiento de flotas logísticas y controles de higiene. Potenciado por un **Asistente de Inteligencia Artificial (LLM)** capaz de interpretar lenguaje natural para generar y enviar reportes automáticos en Excel y plantillas HTML enriquecidas.

## ✨ Características Principales

* **🤖 Asistente IA Integrado:** Chatbot flotante con memoria de contexto que responde a órdenes en lenguaje natural. Puede filtrar viajes, sumar kilómetros y enviar reportes corporativos por correo electrónico.
* **📊 Dashboard Operativo:** Centro de comando en tiempo real con estadísticas de uso, kilómetros totales, viajes registrados y flujo de actividades.
* **🚚 Módulo de Logística:** Seguimiento detallado de viajes, choferes, origen/destino y carga transportada.
* **🧼 Control de Higiene (PCC):** Checklist digital para inspección de transportes y cargas con generación de reportes automáticos.
* **🔐 Autenticación y Roles:** Sistema de seguridad robusto con control de acceso basado en roles (Admin, Logística, Camionero, Inspector, etc.).
* **📧 Reportes Automatizados:** Generación y envío de planillas dinámicas (.xlsx) y reportes de control visuales vía Nodemailer.

## 🛠️ Stack Tecnológico

**Frontend:**
* Angular 
* Tailwind CSS (Diseño UI/UX y layouts responsivos)
* Reactive Forms & Http Client

**Backend & IA:**
* Node.js con Express y TypeScript
* Sequelize ORM
* Groq AI API (Procesamiento de Lenguaje Natural)
* Nodemailer (Envío de reportes HTML y Excel)

**Base de Datos:**
* PostgreSQL

## ⚙️ Estructura del Proyecto

El repositorio funciona como un **Monorepo** dividido en dos entornos principales:

- `/frontend`: Aplicación cliente (Angular).
- `/backend`: API RESTful y lógica de negocios (Node.js).

## 🚀 Despliegue (Deploy)

Este proyecto está optimizado para ser desplegado en servicios cloud modernos:
- **Frontend:** Desplegado en [Vercel](https://vercel.com/) para máxima velocidad y CDN global.
- **Backend & Database:** Alojado en [Railway](https://railway.app/), integrando la API Node.js con una base de datos PostgreSQL nativa.