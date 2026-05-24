import FormularioSaberPro from '../FormularioSaberPro';

function PredictorPage() {
  return (
    <>
      <header className="page-header">
        <div className="page-header-badge">🎯 Demo interactiva</div>
        <h1>Predice el rendimiento Saber Pro</h1>
        <p>
          Completa el formulario con tus variables sociodemográficas y
          académicas. El modelo de Random Forest entrenado con datos del ICFES
          estimará tu nivel de rendimiento esperado.
        </p>
      </header>

      <FormularioSaberPro />
    </>
  );
}

export default PredictorPage;
