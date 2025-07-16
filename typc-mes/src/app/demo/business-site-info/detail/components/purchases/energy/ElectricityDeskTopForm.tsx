'use client';

import React from 'react';
import { FaTrash, FaPaperclip, FaTimes } from 'react-icons/fa';
import { Electricity, InputValue } from './EnergyTabContent'; // 경로 확인

// Props 타입 정의
interface ElectricityDeskTopFormProps {
  items: Electricity[];
  typeOptions: Electricity['type'][];
  onInputChange: (id: number, field: string, value: InputValue) => void;
  onFileChange: (id: number, file: File | null) => void;
  onDelete: (id: number) => void;
}

const ElectricityDeskTopForm: React.FC<ElectricityDeskTopFormProps> = ({
  items, typeOptions, onInputChange, onFileChange, onDelete
}) => {
  if (!items || items.length === 0) {
    return <p className="text-center text-gray-500 py-4">전력 정보가 없습니다. &quot;전력 추가&quot; 버튼을 클릭하여 추가해주세요.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-2/5">전력 종류</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-1/5">단위</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-2/5">파일첨부</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-auto">작업</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 whitespace-nowrap">
                <select
                  value={item.type}
                  onChange={(e) => onInputChange(item.id, 'type', e.target.value as Electricity['type'])}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">종류 선택</option>
                  {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <input
                  type="text"
                  value={item.unit} // kWh 고정
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {item.fileAttachment ? (
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 truncate max-w-[calc(100%-2rem)]" title={item.fileAttachment.name}>{item.fileAttachment.name}</span>
                    <button onClick={() => onFileChange(item.id, null)} className="text-red-500 hover:text-red-700 ml-2">
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
                      onChange={(e) => onFileChange(item.id, e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)}
                    />
                  </label>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
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

export default ElectricityDeskTopForm; 