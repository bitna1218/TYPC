'use client';

import React from 'react';
import { FaTrash, FaPaperclip, FaTimes } from 'react-icons/fa'; // 아이콘 추가
import { Fuel, InputValue } from './EnergyTabContent'; // EnergyTabContent에서 타입 가져오기 (경로 확인 필요)

interface FuelMobileFormProps {
  fuel: Fuel;
  unitOptions: Fuel['unit'][];
  onInputChange: (id: number, field: string, value: InputValue) => void;
  onFileChange: (id: number, file: File | null) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onSelect: (id: number | null) => void;
}

const FuelMobileForm: React.FC<FuelMobileFormProps> = ({ 
  fuel, unitOptions, onInputChange, onFileChange, onDelete, isSelected, onSelect 
}) => {
  const handleLocalInputChange = (field: keyof Fuel, value: InputValue) => {
    onInputChange(fuel.id, field as string, value);
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(fuel.id, e.target.files[0]);
    } else {
      onFileChange(fuel.id, null);
    }
  };

  return (
    <div 
      className={`p-4 my-2 border rounded-md shadow-sm bg-white ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(isSelected ? null : fuel.id)}
    >
      {isSelected && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연료명</label>
            <input 
              type="text" 
              value={fuel.name}
              onChange={(e) => handleLocalInputChange('name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="예: 경유, LNG"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">단위</label>
            <select 
              value={fuel.unit}
              onChange={(e) => handleLocalInputChange('unit', e.target.value as Fuel['unit'])}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">단위 선택</option>
              {unitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">바이오매스 여부</label>
            <select 
              value={fuel.isBiomass}
              onChange={(e) => handleLocalInputChange('isBiomass', e.target.value as Fuel['isBiomass'])}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">선택</option>
              <option value="O">O</option>
              <option value="X">X</option>
            </select>
          </div>
          {fuel.isBiomass === 'O' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">함량 (%)</label>
              <input 
                type="number" 
                value={fuel.biomassPercentage}
                onChange={(e) => handleLocalInputChange('biomassPercentage', e.target.value ? parseFloat(e.target.value) : '')}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="예: 10"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">파일첨부</label>
            {fuel.fileAttachment ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600 truncate max-w-[calc(100%-3rem)]">{fuel.fileAttachment.name}</span>
                <button onClick={(e) => { e.stopPropagation(); onFileChange(fuel.id, null);}} className="text-red-500 hover:text-red-700">
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
            onClick={(e) => { e.stopPropagation(); onDelete(fuel.id); }}
            className="w-full mt-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center justify-center"
          >
            <FaTrash className="mr-2" /> 삭제
          </button>
        </div>
      )}
      {!isSelected && (
        <div className="flex justify-between items-center">
            <p className="text-md font-medium text-gray-800 truncate max-w-[calc(100%-4rem)]">
                {fuel.name || `연료 ${fuel.id}`}
            </p>
            <span className={`px-2 py-0.5 text-xs rounded-full ${fuel.isBiomass === 'O' ? 'bg-green-100 text-green-700' : fuel.isBiomass === 'X' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                {fuel.isBiomass === 'O' ? `바이오매스 (${fuel.biomassPercentage || 0}%)` : fuel.isBiomass === 'X' ? '비-바이오매스' : '미선택'}
            </span>
        </div>
      )}
    </div>
  );
};

export default FuelMobileForm; 