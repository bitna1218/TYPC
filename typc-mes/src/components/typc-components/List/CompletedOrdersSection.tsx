import React from 'react';
import type { AssemblyOrder } from '../../types/typc-types/types';

interface CompletedOrdersSectionProps {
  getCompletedOrders: () => AssemblyOrder[];
}

export const CompletedOrdersSection: React.FC<CompletedOrdersSectionProps> = ({ getCompletedOrders }) => {
  return (
    <div className="mt-6">
      <div className="space-y-3">
        {getCompletedOrders().length > 0 ? (
          getCompletedOrders().map(order => (
            <div 
              key={order.id} 
              className="bg-white rounded-lg border-l-4 border-l-gray-500 p-4 opacity-75"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-lg font-bold text-blue-600 truncate">{order.orderNum}</span>
                  <span className="text-lg font-semibold text-gray-900">{order.customer}</span>
                  <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex-shrink-0">
                    ✓ 완료
                  </span>
                </div>
              </div>
              
              <p className="text-base text-gray-700 line-clamp-2 leading-relaxed font-medium">
                {order.product}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-base text-gray-500">완료된 주문이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};