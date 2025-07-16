'use client';

import React from 'react';
import { FaTrash, FaPaperclip, FaTimes } from 'react-icons/fa';
import { Fuel, InputValue } from './EnergyTabContent'; // 경로가 정확한지 확인하세요.

interface FuelDeskTopFormProps {
  fuels: Fuel[];
  unitOptions: Fuel['unit'][];
  onInputChange: (id: number, field: string, value: InputValue) => void;
  onFileChange: (id: number, file: File | null) => void;
  onDelete: (id: number) => void;
}

const FuelDeskTopForm: React.FC<FuelDeskTopFormProps> = ({ 
  fuels, unitOptions, onInputChange, onFileChange, onDelete 
}) => {
  if (!fuels || fuels.length === 0) {
    return <p className="text-center text-gray-500 py-4">연료 정보가 없습니다. &quot;연료 추가&quot; 버튼을 클릭하여 추가해주세요.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-1/4">연료명</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-1/6">단위</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-1/6">바이오매스 여부</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-1/6">함량 (%)</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-1/5">파일첨부</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-auto">작업</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {fuels.map((fuel) => (
            <tr key={fuel.id}>
              <td className="px-4 py-3 whitespace-nowrap">
                <input 
                  type="text" 
                  value={fuel.name}
                  onChange={(e) => onInputChange(fuel.id, 'name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="예: 경유, LNG"
                />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <select 
                  value={fuel.unit}
                  onChange={(e) => onInputChange(fuel.id, 'unit', e.target.value as Fuel['unit'])}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">선택</option>
                  {unitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <select 
                  value={fuel.isBiomass}
                  onChange={(e) => onInputChange(fuel.id, 'isBiomass', e.target.value as Fuel['isBiomass'])}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">선택</option>
                  <option value="O">O</option>
                  <option value="X">X</option>
                </select>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <input 
                  type="number" 
                  value={fuel.biomassPercentage}
                  onChange={(e) => onInputChange(fuel.id, 'biomassPercentage', e.target.value ? parseFloat(e.target.value) : '')}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="예: 10"
                  disabled={fuel.isBiomass !== 'O'}
                />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {fuel.fileAttachment ? (
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 truncate max-w-[calc(100%-2rem)]" title={fuel.fileAttachment.name}>{fuel.fileAttachment.name}</span>
                    <button onClick={() => onFileChange(fuel.id, null)} className="text-red-500 hover:text-red-700 ml-2">
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <label className="w-full flex items-center justify-center px-3 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm">
                    <FaPaperclip className="mr-2 text-gray-400" />
                    <span className="text-gray-500">파일 선택</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => onFileChange(fuel.id, e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)}
                    />
                  </label>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <button 
                  type="button"
                  onClick={() => onDelete(fuel.id)}
                  className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100"
                  aria-label="삭제"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FuelDeskTopForm; 