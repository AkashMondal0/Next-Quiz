export const dataParser = (data: any) => {
    return JSON.parse(data, (key, value) => {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
            return new Date(value);
        }
        return value;
    });
};

export function safeSerialize(obj: any) {
  return JSON.stringify(obj, (_, value) => {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "bigint") return Number(value); // or value.toString()
    return value;
  });
}

export function normalize(obj: any): any {
  if (Array.isArray(obj)) return obj.map(normalize);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => {
        if (v instanceof Date) return [k, v.toISOString()];
        if (typeof v === 'bigint') return [k, v.toString()];
        return [k, v];
      }),
    );
  }
  return obj;
}