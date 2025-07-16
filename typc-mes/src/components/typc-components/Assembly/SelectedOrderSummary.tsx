// components/SelectedOrderSummary.tsx
import React from 'react';
import { AssemblyOrder } from '../../../types/typc-types/types'; // 실제 경로에 맞게 조정

interface SelectedOrderSummaryProps {
  selectedOrder: AssemblyOrder | null;
}

const SelectedOrderSummary: React.FC<SelectedOrderSummaryProps> = ({ selectedOrder }) => {
  if (!selectedOrder) return null;

  return (
    <div className="bg-white rounded-lg p-4 mb-3">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl font-bold text-blue-600">{selectedOrder.orderNum}</span>
        <span className="text-xl font-bold text-gray-900">{selectedOrder.customer}</span>
      </div>
      <p className="text-lg font-medium text-gray-800 leading-relaxed">
        {selectedOrder.product}
      </p>
    </div>
  );
};

export default SelectedOrderSummary;
