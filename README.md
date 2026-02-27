
# Tamer Industrial S.A. | Suite de Ingeniería Web

Software profesional alojado en la web para asistencia en cálculos de ingeniería eléctrica, mecánica y climatización industrial, normalizado bajo estándares internacionales (IEC / ISO).

## 🚀 Guía para Vincular con GitHub (Terminal)

Si tienes problemas para subir el código al repositorio **Calculos**, sigue estos comandos en orden:

### 1. Corregir y Vincular
```bash
# 1. Eliminar cualquier vínculo antiguo
git remote remove origin

# 2. Agregar el vínculo al repositorio ACTUAL
git remote add origin https://github.com/automatizaciontamer/Calculos.git

# 3. Preparar los archivos
git add .
git commit -m "Despliegue: Calculos (Formato y Protección)"

# 4. Asegurar la rama principal
git branch -M main

# 5. Subir archivos (usa --force para limpiar el historial del repo nuevo)
git push -u origin main --force
```

### 2. Configuración Final en GitHub Web
1. Ve a tu repositorio: `https://github.com/automatizaciontamer/Calculos`.
2. Haz clic en **Settings** (Configuración).
3. En el menú izquierdo, ve a **Pages**.
4. En **Build and deployment** > **Source**, selecciona obligatoriamente **"GitHub Actions"**.
5. ¡Listo! Tu web estará en `https://automatizaciontamer.github.io/Calculos/`.

---
© 2024 Tamer Industrial S.A. Ingeniería industrial normalizada.
