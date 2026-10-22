export interface ParsedQrData {
  fn: string;
  fd: string;
  fp: string;
  purchase_date: string;
  amount: string;
}

/**
 * Разбирает сырую строку из QR-кода чека ФНС.
 * Вытаскивает параметры ФН, ФД, ФП, сумму и форматирует дату под HTML-инпут datetime-local.
 *
 * rawString — сырая строка с QR-кода (например, "t=20260928T103500&s=150.00&fn=...")
 * return объект с распарсенными данными или null, если разбор не удался
 */
export const parseQrString = (
  rawString: string | null | undefined,
): ParsedQrData | null => {
  if (!rawString) return null;

  const params = new URLSearchParams(rawString);
  const amount = params.get("s") || "";
  const rawDate = params.get("t") || ""; // Формат ФНС: YYYYMMDDTHHMMSS (например, 20260928T103500)
  const fn = params.get("fn") || "";
  const fd = params.get("i") || ""; // В строке QR параметр ФД обычно записан как "i"
  const fp = params.get("fp") || "";

  let formattedDate = "";
  if (rawDate && rawDate.length >= 13) {
    // Перевод системной строки "20260928T103500" в формат для инпута типа "2026-09-28T10:35"
    const year = rawDate.substring(0, 4);
    const month = rawDate.substring(4, 6);
    const day = rawDate.substring(6, 8);
    const hour = rawDate.substring(9, 11);
    const minute = rawDate.substring(11, 13);
    formattedDate = `${year}-${month}-${day}T${hour}:${minute}`;
  }

  // Если нашли хотя бы один полезный параметр — возвращаем объект
  if (fn || fd || fp || amount || formattedDate) {
    return { fn, fd, fp, purchase_date: formattedDate, amount };
  }

  return null;
};
