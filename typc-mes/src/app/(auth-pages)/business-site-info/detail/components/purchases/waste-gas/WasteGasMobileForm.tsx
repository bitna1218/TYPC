'use client';

import React from 'react';
import { FaTrash, FaPaperclip, FaTimes, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { WasteGas, WasteGasInputValue } from './WasteGasTabContent';

interface WasteGasMobileFormProps {
  item: WasteGas;
  unitOptions: WasteGas['unit'][];
  onInputChange: (id: number, field: keyof WasteGas, value: WasteGasInputValue) => void;
  onFileChange: (id: number, file: File | null) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onSelect: (id: number | null) => void;
}

const WasteGasMobileForm: React.FC<WasteGasMobileFormProps> = ({
  item, unitOptions, onInputChange, onFileChange, onDelete, isSelected, onSelect
}) => {
  const handleLocalInputChange = (field: keyof WasteGas, value: WasteGasInputValue) => {
    onInputChange(item.id, field, value);
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(item.id, e.target.files && e.target.files.length > 0 ? e.target.files[0] : null);
  };

  return (
    <div 
      className={`p-3 my-2 border rounded-md shadow-sm bg-white ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => onSelect(isSelected ? null : item.id)}
      >
        <h4 className="text-md font-medium text-gray-800">
          {item.name || `폐가스 ${item.id}`}
        </h4>
        {isSelected ? <FaChevronDown className="text-gray-500" /> : <FaChevronRight className="text-gray-500" />}
      </div>

      {isSelected && (
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">(1) 폐가스명</label>
            <input 
              type="text" 
              value={item.name}
              onChange={(e) => handleLocalInputChange('name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="폐가스명 입력"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">(2) 단위</label>
            <select 
              value={item.unit}
              onChange={(e) => handleLocalInputChange('unit', e.target.value as WasteGas['unit'])}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">선택</option>
              {unitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)} 
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">(3) 밀도 (ton/m³)</label>
            <input 
              type="number" 
              value={item.density}
              onChange={(e) => handleLocalInputChange('density', e.target.value ? parseFloat(e.target.value) : '')}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="숫자 입력"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">(4) 순발열량 (TJ/ton)</label>
            <input 
              type="number" 
              value={item.netCalorificValue}
              onChange={(e) => handleLocalInputChange('netCalorificValue', e.target.value ? parseFloat(e.target.value) : '')}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="숫자 입력"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">(5) 배출계수 (kgCO₂/ton)</label>
            <input 
              type="number" 
              value={item.emissionFactor}
              onChange={(e) => handleLocalInputChange('emissionFactor', e.target.value ? parseFloat(e.target.value) : '')}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="숫자 입력"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">(6) 파일첨부</label>
            {item.fileAttachment ? (
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-600 truncate max-w-[calc(100%-3rem)]" title={item.fileAttachment.name}>{item.fileAttachment.name}</span>
                <button onClick={(e) => { e.stopPropagation(); onFileChange(item.id, null);}} className="text-red-500 hover:text-red-700">
                  <FaTimes />
                </button>
              </div>
            ) : (
              <label className="w-full flex items-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-xs">
                <FaPaperclip className="mr-2 text-gray-500" />
                <span className="text-gray-700">파일 선택</span>
                <input type="file" className="hidden" onChange={handleLocalFileChange} />
              </label>
            )}
          </div>

          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="w-full mt-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center justify-center"
          >
            <FaTrash className="mr-2" /> 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default WasteGasMobileForm; 