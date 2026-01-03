
/**
 * NOBEL SPIRIT DATA TRANSMISSION SERVICE
 * Handles RFC 4180 compliant CSV generation for global dossier exports.
 */

export const downloadCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    console.warn("Dossier transmission aborted: No data detected.");
    return;
  }

  // Flatten nested objects (like 'analysis' or 'contactMethods') for flat CSV structure
  const flattenObject = (obj: any, prefix = ''): any => {
    return Object.keys(obj).reduce((acc: any, k: any) => {
      const pre = prefix.length ? prefix + '_' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const flattenedData = data.map(item => flattenObject(item));
  const headers = Object.keys(flattenedData[0]);

  const csvContent = [
    headers.join(','),
    ...flattenedData.map(row => 
      headers.map(header => {
        const cell = row[header] === null || row[header] === undefined ? '' : row[header];
        const cellStr = String(cell);
        // Escape quotes and wrap in quotes if contains comma or quote
        return `"${cellStr.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
