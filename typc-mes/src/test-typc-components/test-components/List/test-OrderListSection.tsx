import React from 'react';
import { Edit,Trash2} from 'lucide-react';
import { AssemblyOrder } from '@/test-typc-components/test-data/test-assemblyData';


type OrderListSectionProps = {
  assemblyData: AssemblyOrder[];
  selectedStatus: string[];
  onOpenEditOrderModal: (order: AssemblyOrder) => void;
  onDeleteOrder: (id: string) => void;
  setCurrentView: (view: string) => void;
  setSelectedOrder: (order: AssemblyOrder | null) => void;
};

const OrderListSection: React.FC<OrderListSectionProps> = ({ 
    assemblyData ,
    selectedStatus, 
    onOpenEditOrderModal,
    onDeleteOrder,
    setCurrentView,
    setSelectedOrder,
}) => {


    const filteredData =
    selectedStatus.length === 0
      ? []
      : assemblyData.filter((item) => selectedStatus.includes(item.status));
    
    return (
        <div className="space-y-4">

            {filteredData.map(order => (
            <div 
                key={order.id}
                onClick={() => {
                    setCurrentView('assembly');
                    setSelectedOrder(order);
                }}
                className={`bg-white rounded-lg border-l-4 ${order.borderColor} p-4 cursor-pointer hover:shadow-md transition-shadow relative`}
            >
                <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg font-bold text-blue-600 truncate">{order.orderNum}</span>
                    <span className="text-lg font-semibold text-gray-900">{order.customer}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                    onClick={() => onOpenEditOrderModal(order)}
                    className="text-blue-600 hover:text-blue-800 p-2">
                    <Edit size={16} />
                    </button>
                    <button 
                    onClick={() => onDeleteOrder(order.id.toString())}
                    className="text-red-600 hover:text-red-800 p-2">
                    <Trash2 size={16} />
                    </button>
                </div>
                </div>
                <p className="text-base text-gray-700 line-clamp-2 leading-relaxed font-medium">
                    {order.product}
                </p>
            </div>
             ))}

        </div>
    )
}
export default OrderListSection;