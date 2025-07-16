import React from 'react';
import { AssemblyOrder } from '@/test-typc-components/test-data/test-assemblyData';

type SelectedOrderSummaryProps = {
  order: AssemblyOrder| null;
}


const SelectedOrderSummary: React.FC<SelectedOrderSummaryProps> = ({order}) => {
  if (!order) return null;

  return (
    <div className="bg-white rounded-lg p-4 mb-3">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl font-bold text-blue-600">{order.orderNum}</span>
        <span className="text-xl font-bold text-gray-900">{order.customer}</span>
      </div>
      <p className="text-lg font-medium text-gray-800 leading-relaxed">
        {order.product}
      </p>
    </div>
  );
};

export default SelectedOrderSummary;
