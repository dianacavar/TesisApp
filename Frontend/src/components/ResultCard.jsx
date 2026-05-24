const RESULT_CONFIG = {
  1: {
    cls: 'bajo',
    emoji: '💪',
    badge: 'Hay oportunidad de mejorar',
    message:
      'El modelo predice un rendimiento bajo. Considera reforzar hábitos de estudio, asistir a tutorías y aprovechar los recursos académicos disponibles.',
  },
  2: {
    cls: 'medio',
    emoji: '📈',
    badge: 'Buen camino, sigue adelante',
    message:
      'El modelo predice un rendimiento medio. Estás en una posición sólida; con un poco más de dedicación puedes alcanzar un desempeño sobresaliente.',
  },
  3: {
    cls: 'alto',
    emoji: '🏆',
    badge: 'Excelente proyección',
    message:
      'El modelo predice un rendimiento alto. ¡Felicitaciones! Tus condiciones académicas y socioeconómicas favorecen un excelente desempeño en la prueba.',
  },
};

function ResultCard({ result, onReset }) {
  if (!result) return null;

  const cfg = RESULT_CONFIG[result.prediction] || RESULT_CONFIG[2];

  return (
    <div
      className="result-overlay"
      onClick={onReset}
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-title"
    >
      <div
        className={`result-card ${cfg.cls}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="result-emoji" aria-hidden="true">
          {cfg.emoji}
        </div>
        <div className="result-label">Resultado de la predicción</div>
        <h3 id="result-title" className={`result-title ${cfg.cls}`}>
          {result.label}
        </h3>
        <div className={`result-badge ${cfg.cls}`}>{cfg.badge}</div>
        <p className="result-message">{cfg.message}</p>
        <div className="result-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onReset}
          >
            Hacer otra predicción
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
