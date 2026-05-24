/**
 * Valores válidos para cada variable de entrada del modelo.
 * Este módulo se usa tanto en el formulario manual como en el
 * generador aleatorio de pruebas masivas.
 */

export const API_URL = 'http://127.0.0.1:5000';

// Campos que no se piden por UI pero el backend espera recibir.
// (Vacío por ahora; el modelo activo ya no requiere variables fijas.)
export const FIXED_FIELDS = {};

// Valores posibles por cada campo (valor enviado al backend).
export const FIELD_VALUES = {
  ESTU_GENERO: ['F', 'M'],
  ESTU_HORASSEMANATRABAJA: [
    '0',
    'Menos de 10 horas',
    'Entre 11 y 20 horas',
    'Entre 21 y 30 horas',
    'Más de 30 horas',
  ],
  ESTU_EXTERIOR: ['no', 'si'],
  ESTU_METODO_PRGM: ['PRESENCIAL', 'DISTANCIA', 'DISTANCIA VITUAL'],
  ESTU_COMOCAPACITOEXAMENSB11: [
    'Tomó un curso de preparación',
    'Repasó por cuenta propia',
    'No realizó ninguna prueba de preparación',
  ],
  ESTU_PAGOMATRICULACREDITO: ['no', 'si'],
  ESTU_PAGOMATRICULAPROPIO: ['no', 'si'],
  ESTU_PAGOMATRICULAPADRES: ['no', 'si'],
  ESTU_PAGOMATRICULABECA: ['no', 'si'],
  INST_ORIGEN: [
    'NO OFICIAL - CORPORACIÓN',
    'NO OFICIAL - FUNDACIÓN',
    'OFICIAL DEPARTAMENTAL',
    'OFICIAL MUNICIPAL',
    'OFICIAL NACIONAL',
    'REGIMEN ESPECIAL',
  ],
  INST_CARACTER_ACADEMICO: [
    'UNIVERSIDAD',
    'INSTITUCIÓN UNIVERSITARIA',
    'INSTITUCIÓN TECNOLÓGICA',
    'TÉCNICA PROFESIONAL',
    'INSTITUCIÓN DE EDUCACIÓN SUPERIOR',
    'INSTITUCION DE EDUCACION MEDIA',
    'ESCUELA NORMAL SUPERIOR',
  ],
  FAMI_TIENEAUTOMOVIL: ['no', 'si'],
  FAMI_TIENECOMPUTADOR: ['no', 'si'],
  FAMI_TIENEHORNOMICROOGAS: ['no', 'si'],
  FAMI_TIENEMOTOCICLETA: ['no', 'si'],
  FAMI_TIENESERVICIOTV: ['no', 'si'],
  FAMI_TIENEINTERNET: ['no', 'si'],
  FAMI_TIENELAVADORA: ['no', 'si'],
  FAMI_ESTRATOVIVIENDA: [
    'Sin Estrato',
    'Estrato 0',
    'Estrato 1',
    'Estrato 2',
    'Estrato 3',
    'Estrato 4',
    'Estrato 5',
    'Estrato 6',
  ],
  FAMI_EDUCACIONPADRE: [
    'No sabe',
    'No Aplica',
    'Ninguno',
    'Primaria incompleta',
    'Primaria completa',
    'Secundaria (Bachillerato) incompleta',
    'Secundaria (Bachillerato) completa',
    'Técnica o tecnológica incompleta',
    'Técnica o tecnológica completa',
    'Educación profesional incompleta',
    'Educación profesional completa',
    'Postgrado',
  ],
  FAMI_EDUCACIONMADRE: [
    'No sabe',
    'No Aplica',
    'Ninguno',
    'Primaria incompleta',
    'Primaria completa',
    'Secundaria (Bachillerato) incompleta',
    'Secundaria (Bachillerato) completa',
    'Técnica o tecnológica incompleta',
    'Técnica o tecnológica completa',
    'Educación profesional incompleta',
    'Educación profesional completa',
    'Postgrado',
  ],
  ESTU_VALORMATRICULAUNIVERSIDAD: [
    'No pagó matrícula',
    'Menos de 500 mil',
    'Entre 500 mil y menos de 1 millón',
    'Entre 1 millón y menos de 2.5 millones',
    'Entre 2.5 millones y menos de 4 millones',
    'Entre 4 millones y menos de 5.5 millones',
    'Entre 5.5 millones y menos de 7 millones',
    'Más de 7 millones',
  ],
};

// Orden estable de los campos para columnas del CSV.
export const FIELD_ORDER = [
  'ESTU_GENERO',
  'ESTU_HORASSEMANATRABAJA',
  'ESTU_EXTERIOR',
  'ESTU_METODO_PRGM',
  'ESTU_COMOCAPACITOEXAMENSB11',
  'ESTU_PAGOMATRICULACREDITO',
  'ESTU_PAGOMATRICULAPROPIO',
  'ESTU_PAGOMATRICULAPADRES',
  'ESTU_PAGOMATRICULABECA',
  'INST_ORIGEN',
  'INST_CARACTER_ACADEMICO',
  'FAMI_TIENEAUTOMOVIL',
  'FAMI_TIENECOMPUTADOR',
  'FAMI_TIENEHORNOMICROOGAS',
  'FAMI_TIENEMOTOCICLETA',
  'FAMI_TIENESERVICIOTV',
  'FAMI_TIENEINTERNET',
  'FAMI_TIENELAVADORA',
  'FAMI_ESTRATOVIVIENDA',
  'FAMI_EDUCACIONPADRE',
  'FAMI_EDUCACIONMADRE',
  'ESTU_VALORMATRICULAUNIVERSIDAD',
];

// Etiquetas de las clases que devuelve el modelo.
export const CLASS_LABELS = {
  1: 'Rendimiento bajo',
  2: 'Rendimiento medio',
  3: 'Rendimiento alto',
};
