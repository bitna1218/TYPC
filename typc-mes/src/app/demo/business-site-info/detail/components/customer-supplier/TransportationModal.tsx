'use client';

import React from 'react';

interface TransportationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (transportation: string) => void;
}

// 이미지에 표시된 운송수단 목록
const transportationOptions = [
  'BCT (환경성적표지)',
  '기차',
  '컨테이너 (환경성적표지)',
  '탱크로리 (환경성적표지)',
  '트럭 (냉동) (에코인벤트)',
  '트럭 (lorry)',
  '항공',
  '내항선 (벌크)',
  '외항선 (벌크)',
  '외항선 (컨테이너)',
  '외항선 (탱커)',
  '해상 (냉동) (에코인벤트)',
  '파이프라인 (에코인벤트)'
];



export default function TransportationModal({
  isOpen,
  onClose,
  onSelect,
}: TransportationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
          <h3 className="text-lg font-medium">운송수단 목록</h3>
          <button className="text-white" onClick={onClose}>&times;</button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          <div className="border-b border-gray-200">
            {transportationOptions.map((option, index) => (
              <div 
                key={index} 
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-100 px-4 py-3 flex justify-end">
          <button 
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-2"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
} 