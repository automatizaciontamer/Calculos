
# Tamer Industrial S.A. | Suite de Ingeniería Web

Software profesional alojado en la web para asistencia en cálculos de ingeniería eléctrica, mecánica y climatización industrial, normalizado bajo estándares internacionales (IEC / ISO).

## 🚀 Funcionalidades Principales

- **⚡ Potencia y Corriente:** Cálculos precisos para sistemas DC, Monofásicos y Trifásicos.
- **🔌 Sección de Conductores:** Recomendación de calibres comerciales según IEC 60364 / IRAM 2178.
- **🛡️ Protección de Motores:** Dimensionamiento de guardamotores y termomagnéticas.
- **🔄 Arranque Estrella-Triángulo (Y-Δ):** Desglose de contactores (KM) y secciones de conductores.
- **❄️ Climatización Industrial:** Cálculo de potencia frigorífica (AC) o caudal de ventilación para tableros.
- **⚙️ Cinemática Mecánica:** Relaciones de transmisión y desplazamientos lineales.
- **🎨 Electrónica:** Identificador de código de colores para resistencias (4 y 5 bandas).

## 💻 Desarrollo Local

### Instalación
```bash
npm install
```

### Ejecución en Desarrollo (Firebase Studio)
```bash
npm run dev
```

---

## 🌐 Guía de Despliegue (GitHub)

Sigue estos pasos en la terminal de Firebase Studio para vincular este proyecto con tu nuevo repositorio en GitHub y publicarlo como página web.

### 1. Vincular con GitHub
Abre la terminal y ejecuta los siguientes comandos uno por uno (reemplaza los datos si es necesario):

```bash
# Inicializar el repositorio local
git init

# Agregar todos los archivos
git add .

# Realizar el primer commit
git commit -m "Initial commit: Suite de Ingeniería Tamer"

# Renombrar la rama a main
git branch -M main

# Vincular con el repositorio remoto (URL de tu repo)
git remote add origin https://github.com/automatizaciontamer/studio.git

# Subir el código forzando si es necesario (solo la primera vez)
git push -u origin main --force
```

### 2. Configurar la Publicación Web
Una vez que el código esté en GitHub:

1. Ve a tu repositorio: `https://github.com/automatizaciontamer/studio`.
2. Haz clic en la pestaña **Settings** (Configuración).
3. En el menú de la izquierda, selecciona **Pages**.
4. En **Build and deployment** > **Source**, selecciona **"GitHub Actions"**.
5. Ve a la pestaña **Actions** para ver cómo se compila tu web.
6. ¡Listo! Tu web estará en `https://automatizaciontamer.github.io/studio/`.

---
© 2024 Tamer Industrial S.A. Ingeniería industrial normalizada.
