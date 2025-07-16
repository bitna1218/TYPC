import React, { useState } from 'react';
import { partsInventoryData } from '@/test-typc-components/test-data/test-partsInventoryData';


type AddComponentModalProps = {
  onClose: () => void;
};

const AddComponentModal: React.FC<AddComponentModalProps> = ({onClose}) => {

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 m-4 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-3">부품 추가</h3>
        <div className="space-y-3">

        {/* 카테고리 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 1</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedBrand('');
                setSelectedModel('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(partsInventoryData).map((category) => (
              <option value="">{category}</option>
              ))}
            </select>
          </div>

        {/* 브랜드 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 2 (브랜드)</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">브랜드 선택</option>
            </select>
          </div>

        {/* 모델 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 3 (세부 부품)</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">세부 부품 선택</option>
            </select>
          </div>

        </div>
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            추가
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
};

export default AddComponentModal;