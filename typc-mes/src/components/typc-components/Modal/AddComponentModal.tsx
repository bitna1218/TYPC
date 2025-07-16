import React from 'react';
import { PartsInventory, NewComponent, CustomComponent } from '../../../types/typc-types/types';

interface AddComponentModalProps {
  showAddComponent: boolean;
  setShowAddComponent: (show: boolean) => void;
  partsInventory: PartsInventory;
  newComponent: NewComponent;
  setNewComponent: React.Dispatch<React.SetStateAction<NewComponent>>;
  handleAddComponent: () => void;
}

export const AddComponentModal: React.FC<AddComponentModalProps> = ({
  showAddComponent,
  setShowAddComponent,
  partsInventory,
  newComponent,
  setNewComponent,
  handleAddComponent,
}) => {
  if (!showAddComponent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 m-4 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-3">부품 추가</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 1</label>
            <select
              value={newComponent.category1}
              onChange={(e) => setNewComponent(prev => ({
                ...prev,
                category1: e.target.value,
                category2: '',
                category3: ''
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">카테고리 1 선택</option>
              {Object.keys(partsInventory).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 2 (브랜드)</label>
            <select
              value={newComponent.category2}
              onChange={(e) => setNewComponent(prev => ({
                ...prev,
                category2: e.target.value,
                category3: ''
              }))}
              disabled={!newComponent.category1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">브랜드 선택</option>
              {newComponent.category1 && partsInventory[newComponent.category1] &&
                Object.keys(partsInventory[newComponent.category1]).map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))
              }
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 3 (세부 부품)</label>
            <select
              value={newComponent.category3}
              onChange={(e) => setNewComponent(prev => ({
                ...prev,
                category3: e.target.value
              }))}
              disabled={!newComponent.category2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">세부 부품 선택</option>
              {newComponent.category2 && partsInventory[newComponent.category1] &&
                partsInventory[newComponent.category1][newComponent.category2] &&
                partsInventory[newComponent.category1][newComponent.category2].map(part => (
                  <option key={part} value={part}>{part}</option>
                ))
              }
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAddComponent}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            추가
          </button>
          <button
            onClick={() => setShowAddComponent(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};