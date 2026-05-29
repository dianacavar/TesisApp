from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import socket

# =========================
# Inicialización Flask
# =========================
app = Flask(__name__)

# Configuración CORS explícita: permite peticiones desde cualquier origen
# (útil cuando se accede tanto por localhost como por la IP local).
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=False,
)

# =========================
# Cargar modelo y feature names
# =========================
# IMPORTANTE: el modelo y feature_names deben ser CONSISTENTES.
# Usamos el modelo entrenado CON la variable ESTU_MCPIO_RESIDE.
# Aunque el modelo la incluye, el frontend ya NO la pide al usuario:
# en el preprocesamiento la inyectamos con un valor por defecto fijo.
MODEL_PATH = "modelo_random_forest_bogota_se.pkl"
FEATURES_PATH = "feature_names_con_ciudad.pkl"

model = joblib.load(MODEL_PATH)
feature_names = joblib.load(FEATURES_PATH)

print(f"[Modelo cargado] {MODEL_PATH} ({len(feature_names)} features)")

# =========================
# Diccionarios de mapeo
# =========================

MAP_SINO = {"si": 1, "no": 0}

MAP_EDUCACION = {
    'No sabe': 0, 'No Aplica': 1, 'Ninguno': 2,
    'Primaria incompleta': 3, 'Primaria completa': 4,
    'Secundaria (Bachillerato) incompleta': 5,
    'Secundaria (Bachillerato) completa': 6,
    'Técnica o tecnológica incompleta': 7,
    'Técnica o tecnológica completa': 8,
    'Educación profesional incompleta': 9,
    'Educación profesional completa': 10,
    'Postgrado': 11
}

MAP_HORAS = {
    '0': 0, 'Menos de 10 horas': 1,
    'Entre 11 y 20 horas': 2,
    'Entre 21 y 30 horas': 3,
    'Más de 30 horas': 4
}

MAP_MATRICULA = {
    'No pagó matrícula': 0, 'Menos de 500 mil': 1,
    'Entre 500 mil y menos de 1 millón': 2,
    'Entre 1 millón y menos de 2.5 millones': 3,
    'Entre 2.5 millones y menos de 4 millones': 4,
    'Entre 4 millones y menos de 5.5 millones': 5,
    'Entre 5.5 millones y menos de 7 millones': 6,
    'Más de 7 millones': 7
}

MAP_ESTRATO = {
    'Sin Estrato': 0, 'Estrato 0': 1, 'Estrato 1': 2,
    'Estrato 2': 3, 'Estrato 3': 4,
    'Estrato 4': 5, 'Estrato 5': 6, 'Estrato 6': 7
}

