# Carlend - Plataforma de Renta de Vehículos

Carlend es una plataforma moderna y completa para la gestión de rentas de vehículos en Colombia. Conecta empresas que ofrecen vehículos en renta con clientes que buscan movilidad temporal.

## 🚀 Características Principales

### Para Clientes
- **Catálogo de Vehículos**: Explora una amplia selección de vehículos disponibles
- **Filtros Avanzados**: Busca por marca, modelo, precio, año, color y disponibilidad
- **Gestión de Rentas**: Visualiza y administra tus rentas activas, pendientes y completadas
- **Asistente IA**: Chatea con nuestro bot de Telegram para encontrar el vehículo perfecto
- **Perfil de Usuario**: Administra tu información personal y documentos

### Para Empresas
- **Gestión de Flota**: Agrega, edita y elimina vehículos de tu inventario
- **Control de Rentas**: Monitorea todas las rentas de tus vehículos
- **Planes de Suscripción**: Elige entre múltiples planes según tus necesidades
- **Dashboard Empresarial**: Visualiza estadísticas y métricas de tu negocio
- **Plan de Prueba**: Prueba la plataforma con un plan económico de 1000 pesos

### Características Generales
- **Autenticación Segura**: Sistema de login y registro con JWT
- **Interfaz Moderna**: Diseño responsivo con tema oscuro/navy profesional
- **Pagos Seguros**: Integración con Mercado Pago para suscripciones
- **Asistente IA**: Bot de Telegram integrado para ayuda y búsqueda de vehículos
- **Gestión de Estados**: Control completo del ciclo de vida de las rentas

## 📋 Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Cuenta de Mercado Pago (para pagos)
- Acceso al backend de Carlend

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd carlendfront
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=https://somosrentwi-backend-production.up.railway.app
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_clave_publica_de_mercadopago
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm start            # Inicia el servidor de producción

