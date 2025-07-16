'use client';

import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { ProcessDetail, ProcessInputValue } from './ProcessTabContent';

interface ProcessDeskTopFormProps {
  buildingId: number;
  processes: ProcessDetail[];
  processClassificationOptions: ProcessDetail['processClassification'][];
  utilityEquipmentList: string[];
  environmentalFacilitiesList: string[];
  onProcessInputChange: (
    buildingId: number,
    processId: number,
    field: keyof ProcessDetail,
    value: ProcessInputValue
  ) => void;
  onDeleteProcess: (buildingId: number, processId: number) => void;
}

const ProcessDeskTopForm: React.FC<ProcessDeskTopFormProps> = ({
  buildingId,
  processes,
  processClassificationOptions,
  utilityEquipmentList,
  environmentalFacilitiesList,
  onProcessInputChange,
  onDeleteProcess,
}) => {
  if (!processes || processes.length === 0) {
    return (
      <div className='text-center py-8 text-gray-500'>
        <p>등록된 공정이 없습니다.</p>
        <p className='text-sm mt-1'>위의 &ldquo;공정 추가&rdquo; 버튼을 클릭하여 공정을 추가해주세요.</p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200 text-sm'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[10%]'>번호</th>
            <th className='px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[25%]'>공정 구분</th>
            <th className='px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[25%]'>공정명</th>
            <th className='px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[30%]'>공정 설명</th>
            <th className='px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[10%]'>작업</th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {processes.map((process, index) => (
            <tr key={process.id}>
              <td className='px-3 py-3 whitespace-nowrap text-center'>{index + 1}</td>
              <td className='px-3 py-3 whitespace-nowrap'>
                <select
                  value={process.processClassification}
                  onChange={(e) => onProcessInputChange(buildingId, process.id, 'processClassification', e.target.value as ProcessDetail['processClassification'])}
                  className='w-full p-2 border border-gray-300 rounded-md text-sm'
                >
                  <option value="">선택</option>
                  {processClassificationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </td>
              <td className='px-3 py-3 whitespace-nowrap'>
                {process.processClassification === '제조' ? (
                  <input
                    type="text"
                    value={process.processName}
                    onChange={(e) => onProcessInputChange(buildingId, process.id, 'processName', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="공정명 직접 입력"
                  />
                ) : process.processClassification === '유틸리티' ? (
                  <select
                    value={process.processName}
                    onChange={(e) => onProcessInputChange(buildingId, process.id, 'processName', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">유틸리티 설비 선택</option>
                    {utilityEquipmentList.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : process.processClassification === '환경오염물질 처리' ? (
                  <select
                    value={process.processName}
                    onChange={(e) => onProcessInputChange(buildingId, process.id, 'processName', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">환경 시설 선택</option>
                    {environmentalFacilitiesList.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={process.processName}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                    placeholder="공정 구분 선택 필요"
                  />
                )}
              </td>
              <td className='px-3 py-3 whitespace-nowrap'>
                <input
                  type='text'
                  value={process.processDescription}
                  onChange={(e) => onProcessInputChange(buildingId, process.id, 'processDescription', e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md text-sm'
                  placeholder='공정 설명 입력 (선택)'
                />
              </td>
              <td className='px-3 py-3 whitespace-nowrap text-center'>
                <button
                  type='button'
                  onClick={() => onDeleteProcess(buildingId, process.id)}
                  className='p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100'
                  aria-label='삭제'
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

export default ProcessDeskTopForm; 