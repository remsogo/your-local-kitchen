export const getSessionRandomIndex = (
  storage: Pick<Storage, "getItem" | "setItem">,
  key: string,
  length: number,
  random = Math.random,
): number => {
  if (length <= 0) return 0;
  const existing = storage.getItem(key);
  if (existing !== null) {
    const parsed = Number(existing);
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed < length) {
      return parsed;
    }
  }

  const next = Math.floor(random() * length);
  storage.setItem(key, String(next));
  return next;
};
