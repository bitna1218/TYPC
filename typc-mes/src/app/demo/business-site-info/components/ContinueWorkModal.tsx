import { FaFileAlt, FaPlus, FaTimes } from 'react-icons/fa';

interface ContinueWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewWork: () => void;
  onContinueWork: () => void;
  stepName: string;
  siteName?: string;
}

export default function ContinueWorkModal({
  isOpen,
  onClose,
  onNewWork,
  onContinueWork,
  stepName,
  siteName,
}: ContinueWorkModalProps) {
  if (!isOpen) return null;

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
            {stepName} 작업 방식 선택
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* 사업장명 표시 */}
        {siteName && (
          <div className="mb-4 rounded-md bg-blue-50 p-3">
            <p className="text-sm text-blue-700">
              <span className="font-medium">사업장:</span> {siteName}
            </p>
          </div>
        )}

        {/* 설명 */}
        <p className="mb-6 text-sm text-gray-600">
          현재 {stepName} 작업이 진행 중입니다. 어떻게 작업하시겠습니까?
        </p>

        {/* 선택 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={onContinueWork}
            className="flex w-full items-center rounded-lg border border-blue-300 bg-blue-50 p-4 text-left transition-colors hover:bg-blue-100"
          >
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
              <FaFileAlt className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">기존 작업 이어하기</h4>
              <p className="text-sm text-blue-700">
                저장된 데이터를 불러와서 이어서 작업합니다
              </p>
            </div>
          </button>

          <button
            onClick={onNewWork}
            className="flex w-full items-center rounded-lg border border-gray-300 bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100"
          >
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
              <FaPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">새로 작성하기</h4>
              <p className="text-sm text-gray-700">
                처음부터 새로 작성합니다 (기존 데이터는 삭제됩니다)
              </p>
            </div>
          </button>
        </div>

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