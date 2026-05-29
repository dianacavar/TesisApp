function MetricasPage() {
  const metrics = [
    {
      label: 'MAE',
      value: '—',
      hint: 'Error absoluto medio entre clases ordinales',
    },
    {
      label: 'MZE',
      value: '—',
      hint: 'Mean Zero-One Error (tasa de error)',
    },
    {
      label: 'Accuracy',
      value: '—',
      hint: 'Proporción de predicciones correctas',
    },
    {
      label: 'Kappa',
      value: '—',
      hint: 'Acuerdo corregido por azar (Cohen)',
    },
    {
      label: 'Kendall τ',
      value: '—',
      hint: 'Correlación de rangos por concordancia',
    },
    {
      label: 'Spearman ρ',
      value: '—',
      hint: 'Correlación de rangos monotónica',
    },
  ];

  
  return (
    <>
      <header className="page-header">
        <div className="page-header-badge">📈 Métricas del modelo</div>
        <h1>Desempeño y características</h1>
        <p>
          Métricas de evaluación del modelo Random Forest.
        </p>
      </header>

      <div className="app-card">
        <section className="content-section">
          <h2>📊 Métricas de evaluación</h2>
          
          <div className="metrics-grid">
            {metrics.map((m) => (
              <div key={m.label} className="metric-card">
                <div className="metric-value">{m.value}</div>
                <div className="metric-label">{m.label}</div>
                <div className="metric-hint">{m.hint}</div>
              </div>
            ))}
          </div>
        </section>


        <section className="content-section">
          <h2>🔎 Configuración</h2>
          <ul className="tech-list">
            <li><strong>Algoritmo:</strong> Random Forest Classifier</li>
            <li><strong>Clases objetivo:</strong> Bajo · Medio · Alto</li>
          </ul>
        </section>
      </div>
    </>
  );
}

export default MetricasPage;
