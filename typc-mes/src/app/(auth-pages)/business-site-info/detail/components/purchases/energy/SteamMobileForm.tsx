'use client';

import React from 'react';
import { FaTrash, FaPaperclip, FaTimes } from 'react-icons/fa';
import { Steam, InputValue } from './EnergyTabContent'; // 경로 확인

interface SteamMobileFormProps {
  item: Steam;
  unitOptions: Steam['unit'][];
  boilerOptions: string[]; 
  fixedUnit: Steam['unit'] | '';
  isBoilerAvailable: boolean;
  onInputChange: (id: number, field: string, value: InputValue) => void;
  onFileChange: (id: number, file: File | null) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onSelect: (id: number | null) => void;
}

const SteamMobileForm: React.FC<SteamMobileFormProps> = ({
  item, unitOptions, boilerOptions, fixedUnit, isBoilerAvailable, 
  onInputChange, onFileChange, onDelete, isSelected, onSelect
}) => {
  const handleLocalInputChange = (field: keyof Steam, value: InputValue) => {
    onInputChange(item.id, field as string, value);
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(item.id, e.target.files[0]);
    } else {
      onFileChange(item.id, null);
    }
  };
  
  const showBoilerName = item.isSelfGenerated === 'O';
  const showEmissionFactor = item.isSelfGenerated === 'X';

  return (
    <div 
      className={`p-4 my-2 border rounded-md shadow-sm bg-white ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(isSelected ? null : item.id)}
    >
      {isSelected && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">스팀명</label>
            <input 
              type="text" 
              value={item.name}
              onChange={(e) => handleLocalInputChange('name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="예: 생산공정 스팀"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">자체 생산 여부</label>
            <select 
              value={item.isSelfGenerated}
              onChange={(e) => handleLocalInputChange('isSelfGenerated', e.target.value as Steam['isSelfGenerated'])}
              className={`w-full p-2 border border-gray-300 rounded-md text-sm ${!isBoilerAvailable && item.isSelfGenerated === '' ? 'bg-gray-100' : ''}`}
              disabled={!isBoilerAvailable && item.isSelfGenerated === ''} // 보일러 데이터 없으면 초기 선택 불가
            >
              <option value="">선택</option>
              <option value="O" disabled={!isBoilerAvailable}>O (자체생산)</option>
              <option value="X">X (외부구매)</option>
            </select>
            {!isBoilerAvailable && <p className="text-xs text-red-500 mt-1">보일러 데이터가 없어 자체생산을 선택할 수 없습니다.</p>}
          </div>

          {showBoilerName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">생산 보일러</label>
              <select 
                value={item.boilerName || ''}
                onChange={(e) => handleLocalInputChange('boilerName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">보일러 선택</option>
                {boilerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                {/* TODO: 실제 보일러 목록 연동 */} 
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">단위</label>
            <select 
              value={item.unit || ''}
              onChange={(e) => handleLocalInputChange('unit', e.target.value as Steam['unit'])}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">단위 선택</option>
              {unitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            {fixedUnit && item.unit !== fixedUnit && (
                <p className="text-xs text-blue-500 mt-1">현재 모든 스팀 단위는 {fixedUnit}(으)로 고정됩니다.</p>
            )}
            {fixedUnit && item.unit === fixedUnit && (
                 <p className="text-xs text-green-500 mt-1">단위: {fixedUnit} (고정됨)</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">온도 (°C)</label>
            <input type="number" value={item.temperature} onChange={(e) => handleLocalInputChange('temperature', e.target.value ? parseFloat(e.target.value) : '')} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">압력 (kg/cm²)</label>
            <input type="number" value={item.pressure} onChange={(e) => handleLocalInputChange('pressure', e.target.value ? parseFloat(e.target.value) : '')} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비엔탈피 (MJ/kg)</label>
            <input type="number" value={item.enthalpy} onChange={(e) => handleLocalInputChange('enthalpy', e.target.value ? parseFloat(e.target.value) : '')} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
          </div>

          {showEmissionFactor && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">배출계수 (kgCO₂/MJ)</label>
              <input 
                type="number" 
                value={item.emissionFactor}
                onChange={(e) => handleLocalInputChange('emissionFactor', e.target.value ? parseFloat(e.target.value) : '')}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          )}

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
            <p className="text-md font-medium text-gray-800 truncate max-w-[calc(100%-8rem)]">
                {item.name || `스팀 ${item.id}`}
            </p>
            <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 text-xs rounded-full ${item.isSelfGenerated === 'O' ? 'bg-sky-100 text-sky-700' : item.isSelfGenerated === 'X' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.isSelfGenerated === 'O' ? '자체생산' : item.isSelfGenerated === 'X' ? '외부구매' : '미선택'}
                </span>
                {item.unit && <span className="px-2 py-0.5 text-xs rounded-full bg-teal-100 text-teal-700">{item.unit}</span>}
            </div>
        </div>
      )}
    </div>
  );
};

export default SteamMobileForm; 