import { useMemo, useState } from 'react';
import ProgressBar from './components/ProgressBar';
import SelectField from './components/SelectField';
import SectionHeader from './components/SectionHeader';
import ResultCard from './components/ResultCard';

const API_URL = 'http://127.0.0.1:5000/predict';

const SI_NO_OPTIONS = [
  { value: 'no', label: 'No' },
  { value: 'si', label: 'Sí' },
];

const EDUCACION_OPTIONS = [
  { value: 'No sabe', label: 'No sabe' },
  { value: 'No Aplica', label: 'No aplica' },
  { value: 'Ninguno', label: 'Ninguno' },
  { value: 'Primaria incompleta', label: 'Primaria incompleta' },
  { value: 'Primaria completa', label: 'Primaria completa' },
  { value: 'Secundaria (Bachillerato) incompleta', label: 'Secundaria (Bachillerato) incompleta' },
  { value: 'Secundaria (Bachillerato) completa', label: 'Secundaria (Bachillerato) completa' },
  { value: 'Técnica o tecnológica incompleta', label: 'Técnica o tecnológica incompleta' },
  { value: 'Técnica o tecnológica completa', label: 'Técnica o tecnológica completa' },
  { value: 'Educación profesional incompleta', label: 'Educación profesional incompleta' },
  { value: 'Educación profesional completa', label: 'Educación profesional completa' },
  { value: 'Postgrado', label: 'Postgrado' },
];

const ESTRATO_OPTIONS = [
  { value: 'Sin Estrato', label: 'Sin estrato' },
  { value: 'Estrato 0', label: 'Estrato 0' },
  { value: 'Estrato 1', label: 'Estrato 1' },
  { value: 'Estrato 2', label: 'Estrato 2' },
  { value: 'Estrato 3', label: 'Estrato 3' },
  { value: 'Estrato 4', label: 'Estrato 4' },
  { value: 'Estrato 5', label: 'Estrato 5' },
  { value: 'Estrato 6', label: 'Estrato 6' },
];

const INITIAL_FORM_DATA = {
  ESTU_GENERO: 'F',
  ESTU_HORASSEMANATRABAJA: '0',
  ESTU_EXTERIOR: 'no',
  ESTU_METODO_PRGM: 'PRESENCIAL',
  ESTU_COMOCAPACITOEXAMENSB11: 'Tomó un curso de preparación',
  ESTU_PAGOMATRICULACREDITO: 'no',
  ESTU_PAGOMATRICULAPROPIO: 'si',
  ESTU_PAGOMATRICULAPADRES: 'no',
  ESTU_PAGOMATRICULABECA: 'no',
  INST_ORIGEN: 'NO OFICIAL - CORPORACIÓN',
  INST_CARACTER_ACADEMICO: 'UNIVERSIDAD',
  FAMI_TIENEAUTOMOVIL: 'no',
  FAMI_TIENECOMPUTADOR: 'si',
  FAMI_TIENEHORNOMICROOGAS: 'si',
  FAMI_TIENEMOTOCICLETA: 'no',
  FAMI_TIENESERVICIOTV: 'si',
  FAMI_TIENEINTERNET: 'si',
  FAMI_TIENELAVADORA: 'si',
  FAMI_ESTRATOVIVIENDA: 'Estrato 3',
  FAMI_EDUCACIONPADRE: 'Educación profesional completa',
  FAMI_EDUCACIONMADRE: 'Educación profesional completa',
  ESTU_VALORMATRICULAUNIVERSIDAD: 'Entre 2.5 millones y menos de 4 millones',
};

