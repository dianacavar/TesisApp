function AcercaPage() {
  return (
    <>
      <header className="page-header">
        <div className="page-header-badge">📖 Acerca de la tesis</div>
        <h1>Sobre el proyecto</h1>
        <p>
          Trabajo de grado enfocado en aplicar técnicas de mineria de datos para
          predecir el rendimiento académico de los estudiantes en la prueba
          Saber Pro a partir de variables sociodemográficas, familiares y
          académicas.
        </p>
      </header>

      <div className="app-card">
        <section className="content-section">
          <h2>🎯 Objetivo</h2>
          <p>
            Construir un modelo de clasificación capaz de estimar el nivel de
            desempeño (bajo, medio o alto) de un estudiante en la prueba Saber
            Pro, segun variables del cuestionario socioeconomico.
          </p>
        </section>

        <section className="content-section">
          <h2>📊 Datos</h2>
          <p>
            Conjunto de datos públicos del ICFES con registros de estudiantes
            que presentaron la prueba en Bogotá. Incluye 22 variables
            categóricas relacionadas con el entorno familiar, las condiciones
            del hogar, la institución educativa y los hábitos del estudiante.
          </p>
        </section>

        <section className="content-section">
          <h2>🧠 Modelo</h2>
          <p>
            Se entrenó un <strong>Random Forest Classifier</strong> con
            preprocesamiento de variables ordinales y One-Hot Encoding para
            variables nominales. Se generaron dos versiones del modelo: una con
            ciudad de residencia y otra sin esa variable, permitiendo comparar
            el impacto del factor geográfico.
          </p>
        </section>

        <section className="content-section">
          <h2>🔧 Tecnologías</h2>
          <ul className="tech-list">
            <li><strong>Backend:</strong> Python · Flask · scikit-learn · pandas</li>
            <li><strong>Frontend:</strong> React 19 · Vite</li>
            <li><strong>Modelo:</strong> Random Forest (scikit-learn)</li>
            <li><strong>Persistencia:</strong> joblib</li>
          </ul>
        </section>
      </div>
    </>
  );
}

export default AcercaPage;
