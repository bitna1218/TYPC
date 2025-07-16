import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// 아코디언 아이템 인터페이스
export interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/**
 * 아코디언 아이템 컴포넌트
 * 접을 수 있는 섹션을 생성하는 재사용 가능한 컴포넌트
 */
const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className='border border-gray-200 rounded-md mb-2'>
      <button
        className='w-full flex justify-between items-center p-3 text-left bg-gray-50 hover:bg-gray-100'
        onClick={() => setIsOpen(!isOpen)}
        type='button'
        aria-expanded={isOpen}
      >
        <h4 className='font-medium'>{title}</h4>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && (
        <div className='p-4 border-t border-gray-200'>{children}</div>
      )}
    </div>
  );
};

export default AccordionItem; 