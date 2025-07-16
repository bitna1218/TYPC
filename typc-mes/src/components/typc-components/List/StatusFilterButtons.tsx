import React from 'react';
import type { AssemblyOrder } from '../../../types/typc-types/types';

interface StatusFilterButtonsProps {
  assemblyData: AssemblyOrder[];
  showCompleted: boolean;
  setShowCompleted: (show: boolean) => void;
  statusFilter: string[];
  toggleStatusFilter: (status: string) => void;
}

export const StatusFilterButtons: React.FC<StatusFilterButtonsProps> = ({
  assemblyData,
  showCompleted,
  setShowCompleted,
  statusFilter,
  toggleStatusFilter,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      {(['조립 대기', '조립중', '조립 완료'] as const).map(status => {
        const isActive = status === '조립 완료' ? showCompleted : statusFilter.includes(status);
        const today = new Date().toISOString().split('T')[0];
        
        // 총 개수 계산
        let statusCount = 0;
        if (status === '조립 대기') {
          const todayCount = assemblyData.filter(order => 
            order.status === status && order.assemblyDate === today
          ).length;
          const overdueCount = assemblyData.filter(order => 
            order.status === status && order.assemblyDate < today
          ).length;
          statusCount = todayCount + overdueCount;
        } else if (status === '조립중') {
          const todayCount = assemblyData.filter(order => 
            order.status === status && order.assemblyDate === today
          ).length;
          const overdueCount = assemblyData.filter(order => 
            order.status === status && order.assemblyDate < today
          ).length;
          statusCount = todayCount + overdueCount;
        } else {
          statusCount = assemblyData.filter(order => order.status === status).length;
        }
        
        return (
          <button
            key={status}
            onClick={() => {
              if (status === '조립 완료') {
                setShowCompleted(!showCompleted);
              } else {
                toggleStatusFilter(status);
              }
            }}
            className={`p-4 rounded-lg text-center transition-colors ${
              isActive 
                ? status === '조립 대기' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                  status === '조립중' ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
                  'bg-gray-100 text-gray-800 border-2 border-gray-300'
                : 'bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <div className={`w-8 h-8 rounded mx-auto mb-3 ${
              status === '조립 대기' ? 'bg-green-500' :
              status === '조립중' ? 'bg-blue-500' :
              'bg-gray-500'
            }`}></div>
            <div className="text-sm font-medium mb-2">{status}</div>
            <div className={`text-2xl font-bold ${
              isActive 
                ? status === '조립 대기' ? 'text-green-800' :
                  status === '조립중' ? 'text-blue-800' :
                  'text-gray-800'
                : 'text-gray-600'
            }`}>
              {statusCount}
            </div>
          </button>
        );
      })}
    </div>
  );
};