function FormularioSaberPro() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const steps = useMemo(
    () => [
      {
        id: 'estudiante',
        label: 'Estudiante',
        icon: '🎓',
        title: 'Datos del estudiante',
        description: 'Información personal y académica básica.',
        render: () => (
          <div className="fields-grid">
            <SelectField
              label="Género"
              name="ESTU_GENERO"
              icon="👤"
              value={formData.ESTU_GENERO}
              onChange={handleChange}
              required
              options={[
                { value: 'F', label: 'Femenino' },
                { value: 'M', label: 'Masculino' },
              ]}
            />
            <SelectField
              label="Horas semanales que trabaja"
              name="ESTU_HORASSEMANATRABAJA"
              icon="⏱️"
              value={formData.ESTU_HORASSEMANATRABAJA}
              onChange={handleChange}
              options={[
                { value: '0', label: 'No trabaja' },
                { value: 'Menos de 10 horas', label: 'Menos de 10 horas' },
                { value: 'Entre 11 y 20 horas', label: 'Entre 11 y 20 horas' },
                { value: 'Entre 21 y 30 horas', label: 'Entre 21 y 30 horas' },
                { value: 'Más de 30 horas', label: 'Más de 30 horas' },
              ]}
            />
            <SelectField
              label="¿Estudió en el exterior?"
              name="ESTU_EXTERIOR"
              icon="✈️"
              value={formData.ESTU_EXTERIOR}
              onChange={handleChange}
              options={SI_NO_OPTIONS}
            />
            <SelectField
              label="Método del programa"
              name="ESTU_METODO_PRGM"
              icon="🏫"
              value={formData.ESTU_METODO_PRGM}
              onChange={handleChange}
              options={[
                { value: 'PRESENCIAL', label: 'Presencial' },
                { value: 'DISTANCIA', label: 'Distancia' },
                { value: 'DISTANCIA VITUAL', label: 'Distancia virtual' },
              ]}
            />
            <SelectField
              label="Preparación para Saber 11"
              name="ESTU_COMOCAPACITOEXAMENSB11"
              icon="📚"
              value={formData.ESTU_COMOCAPACITOEXAMENSB11}
              onChange={handleChange}
              required
              options={[
                { value: 'Tomó un curso de preparación', label: 'Tomó un curso de preparación' },
                { value: 'Repasó por cuenta propia', label: 'Repasó por cuenta propia' },
                {
                  value: 'No realizó ninguna prueba de preparación',
                  label: 'No realizó preparación',
                },
              ]}
            />
          </div>
        ),
      },
      {
        id: 'matricula',
        label: 'Matrícula',
        icon: '💰',
        title: 'Pago de matrícula',
        description: 'Costo y fuentes de financiación de la matrícula universitaria.',
        render: () => (
          <div className="fields-grid">
            <SelectField
              label="Valor de la matrícula"
              name="ESTU_VALORMATRICULAUNIVERSIDAD"
              icon="💵"
              value={formData.ESTU_VALORMATRICULAUNIVERSIDAD}
              onChange={handleChange}
              options={[
                { value: 'No pagó matrícula', label: 'No pagó matrícula' },
                { value: 'Menos de 500 mil', label: 'Menos de 500 mil' },
                { value: 'Entre 500 mil y menos de 1 millón', label: 'Entre 500 mil y 1 millón' },
                {
                  value: 'Entre 1 millón y menos de 2.5 millones',
                  label: 'Entre 1 y 2.5 millones',
                },
                {
                  value: 'Entre 2.5 millones y menos de 4 millones',
                  label: 'Entre 2.5 y 4 millones',
                },
                {
                  value: 'Entre 4 millones y menos de 5.5 millones',
                  label: 'Entre 4 y 5.5 millones',
                },
                {
                  value: 'Entre 5.5 millones y menos de 7 millones',
                  label: 'Entre 5.5 y 7 millones',
                },
                { value: 'Más de 7 millones', label: 'Más de 7 millones' },
              ]}
            />
            <SelectField
              label="¿Paga con crédito?"
              name="ESTU_PAGOMATRICULACREDITO"
              icon="💳"
              value={formData.ESTU_PAGOMATRICULACREDITO}
              onChange={handleChange}
              options={SI_NO_OPTIONS}
            />
            <SelectField
              label="¿Paga con recursos propios?"
              name="ESTU_PAGOMATRICULAPROPIO"
              icon="💼"
              value={formData.ESTU_PAGOMATRICULAPROPIO}
              onChange={handleChange}
              options={SI_NO_OPTIONS}
            />
            <SelectField
              label="¿Pagan los padres?"
              name="ESTU_PAGOMATRICULAPADRES"
              icon="👨‍👩‍👧"
              value={formData.ESTU_PAGOMATRICULAPADRES}
              onChange={handleChange}
              options={SI_NO_OPTIONS}
            />
            <SelectField
              label="¿Tiene beca?"
              name="ESTU_PAGOMATRICULABECA"
              icon="🎁"
              value={formData.ESTU_PAGOMATRICULABECA}
              onChange={handleChange}
              options={SI_NO_OPTIONS}
            />
          </div>
        ),
      },
      {
        id: 'institucion',
        label: 'Institución',
        icon: '🏛️',
        title: 'Información de la institución',
        description: 'Características de la universidad o instituto.',
        render: () => (
          <div className="fields-grid">
            <SelectField
              label="Origen de la institución"
              name="INST_ORIGEN"
              icon="🏷️"
              value={formData.INST_ORIGEN}
              onChange={handleChange}
              options={[
                { value: 'NO OFICIAL - CORPORACIÓN', label: 'No oficial – Corporación' },
                { value: 'NO OFICIAL - FUNDACIÓN', label: 'No oficial – Fundación' },
                { value: 'OFICIAL DEPARTAMENTAL', label: 'Oficial departamental' },
                { value: 'OFICIAL MUNICIPAL', label: 'Oficial municipal' },
                { value: 'OFICIAL NACIONAL', label: 'Oficial nacional' },
                { value: 'REGIMEN ESPECIAL', label: 'Régimen especial' },
              ]}
            />
            <SelectField
              label="Carácter académico"
              name="INST_CARACTER_ACADEMICO"
              icon="📜"
              value={formData.INST_CARACTER_ACADEMICO}
              onChange={handleChange}
              options={[
                { value: 'UNIVERSIDAD', label: 'Universidad' },
                { value: 'INSTITUCIÓN UNIVERSITARIA', label: 'Institución universitaria' },
                { value: 'INSTITUCIÓN TECNOLÓGICA', label: 'Institución tecnológica' },
                { value: 'TÉCNICA PROFESIONAL', label: 'Técnica profesional' },
                {
                  value: 'INSTITUCIÓN DE EDUCACIÓN SUPERIOR',
                  label: 'Institución de educación superior',
                },
                {
                  value: 'INSTITUCION DE EDUCACION MEDIA',
                  label: 'Institución de educación media',
                },
                { value: 'ESCUELA NORMAL SUPERIOR', label: 'Escuela Normal Superior' },
              ]}
            />
          </div>
        ),
      },
      {
        id: 'hogar',
        label: 'Hogar',
        icon: '🏠',
        title: 'Condiciones del hogar',
        description: 'Bienes y servicios disponibles en la vivienda.',
        render: () => (
          <div className="fields-grid">
            <SelectField
              label="Estrato de la vivienda"
              name="FAMI_ESTRATOVIVIENDA"
              icon="🏘️"
              value={formData.FAMI_ESTRATOVIVIENDA}
              onChange={handleChange}
              options={ESTRATO_OPTIONS}
            />
            <SelectField
              label="¿Tiene automóvil?"
              name="FAMI_TIENEAUTOMOVIL"
              icon="🚗"
              value={formData.FAMI_TIENEAUTOMOVIL}
              onChange={handleChange}
              options={SI_NO_OPTIONS}
            />
            <SelectField
              label="¿Tiene computador?"
              name="FAMI_TIENECOMPUTADOR"
              icon="💻"
              value={formData.FAMI_TIENECOMPUTADOR}
              onChange={handleChange}
              options={SI_NO_OPTIONS}
            />
            <SelectField
              label="¿Tiene microondas/horno?"
              name="FAMI_TIENEHORNOMICROOGAS"
              icon="🍳"
              value={formData.FAMI_TIENEHORNOMICROOGAS}
              onChange={handleChange}
              options={SI_NO_OPTIONS}
            />
            <SelectField
              label="¿Tiene motocicleta?"
              name="FAMI_TIENEMOTOCICLETA"
              icon="🛵"
              value={formData.FAMI_TIENEMOTOCICLETA}
              onChange={handleChange}
              options={SI_NO_OPTIONS}
            />
            <SelectField
              label="¿Tiene servicio de TV?"
              name="FAMI_TIENESERVICIOTV"
              icon="📺"
              value={formData.FAMI_TIENESERVICIOTV}
              onChange={handleChange}
              options={SI_NO_OPTIONS}
            />
            <SelectField
              label="¿Tiene internet?"
              name="FAMI_TIENEINTERNET"
              icon="🌐"
              value={formData.FAMI_TIENEINTERNET}
              onChange={handleChange}
              options={SI_NO_OPTIONS}
            />
            <SelectField
              label="¿Tiene lavadora?"
              name="FAMI_TIENELAVADORA"
              icon="🧺"
              value={formData.FAMI_TIENELAVADORA}
              onChange={handleChange}
              options={SI_NO_OPTIONS}
            />
          </div>
        ),
      },
      {
        id: 'educacion-familiar',
        label: 'Familia',
        icon: '👨‍👩‍👧‍👦',
        title: 'Educación familiar',
        description: 'Nivel educativo más alto alcanzado por los padres.',
        render: () => (
          <div className="fields-grid">
            <SelectField
              label="Educación del padre"
              name="FAMI_EDUCACIONPADRE"
              icon="👨"
              value={formData.FAMI_EDUCACIONPADRE}
              onChange={handleChange}
              options={EDUCACION_OPTIONS}
            />
            <SelectField
              label="Educación de la madre"
              name="FAMI_EDUCACIONMADRE"
              icon="👩"
              value={formData.FAMI_EDUCACIONMADRE}
              onChange={handleChange}
              options={EDUCACION_OPTIONS}
            />
          </div>
        ),
      },
    ],
    [formData]
  );

  const isLastStep = currentStep === steps.length - 1;
  const currentSection = steps[currentStep];

  const goNext = () => {
    setError(null);
    if (!isLastStep) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    setError(null);
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLastStep) {
      goNext();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error del servidor (${response.status})`);
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        err.message === 'Failed to fetch'
          ? 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://127.0.0.1:5000.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCurrentStep(0);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="app-card">
        <ProgressBar steps={steps} currentStep={currentStep} />

        <div className="step-counter">
          Paso {currentStep + 1} de {steps.length}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-section" key={currentSection.id}>
            <SectionHeader
              icon={currentSection.icon}
              title={currentSection.title}
              description={currentSection.description}
            />
            {currentSection.render()}
          </div>

          {error && (
            <div className="error-banner" role="alert">
              <span className="error-banner-icon" aria-hidden="true">
                ⚠️
              </span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-nav">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={goBack}
              disabled={currentStep === 0 || loading}
            >
              ← Anterior
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  Procesando...
                </>
              ) : isLastStep ? (
                <>Predecir rendimiento →</>
              ) : (
                <>Siguiente →</>
              )}
            </button>
          </div>
        </form>
      </div>

      <ResultCard result={result} onReset={handleReset} />
    </>
  );
}

export default FormularioSaberPro;
