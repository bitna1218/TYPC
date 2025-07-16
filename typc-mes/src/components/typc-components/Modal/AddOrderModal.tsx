import React from 'react';
import { AssemblyOrder, NewOrder } from '../../../types/typc-types/types';

interface AddOrderModalProps {
  showAddOrder: boolean;
  setShowAddOrder: (show: boolean) => void;
  newOrder: NewOrder;
  setNewOrder: React.Dispatch<React.SetStateAction<NewOrder>>;
  handleAddOrder: () => void;
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({
  showAddOrder,
  setShowAddOrder,
  newOrder,
  setNewOrder,
  handleAddOrder,
}) => {
  if (!showAddOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 m-4 w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">주문 추가</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주문번호 *</label>
            <input
              type="text"
              value={newOrder.orderNum}
              onChange={(e) => setNewOrder(prev => ({ ...prev, orderNum: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="주문번호를 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">고객명 *</label>
            <input
              type="text"
              value={newOrder.customer}
              onChange={(e) => setNewOrder(prev => ({ ...prev, customer: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="고객명을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
            <input
              type="text"
              value={newOrder.phone}
              onChange={(e) => setNewOrder(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="010-0000-0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제품명 *</label>
            <textarea
              value={newOrder.product}
              onChange={(e) => setNewOrder(prev => ({ ...prev, product: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="제품 설명을 입력하세요"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주문일 *</label>
            <input
              type="date"
              value={newOrder.orderDate}
              onChange={(e) => setNewOrder(prev => ({ ...prev, orderDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">특이사항</label>
            <textarea
              value={newOrder.notes}
              onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="특별한 요청사항이 있으면 입력하세요"
              rows={2}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAddOrder}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            추가
          </button>
          <button
            onClick={() => setShowAddOrder(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};