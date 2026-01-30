from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

# =========================
# Inicialización Flask
# =========================
app = Flask(__name__)
CORS(app)

# =========================
# Cargar modelo y feature names
# =========================
model = joblib.load("modelo_random_forest_bogota.pkl")
feature_names = joblib.load("feature_names.pkl")

# =========================
# Diccionarios de mapeo
# =========================
MAP_MCPIO = {"BOGOTA": 0, "MEDELLIN": 1}
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
    df['ESTU_MCPIO_RESIDE'] = df['ESTU_MCPIO_RESIDE'].str.upper()
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
    df['ESTU_MCPIO_RESIDE'] = df['ESTU_MCPIO_RESIDE'].map(MAP_MCPIO)
    df['FAMI_EDUCACIONPADRE'] = df['FAMI_EDUCACIONPADRE'].map(MAP_EDUCACION)
    df['FAMI_EDUCACIONMADRE'] = df['FAMI_EDUCACIONMADRE'].map(MAP_EDUCACION)
    df['ESTU_HORASSEMANATRABAJA'] = df['ESTU_HORASSEMANATRABAJA'].map(MAP_HORAS)
    df['ESTU_VALORMATRICULAUNIVERSIDAD'] = df['ESTU_VALORMATRICULAUNIVERSIDAD'].map(MAP_MATRICULA)
    df['FAMI_ESTRATOVIVIENDA'] = df['FAMI_ESTRATOVIVIENDA'].map(MAP_ESTRATO)

    # One-Hot Encoding
    nominales = [
        'INST_ORIGEN', 'INST_CARACTER_ACADEMICO',
        'ESTU_METODO_PRGM', 'ESTU_COMOCAPACITOEXAMENSB11',
        'ESTU_GENERO'
    ]

    df = pd.get_dummies(df, columns=nominales, drop_first=True)

    # Boolean → int
    bool_cols = df.select_dtypes(include='bool').columns
    df[bool_cols] = df[bool_cols].astype(int)

    # Relleno defensivo
    df = df.fillna(0)

    return df

# =========================
# Endpoint de predicción
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    X = preprocess_input(data)

    # 🔑 CLAVE: alinear EXACTAMENTE con el modelo
    X = X.reindex(columns=feature_names, fill_value=0)

    pred = model.predict(X)[0]

    return jsonify({
        "prediction": int(pred),
        "label": {
            1: "Rendimiento bajo",
            2: "Rendimiento medio",
            3: "Rendimiento alto"
        }[int(pred)]
    })

# =========================
# Main
# =========================
if __name__ == "__main__":
    app.run(debug=True)
