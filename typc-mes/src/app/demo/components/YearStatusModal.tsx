import {
  FaCalendarAlt,
  FaCheck,
  FaExclamationTriangle,
  FaTimes,
} from 'react-icons/fa';

type YearStatus = 'completed' | 'in-progress' | 'not-started';

interface YearStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onNewStart?: () => void;
  status: YearStatus;
  year: string;
}

export default function YearStatusModal({
  isOpen,
  onClose,
  onConfirm,
  onNewStart,
  status,
  year,
}: YearStatusModalProps) {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (status) {
      case 'completed':
        return (
          <>
            <p className="mb-6 text-center text-sm text-gray-600">
              {year}년도 데이터는 작성이 완료되었습니다. 작성정보를 확인하시겠습니까?
            </p>
            
            <div className="space-y-3">
              <button
                onClick={onConfirm}
                className="flex w-full items-center rounded-lg border border-green-300 bg-green-50 p-4 text-left transition-colors hover:bg-green-100"
              >
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                  <FaCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">작성정보 확인하기</h4>
                  <p className="text-sm text-green-700">
                    완료된 {year}년도 데이터를 확인합니다
                  </p>
                </div>
              </button>
            </div>
          </>
        );

      case 'in-progress':
        return (
          <>
            <p className="mb-6 text-center text-sm text-gray-600">
              {year}년도 데이터는 작성 중입니다. 기존에 작성중인 정보를 불러올까요?
            </p>
            
            <div className="space-y-3">
              <button
                onClick={onConfirm}
                className="flex w-full items-center rounded-lg border border-blue-300 bg-blue-50 p-4 text-left transition-colors hover:bg-blue-100"
              >
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                  <FaExclamationTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">기존 작업 이어하기</h4>
                  <p className="text-sm text-blue-700">
                    저장된 {year}년도 데이터를 불러와서 이어서 작업합니다
                  </p>
                </div>
              </button>

              <button
                onClick={onNewStart}
                className="flex w-full items-center rounded-lg border border-gray-300 bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100"
              >
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                  <FaCalendarAlt className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">새로 작성하기</h4>
                  <p className="text-sm text-gray-700">
                    처음부터 새로 작성합니다 (기존 데이터는 삭제됩니다)
                  </p>
                </div>
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {year}년도 데이터 상태
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* 모달 바디 */}
        {renderContent()}

        {/* 취소 버튼 */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
