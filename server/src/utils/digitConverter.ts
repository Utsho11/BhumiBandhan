export const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const EN_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Converts English numerals (0-9) to Bengali numerals (০-৯).
 */
export function toBengaliNumerals(str: string = ""): string {
  if (!str) return "";
  return str.replace(/[0-9]/g, (ch) => BN_DIGITS[parseInt(ch, 10)]);
}

/**
 * Converts Bengali numerals (০-৯) to English numerals (0-9).
 */
export function toEnglishNumerals(str: string = ""): string {
  if (!str) return "";
  return str.replace(/[০-৯]/g, (ch) => {
    const idx = BN_DIGITS.indexOf(ch);
    return idx !== -1 ? EN_DIGITS[idx] : ch;
  });
}

/**
 * Generates all search variants for a query, covering English, Bengali, and prefix-stripped variants.
 */
export function getSearchVariants(input: string = ""): string[] {
  if (!input) return [];
  const raw = input.trim();
  const cleaned = raw.replace(/^(দাগ\s*নং|দাগ|dag\s*no\.?|dag\s*#?|#)\s*/i, "").trim();

  const variants = new Set<string>();
  if (raw) {
    variants.add(raw);
    variants.add(toEnglishNumerals(raw));
    variants.add(toBengaliNumerals(raw));
  }
  if (cleaned) {
    variants.add(cleaned);
    variants.add(toEnglishNumerals(cleaned));
    variants.add(toBengaliNumerals(cleaned));
  }
  return Array.from(variants).filter((v) => v.length > 0);
}

/**
 * Robust equality check between two dag or parcel numbers across Bengali and English scripts.
 */
export function isDagMatch(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  const aClean = a.trim();
  const bClean = b.trim();
  if (aClean.toLowerCase() === bClean.toLowerCase()) return true;

  const aVariants = getSearchVariants(aClean);
  const bVariants = getSearchVariants(bClean);
  return aVariants.some((av) => bVariants.includes(av));
}
