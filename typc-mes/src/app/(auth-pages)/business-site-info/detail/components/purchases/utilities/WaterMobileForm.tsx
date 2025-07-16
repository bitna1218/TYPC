'use client';

import React from 'react';
import { FaTrash, FaPaperclip, FaTimes, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { WaterUtility, UtilityInputValue } from './UtilitiesTabContent';

interface WaterMobileFormProps {
  item: WaterUtility;
  unitOptions: WaterUtility['unit'][];
  onInputChange: (id: number, field: keyof WaterUtility, value: UtilityInputValue) => void;
  onFileChange: (id: number, file: File | null) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onSelect: (id: number | null) => void;
}

const WaterMobileForm: React.FC<WaterMobileFormProps> = ({
  item, unitOptions, onInputChange, onFileChange, onDelete, isSelected, onSelect
}) => {
  const handleLocalInputChange = (field: keyof WaterUtility, value: UtilityInputValue) => {
    onInputChange(item.id, field, value);
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(item.id, e.target.files && e.target.files.length > 0 ? e.target.files[0] : null);
  };
  
  const waterKindOptions = ['공업용수', '지하수', '상수도', '기타'];
  const waterUsageOptions = ['공정수', '냉각수', '보일러수', '기타'];

  return (
    <div 
      className={`p-3 my-2 border rounded-md shadow-sm bg-white ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => onSelect(isSelected ? null : item.id)}
      >
        <h4 className="text-md font-medium text-gray-800">
          {item.kind || `용수 ${item.id}`}{item.usage && ` (${item.usage})`}
        </h4>
        {isSelected ? <FaChevronDown className="text-gray-500" /> : <FaChevronRight className="text-gray-500" />}
      </div>

      {isSelected && (
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">구분</label>
            <input 
              type="text"
              value="용수"
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">종류</label>
            <select 
              value={item.kind}
              onChange={(e) => handleLocalInputChange('kind', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-orange-100"
            >
              <option value="">선택</option>
              {waterKindOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)} 
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">용도</label>
            <select 
              value={item.usage}
              onChange={(e) => handleLocalInputChange('usage', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-orange-100"
            >
              <option value="">선택</option>
              {waterUsageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)} 
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">단위</label>
            <select 
              value={item.unit}
              onChange={(e) => handleLocalInputChange('unit', e.target.value as WaterUtility['unit'])}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">선택</option>
              {unitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)} 
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">파일첨부</label>
            {item.fileAttachment ? (
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-600 truncate max-w-[calc(100%-3rem)]" title={item.fileAttachment.name}>{item.fileAttachment.name}</span>
                <button onClick={(e) => { e.stopPropagation(); onFileChange(item.id, null);}} className="text-red-500 hover:text-red-700">
                  <FaTimes />
                </button>
              </div>
            ) : (
              <label className="w-full flex items-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-xs bg-yellow-100">
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

export default WaterMobileForm; 