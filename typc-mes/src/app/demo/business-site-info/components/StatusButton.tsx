import { FaCheck, FaClock, FaPen, FaLock } from 'react-icons/fa';
import { StepStatus } from '../types';

interface StatusButtonProps {
  status: StepStatus;
  onClick?: () => void;
  lockedMessage?: string;
}

export default function StatusButton({ status, onClick, lockedMessage }: StatusButtonProps) {
  const getStatusConfig = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return {
          icon: FaCheck,
          text: '완료',
          className: 'bg-green-500 hover:bg-green-600 text-white cursor-pointer',
          clickable: true,
        };
      case 'in-progress':
        return {
          icon: FaClock,
          text: '작성중',
          className: 'bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50',
          clickable: true,
        };
      case 'available':
        return {
          icon: FaPen,
          text: '작성하기',
          className: 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer',
          clickable: true,
        };
      case 'locked':
        return {
          icon: FaLock,
          text: null, // 텍스트 제거
          className: 'bg-gray-400 text-white cursor-not-allowed group relative',
          clickable: false,
        };
      default:
        return {
          icon: FaLock,
          text: null,
          className: 'bg-gray-400 text-white cursor-not-allowed group relative',
          clickable: false,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const handleClick = () => {
    if (config.clickable && onClick) {
      onClick();
    }
    // 잠금 상태일 때는 아무 동작하지 않음 (툴팁으로 대체)
  };

  const isLocked = status === 'locked';
  const buttonContent = (
    <button
      className={`flex w-full items-center justify-center ${config.text ? 'space-x-2' : ''} rounded px-3 py-2 text-sm font-medium transition-colors lg:w-auto ${config.className}`}
      onClick={handleClick}
      disabled={!config.clickable}
    >
      <Icon className="h-4 w-4" />
      {config.text && <span>{config.text}</span>}
      
      {/* 잠금 상태일 때 툴팁 */}
      {isLocked && lockedMessage && (
        <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
          {lockedMessage}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </button>
  );

  return buttonContent;
} 