import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { CorpYearListItem } from '@/http/endpoints/corpYear';

interface LoadDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadData: (corpYearId: string) => void;
  currentYear?: string;
  yearsData: CorpYearListItem[];
}

export default function LoadDataModal({
  isOpen,
  onClose,
  onLoadData,
  yearsData,
}: LoadDataModalProps) {
  const [selectedCorpYearId, setSelectedCorpYearId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    // Reset selected year when modal opens
    if (isOpen) {
      setSelectedCorpYearId(null);
    }
  }, [isOpen]);

  // Don't show years that match the current year
  const availableYears = yearsData;

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
                    key={yearData.id} // Use yearData.id as key
                    className={`cursor-pointer rounded-md border p-3 transition-all duration-200 ${
                      selectedCorpYearId === yearData.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedCorpYearId(yearData.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">
                        {yearData.year}
                      </span>
                    </div>
                    {yearData.created_at && ( // Use created_at for last modified
                      <p className="mt-1 text-sm text-gray-500">
                        최종 생성:{' '}
                        {new Date(yearData.created_at).toLocaleDateString()}
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
                  disabled={selectedCorpYearId === null}
                  onClick={() => {
                    if (selectedCorpYearId !== null) {
                      onLoadData(selectedCorpYearId);
                      onClose(); // Close modal after initiating load
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
