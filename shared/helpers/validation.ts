/**
 * Validation message utility functions
 * Handles dynamic parameter interpolation for validation messages
 */

/**
 * Generic validation message handler with dynamic parameters
 * @param t - Translation function from react-i18next
 * @param validationParams - Object mapping validation keys to their parameters
 * @param message - The validation message key
 * @returns Translated message with interpolated parameters
 */
export const getValidationMessage = (
  t: any,
  validationParams: Record<string, any>,
  message: string | undefined
): string => {
  if (!message) return "";

  const params = validationParams[message];
  return params ? t(message, params) : t(message);
};