# Linting
npm run lint         # Ejecuta el linter
```

## 🏗️ Estructura del Proyecto

```
carlendfront/
├── public/                 # Archivos estáticos
│   └── assets/            # Imágenes y recursos
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── VehicleCard.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/           # Contextos de React
│   │   └── AuthContext.tsx
│   ├── mock/              # Datos de prueba
│   │   └── product.ts     # Planes de suscripción
│   ├── pages/             # Páginas de Next.js
│   │   ├── api/           # API routes
│   │   ├── auth/          # Autenticación
│   │   ├── client/        # Páginas de cliente
│   │   ├── company/       # Páginas de empresa
│   │   ├── catalog.tsx    # Catálogo de vehículos
│   │   ├── plans.tsx      # Planes de suscripción
│   │   └── index.tsx      # Página principal
│   ├── services/          # Servicios de API
│   │   ├── api.ts         # Cliente Axios configurado
│   │   └── index.ts       # Servicios organizados
│   ├── styles/            # Estilos SCSS
│   │   ├── components/
│   │   └── pages/
│   ├── types/             # Tipos de TypeScript
│   │   └── index.ts
│   └── utils/             # Utilidades
│       └── formatNumber.ts
├── .env.local             # Variables de entorno (no versionado)
├── next.config.ts         # Configuración de Next.js
├── package.json
└── tsconfig.json          # Configuración de TypeScript
```

## 🔐 Autenticación

La aplicación utiliza JWT (JSON Web Tokens) para la autenticación. Los tokens se almacenan en `localStorage` y se envían automáticamente en cada petición al backend.

### Flujo de Autenticación

1. **Registro**: Los usuarios pueden registrarse como clientes o empresas
2. **Login**: Autenticación con email y contraseña
3. **Sesión**: El token se almacena y se usa para peticiones autenticadas
4. **Logout**: Limpia el token y redirige al inicio

### Rutas Protegidas

Las rutas están protegidas según el tipo de usuario:
- `/client/*`: Solo para clientes autenticados
- `/company/*`: Solo para empresas autenticadas

## 🚗 Gestión de Vehículos

### Estados de Disponibilidad
- `isAvailable = true` (status 0): Vehículo disponible para renta
- `isAvailable = false`: Vehículo no disponible

### Operaciones CRUD
- **Crear**: `/company/add-vehicle`
- **Leer**: `/company/vehicles`
- **Actualizar**: `/company/edit-vehicle/[id]`
- **Eliminar**: Botón en la tarjeta del vehículo

## 📅 Sistema de Rentas

### Estados de Renta
- **Pending (0)**: Renta creada, esperando entrega
- **Active (1)**: Vehículo entregado, renta en curso
- **Completed (2)**: Renta finalizada
- **Cancelled (3)**: Renta cancelada

### Flujo de Renta

1. **Cliente**: Selecciona vehículo y crea renta
2. **Empresa**: Confirma y entrega el vehículo (Pending → Active)
3. **Cliente**: Usa el vehículo
4. **Empresa**: Completa la renta al recibir el vehículo (Active → Completed)

## 💳 Planes de Suscripción

### Planes Disponibles

#### Plan de Prueba (Oculto por defecto)
- **Precio**: $1,000 COP/mes
- **Vehículos**: Hasta 3
- **Características**: Gestión básica, soporte por email

#### Plan Basic
- **Precio**: $150,000 COP/mes
- **Vehículos**: Hasta 10
- **Características**: Gestión básica, soporte por email

#### Plan Premium (Más Popular)
- **Precio**: $720,000 COP/6 meses ($120,000/mes)
- **Vehículos**: Hasta 50
- **Características**: Gestión avanzada, soporte prioritario, reportes
- **Descuento**: 20%

#### Plan Enterprise
- **Precio**: $1,080,000 COP/12 meses ($90,000/mes)
- **Vehículos**: Ilimitados
- **Características**: Gestión completa, soporte 24/7, analytics, API access
- **Descuento**: 40%

### Mostrar Plan de Prueba
Usa el botón "Mostrar Plan de Prueba" en la página de planes para ver el plan económico de prueba.

## 🤖 Asistente IA - Telegram Bot

### Integración
El bot de Telegram está integrado en dos lugares:
1. **Footer**: Sección dedicada "Asistente IA" con botón
2. **Catálogo**: Botón flotante en la esquina inferior derecha

### Acceso al Bot
- **Link**: [t.me/CarlendAssistantBot](https://t.me/CarlendAssistantBot)
- **Funcionalidad**: Ayuda a encontrar vehículos, responde preguntas, asistencia general

## 🎨 Diseño y Estilos

### Tema
- Diseño moderno con tema oscuro/navy profesional
- Sin emojis en la interfaz (excepto en algunos iconos específicos)
- Gradientes y efectos glassmorphism
- Animaciones suaves y micro-interacciones

### Componentes Reutilizables
- `Button`: Botón con variantes (primary, outline) y estados (loading, disabled)
- `Input`: Input con validación y estilos consistentes
- `VehicleCard`: Tarjeta de vehículo con imagen y detalles
- `Navbar`: Navegación con autenticación condicional
- `Footer`: Pie de página con enlaces y bot de IA

## 📡 API Endpoints

### Base URL
```
https://somosrentwi-backend-production.up.railway.app/api
```

### Autenticación
- `POST /auth/register` - Registro de cliente
- `POST /auth/register-company` - Registro de empresa
- `POST /auth/login` - Inicio de sesión

### Vehículos
- `GET /Cars` - Listar todos los vehículos
- `GET /Cars/{id}` - Obtener vehículo por ID
- `GET /Cars/my-cars` - Vehículos de la empresa autenticada
- `POST /Cars` - Crear vehículo (requiere autenticación de empresa)
- `PUT /Cars/{id}` - Actualizar vehículo
- `DELETE /Cars/{id}` - Eliminar vehículo

### Rentas
- `GET /Rentals/my-rentals` - Rentas del cliente autenticado
- `GET /Rentals/company-rentals` - Rentas de la empresa autenticada
- `GET /Rentals/{id}` - Obtener renta por ID
- `POST /Rentals` - Crear renta
- `POST /Rentals/{id}/deliver` - Marcar renta como entregada
- `POST /Rentals/{id}/complete` - Completar renta
- `POST /Rentals/{id}/cancel` - Cancelar renta

## 🔧 Configuración de Mercado Pago

1. Crea una cuenta en [Mercado Pago](https://www.mercadopago.com.co)
2. Obtén tus credenciales de prueba/producción
3. Configura la variable de entorno `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
4. El backend debe tener configurada la clave privada

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente con cada push

### Otros Servicios

La aplicación es compatible con cualquier servicio que soporte Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 🐛 Solución de Problemas

### Error de CORS
Si encuentras errores de CORS, verifica que el backend tenga configurado correctamente el origen del frontend.

### Error de Autenticación
- Verifica que el token esté almacenado en `localStorage`
- Revisa que la URL del API sea correcta
- Comprueba que el backend esté en línea

### Imágenes no se cargan
- Verifica que las URLs de las imágenes sean accesibles
- Comprueba la configuración de Next.js para imágenes externas

## 📝 Notas Importantes

- **Estado de Vehículos**: `isAvailable = true` significa disponible (status 0)
- **Suscripciones**: Las empresas necesitan una suscripción activa para gestionar vehículos
- **Plan de Prueba**: Está oculto por defecto, usa el botón toggle para mostrarlo
- **Bot de IA**: Asegúrate de que el bot de Telegram esté activo antes de compartir el link

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 📞 Soporte

Para soporte técnico, contacta a:
- Email: soporte@carlend.com
- Telegram Bot: [@CarlendAssistantBot](https://t.me/CarlendAssistantBot)

---

Desarrollado con ❤️ para Carlend
