# Food Shooping 🍔

Landing page interactiva para la app de pedidos de comida **Food Shooping**.

## Características

- Diseño moderno con animaciones y efectos interactivos
- Logo centrado y descripción de la app
- Dos vistas previas de cómo se verá la aplicación móvil
- Botón central para descargar el APK
- Inicio de sesión con correo (registro automático)
- Base de datos en Excel (`data/usuarios.xlsx`)

## Inicio rápido

```bash
npm install
npm run init-db
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Inicio de sesión

1. Haz clic en **Iniciar sesión**
2. Ingresa tu correo electrónico
3. Si es nuevo, se crea tu cuenta automáticamente en el Excel
4. Si ya existes, inicia sesión directamente

Los usuarios se guardan en `data/usuarios.xlsx` con columnas: `id`, `email`, `nombre`, `fecha_registro`.

## Generar APK (Android)

Para empaquetar la web como app Android:

```bash
npm install
npx cap add android
npx cap sync android
npm run build:apk
```

El APK se generará en `android/app/build/outputs/apk/debug/app-debug.apk`.  
Cópialo a `public/downloads/food-shooping.apk` para que el botón de descarga funcione en la web.

**Requisitos:** Android Studio, JDK 17+, Android SDK.

## Estructura

```
food shooping/
├── public/           # Frontend (HTML, CSS, JS, imágenes)
├── data/             # Base de datos Excel
├── scripts/          # Scripts de inicialización
├── server.js         # Servidor Express + API
└── capacitor.config.json
```

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/login` | Login/registro con email |
| GET | `/api/users` | Listar usuarios |
| GET | `/api/download/apk` | Descargar APK |
