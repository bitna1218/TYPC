// components/common/ValidationAlert.tsx
import React from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface ValidationAlertProps {
  validationResult: ValidationResult;
  className?: string;
}

export const ValidationAlert: React.FC<ValidationAlertProps> = ({
  validationResult,
  className = ""
}) => {
  if (validationResult.errors.length === 0 && validationResult.warnings.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 오류 표시 */}
      {validationResult.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2 flex-shrink-0" />
            <h4 className="text-sm font-medium text-red-800">오류</h4>
          </div>
          <ul className="mt-2 text-sm text-red-700 space-y-1">
            {validationResult.errors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 경고 표시 */}
      {validationResult.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-center">
            <FaInfoCircle className="text-yellow-500 mr-2 flex-shrink-0" />
            <h4 className="text-sm font-medium text-yellow-800">경고</h4>
          </div>
          <ul className="mt-2 text-sm text-yellow-700 space-y-1">
            {validationResult.warnings.map((warning, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-1 h-1 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 성공 표시 (오류와 경고가 없을 때) */}
      {validationResult.isValid && validationResult.errors.length === 0 && validationResult.warnings.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-2" />
            <span className="text-sm font-medium text-green-800">검증 완료</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationAlert;