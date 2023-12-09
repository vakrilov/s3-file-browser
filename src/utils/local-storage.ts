export const getObject = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const setObject = <T>(key: string, value: T): void =>
  localStorage.setItem(key, JSON.stringify(value, null, 2));

export const clearObject = (key: string) => localStorage.removeItem(key);
