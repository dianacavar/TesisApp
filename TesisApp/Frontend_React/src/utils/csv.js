/**
 * Convierte un array de objetos en una cadena CSV.
 * Los headers se infieren del primer elemento (más cualquier llave extra
 * que aparezca en los siguientes).
 */
export function toCSV(rows) {
  if (!rows || !rows.length) return '';

  const headerSet = new Set();
  for (const row of rows) {
    Object.keys(row).forEach((k) => headerSet.add(k));
  }
  const headers = Array.from(headerSet);

  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\r\n');
}

/**
 * Dispara la descarga de un CSV en el navegador.
 * Incluye BOM UTF-8 para que Excel lo abra correctamente con acentos.
 */
export function downloadCSV(filename, csv) {
  const blob = new Blob(['\ufeff' + csv], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
