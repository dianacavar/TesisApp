import React, { useState } from 'react';

const FormularioSaberPro = () => {
  const styles = {
    container: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '40px 0'
    },
    formCard: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      padding: '40px',
      marginBottom: '30px'
    },
    header: {
      color: '#667eea',
      fontWeight: '700',
      marginBottom: '30px',
      textAlign: 'center',
      fontSize: '2.5rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      color: '#764ba2',
      fontWeight: '600',
      borderBottom: '3px solid #667eea',
      paddingBottom: '10px',
      marginTop: '30px',
      marginBottom: '20px',
      fontSize: '1.5rem'
    },
    label: {
      fontWeight: '600',
      color: '#4a5568',
      marginBottom: '8px',
      fontSize: '0.95rem'
    },
    select: {
      borderRadius: '10px',
      border: '2px solid #e2e8f0',
      padding: '12px',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem'
    },
    selectFocus: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    button: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '50px',
      padding: '15px 50px',
      fontSize: '1.1rem',
      fontWeight: '600',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
      transition: 'all 0.3s ease',
      width: '100%',
      maxWidth: '300px',
      margin: '30px auto',
      display: 'block'
    },
    resultCard: {
      borderRadius: '15px',
      border: 'none',
      boxShadow: '0 10px 30px rgba(34, 197, 94, 0.2)',
      padding: '25px',
      background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)'
    },
    resultTitle: {
      color: '#065f46',
      fontWeight: '700',
      fontSize: '1.5rem',
      marginBottom: '15px'
    },
    resultText: {
      color: '#047857',
      fontSize: '1.2rem',
      fontWeight: '500'
    },
    inputGroup: {
      marginBottom: '20px'
    }
  };

  const [formData, setFormData] = useState({
    ESTU_GENERO: 'F',
    ESTU_MCPIO_RESIDE: 'BOGOTA',
    ESTU_HORASSEMANATRABAJA: '0',
    ESTU_EXTERIOR: 'no',
    ESTU_METODO_PRGM: 'DISTANCIA',
    ESTU_COMOCAPACITOEXAMENSB11: 'Tomó un curso de preparación',
    ESTU_PAGOMATRICULACREDITO: 'no',
    ESTU_PAGOMATRICULAPROPIO: 'si',
    ESTU_PAGOMATRICULAPADRES: 'no',
    ESTU_PAGOMATRICULABECA: 'no',
    INST_ORIGEN: 'NO OFICIAL - CORPORACIÓN',
    INST_CARACTER_ACADEMICO: 'INSTITUCIÓN TECNOLÓGICA',
    FAMI_TIENEAUTOMOVIL: 'no',
    FAMI_TIENECOMPUTADOR: 'si',
    FAMI_TIENEHORNOMICROOGAS: 'si',
    FAMI_TIENEMOTOCICLETA: 'no',
    FAMI_TIENESERVICIOTV: 'si',
    FAMI_TIENEINTERNET: 'si',
    FAMI_TIENELAVADORA: 'si',
    FAMI_ESTRATOVIVIENDA: 'Sin Estrato',
    FAMI_EDUCACIONPADRE: 'No sabe',
    FAMI_EDUCACIONMADRE: 'No sabe',
    ESTU_VALORMATRICULAUNIVERSIDAD: 'No pagó matrícula'
  });

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      setResultado(result);
    } catch (error) {
      alert('Error al obtener la predicción');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="container">
        <div style={styles.formCard}>
          <h2 style={styles.header}>Formulario de Predicción Saber Pro</h2>

          <form onSubmit={handleSubmit}>
            {/* DATOS DEL ESTUDIANTE */}
            <div className="row">
              <div className="col-md-4" style={styles.inputGroup}>
                <label htmlFor="ESTU_GENERO" className="form-label" style={styles.label}>Género</label>
                <select
                  id="ESTU_GENERO"
                  name="ESTU_GENERO"
                  className="form-select"
                  style={styles.select}
                  value={formData.ESTU_GENERO}
                  onChange={handleChange}
                  required
                >
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                </select>
              </div>

              <div className="col-md-4" style={styles.inputGroup}>
                <label htmlFor="ESTU_MCPIO_RESIDE" className="form-label" style={styles.label}>Municipio de residencia</label>
                <select
                  id="ESTU_MCPIO_RESIDE"
                  name="ESTU_MCPIO_RESIDE"
                  className="form-select"
                  style={styles.select}
                  value={formData.ESTU_MCPIO_RESIDE}
                  onChange={handleChange}
                >
                  <option value="BOGOTA">Bogotá</option>
                  <option value="MEDELLIN">Medellín</option>
                </select>
              </div>

              <div className="col-md-4" style={styles.inputGroup}>
                <label htmlFor="ESTU_HORASSEMANATRABAJA" className="form-label" style={styles.label}>Horas semanales trabaja</label>
                <select
                  id="ESTU_HORASSEMANATRABAJA"
                  name="ESTU_HORASSEMANATRABAJA"
                  className="form-select"
                  style={styles.select}
                  value={formData.ESTU_HORASSEMANATRABAJA}
                  onChange={handleChange}
                >
                  <option value="0">0</option>
                  <option value="Menos de 10 horas">Menos de 10 horas</option>
                  <option value="Entre 11 y 20 horas">Entre 11 y 20 horas</option>
                  <option value="Entre 21 y 30 horas">Entre 21 y 30 horas</option>
                  <option value="Más de 30 horas">Más de 30 horas</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4" style={styles.inputGroup}>
                <label htmlFor="ESTU_EXTERIOR" className="form-label" style={styles.label}>Estudió en el exterior</label>
                <select
                  id="ESTU_EXTERIOR"
                  name="ESTU_EXTERIOR"
                  className="form-select"
                  style={styles.select}
                  value={formData.ESTU_EXTERIOR}
                  onChange={handleChange}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>

              <div className="col-md-4" style={styles.inputGroup}>
                <label htmlFor="ESTU_METODO_PRGM" className="form-label" style={styles.label}>Método del programa</label>
                <select
                  id="ESTU_METODO_PRGM"
                  name="ESTU_METODO_PRGM"
                  className="form-select"
                  style={styles.select}
                  value={formData.ESTU_METODO_PRGM}
                  onChange={handleChange}
                >
                  <option value="DISTANCIA">Distancia</option>
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="DISTANCIA VITUAL">Distancia virtual</option>
                </select>
              </div>

              <div className="col-md-4" style={styles.inputGroup}>
                <label htmlFor="ESTU_COMOCAPACITOEXAMENSB11" className="form-label" style={styles.label}>
                  ¿Cómo se capacitó para el examen Saber 11?
                </label>
                <select
                  id="ESTU_COMOCAPACITOEXAMENSB11"
                  name="ESTU_COMOCAPACITOEXAMENSB11"
                  className="form-select"
                  style={styles.select}
                  value={formData.ESTU_COMOCAPACITOEXAMENSB11}
                  onChange={handleChange}
                  required
                >
                  <option value="Tomó un curso de preparación">Tomó un curso de preparación</option>
                  <option value="Repasó por cuenta propia">Repasó por cuenta propia</option>
                  <option value="No realizó ninguna prueba de preparación">
                    No realizó ninguna prueba de preparación
                  </option>
                </select>
              </div>
            </div>

            {/* PAGO MATRÍCULA */}
            <h5 style={styles.sectionTitle}>Pago de Matrícula</h5>
            <div className="row">
              <div className="col-md-3" style={styles.inputGroup}>
                <label htmlFor="ESTU_PAGOMATRICULACREDITO" className="form-label" style={styles.label}>Crédito</label>
                <select
                  id="ESTU_PAGOMATRICULACREDITO"
                  name="ESTU_PAGOMATRICULACREDITO"
                  className="form-select"
                  style={styles.select}
                  value={formData.ESTU_PAGOMATRICULACREDITO}
                  onChange={handleChange}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>

              <div className="col-md-3" style={styles.inputGroup}>
                <label htmlFor="ESTU_PAGOMATRICULAPROPIO" className="form-label" style={styles.label}>Propio</label>
                <select
                  id="ESTU_PAGOMATRICULAPROPIO"
                  name="ESTU_PAGOMATRICULAPROPIO"
                  className="form-select"
                  style={styles.select}
                  value={formData.ESTU_PAGOMATRICULAPROPIO}
                  onChange={handleChange}
                >
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="col-md-3" style={styles.inputGroup}>
                <label htmlFor="ESTU_PAGOMATRICULAPADRES" className="form-label" style={styles.label}>Padres</label>
                <select
                  id="ESTU_PAGOMATRICULAPADRES"
                  name="ESTU_PAGOMATRICULAPADRES"
                  className="form-select"
                  style={styles.select}
                  value={formData.ESTU_PAGOMATRICULAPADRES}
                  onChange={handleChange}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>

              <div className="col-md-3" style={styles.inputGroup}>
                <label htmlFor="ESTU_PAGOMATRICULABECA" className="form-label" style={styles.label}>Beca</label>
                <select
                  id="ESTU_PAGOMATRICULABECA"
                  name="ESTU_PAGOMATRICULABECA"
                  className="form-select"
                  style={styles.select}
                  value={formData.ESTU_PAGOMATRICULABECA}
                  onChange={handleChange}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>
            </div>

            {/* INSTITUCIÓN */}
            <h5 style={styles.sectionTitle}>Información de la Institución</h5>
            <div className="row">
              <div className="col-md-6" style={styles.inputGroup}>
                <label htmlFor="INST_ORIGEN" className="form-label" style={styles.label}>Origen de la institución</label>
                <select
                  id="INST_ORIGEN"
                  name="INST_ORIGEN"
                  className="form-select"
                  style={styles.select}
                  value={formData.INST_ORIGEN}
                  onChange={handleChange}
                >
                  <option value="NO OFICIAL - CORPORACIÓN">No oficial – Corporación</option>
                  <option value="NO OFICIAL - FUNDACIÓN">No oficial – Fundación</option>
                  <option value="OFICIAL DEPARTAMENTAL">Oficial departamental</option>
                  <option value="OFICIAL MUNICIPAL">Oficial municipal</option>
                  <option value="OFICIAL NACIONAL">Oficial nacional</option>
                  <option value="REGIMEN ESPECIAL">Régimen especial</option>
                </select>
              </div>

              <div className="col-md-6" style={styles.inputGroup}>
                <label htmlFor="INST_CARACTER_ACADEMICO" className="form-label" style={styles.label}>
                  Carácter académico de la institución
                </label>
                <select
                  id="INST_CARACTER_ACADEMICO"
                  name="INST_CARACTER_ACADEMICO"
                  className="form-select"
                  style={styles.select}
                  value={formData.INST_CARACTER_ACADEMICO}
                  onChange={handleChange}
                >
                  <option value="INSTITUCIÓN TECNOLÓGICA">Institución tecnológica</option>
                  <option value="UNIVERSIDAD">Universidad</option>
                  <option value="INSTITUCIÓN UNIVERSITARIA">Institución universitaria</option>
                  <option value="TÉCNICA PROFESIONAL">Técnica profesional</option>
                  <option value="INSTITUCIÓN DE EDUCACIÓN SUPERIOR">Institución de educación superior</option>
                  <option value="INSTITUCION DE EDUCACION MEDIA">Institución de educación media</option>
                  <option value="ESCUELA NORMAL SUPERIOR">Escuela Normal Superior</option>
                </select>
              </div>
            </div>

            {/* FAMILIA */}
            <h5 style={styles.sectionTitle}>Condiciones del hogar</h5>
            <div className="row">
              <div className="col-md-3" style={styles.inputGroup}>
                <label htmlFor="FAMI_TIENEAUTOMOVIL" className="form-label" style={styles.label}>Automóvil</label>
                <select
                  id="FAMI_TIENEAUTOMOVIL"
                  name="FAMI_TIENEAUTOMOVIL"
                  className="form-select"
                  style={styles.select}
                  value={formData.FAMI_TIENEAUTOMOVIL}
                  onChange={handleChange}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>

              <div className="col-md-3" style={styles.inputGroup}>
                <label htmlFor="FAMI_TIENECOMPUTADOR" className="form-label" style={styles.label}>Computador</label>
                <select
                  id="FAMI_TIENECOMPUTADOR"
                  name="FAMI_TIENECOMPUTADOR"
                  className="form-select"
                  style={styles.select}
                  value={formData.FAMI_TIENECOMPUTADOR}
                  onChange={handleChange}
                >
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="col-md-3" style={styles.inputGroup}>
                <label htmlFor="FAMI_TIENEHORNOMICROOGAS" className="form-label" style={styles.label}>Horno microondas</label>
                <select
                  id="FAMI_TIENEHORNOMICROOGAS"
                  name="FAMI_TIENEHORNOMICROOGAS"
                  className="form-select"
                  style={styles.select}
                  value={formData.FAMI_TIENEHORNOMICROOGAS}
                  onChange={handleChange}
                >
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="col-md-3" style={styles.inputGroup}>
                <label htmlFor="FAMI_TIENEMOTOCICLETA" className="form-label" style={styles.label}>Motocicleta</label>
                <select
                  id="FAMI_TIENEMOTOCICLETA"
                  name="FAMI_TIENEMOTOCICLETA"
                  className="form-select"
                  style={styles.select}
                  value={formData.FAMI_TIENEMOTOCICLETA}
                  onChange={handleChange}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-3" style={styles.inputGroup}>
                <label htmlFor="FAMI_TIENESERVICIOTV" className="form-label" style={styles.label}>TV</label>
                <select
                  id="FAMI_TIENESERVICIOTV"
                  name="FAMI_TIENESERVICIOTV"
                  className="form-select"
                  style={styles.select}
                  value={formData.FAMI_TIENESERVICIOTV}
                  onChange={handleChange}
                >
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="col-md-3" style={styles.inputGroup}>
                <label htmlFor="FAMI_TIENEINTERNET" className="form-label" style={styles.label}>Internet</label>
                <select
                  id="FAMI_TIENEINTERNET"
                  name="FAMI_TIENEINTERNET"
                  className="form-select"
                  style={styles.select}
                  value={formData.FAMI_TIENEINTERNET}
                  onChange={handleChange}
                >
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="col-md-3" style={styles.inputGroup}>
                <label htmlFor="FAMI_TIENELAVADORA" className="form-label" style={styles.label}>Lavadora</label>
                <select
                  id="FAMI_TIENELAVADORA"
                  name="FAMI_TIENELAVADORA"
                  className="form-select"
                  style={styles.select}
                  value={formData.FAMI_TIENELAVADORA}
                  onChange={handleChange}
                >
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="col-md-3" style={styles.inputGroup}>
                <label htmlFor="FAMI_ESTRATOVIVIENDA" className="form-label" style={styles.label}>Estrato de la vivienda</label>
                <select
                  id="FAMI_ESTRATOVIVIENDA"
                  name="FAMI_ESTRATOVIVIENDA"
                  className="form-select"
                  style={styles.select}
                  value={formData.FAMI_ESTRATOVIVIENDA}
                  onChange={handleChange}
                >
                  <option value="Sin Estrato">Sin estrato</option>
                  <option value="Estrato 0">Estrato 0</option>
                  <option value="Estrato 1">Estrato 1</option>
                  <option value="Estrato 2">Estrato 2</option>
                  <option value="Estrato 3">Estrato 3</option>
                  <option value="Estrato 4">Estrato 4</option>
                  <option value="Estrato 5">Estrato 5</option>
                  <option value="Estrato 6">Estrato 6</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6" style={styles.inputGroup}>
                <label htmlFor="FAMI_EDUCACIONPADRE" className="form-label" style={styles.label}>Educación del padre</label>
                <select
                  id="FAMI_EDUCACIONPADRE"
                  name="FAMI_EDUCACIONPADRE"
                  className="form-select"
                  style={styles.select}
                  value={formData.FAMI_EDUCACIONPADRE}
                  onChange={handleChange}
                >
                  <option value="No sabe">No sabe</option>
                  <option value="No Aplica">No aplica</option>
                  <option value="Ninguno">Ninguno</option>
                  <option value="Primaria incompleta">Primaria incompleta</option>
                  <option value="Primaria completa">Primaria completa</option>
                  <option value="Secundaria (Bachillerato) incompleta">Secundaria (Bachillerato) incompleta</option>
                  <option value="Secundaria (Bachilleratoato) completa">Secundaria (Bachillerato) completa</option>
                  <option value="Técnica o tecnológica incompleta">Técnica o tecnológica incompleta</option>
                  <option value="Técnica o tecnológica completa">Técnica o tecnológica completa</option>
                  <option value="Educación profesional incompleta">Educación profesional incompleta</option>
                  <option value="Educación profesional completa">Educación profesional completa</option>
                  <option value="Postgrado">Postgrado</option>
                </select>
              </div>

              <div className="col-md-6" style={styles.inputGroup}>
                <label htmlFor="FAMI_EDUCACIONMADRE" className="form-label" style={styles.label}>Educación de la madre</label>
                <select
                  id="FAMI_EDUCACIONMADRE"
                  name="FAMI_EDUCACIONMADRE"
                  className="form-select"
                  style={styles.select}
                  value={formData.FAMI_EDUCACIONMADRE}
                  onChange={handleChange}
                >
                  <option value="No sabe">No sabe</option>
                  <option value="No Aplica">No aplica</option>
                  <option value="Ninguno">Ninguno</option>
                  <option value="Primaria incompleta">Primaria incompleta</option>
                  <option value="Primaria completa">Primaria completa</option>
                  <option value="Secundaria (Bachillerato) incompleta">Secundaria (Bachillerato) incompleta</option>
                  <option value="Secundaria (Bachillerato) completa">Secundaria (Bachillerato) completa</option>
                  <option value="Técnica o tecnológica incompleta">Técnica o tecnológica incompleta</option>
                  <option value="Técnica o tecnológica completa">Técnica o tecnológica completa</option>
                  <option value="Educación profesional incompleta">Educación profesional incompleta</option>
                  <option value="Educación profesional completa">Educación profesional completa</option>
                  <option value="Postgrado">Postgrado</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6" style={styles.inputGroup}>
                <label htmlFor="ESTU_VALORMATRICULAUNIVERSIDAD" className="form-label" style={styles.label}>
                  Valor de la matrícula universitaria
                </label>
                <select
                  id="ESTU_VALORMATRICULAUNIVERSIDAD"
                  name="ESTU_VALORMATRICULAUNIVERSIDAD"
                  className="form-select"
                  style={styles.select}
                  value={formData.ESTU_VALORMATRICULAUNIVERSIDAD}
                  onChange={handleChange}
                >
                  <option value="No pagó matrícula">No pagó matrícula</option>
                  <option value="Menos de 500 mil">Menos de 500 mil</option>
                  <option value="Entre 500 mil y menos de 1 millón">Entre 500 mil y menos de 1 millón</option>
                  <option value="Entre 1 millón y menos de 2.5 millones">Entre 1 millón y menos de 2.5 millones</option>
                  <option value="Entre 2.5 millones y menos de 4 millones">Entre 2.5 millones y menos de 4 millones</option>
                  <option value="Entre 4 millones y menos de 5.5 millones">Entre 4 millones y menos de 5.5 millones</option>
                  <option value="Entre 5.5 millones y menos de 7 millones">Entre 5.5 millones y menos de 7 millones</option>
                  <option value="Más de 7 millones">Más de 7 millones</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={styles.button}
              disabled={loading}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
              }}
            >
              {loading ? '⏳ Procesando...' : '🎯 Predecir'}
            </button>
          </form>

          {resultado && (
            <div style={styles.resultCard}>
              <h5 style={styles.resultTitle}>✅ Resultado de la predicción</h5>
              <p style={styles.resultText}><strong>Resultado:</strong> {resultado.label}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioSaberPro;
