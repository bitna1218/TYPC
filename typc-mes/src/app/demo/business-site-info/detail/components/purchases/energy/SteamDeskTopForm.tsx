'use client';

import React from 'react';
import { FaTrash, FaPaperclip, FaTimes } from 'react-icons/fa';
import { Steam, InputValue } from './EnergyTabContent'; // 경로 확인

interface SteamDeskTopFormProps {
  items: Steam[];
  unitOptions: Steam['unit'][];
  boilerOptions: string[];
  fixedUnit: Steam['unit'] | '';
  isBoilerAvailable: boolean;
  onInputChange: (id: number, field: string, value: InputValue) => void;
  onFileChange: (id: number, file: File | null) => void;
  onDelete: (id: number) => void;
}

const SteamDeskTopForm: React.FC<SteamDeskTopFormProps> = ({
  items, unitOptions, boilerOptions, fixedUnit, isBoilerAvailable,
  onInputChange, onFileChange, onDelete
}) => {
  if (!items || items.length === 0) {
    return <p className="text-center text-gray-500 py-4">스팀 정보가 없습니다. &quot;스팀 추가&quot; 버튼을 클릭하여 추가해주세요.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-[15%]">스팀명</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-[10%]">자체생산</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-[15%]">생산보일러</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-[10%]">단위</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-[10%]">온도(°C)</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-[10%]">압력(kg/cm²)</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-[10%]">비엔탈피(MJ/kg)</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-[15%]">배출계수(kgCO₂/MJ)</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-[15%]">파일첨부</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-auto">작업</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => {
            const showBoilerName = item.isSelfGenerated === 'O';
            const unitIsFixed = !!fixedUnit;
            const currentUnitDisabled = unitIsFixed && (item.unit !== fixedUnit && item.unit !== '' );

            return (
              <tr key={item.id}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <input type="text" value={item.name} onChange={(e) => onInputChange(item.id, 'name', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="예: 공정 스팀" />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <select 
                    value={item.isSelfGenerated}
                    onChange={(e) => onInputChange(item.id, 'isSelfGenerated', e.target.value as Steam['isSelfGenerated'])}
                    className={`w-full p-2 border border-gray-300 rounded-md text-sm ${!isBoilerAvailable && item.isSelfGenerated === '' ? 'bg-gray-100' : ''}`}
                    disabled={!isBoilerAvailable && item.isSelfGenerated === ''}
                  >
                    <option value="">선택</option>
                    <option value="O" disabled={!isBoilerAvailable}>O</option>
                    <option value="X">X</option>
                  </select>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <select 
                    value={item.boilerName || ''}
                    onChange={(e) => onInputChange(item.id, 'boilerName', e.target.value)}
                    className={`w-full p-2 border border-gray-300 rounded-md text-sm ${!showBoilerName ? 'bg-gray-100' : ''}`}
                    disabled={!showBoilerName}
                  >
                    <option value="">{showBoilerName ? '보일러 선택' : '-'}</option>
                    {showBoilerName && boilerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <select 
                    value={item.unit || (unitIsFixed ? fixedUnit : '')}
                    onChange={(e) => onInputChange(item.id, 'unit', e.target.value as Steam['unit'])}
                    className={`w-full p-2 border border-gray-300 rounded-md text-sm ${currentUnitDisabled || (unitIsFixed && !item.unit) ? 'bg-gray-100' : ''}`}
                    disabled={currentUnitDisabled || (unitIsFixed && !item.unit && items.findIndex(s => s.id === item.id) > 0 && items.filter(s => s.unit !=='').length > 0 )}
                  >
                    <option value="">선택</option>
                    {unitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2 whitespace-nowrap"><input type="number" value={item.temperature} onChange={(e) => onInputChange(item.id, 'temperature', e.target.value ? parseFloat(e.target.value) : '')} className="w-full p-2 border border-gray-300 rounded-md text-sm" /></td>
                <td className="px-3 py-2 whitespace-nowrap"><input type="number" value={item.pressure} onChange={(e) => onInputChange(item.id, 'pressure', e.target.value ? parseFloat(e.target.value) : '')} className="w-full p-2 border border-gray-300 rounded-md text-sm" /></td>
                <td className="px-3 py-2 whitespace-nowrap"><input type="number" value={item.enthalpy} onChange={(e) => onInputChange(item.id, 'enthalpy', e.target.value ? parseFloat(e.target.value) : '')} className="w-full p-2 border border-gray-300 rounded-md text-sm" /></td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <input 
                    type="number" 
                    value={item.emissionFactor || ''}
                    onChange={(e) => onInputChange(item.id, 'emissionFactor', e.target.value ? parseFloat(e.target.value) : '')}
                    className={`w-full p-2 border border-gray-300 rounded-md text-sm ${item.isSelfGenerated !== 'X' ? 'bg-gray-100' : ''}`}
                    disabled={item.isSelfGenerated !== 'X'}
                    placeholder={item.isSelfGenerated !== 'X' ? '-' : '배출계수 입력'}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {item.fileAttachment ? (
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 truncate max-w-[calc(100%-2rem)]" title={item.fileAttachment.name}>{item.fileAttachment.name}</span>
                      <button onClick={() => onFileChange(item.id, null)} className="text-red-500 hover:text-red-700 ml-2"><FaTimes /></button>
                    </div>
                  ) : (
                    <label className="w-full flex items-center justify-center px-2 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-xs">
                      <FaPaperclip className="mr-1 text-gray-400" />
                      <span className="text-gray-500">파일</span>
                      <input type="file" className="hidden" onChange={(e) => onFileChange(item.id, e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)} />
                    </label>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center">
                  <button type="button" onClick={() => onDelete(item.id)} className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100" aria-label="삭제">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SteamDeskTopForm; 