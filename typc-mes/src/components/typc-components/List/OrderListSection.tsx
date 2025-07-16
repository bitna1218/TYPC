import React from 'react';
import type { AssemblyOrder } from '../../../types/typc-types/types';
import { Edit, Trash2 } from 'lucide-react';

interface OrderListSectionProps {
  getDisplayOrders: () => AssemblyOrder[];
  startAssembly: (order: AssemblyOrder) => void;
  handleEditOrder: (order: AssemblyOrder) => void;
  deleteOrder: (id: number) => void;
  statusFilter: string[];
  selectedDate: string;
  setShowAddOrder: (show: boolean) => void;
}

export const OrderListSection: React.FC<OrderListSectionProps> = ({
  getDisplayOrders,
  startAssembly,
  handleEditOrder,
  deleteOrder,
  statusFilter,
  selectedDate,
  setShowAddOrder,
}) => {
  return (
    <div className="space-y-4">
      {getDisplayOrders().length > 0 ? (
        getDisplayOrders().map(order => (
          <div 
            key={order.id} 
            className={`bg-white rounded-lg border-l-4 ${order.borderColor} p-4 cursor-pointer hover:shadow-md transition-shadow relative`}
            onClick={() => startAssembly(order)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-lg font-bold text-blue-600 truncate">{order.orderNum}</span>
                <span className="text-lg font-semibold text-gray-900">{order.customer}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleEditOrder(order)}
                  className="text-blue-600 hover:text-blue-800 p-2"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-base text-gray-700 line-clamp-2 leading-relaxed font-medium">
              {order.product}
            </p>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-base text-gray-500 mb-4">
            {statusFilter.length === 0 
              ? '표시할 상태가 선택되지 않았습니다' 
              : selectedDate === new Date().toISOString().split('T')[0] 
                ? `${statusFilter.join(', ')} 상태의 주문이 없습니다`
                : `해당 날짜에 ${statusFilter.join(', ')} 상태의 주문이 없습니다`}
          </p>
          {selectedDate === new Date().toISOString().split('T')[0] && statusFilter.length > 0 && (
            <button
              onClick={() => setShowAddOrder(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 text-base"
            >
              주문 추가하기
            </button>
          )}
        </div>
      )}
    </div>
  );
};