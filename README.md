
# Tamer Industrial S.A. | Suite de Ingeniería Web

Software profesional alojado en la web para asistencia en cálculos de ingeniería eléctrica, mecánica y climatización industrial, normalizado bajo estándares internacionales (IEC / ISO).

## 🚀 Guía para Vincular con GitHub (Terminal)

Si recibes el error "remote origin already exists", ejecuta estos comandos en orden:

### 1. Corregir y Vincular
```bash
# Eliminar el vínculo antiguo si existe
git remote remove origin

# Agregar el vínculo CORRECTO al repositorio Calculos
git remote add origin https://github.com/automatizaciontamer/Calculos.git

# Agregar todos los archivos
git add .

# Crear el commit
git commit -m "Despliegue final: Calculos"

# Asegurar que estamos en la rama main
git branch -M main

# Subir archivos con FUERZA para limpiar el repo
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
