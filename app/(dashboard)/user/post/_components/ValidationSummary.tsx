// components/ValidationSummary.tsx
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ValidationErrors } from "../_types/post";

interface ValidationSummaryProps {
  errors: ValidationErrors;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  errors,
}) => {
  if (Object.keys(errors).length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="font-semibold mb-2">
          Vui lòng kiểm tra lại các trường sau:
        </div>
        <ul className="list-disc list-inside space-y-1">
          {errors.title && <li>{errors.title}</li>}
          {errors.featured_image && <li>{errors.featured_image}</li>}
          {errors.gallery && <li>{errors.gallery}</li>}
          {errors.content && <li>{errors.content}</li>}
        </ul>
      </AlertDescription>
    </Alert>
  );
};
