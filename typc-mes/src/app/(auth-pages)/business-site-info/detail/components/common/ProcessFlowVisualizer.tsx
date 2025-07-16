// components/common/ProcessFlowVisualizer.tsx
import React from 'react';
import { FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';

interface SubProcessInfo {
  id: string;
  name: string;
}

interface UnitProcessDefinition {
  id: string | number;
  name: string;
  subProcessIds: string[];
  isRecommended?: boolean;
}

interface ProcessFlowVisualizerProps {
  unitProcessDefinitions: UnitProcessDefinition[];
  availableSubProcesses: SubProcessInfo[];
  isMobile?: boolean;
}

export const ProcessFlowVisualizer: React.FC<ProcessFlowVisualizerProps> = ({
  unitProcessDefinitions,
  availableSubProcesses,
  isMobile = false,
}) => {
  if (unitProcessDefinitions.length === 0) {
    return (
      <div className='border rounded-lg p-4 bg-gray-50 text-center'>
        <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          단위공정을 정의하면 여기에 공정 흐름도가 표시됩니다.
        </p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className='border rounded-md p-3 bg-gray-50'>
        <h4 className='text-xs font-medium mb-2'>공정 흐름도</h4>
        <div className='space-y-2'>
          {unitProcessDefinitions.map((unitProcess, index) => (
            <div
              key={unitProcess.id}
              className='bg-white border border-green-300 rounded-md p-2'
            >
              <div className='text-xs font-medium text-gray-800 mb-1 flex items-center'>
                <span className='bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-[10px] mr-2'>
                  {index + 1}
                </span>
                {unitProcess.name || '(이름 없음)'}
                {unitProcess.isRecommended && (
                  <FaLightbulb
                    className='ml-1 text-yellow-500'
                    size={10}
                    title='추천 단위공정'
                  />
                )}
              </div>
              <div className='flex flex-wrap gap-1'>
                {unitProcess.subProcessIds.length > 0 ? (
                  unitProcess.subProcessIds.map((subId) => {
                    const subProcess = availableSubProcesses.find(
                      (sp) => sp.id === subId
                    );
                    return (
                      <span
                        key={subId}
                        className='bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[9px]'
                      >
                        {subProcess?.name || '(알 수 없음)'}
                      </span>
                    );
                  })
                ) : (
                  <span className='bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[9px] flex items-center'>
                    <FaExclamationTriangle className='mr-1' size={8} />
                    세부공정 없음
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='border rounded-lg p-4 bg-gray-50'>
      <h4 className='text-sm font-medium mb-3 flex items-center'>
        <span>공정 흐름도</span>
        <span className='ml-2 text-xs text-gray-500'>
          (정의된 단위공정 순서)
        </span>
      </h4>
      <div className='flex items-center space-x-4 overflow-x-auto pb-2'>
        {unitProcessDefinitions.map((unitProcess, index) => (
          <div key={unitProcess.id} className='flex items-center flex-shrink-0'>
            <div
              className={`border-2 rounded-lg p-3 bg-white min-w-[140px] shadow-sm ${
                unitProcess.isRecommended
                  ? 'border-yellow-400'
                  : 'border-green-500'
              }`}
            >
              <div className='text-center font-medium text-sm text-gray-800 mb-2 flex items-center justify-center'>
                <span>{unitProcess.name || '(이름 없음)'}</span>
                {unitProcess.isRecommended && (
                  <FaLightbulb
                    className='ml-1 text-yellow-500'
                    size={12}
                    title='추천 단위공정'
                  />
                )}
              </div>
              <div className='space-y-1'>
                {unitProcess.subProcessIds.length > 0 ? (
                  unitProcess.subProcessIds.map((subId) => {
                    const subProcess = availableSubProcesses.find(
                      (sp) => sp.id === subId
                    );
                    return (
                      <div
                        key={subId}
                        className='bg-blue-100 border border-blue-300 rounded px-2 py-1 text-xs text-center'
                      >
                        {subProcess?.name || '(알 수 없음)'}
                      </div>
                    );
                  })
                ) : (
                  <div className='bg-red-100 border border-red-300 rounded px-2 py-1 text-xs text-center text-red-600 flex items-center justify-center'>
                    <FaExclamationTriangle className='mr-1' size={10} />
                    세부공정 없음
                  </div>
                )}
              </div>
            </div>
            {index < unitProcessDefinitions.length - 1 && (
              <div className='text-gray-400 mx-2 text-lg font-bold'>→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessFlowVisualizer;
