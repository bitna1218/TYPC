import { FaExclamationCircle } from 'react-icons/fa';

// 삭제 확인 모달 컴포넌트
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  year: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  year,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative z-10 mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="px-6 py-4">
          <div className="mb-4 flex items-center justify-center text-red-600">
            <div className="rounded-full bg-red-100 p-3">
              <FaExclamationCircle className="h-6 w-6" />
            </div>
          </div>
          <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
            {year}년도 데이터를 삭제하시겠습니까?
          </h3>
          <p className="mb-6 text-center text-gray-600">
            삭제된 데이터는 복구할 수 없습니다.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              취소
            </button>
            <button
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              onClick={onConfirm}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
