import { useCallback } from "react";

/**
 * Interface cho validation errors từ API
 */
export interface ValidationErrors {
  [key: string]: string[];
}

/**
 * Interface cho API error response
 */
export interface ApiErrorResponse {
  _status: number;
  _success: boolean;
  _messages: string | string[] | object | null;
  _data: ValidationErrors | null;
  _extra?: any;
}

/**
 * Hook để xử lý validation errors từ API response
 *
 * @example
 * ```tsx
 * const { extractValidationErrors, getFieldError, hasFieldError } = useValidationErrors();
 *
 * // Trong error handler của mutation
 * const handleError = (error: any) => {
 *   const validationErrors = extractValidationErrors(error);
 *   console.log('Email errors:', getFieldError(validationErrors, 'email'));
 * };
 * ```
 */
export const useValidationErrors = () => {
  /**
   * Extract validation errors từ error object
   */
  const extractValidationErrors = useCallback(
    (error: any): ValidationErrors => {
      // Nếu error có data và đó là validation error (422)
      if (
        error?.status === 422 &&
        error?.data &&
        typeof error.data === "object"
      ) {
        return error.data as ValidationErrors;
      }

      // Nếu error.data có _data field (response format)
      if (error?.data?._data && typeof error.data._data === "object") {
        return error.data._data as ValidationErrors;
      }

      // Nếu error có response.data._data
      if (
        error?.response?.data?._data &&
        typeof error.response.data._data === "object"
      ) {
        return error.response.data._data as ValidationErrors;
      }

      return {};
    },
    []
  );

  /**
   * Lấy error message cho một field cụ thể
   */
  const getFieldError = useCallback(
    (validationErrors: ValidationErrors, fieldName: string): string | null => {
      const fieldErrors = validationErrors[fieldName];
      if (fieldErrors && fieldErrors.length > 0) {
        return fieldErrors[0]; // Trả về error đầu tiên
      }
      return null;
    },
    []
  );

  /**
   * Lấy tất cả error messages cho một field
   */
  const getFieldErrors = useCallback(
    (validationErrors: ValidationErrors, fieldName: string): string[] => {
      return validationErrors[fieldName] || [];
    },
    []
  );

  /**
   * Kiểm tra field có error hay không
   */
  const hasFieldError = useCallback(
    (validationErrors: ValidationErrors, fieldName: string): boolean => {
      return !!(
        validationErrors[fieldName] && validationErrors[fieldName].length > 0
      );
    },
    []
  );

  /**
   * Lấy tất cả validation errors dưới dạng flat array
   */
  const getAllErrors = useCallback(
    (validationErrors: ValidationErrors): string[] => {
      return Object.values(validationErrors).flat();
    },
    []
  );

  /**
   * Lấy error message đầu tiên từ tất cả fields
   */
  const getFirstError = useCallback(
    (validationErrors: ValidationErrors): string | null => {
      const allErrors = getAllErrors(validationErrors);
      return allErrors.length > 0 ? allErrors[0] : null;
    },
    [getAllErrors]
  );

  /**
   * Format validation errors thành object dễ sử dụng với form
   */
  const formatForForm = useCallback(
    (validationErrors: ValidationErrors): Record<string, string> => {
      const formErrors: Record<string, string> = {};

      Object.entries(validationErrors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          formErrors[field] = errors[0]; // Lấy error đầu tiên cho mỗi field
        }
      });

      return formErrors;
    },
    []
  );

  /**
   * Kiểm tra có validation errors hay không
   */
  const hasValidationErrors = useCallback(
    (validationErrors: ValidationErrors): boolean => {
      return Object.keys(validationErrors).length > 0;
    },
    []
  );

  /**
   * Extract error message từ bất kỳ error object nào
   */
  const extractErrorMessage = useCallback(
    (error: any): string => {
      // Nếu error đã có message
      if (error?.message) {
        return error.message;
      }

      // Nếu là validation error, lấy first error
      const validationErrors = extractValidationErrors(error);
      if (hasValidationErrors(validationErrors)) {
        return getFirstError(validationErrors) || "Validation error";
      }

      // Fallback messages
      if (error?.response?.data?._messages) {
        const messages = error.response.data._messages;
        if (typeof messages === "string") {
          return messages;
        }
        if (Array.isArray(messages)) {
          return messages.join(", ");
        }
      }

      return "Có lỗi xảy ra";
    },
    [extractValidationErrors, hasValidationErrors, getFirstError]
  );

  return {
    extractValidationErrors,
    getFieldError,
    getFieldErrors,
    hasFieldError,
    getAllErrors,
    getFirstError,
    formatForForm,
    hasValidationErrors,
    extractErrorMessage,
  };
};

/**
 * Type guard để kiểm tra error có phải validation error không
 */
export const isValidationError = (error: any): error is ApiErrorResponse => {
  return error?.status === 422 || error?.response?.status === 422;
};

/**
 * Helper function để extract validation errors mà không cần hook
 */
export const extractValidationErrors = (error: any): ValidationErrors => {
  if (error?.status === 422 && error?.data && typeof error.data === "object") {
    return error.data as ValidationErrors;
  }

  if (error?.data?._data && typeof error.data._data === "object") {
    return error.data._data as ValidationErrors;
  }

  if (
    error?.response?.data?._data &&
    typeof error.response.data._data === "object"
  ) {
    return error.response.data._data as ValidationErrors;
  }

  return {};
};