# =========================
# Preprocesamiento
# =========================
def preprocess_input(data: dict) -> pd.DataFrame:
    df = pd.DataFrame([data])

    # Eliminar variable objetivo si viene por error
    df = df.drop(columns=['PUNT_GLOBAL'], errors='ignore')

    # Normalización
    df['ESTU_VALORMATRICULAUNIVERSIDAD'] = df['ESTU_VALORMATRICULAUNIVERSIDAD'].replace(
        {'Mas de 7 millones': 'Más de 7 millones'}
    )
    df['FAMI_ESTRATOVIVIENDA'] = df['FAMI_ESTRATOVIVIENDA'].replace(
        {'Vive en una zona rural donde no hay estratificación socioeconómica': 'Sin Estrato'}
    )

    # Variables dicotómicas
    dicotomicas = [
        'FAMI_TIENEAUTOMOVIL', 'FAMI_TIENECOMPUTADOR',
        'FAMI_TIENEHORNOMICROOGAS', 'FAMI_TIENEMOTOCICLETA',
        'FAMI_TIENESERVICIOTV', 'FAMI_TIENEINTERNET',
        'FAMI_TIENELAVADORA', 'ESTU_PAGOMATRICULACREDITO',
        'ESTU_PAGOMATRICULAPROPIO', 'ESTU_PAGOMATRICULAPADRES',
        'ESTU_PAGOMATRICULABECA', 'ESTU_EXTERIOR'
    ]

    for col in dicotomicas:
        df[col] = df[col].str.lower().map(MAP_SINO)

    # Variables ordinales
    df['FAMI_EDUCACIONPADRE'] = df['FAMI_EDUCACIONPADRE'].map(MAP_EDUCACION)
    df['FAMI_EDUCACIONMADRE'] = df['FAMI_EDUCACIONMADRE'].map(MAP_EDUCACION)
    df['ESTU_HORASSEMANATRABAJA'] = df['ESTU_HORASSEMANATRABAJA'].map(MAP_HORAS)
    df['ESTU_VALORMATRICULAUNIVERSIDAD'] = df['ESTU_VALORMATRICULAUNIVERSIDAD'].map(MAP_MATRICULA)
    df['FAMI_ESTRATOVIVIENDA'] = df['FAMI_ESTRATOVIVIENDA'].map(MAP_ESTRATO)

    # One-Hot Encoding manual
    # ESTU_GENERO — referencia: 'F'
    df['ESTU_GENERO_M'] = (df['ESTU_GENERO'] == 'M').astype(int)

    # ESTU_METODO_PRGM — referencia: 'DISTANCIA TRADICIONAL'
    df['ESTU_METODO_PRGM_DISTANCIA VITUAL'] = (df['ESTU_METODO_PRGM'] == 'DISTANCIA VITUAL').astype(int)
    df['ESTU_METODO_PRGM_PRESENCIAL']       = (df['ESTU_METODO_PRGM'] == 'PRESENCIAL').astype(int)

    # ESTU_COMOCAPACITOEXAMENSB11 — referencia: 'No se preparó'
    df['ESTU_COMOCAPACITOEXAMENSB11_Repasó por cuenta propia']     = (df['ESTU_COMOCAPACITOEXAMENSB11'] == 'Repasó por cuenta propia').astype(int)
    df['ESTU_COMOCAPACITOEXAMENSB11_Tomó un curso de preparación'] = (df['ESTU_COMOCAPACITOEXAMENSB11'] == 'Tomó un curso de preparación').astype(int)

    # INST_ORIGEN — referencia: 'NO OFICIAL - CORPORACIÓN'
    df['INST_ORIGEN_NO OFICIAL - FUNDACIÓN'] = (df['INST_ORIGEN'] == 'NO OFICIAL - FUNDACIÓN').astype(int)
    df['INST_ORIGEN_OFICIAL DEPARTAMENTAL']  = (df['INST_ORIGEN'] == 'OFICIAL DEPARTAMENTAL').astype(int)
    df['INST_ORIGEN_OFICIAL MUNICIPAL']      = (df['INST_ORIGEN'] == 'OFICIAL MUNICIPAL').astype(int)
    df['INST_ORIGEN_OFICIAL NACIONAL']       = (df['INST_ORIGEN'] == 'OFICIAL NACIONAL').astype(int)
    df['INST_ORIGEN_REGIMEN ESPECIAL']       = (df['INST_ORIGEN'] == 'REGIMEN ESPECIAL').astype(int)

    # INST_CARACTER_ACADEMICO — referencia: 'INSTITUCIÓN TECNOLÓGICA'
    df['INST_CARACTER_ACADEMICO_INSTITUCIÓN UNIVERSITARIA'] = (df['INST_CARACTER_ACADEMICO'] == 'INSTITUCIÓN UNIVERSITARIA').astype(int)
    df['INST_CARACTER_ACADEMICO_TÉCNICA PROFESIONAL']       = (df['INST_CARACTER_ACADEMICO'] == 'TÉCNICA PROFESIONAL').astype(int)
    df['INST_CARACTER_ACADEMICO_UNIVERSIDAD']               = (df['INST_CARACTER_ACADEMICO'] == 'UNIVERSIDAD').astype(int)

    # Eliminar columnas originales ya codificadas
    df = df.drop(columns=[
        'ESTU_GENERO', 'ESTU_METODO_PRGM', 'ESTU_COMOCAPACITOEXAMENSB11',
        'INST_ORIGEN', 'INST_CARACTER_ACADEMICO'
    ], errors='ignore')

    # Relleno defensivo
    df = df.fillna(0)

    return df

# =========================
# Helpers de predicción
# =========================
LABELS = {
    1: "Rendimiento bajo",
    2: "Rendimiento medio",
    3: "Rendimiento alto",
}


def _predict_single(data: dict) -> dict:
    """Ejecuta el preprocesamiento y la predicción para un único registro.

    Devuelve un dict con la predicción, etiqueta, probabilidad de la clase
    elegida y un diccionario con la probabilidad de cada clase.
    """
    X = preprocess_input(data)
    X = X.reindex(columns=feature_names, fill_value=0)

    pred = int(model.predict(X)[0])
    probs = model.predict_proba(X)[0]
    classes = [int(c) for c in model.classes_]

    prob_by_class = {c: float(p) for c, p in zip(classes, probs)}
    chosen_prob = prob_by_class.get(pred, float(max(probs)))

    return {
        "prediction": pred,
        "label": LABELS.get(pred, "Desconocido"),
        "probability": chosen_prob,
        "probabilities": prob_by_class,
    }


# =========================
# Endpoint de predicción (un registro)
# =========================
@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json()
        result = _predict_single(data)
        return jsonify(result)
    except Exception as e:
        app.logger.exception("Error en /predict")
        return jsonify({"error": str(e)}), 500


# =========================
# Endpoint de predicción por lotes (n registros)
# =========================
@app.route("/predict_batch", methods=["POST", "OPTIONS"])
def predict_batch():
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        payload = request.get_json()

        # Acepta tanto {"items": [...]} como una lista directa.
        items = payload.get("items") if isinstance(payload, dict) else payload
        if not isinstance(items, list):
            return jsonify({"error": "Se esperaba una lista en 'items'"}), 400

        results = []
        for idx, data in enumerate(items):
            try:
                results.append(_predict_single(data))
            except Exception as e:
                results.append({"error": str(e), "index": idx})

        return jsonify({"count": len(results), "results": results})
    except Exception as e:
        app.logger.exception("Error en /predict_batch")
        return jsonify({"error": str(e)}), 500

# =========================
# Main
# =========================
def get_local_ip() -> str:
    """Obtiene la IP local de la máquina en la red."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # No necesita ser alcanzable, solo se usa para obtener la IP de salida
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip


if __name__ == "__main__":
    host = "0.0.0.0"
    port = 5000
    local_ip = get_local_ip()

    print("=" * 50)
    print(" Servidor Flask iniciado")
    print(f"   - Localhost:  http://127.0.0.1:{port}")
    print(f"   - Red local:  http://{local_ip}:{port}")
    print("=" * 50)

    app.run(host=host, port=port, debug=True)
