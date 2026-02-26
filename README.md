# Tamer Industrial S.A. | Ingeniería de Automatización

Software profesional para asistencia en cálculos de ingeniería eléctrica, mecánica y climatización industrial, normalizado bajo estándares internacionales (IEC / ISO).

## 🚀 Funcionalidades Principales

- **Potencia y Corriente:** Cálculos precisos para sistemas DC, Monofásicos y Trifásicos.
- **Sección de Conductores:** Recomendación de calibres comerciales según IEC 60364 / IRAM 2178.
- **Protección de Motores:** Dimensionamiento de guardamotores y termomagnéticas con criterio de arranque.
- **Arranque Estrella-Triángulo (Y-Δ):** Desglose de contactores (KM) y secciones de conductores de potencia.
- **Climatización Industrial:** Cálculo de potencia frigorífica (AC) o caudal de ventilación para tableros eléctricos.
- **Cinemática Lineal y Rotativa:** Relaciones de transmisión y desplazamientos mecánicos.
- **Electrónica:** Identificador visual de código de colores para resistencias (4 y 5 bandas).

## 💻 Desarrollo y Compilación

### Requisitos
- Node.js 18+
- npm

### Instalación
```bash
npm install
```

### Ejecución en Desarrollo (Web)
```bash
npm run dev
```

### Ejecución en Escritorio (Electron)
```bash
npm run electron:dev
```

### Generar Ejecutable Portable (.exe)
```bash
npm run electron:build
```
El archivo ejecutable se generará en la carpeta `dist/`.

## 🌐 Despliegue en GitHub Pages
La aplicación está configurada para desplegarse automáticamente mediante GitHub Actions. Asegúrate de configurar la fuente en **Settings > Pages > GitHub Actions**.

---
© 2024 Tamer Industrial S.A. Ingeniería industrial normalizada.