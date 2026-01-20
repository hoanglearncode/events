/**
 * Format number with thousand separators
 * @param num - The number to format
 * @param locale - The locale to use for formatting (default: 'vi-VN')
 * @returns Formatted number string (e.g., 300000 -> "300.000")
 */
export function formatNumber(
  num: number | string,
  locale: string = "vi-VN"
): string {
  const number = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(number)) {
    return "0";
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

/**
 * Format currency with thousand separators
 * @param amount - The amount to format
 * @param currency - The currency symbol
 * @param locale - The locale to use for formatting (default: 'vi-VN')
 * @returns Formatted currency string (e.g., 300000 -> "300.000 VND")
 */
export function formatCurrency(
  amount: number | string,
  currency: string = "",
  locale: string = "vi-VN"
): string {
  const formattedNumber = formatNumber(amount, locale);
  return currency ? `${currency}${formattedNumber}` : formattedNumber;
}
