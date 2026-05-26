# Hotel-Reserva
Documentación del Proyecto
Sistema de Reservas Hoteleras

1. Introducción

El presente proyecto consiste en el desarrollo de un sistema web de reservas hoteleras utilizando Python y Flask. El sistema permite visualizar habitaciones disponibles, realizar reservas y administrar la disponibilidad de las habitaciones mediante una interfaz web moderna e interactiva.

El objetivo principal es simular el funcionamiento básico de una plataforma hotelera integrando frontend, backend y una base de datos local simulada dentro del mismo código.

2. Objetivos
Objetivo General

Desarrollar un sistema web de reservas hoteleras utilizando Flask y tecnologías web modernas.

Objetivos Específicos
Crear una interfaz gráfica atractiva para visualizar habitaciones.
Implementar un backend en Flask.
Simular una base de datos local utilizando listas en Python.
Permitir la realización de reservas.
Mostrar dinámicamente la disponibilidad de habitaciones.
3. Tecnologías Utilizadas
Tecnología	Función
Python	Lenguaje principal
Flask	Framework backend
HTML	Estructura de la página
CSS	Diseño visual
JavaScript	Interactividad
JSON	Intercambio de datos
4. Arquitectura del Proyecto

El sistema se divide en tres partes principales:

Frontend

Encargado de mostrar la interfaz visual del hotel, habitaciones, imágenes y botones de reserva.

Backend

Implementado con Flask para manejar rutas, solicitudes y lógica de negocio.

Base de Datos Local

Se implementó una base de datos simulada utilizando listas de Python para almacenar habitaciones y reservas.

5. Desarrollo del Frontend

El frontend fue construido utilizando HTML, CSS y JavaScript.

Características implementadas
Diseño moderno tipo hotel de lujo.
Imágenes dinámicas para cada tipo de habitación.
Tarjetas informativas.
Botones interactivos.
Diseño responsive.
Animaciones hover.
Funcionalidades
Visualización de habitaciones.
Consulta dinámica mediante fetch().
Reservación desde la interfaz web.
6. Desarrollo del Backend

El backend fue desarrollado con Flask.

Rutas implementadas
Ruta	Método	Función
/	GET	Cargar página principal
/habitaciones	GET	Obtener habitaciones
/reservas	POST	Crear reservas
Funciones principales
Obtener habitaciones

Devuelve todas las habitaciones disponibles en formato JSON.

Crear reservas

Permite:

Validar habitaciones disponibles.
Registrar reservas.
Cambiar disponibilidad.
7. Base de Datos Simulada

Debido a que el proyecto fue diseñado para funcionar localmente sin depender de SQL Server, se utilizó una estructura de listas en Python.

Ejemplo
habitaciones = [
    {
        "id":1,
        "numero":"101",
        "tipo":"Simple",
        "precio_noche":120000,
        "disponible":True
    }
]
Ventajas
Fácil implementación.
No requiere instalación adicional.
Ideal para pruebas y proyectos académicos.
8. Integración del Sistema

La integración se realizó conectando el frontend con el backend mediante fetch() en JavaScript.

Flujo del sistema
El usuario entra a la página principal.
JavaScript solicita habitaciones al backend.
Flask devuelve datos JSON.
El frontend genera tarjetas dinámicamente.
El usuario realiza una reserva.
Flask actualiza disponibilidad.
9. Funcionamiento del Sistema
Visualización

El sistema muestra:

Imagen de habitación.
Tipo de habitación.
Precio.
Estado de disponibilidad.
Reservas

El usuario ingresa:

Nombre
Correo
Teléfono
Documento
Fecha de entrada
Fecha de salida

Posteriormente el sistema:

Guarda la reserva.
Cambia el estado de la habitación.
10. Resultados Obtenidos

Se logró desarrollar exitosamente:

✅ Backend funcional con Flask.
✅ Frontend moderno e interactivo.
✅ Sistema de reservas operativo.
✅ Comunicación frontend-backend.
✅ Manejo dinámico de habitaciones.
✅ Simulación de base de datos local.

11. Conclusiones
Flask permite desarrollar aplicaciones web de forma sencilla y eficiente.
La integración entre frontend y backend facilita la interacción dinámica.
Una base de datos simulada es útil para proyectos pequeños o académicos.
El sistema desarrollado cumple correctamente con las funcionalidades básicas de un hotel.
12. Posibles Mejoras Futuras
Integrar MySQL o SQL Server.
Implementar autenticación de usuarios.
Agregar panel administrativo.
Incorporar pagos en línea.
Mejorar validaciones de fechas.
Subir imágenes reales desde base de datos.
13. Ejecución del Proyecto
Instalar Flask
pip install flask
Ejecutar el sistema
py reserva.py
Abrir en navegador
http://localhost:5050
14. Evidencia del Funcionamiento

El sistema muestra:

Página principal del hotel.
Habitaciones dinámicas.
Botones de reserva.
Cambio de disponibilidad automáticamente.

