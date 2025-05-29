export function flattenObject(obj, parentKey = '', result = {}) {
  for (const key in obj) {
    const propKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], propKey, result);
    } else {
      result[propKey] = obj[key];
    }
  }
  return result;
}
