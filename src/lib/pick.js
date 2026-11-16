/**
 * pick — read the English value from a { en, as } object.
 *   pick({en:"...", as:"..."}) -> the English string
 *   pick("plain string")       -> the string untouched
 *   pick(["a","b"])            -> the array untouched
 */
export function pick(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value.en ?? value ?? "";
  }
  return value;
}
