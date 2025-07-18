import React from 'react';



const AssemblyProgressBar: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">조립 진행률</h3>
        <span className="text-xs text-blue-600 font-medium">%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `0%` }}
        ></div>
      </div>
    </div>
  );
};

export default AssemblyProgressBar;