/**
 * Creates a properly formatted form data object for API requests
 * This helper ensures FormData is properly created with the right structure
 *
 * @param data - The object containing data to include in the form
 * @returns FormData object properly configured for API use
 */
export function createApiFormData(data: Record<string, any>): FormData {
  const formData = new FormData();

  // Using Object.entries instead of for...in to avoid prototype chain properties
  Object.entries(data).forEach(([key, value]) => {
    // Skip null or undefined values
    if (value === null || value === undefined) {
      return;
    }

    // Convert booleans to "0"/"1" strings for better API compatibility
    if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
    }
    // Handle arrays - includes special handling for arrays of files
    else if (Array.isArray(value)) {
      if (value.length === 0) {
        // Append an empty entry to indicate an empty array
        formData.append(`${key}[]`, "");
      } else {
        value.forEach((item) => {
          if (item instanceof File || item instanceof Blob) {
            // Pass files directly without conversion
            formData.append(`${key}[]`, item);
          } else if (item !== null && item !== undefined) {
            // Convert other types to string
            formData.append(`${key}[]`, item.toString());
          }
        });
      }
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (typeof value === "object") {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (Array.isArray(subValue)) {
          // Handle arrays within objects
          subValue.forEach((item, index) => {
            formData.append(`${key}[${subKey}][${index}]`, String(item));
          });
        } else {
          formData.append(`${key}[${subKey}]`, String(subValue));
        }
      });
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}

/**
 * Creates a FormData object from a JavaScript object or record.
 * Handles nested objects, arrays, and File objects.
 *
 * @param obj - The source object to convert to FormData
 * @param options - Configuration options for the conversion
 * @returns FormData object containing all the object's properties
 *
 * @example
 * // Basic usage
 * const data = { name: "John", age: 30 };
 * const formData = createFormDataFromObject(data);
 *
 * // With nested objects (creates flattened keys with square bracket notation)
 * const data = { user: { name: "John", details: { age: 30 } } };
 * const formData = createFormDataFromObject(data);
 * // Results in: user[name]=John&user[details][age]=30
 *
 * // With arrays
 * const data = { tags: ["javascript", "typescript"] };
 * const formData = createFormDataFromObject(data);
 * // Results in: tags[0]=javascript&tags[1]=typescript
 *
 * // With File objects
 * const data = { profile: fileObject, documents: [file1, file2] };
 * const formData = createFormDataFromObject(data);
 */
export function createFormDataFromObject(
  obj: Record<string, any>,
  options: {
    /**
     * Use dots instead of square brackets for nested object keys
     * e.g., 'user.name' instead of 'user[name]'
     */
    useDotNotation?: boolean;
    /**
     * Skip null or undefined values to avoid sending them to the server
     */
    skipNullValues?: boolean;
    /**
     * Custom transformation function for values before adding to FormData
     */
    valueTransform?: (value: any, key: string) => any;
  } = {}
): FormData {
  const {
    useDotNotation = false,
    skipNullValues = false,
    valueTransform,
  } = options;

  const formData = new FormData();
  const valueTransformFn = valueTransform || ((value, _) => value);

  /**
   * Recursively processes object properties and adds them to FormData
   */
  function appendToFormData(data: any, parentKey?: string) {
    if (data === null || data === undefined) {
      if (!skipNullValues && parentKey) {
        formData.append(parentKey, "");
      }
      return;
    }

    // Handle File objects directly
    if (data instanceof File) {
      if (parentKey) {
        formData.append(parentKey, data);
      }
      return;
    }

    // Handle Date objects
    if (data instanceof Date) {
      if (parentKey) {
        formData.append(parentKey, data.toISOString());
      }
      return;
    }

    // If it's a simple value, append it directly
    if (typeof data !== "object") {
      if (parentKey) {
        formData.append(
          parentKey,
          valueTransformFn(data.toString(), parentKey)
        );
        console.log(
          "valueTransform",
          valueTransformFn(data.toString(), parentKey)
        );
      }
      return;
    }

    // Handle Arrays
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const key = parentKey
          ? useDotNotation
            ? `${parentKey}.${index}`
            : `${parentKey}[${index}]`
          : index.toString();

        if (item instanceof File) {
          // For files in array, use the same key for each file
          formData.append(parentKey ? parentKey : "files", item);
        } else if (typeof item === "object" && item !== null) {
          // For objects in array, recurse with the indexed key
          appendToFormData(item, key);
        } else {
          // For primitives in array
          if (item !== null && item !== undefined) {
            formData.append(key, valueTransformFn(item.toString(), key));
          } else if (!skipNullValues) {
            formData.append(key, "");
          }
        }
      });
      return;
    }

    // Handle Objects (not File, not Date, not Array)
    Object.entries(data).forEach(([key, value]) => {
      const newKey = parentKey
        ? useDotNotation
          ? `${parentKey}.${key}`
          : `${parentKey}[${key}]`
        : key;

      appendToFormData(value, newKey);
    });
  }

  appendToFormData(obj);
  return formData;
}
