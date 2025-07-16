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
            <div className='flex items-center justify-center mb-4 text-green-600'>
              <div className='bg-green-100 rounded-full p-3'>
                <FaCheck className='h-6 w-6' />
              </div>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-4 text-center'>
              이미 작성 완료되었습니다
            </h3>
            <p className='text-gray-600 mb-6 text-center'>
              {year}년도 데이터는 작성이 완료되었습니다. 작성정보를
              확인하시겠습니까?
            </p>
            <div className='flex justify-center'>
              <button
                className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                onClick={onConfirm}
              >
                확인
              </button>
            </div>
          </>
        );

      case 'in-progress':
        return (
          <>
            <div className='flex items-center justify-center mb-4 text-blue-600'>
              <div className='bg-blue-100 rounded-full p-3'>
                <FaExclamationTriangle className='h-6 w-6' />
              </div>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-4 text-center'>
              작성 중인 정보가 있습니다
            </h3>
            <p className='text-gray-600 mb-6 text-center'>
              {year}년도 데이터는 작성 중입니다. 기존에 작성중인 정보를
              불러올까요?
            </p>
            <div className='flex justify-center space-x-4'>
              <button
                className='px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                onClick={onNewStart}
              >
                새로 작성하기
              </button>
              <button
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                onClick={onConfirm}
              >
                불러오기
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={onClose}
      ></div>

      <div className='relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10'>
        {/* Header */}
        <div className='flex justify-between items-center border-b border-gray-200 px-6 py-4'>
          <h3 className='text-lg font-semibold text-gray-800 flex items-center'>
            <FaCalendarAlt className='mr-2 text-blue-500' />
            {year}년도 데이터 상태
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-500 focus:outline-none'
          >
            <FaTimes className='h-5 w-5' />
          </button>
        </div>

        {/* Modal Body */}
        <div className='px-6 py-4'>{renderContent()}</div>
      </div>
    </div>
  );
}
