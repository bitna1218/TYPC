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
          단위공정을 정의하면 여기에 구성 요약이 표시됩니다.
        </p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className='border rounded-md p-3 bg-gray-50'>
        <h4 className='text-xs font-medium mb-2 flex items-center'>
          <span>단위공정 구성 요약</span>
          <span className='ml-2 text-[10px] text-gray-500'>
            ({unitProcessDefinitions.length}개)
          </span>
        </h4>
        <div className='grid grid-cols-1 gap-2'>
          {unitProcessDefinitions.map((unitProcess) => (
            <div
              key={unitProcess.id}
              className='bg-white border border-gray-200 rounded-md p-3 shadow-sm'
            >
              <div className='flex items-center justify-between mb-2'>
                <h5 className='text-xs font-medium text-gray-800 truncate flex-1'>
                  {unitProcess.name || '(이름 없음)'}
                </h5>
                {unitProcess.isRecommended && (
                  <span className='ml-2 bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-full text-[9px] flex items-center flex-shrink-0'>
                    <FaLightbulb className='mr-0.5' size={8} />
                    추천
                  </span>
                )}
              </div>
              <div className='space-y-1'>
                <div className='text-[10px] text-gray-500 mb-1'>
                  포함된 세부공정 ({unitProcess.subProcessIds.length}개)
                </div>
                {unitProcess.subProcessIds.length > 0 ? (
                  <div className='flex flex-wrap gap-1'>
                    {unitProcess.subProcessIds.map((subId) => {
                      const subProcess = availableSubProcesses.find(
                        (sp) => sp.id === subId
                      );
                      return (
                        <span
                          key={subId}
                          className='bg-blue-50 border border-blue-200 text-blue-700 rounded px-1.5 py-0.5 text-[9px]'
                        >
                          {subProcess?.name || '(알 수 없음)'}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className='bg-red-50 border border-red-200 rounded px-2 py-1 text-center'>
                    <span className='text-red-600 text-[9px] flex items-center justify-center'>
                      <FaExclamationTriangle className='mr-1' size={8} />
                      세부공정 없음
                    </span>
                  </div>
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
        <span>단위공정 구성 요약</span>
        <span className='ml-2 text-xs text-gray-500'>
          (정의된 단위공정별 세부공정 구성)
        </span>
      </h4>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {unitProcessDefinitions.map((unitProcess) => (
          <div key={unitProcess.id} className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between mb-3'>
              <h5 className='font-medium text-sm text-gray-800 truncate flex-1'>
                {unitProcess.name || '(이름 없음)'}
              </h5>
              {unitProcess.isRecommended && (
                <span className='ml-2 bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs flex items-center flex-shrink-0'>
                  <FaLightbulb className='mr-1' size={10} />
                  추천
                </span>
              )}
            </div>
            <div className='space-y-2'>
              <div className='text-xs text-gray-500 mb-2'>
                포함된 세부공정 ({unitProcess.subProcessIds.length}개)
              </div>
              {unitProcess.subProcessIds.length > 0 ? (
                <div className='flex flex-wrap gap-1'>
                  {unitProcess.subProcessIds.map((subId) => {
                    const subProcess = availableSubProcesses.find(
                      (sp) => sp.id === subId
                    );
                    return (
                      <span
                        key={subId}
                        className='bg-blue-50 border border-blue-200 text-blue-700 rounded-md px-2 py-1 text-xs'
                      >
                        {subProcess?.name || '(알 수 없음)'}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className='bg-red-50 border border-red-200 rounded-md px-3 py-2 text-center'>
                  <span className='text-red-600 text-xs flex items-center justify-center'>
                    <FaExclamationTriangle className='mr-1' size={10} />
                    세부공정 없음
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessFlowVisualizer;
