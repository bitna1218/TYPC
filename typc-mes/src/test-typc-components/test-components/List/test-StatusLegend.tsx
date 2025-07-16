import React from 'react';

const StatusLegend: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-3 mt-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">상태 범례</h3>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">조립 대기</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-600">조립중</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded"></div>
          <span className="text-xs text-gray-600">조립 완료</span>
        </div>
      </div>
    </div>
  );
};

export default StatusLegend;
