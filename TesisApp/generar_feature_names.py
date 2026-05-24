"""
Genera los archivos feature_names.pkl a partir de los modelos entrenados.

Esto garantiza que las columnas que se le pasan al modelo en /predict
coincidan exactamente (en nombre y orden) con las que vio durante el
entrenamiento. Si las columnas no coinciden, las predicciones son basura.

Salida:
    - feature_names_con_ciudad.pkl  -> desde modelo_random_forest_bogota_se.pkl
    - feature_names_sin_ciudad.pkl  -> desde modelo_random_forest_bogota.pkl
"""

import joblib

MODELOS = {
    "feature_names_con_ciudad.pkl": "modelo_random_forest_bogota_se.pkl",
    "feature_names_sin_ciudad.pkl": "modelo_random_forest_bogota.pkl",
}

for out_path, model_path in MODELOS.items():
    print(f"\nProcesando {model_path} ...")
    model = joblib.load(model_path)

    if not hasattr(model, "feature_names_in_"):
        print(f"  [!] El modelo {model_path} no expone feature_names_in_.")
        continue

    feature_names = list(model.feature_names_in_)
    print(f"  - n_features: {len(feature_names)}")
    print(f"  - incluye ESTU_MCPIO_RESIDE: {'ESTU_MCPIO_RESIDE' in feature_names}")

    joblib.dump(feature_names, out_path)
    print(f"  -> guardado en {out_path}")

print("\nListo.")
