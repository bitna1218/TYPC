import React, { useState } from 'react';
import { AssemblyOrder } from '@/test-typc-components/test-data/test-assemblyData';

type EditOrderModalProps = {
  editingOrder: AssemblyOrder | null;
  onClose: () => void;
  onUpdate: (updatedOrder: AssemblyOrder) => void;
};

const EditOrderModal: React.FC<EditOrderModalProps> = ({editingOrder, onClose,onUpdate}) => {
    
    if (!editingOrder) return null;
    
    const [localOrder, setLocalOrder] = useState<AssemblyOrder>(editingOrder);

    // 공통 핸들러
    const handleChange = (key: keyof AssemblyOrder, value: string) => {
        setLocalOrder({ ...localOrder, [key]: value });
    };

    const handleUpdate = () => {
        onUpdate(localOrder); 
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 m-4 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">주문 수정</h3>
            <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주문번호 *</label>
                <input
                type="text"
                value={localOrder.orderNum}
                onChange={(e) => handleChange('orderNum', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">고객명 *</label>
                <input
                type="text"
                value={localOrder.customer}
                onChange={(e) => handleChange('customer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
                <input
                type="text"
                value={localOrder.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제품명 *</label>
                <textarea
                value={localOrder.product}
                onChange={(e) => handleChange('product', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주문일 *</label>
                <input
                type="date"
                value={localOrder.orderDate}
                onChange={(e) => handleChange('orderDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">특이사항</label>
                <textarea
                value={localOrder.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={2}
                />
            </div>
            </div>
            <div className="flex gap-2 mt-4">
            <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
                수정
            </button>
            <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
                취소
            </button>
            </div>
        </div>
        </div>
    );

}

export default EditOrderModal;
