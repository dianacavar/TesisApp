import { useMemo, useState } from 'react';
import {
  API_URL,
  CLASS_LABELS,
  FIELD_ORDER,
} from '../data/formOptions';
import { generateRandomInputs } from '../utils/random';
import { downloadCSV, toCSV } from '../utils/csv';

const MIN_TESTS = 1;
const MAX_TESTS = 5000;
const BATCH_SIZE = 100;

function AutomatizacionPage() {
  const [n, setN] = useState(50);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(null);

  const distribution = useMemo(() => {
    if (!results.length) return null;
    const counts = { 1: 0, 2: 0, 3: 0 };
    let avgProb = 0;
    let errors = 0;
    for (const { prediction } of results) {
      if (!prediction || prediction.error) {
        errors += 1;
        continue;
      }
      counts[prediction.prediction] = (counts[prediction.prediction] || 0) + 1;
      avgProb += prediction.probability || 0;
    }
    const valid = results.length - errors;
    return {
      counts,
      errors,
      total: results.length,
      avgProb: valid ? avgProb / valid : 0,
    };
  }, [results]);

  const runBatch = async (items) => {
    const response = await fetch(`${API_URL}/predict_batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        errorBody.error || `Error del servidor (${response.status})`
      );
    }

    const data = await response.json();
    return data.results || [];
  };

  const handleRun = async () => {
    const total = Math.max(MIN_TESTS, Math.min(MAX_TESTS, Number(n) || 0));
    setN(total);
    setRunning(true);
    setError(null);
    setResults([]);
    setProgress({ done: 0, total });
    setElapsedMs(null);

    const startedAt = performance.now();

    try {
      const inputs = generateRandomInputs(total);
      const collected = [];

      for (let i = 0; i < inputs.length; i += BATCH_SIZE) {
        const chunk = inputs.slice(i, i + BATCH_SIZE);
        const batchResults = await runBatch(chunk);

        for (let j = 0; j < chunk.length; j++) {
          const inputRow = chunk[j];
          const prediction = batchResults[j] || { error: 'Sin respuesta' };
          collected.push({ input: inputRow, prediction });
        }

        setProgress({ done: collected.length, total });
      }

      setResults(collected);
      setElapsedMs(Math.round(performance.now() - startedAt));
    } catch (err) {
      console.error(err);
      setError(
        err.message === 'Failed to fetch'
          ? `No se pudo conectar con el servidor (${API_URL}). Asegúrate de que el backend esté corriendo.`
          : err.message
      );
    } finally {
      setRunning(false);
    }
  };

  const handleDownload = () => {
    if (!results.length) return;

    const rows = results.map(({ input, prediction }, idx) => {
      const base = { test: idx + 1 };

      for (const field of FIELD_ORDER) {
        base[field] = input[field] ?? '';
      }

      if (prediction.error) {
        base.prediction = '';
        base.label = '';
        base.probability = '';
        base.prob_bajo = '';
        base.prob_medio = '';
        base.prob_alto = '';
        base.error = prediction.error;
      } else {
        base.prediction = prediction.prediction;
        base.label = prediction.label;
        base.probability = Number(prediction.probability ?? 0).toFixed(4);
        base.prob_bajo = Number(
          prediction.probabilities?.[1] ?? 0
        ).toFixed(4);
        base.prob_medio = Number(
          prediction.probabilities?.[2] ?? 0
        ).toFixed(4);
        base.prob_alto = Number(
          prediction.probabilities?.[3] ?? 0
        ).toFixed(4);
        base.error = '';
      }
      return base;
    });

    const csv = toCSV(rows);
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadCSV(`pruebas_saberpro_${rows.length}_${stamp}.csv`, csv);
  };

  const progressPct =
    progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0;

  return (
    <>
      <header className="page-header">
        <div className="page-header-badge">🧪 Pruebas masivas</div>
        <h1>Predicciones</h1>
        <p>
          Genera N entradas aleatorias y obtén su predicción + probabilidad
          desde el modelo. Al final puedes descargar todos los resultados como
          un CSV listo para análisis.
        </p>
      </header>

      <div className="app-card">
        <section className="content-section">
          <h2>⚙️ Configuración</h2>
          <div className="auto-config">
            <div className="field" style={{ maxWidth: 280 }}>
              <label htmlFor="n-tests" className="field-label">
                <span className="field-icon">🔢</span>
                <span>Número de pruebas</span>
              </label>
              <input
                id="n-tests"
                type="number"
                min={MIN_TESTS}
                max={MAX_TESTS}
                value={n}
                onChange={(e) => setN(e.target.value)}
                disabled={running}
                className="field-input"
              />
              <span className="field-hint">
                Entre {MIN_TESTS} y {MAX_TESTS.toLocaleString()} pruebas
              </span>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRun}
              disabled={running || !n || Number(n) < MIN_TESTS}
            >
              {running ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  Ejecutando...
                </>
              ) : (
                <>▶ Iniciar pruebas</>
              )}
            </button>
          </div>

          {running && (
            <div className="auto-progress" aria-live="polite">
              <div className="auto-progress-bar">
                <div
                  className="auto-progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="auto-progress-label">
                {progress.done.toLocaleString()} / {progress.total.toLocaleString()}{' '}
                ({progressPct}%)
              </div>
            </div>
          )}

          {error && (
            <div className="error-banner" role="alert">
              <span className="error-banner-icon" aria-hidden="true">
                ⚠️
              </span>
              <span>{error}</span>
            </div>
          )}
        </section>

        {distribution && !running && (
          <section className="content-section">
            <h2>📊 Resultados</h2>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">{distribution.total}</div>
                <div className="metric-label">Pruebas</div>
                <div className="metric-hint">
                  {elapsedMs != null
                    ? `${(elapsedMs / 1000).toFixed(2)} s`
                    : ''}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{distribution.counts[3] || 0}</div>
                <div className="metric-label">🏆 Alto</div>
                <div className="metric-hint">
                  {distribution.total
                    ? `${(((distribution.counts[3] || 0) / distribution.total) * 100).toFixed(1)}%`
                    : ''}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{distribution.counts[2] || 0}</div>
                <div className="metric-label">📈 Medio</div>
                <div className="metric-hint">
                  {distribution.total
                    ? `${(((distribution.counts[2] || 0) / distribution.total) * 100).toFixed(1)}%`
                    : ''}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{distribution.counts[1] || 0}</div>
                <div className="metric-label">💪 Bajo</div>
                <div className="metric-hint">
                  {distribution.total
                    ? `${(((distribution.counts[1] || 0) / distribution.total) * 100).toFixed(1)}%`
                    : ''}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-value">
                  {(distribution.avgProb * 100).toFixed(1)}%
                </div>
                <div className="metric-label">Probabilidad media</div>
                <div className="metric-hint">de la clase predicha</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{distribution.errors}</div>
                <div className="metric-label">Errores</div>
                <div className="metric-hint">filas sin predicción</div>
              </div>
            </div>

            <div className="auto-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDownload}
              >
                ⬇ Descargar CSV ({results.length} filas)
              </button>
            </div>

            <h3 className="auto-preview-title">
              Vista previa (primeras 10 filas)
            </h3>
            <div className="auto-table-wrap">
              <table className="auto-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Predicción</th>
                    <th>Probabilidad</th>
                    <th>Género</th>
                    <th>Estrato</th>
                    <th>Educ. madre</th>
                    <th>Matrícula</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 10).map(({ input, prediction }, idx) => {
                    const cls =
                      prediction.prediction === 3
                        ? 'alto'
                        : prediction.prediction === 2
                          ? 'medio'
                          : 'bajo';
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          {prediction.error ? (
                            <span className="badge bajo">Error</span>
                          ) : (
                            <span className={`badge ${cls}`}>
                              {CLASS_LABELS[prediction.prediction]}
                            </span>
                          )}
                        </td>
                        <td>
                          {prediction.error
                            ? '—'
                            : `${(prediction.probability * 100).toFixed(1)}%`}
                        </td>
                        <td>{input.ESTU_GENERO}</td>
                        <td>{input.FAMI_ESTRATOVIVIENDA}</td>
                        <td title={input.FAMI_EDUCACIONMADRE}>
                          {input.FAMI_EDUCACIONMADRE}
                        </td>
                        <td title={input.ESTU_VALORMATRICULAUNIVERSIDAD}>
                          {input.ESTU_VALORMATRICULAUNIVERSIDAD}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default AutomatizacionPage;
