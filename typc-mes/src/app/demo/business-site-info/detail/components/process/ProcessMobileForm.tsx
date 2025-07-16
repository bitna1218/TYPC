'use client';

import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { ProcessDetail, ProcessInputValue } from './ProcessTabContent';

interface ProcessMobileFormProps {
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

const ProcessMobileForm: React.FC<ProcessMobileFormProps> = ({
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

  const renderProcessNameInput = (process: ProcessDetail) => {
    switch (process.processClassification) {
      case '제조':
        return (
          <input
            type="text"
            value={process.processName}
            onChange={(e) => onProcessInputChange(buildingId, process.id, 'processName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="공정명 직접 입력"
          />
        );
      case '유틸리티':
        return (
          <select
            value={process.processName}
            onChange={(e) => onProcessInputChange(buildingId, process.id, 'processName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">유틸리티 설비 선택</option>
            {utilityEquipmentList.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
          </select>
        );
      case '환경오염물질 처리':
        return (
          <select
            value={process.processName}
            onChange={(e) => onProcessInputChange(buildingId, process.id, 'processName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">환경 시설 선택</option>
            {environmentalFacilitiesList.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={process.processName}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-100"
            placeholder="공정 구분 선택 필요"
          />
        );
    }
  };

  return (
    <div className='space-y-2'>
      {processes.map((process) => (
        <div key={process.id} className='border rounded-md p-3 bg-gray-50'>
          <div className='space-y-3'>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>공정 구분</label>
              <select
                value={process.processClassification}
                onChange={(e) => onProcessInputChange(buildingId, process.id, 'processClassification', e.target.value as ProcessDetail['processClassification'])}
                className='w-full p-2 border border-gray-300 rounded-md text-sm'
              >
                <option value="">선택</option>
                {processClassificationOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>공정명</label>
              {renderProcessNameInput(process)}
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>공정 설명 (선택)</label>
              <textarea
                value={process.processDescription}
                onChange={(e) => onProcessInputChange(buildingId, process.id, 'processDescription', e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md text-sm h-20'
                placeholder='공정 설명 입력'
              />
            </div>
            <div className='flex justify-end pt-2'>
              <button
                type='button'
                onClick={() => onDeleteProcess(buildingId, process.id)}
                className='p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100 text-sm flex items-center'
                aria-label='삭제'
              >
                <FaTrash className='mr-1'/> 삭제
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessMobileForm; 