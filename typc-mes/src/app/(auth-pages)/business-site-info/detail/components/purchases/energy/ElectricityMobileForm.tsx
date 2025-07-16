'use client';

import React from 'react';
import { FaTrash, FaPaperclip, FaTimes } from 'react-icons/fa';
import { Electricity, InputValue } from './EnergyTabContent'; // 경로 확인

interface ElectricityMobileFormProps {
  item: Electricity;
  typeOptions: Electricity['type'][];
  onInputChange: (id: number, field: string, value: InputValue) => void;
  onFileChange: (id: number, file: File | null) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onSelect: (id: number | null) => void;
}

const ElectricityMobileForm: React.FC<ElectricityMobileFormProps> = ({ 
  item, typeOptions, onInputChange, onFileChange, onDelete, isSelected, onSelect 
}) => {
  const handleLocalInputChange = (field: keyof Electricity, value: InputValue) => {
    onInputChange(item.id, field as string, value);
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(item.id, e.target.files[0]);
    } else {
      onFileChange(item.id, null);
    }
  };

  return (
    <div 
      className={`p-4 my-2 border rounded-md shadow-sm bg-white ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(isSelected ? null : item.id)}
    >
      {isSelected && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전력 종류</label>
            <select 
              value={item.type}
              onChange={(e) => handleLocalInputChange('type', e.target.value as Electricity['type'])}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">종류 선택</option>
              {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">단위</label>
            <input 
              type="text" 
              value={item.unit} // kWh 고정
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">파일첨부</label>
            {item.fileAttachment ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600 truncate max-w-[calc(100%-3rem)]">{item.fileAttachment.name}</span>
                <button onClick={(e) => { e.stopPropagation(); onFileChange(item.id, null);}} className="text-red-500 hover:text-red-700">
                  <FaTimes />
                </button>
              </div>
            ) : (
              <label className="w-full flex items-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm">
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
      {!isSelected && (
        <div className="flex justify-between items-center">
            <p className="text-md font-medium text-gray-800 truncate max-w-[calc(100%-4rem)]">
                {item.type || `전력 ${item.id}`}
            </p>
            <span className={`px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700`}>
                {item.unit}
            </span>
        </div>
      )}
    </div>
  );
};

export default ElectricityMobileForm; 