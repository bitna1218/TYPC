import React from 'react';

import { AssemblyOrder } from '../../../types/typc-types/types';



interface EditOrderModalProps {
  editingOrder: AssemblyOrder | null;
  setEditingOrder: React.Dispatch<React.SetStateAction<AssemblyOrder | null>>;
  handleUpdateOrder: () => void;
  setShowEditOrder: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  editingOrder,
  setEditingOrder,
  handleUpdateOrder,
  setShowEditOrder
}) => {
  if (!editingOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 m-4 w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">주문 수정</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주문번호 *</label>
            <input
              type="text"
              value={editingOrder.orderNum}
              onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, orderNum: e.target.value }) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">고객명 *</label>
            <input
              type="text"
              value={editingOrder.customer}
              onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, customer: e.target.value }) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
            <input
              type="text"
              value={editingOrder.phone}
              onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제품명 *</label>
            <textarea
              value={editingOrder.product}
              onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, product: e.target.value }) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주문일 *</label>
            <input
              type="date"
              value={editingOrder.orderDate}
              onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, orderDate: e.target.value }) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">특이사항</label>
            <textarea
              value={editingOrder.notes}
              onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, notes: e.target.value }) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleUpdateOrder}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            수정
          </button>
          <button
            onClick={() => setShowEditOrder(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};