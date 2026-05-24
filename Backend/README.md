# Backend - API de Predicción Saber Pro

API REST construida con **Flask** que expone un modelo de Machine Learning (Random Forest) para predecir el rendimiento académico de estudiantes en las pruebas Saber Pro.

---

## Tabla de contenido

- [Requisitos previos](#requisitos-previos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Despliegue local (desarrollo)](#despliegue-local-desarrollo)
  - [1. Clonar el repositorio](#1-clonar-el-repositorio)
  - [2. Crear y activar el entorno virtual](#2-crear-y-activar-el-entorno-virtual)
  - [3. Instalar dependencias](#3-instalar-dependencias)
  - [4. Ejecutar el servidor](#4-ejecutar-el-servidor)
- [Endpoints disponibles](#endpoints-disponibles)
- [Despliegue en red local (LAN)](#despliegue-en-red-local-lan)
- [Despliegue en producción](#despliegue-en-producción)
- [Solución de problemas](#solución-de-problemas)

---

## Requisitos previos

- **Python 3.10 o superior** (probado con 3.10 / 3.11).
- **pip** actualizado.
- (Opcional) **Git** para clonar el repositorio.

Verifica tu versión de Python:

```bash
python --version
```

---

## Estructura del proyecto

```
Backend/
├── app.py                              # Punto de entrada de la API Flask
├── requirements.txt                    # Dependencias del proyecto
├── modelo_random_forest_bogota_se.pkl  # Modelo entrenado (Random Forest)
├── feature_names_con_ciudad.pkl        # Nombres de features esperadas por el modelo
├── feature_names.pkl                   # Versión alterna de feature names
└── generar_feature_names.py            # Script auxiliar para regenerar feature names
```

> **Importante:** Los archivos `.pkl` deben estar presentes en el mismo directorio que `app.py` para que el servidor inicie correctamente.

---

## Despliegue local (desarrollo)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd TesisApp/Backend
```

### 2. Crear y activar el entorno virtual

**Windows (PowerShell):**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

> Si PowerShell bloquea la activación, ejecuta una vez:
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

**Windows (CMD):**

```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Las dependencias instaladas son:

- `Flask==3.0.0`
- `flask-cors==4.0.0`
- `numpy==1.26.4`
- `pandas==2.2.1`
- `scikit-learn==1.4.1.post1`
- `joblib==1.3.2`

### 4. Ejecutar el servidor

```bash
python app.py
```

Si todo está correcto verás algo como:

```
[Modelo cargado] modelo_random_forest_bogota_se.pkl (NN features)
==================================================
 Servidor Flask iniciado
   - Localhost:  http://127.0.0.1:5000
   - Red local:  http://192.168.X.X:5000
==================================================
```

El servidor queda escuchando en el puerto **5000**.

---

## Endpoints disponibles

### `POST /predict`

Predice el rendimiento de **un único estudiante**.

**Body (JSON):**

```json
{
  "FAMI_TIENEAUTOMOVIL": "Si",
  "FAMI_TIENECOMPUTADOR": "Si",
  "FAMI_TIENEINTERNET": "Si",
  "FAMI_EDUCACIONPADRE": "Educación profesional completa",
  "FAMI_EDUCACIONMADRE": "Postgrado",
  "FAMI_ESTRATOVIVIENDA": "Estrato 3",
  "ESTU_HORASSEMANATRABAJA": "0",
  "ESTU_VALORMATRICULAUNIVERSIDAD": "Entre 2.5 millones y menos de 4 millones",
  "ESTU_GENERO": "F",
  "...": "..."
}
```

**Respuesta:**

```json
{
  "prediction": 3,
  "label": "Rendimiento alto",
  "probability": 0.78,
  "probabilities": { "1": 0.05, "2": 0.17, "3": 0.78 }
}
```

### `POST /predict_batch`

Predice el rendimiento para **múltiples estudiantes** en una sola petición.

**Body (JSON):**

```json
{
  "items": [
    { "FAMI_TIENEAUTOMOVIL": "Si", "...": "..." },
    { "FAMI_TIENEAUTOMOVIL": "No", "...": "..." }
  ]
}
```

**Respuesta:**

```json
{
  "count": 2,
  "results": [
    { "prediction": 2, "label": "Rendimiento medio", "probability": 0.61, "probabilities": { "...": "..." } },
    { "prediction": 1, "label": "Rendimiento bajo",  "probability": 0.55, "probabilities": { "...": "..." } }
  ]
}
```

---

## Despliegue en red local (LAN)

El servidor ya está configurado para escuchar en `0.0.0.0`, por lo que es accesible desde otros equipos de la misma red.

1. Ejecuta `python app.py`. Anota la IP de red local que muestra la consola (ej. `http://192.168.1.20:5000`).
2. Asegúrate de que el **firewall de Windows** permita conexiones entrantes al puerto `5000`:

   ```powershell
   New-NetFirewallRule -DisplayName "Flask 5000" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
   ```

3. Desde otro equipo en la misma red, prueba la conexión:

   ```bash
   curl http://192.168.1.20:5000/predict -X POST -H "Content-Type: application/json" -d "{}"
   ```

4. En el frontend, actualiza la URL de la API (`Frontend/src/data/formOptions.js`) apuntando a la IP local del backend.

---

## Despliegue en producción

`app.run(debug=True)` **no debe usarse en producción**. Usa un servidor WSGI:

### Opción A: Waitress (Windows)

```bash
pip install waitress
waitress-serve --host=0.0.0.0 --port=5000 app:app
```

### Opción B: Gunicorn (Linux / macOS)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Opción C: Docker

Crea un `Dockerfile` en la carpeta `Backend/`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn

COPY . .

EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

Construye y ejecuta:

```bash
docker build -t saberpro-backend .
docker run -p 5000:5000 saberpro-backend
```

### Opción D: Servicios cloud

- **Render / Railway / Heroku:** sube el repo, configura el comando de arranque `gunicorn app:app` y el puerto desde la variable `PORT`.
- **Azure App Service / AWS Elastic Beanstalk:** despliega como aplicación Python con `app.py`.

---

## Solución de problemas

| Error | Causa probable | Solución |
|---|---|---|
| `ModuleNotFoundError: flask` | Entorno virtual no activado | Activa `venv` antes de ejecutar `python app.py` |
| `FileNotFoundError: ...pkl` | Falta el modelo o feature names | Verifica que los `.pkl` estén junto a `app.py` |
| `Address already in use` | Puerto 5000 ocupado | Cambia el puerto en `app.py` o cierra la app que lo use |
| El frontend no conecta | CORS / IP incorrecta | Verifica la `API_URL` en el frontend y que el backend esté corriendo |
| `InconsistentVersionWarning` (sklearn) | Modelo entrenado con otra versión | Reentrena el modelo o instala la versión exacta indicada en `requirements.txt` |

---

## Licencia

Proyecto académico - Trabajo de tesis.
