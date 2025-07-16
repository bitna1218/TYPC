import React, { useState } from 'react';

import { AssemblyOrder } from '@/test-typc-components/test-data/test-assemblyData';


type StatusFilterButtonsProps = {
  assemblyData: AssemblyOrder[];
  selectedStatus: string[];
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
};


const StatusFilterButtons: React.FC<StatusFilterButtonsProps> = ({ 
  assemblyData, 
  selectedStatus,
  setSelectedStatus,
}) => {
  
    const countByStatus = (status: string) =>
    assemblyData.filter((item) => item.status === status).length;

    const handleStatusClick = (status: string) => {
      setSelectedStatus((prev: string[]) =>
        prev.includes(status)
      ? prev.filter((s) => s !== status) // 이미 있으면 제거
      : [...prev, status]               // 없으면 추가
      );
    };
  
    return (
        <div className="grid grid-cols-3 gap-3 mb-4">

          <button
              onClick={() => handleStatusClick('조립 대기')}
              className={`p-4 rounded-lg text-center transition-colors
              ${selectedStatus.includes('조립 대기')
              ? 'bg-green-100 text-green-800 border-2 border-green-300'
              : 'hover:bg-gray-100'}
              `}
          >
            <div className={`w-8 h-8 rounded mx-auto mb-3 bg-green-500`}></div>
            <div className="text-sm font-medium mb-2">조립 대기</div>
            <div className={`text-2xl font-bold `}>{countByStatus('조립 대기')}</div>
          </button>


          <button
            onClick={() => handleStatusClick('조립중')}
            className={`p-4 rounded-lg text-center transition-colors
            ${selectedStatus.includes('조립중')
            ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
            : 'hover:bg-gray-100'}
            `}
          >
            <div className={`w-8 h-8 rounded mx-auto mb-3 bg-blue-500`}></div>
            <div className="text-sm font-medium mb-2">조립중</div>
            <div className={`text-2xl font-bold `}>{countByStatus('조립중')}</div>
          </button>


          <button
            onClick={() => handleStatusClick('조립 완료')}
            className={`p-4 rounded-lg text-center transition-colors
            ${selectedStatus.includes('조립 완료')
            ? 'bg-gray-100 text-gray-800 border-2 border-gray-300'
            : 'hover:bg-gray-100'}
            `}
          >
            <div className={`w-8 h-8 rounded mx-auto mb-3 bg-gray-500`}></div>  
            <div className="text-sm font-medium mb-2">조립 완료</div>
            <div className={`text-2xl font-bold `}>{countByStatus('조립 완료')}</div>
          </button>

          
        </div>

        
    );
}

export default StatusFilterButtons