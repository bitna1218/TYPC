import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { yearStatusData } from '@/app/demo/data/yearData';

// Define the year data interface
interface YearData {
  year: number;
  status: 'completed' | 'in-progress' | 'not-started';
  lastModified?: string;
}

// Define the props for the modal component
interface LoadDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadData: (year: number) => void;
  currentYear?: string;
}

export default function LoadDataModal({
  isOpen,
  onClose,
  onLoadData,
  currentYear,
}: LoadDataModalProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Convert yearStatusData to YearData array
  const years: YearData[] = Object.entries(yearStatusData).map(
    ([year, status]) => ({
      year: parseInt(year),
      status: status.status,
      lastModified: status.lastModified,
    }),
  );

  useEffect(() => {
    // Reset selected year when modal opens
    if (isOpen) {
      setSelectedYear(null);
    }
  }, [isOpen]);

  // Don't show years that match the current year
  const availableYears = years.filter(
    (yearData) => yearData.year.toString() !== currentYear,
  );

  const getStatusColorClass = (
    status: 'completed' | 'in-progress' | 'not-started',
  ): string => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'not-started':
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusText = (
    status: 'completed' | 'in-progress' | 'not-started',
  ): string => {
    switch (status) {
      case 'completed':
        return '작성 완료';
      case 'in-progress':
        return '작성 중';
      case 'not-started':
        return '미작성';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative z-10 mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            다른 연도 데이터 불러오기
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">
          <p className="mb-4 text-gray-600">
            다른 연도의 데이터를 현재 양식에 불러옵니다. 현재 입력된 데이터는
            모두 대체됩니다.
          </p>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              데이터를 불러올 연도를 선택하세요
            </label>

            <div className="max-h-60 space-y-3 overflow-y-auto">
              {availableYears.length > 0 ? (
                availableYears.map((yearData) => (
                  <div
                    key={yearData.year}
                    className={`cursor-pointer rounded-md border p-3 transition-all duration-200 ${
                      selectedYear === yearData.year
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedYear(yearData.year)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">
                        {yearData.year}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColorClass(
                          yearData.status,
                        )}`}
                      >
                        {getStatusText(yearData.status)}
                      </span>
                    </div>
                    {yearData.lastModified && (
                      <p className="mt-1 text-sm text-gray-500">
                        최종 수정: {yearData.lastModified}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-500">
                  불러올 수 있는 다른 연도 데이터가 없습니다.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-amber-600">
                <span className="font-medium">주의:</span> 현재 데이터가 모두
                대체됩니다.
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={onClose}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={selectedYear === null}
                  onClick={() => {
                    if (selectedYear !== null) {
                      onLoadData(selectedYear);
                      onClose();
                    }
                  }}
                >
                  불러오기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
