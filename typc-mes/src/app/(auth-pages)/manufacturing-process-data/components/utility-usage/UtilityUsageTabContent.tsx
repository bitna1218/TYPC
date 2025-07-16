'use client';

import React, { useState } from 'react';
import CompressedAirUsageContent from './CompressedAirUsageContent';
import IndustrialGasUsageContent from './IndustrialGasUsageContent';
import RefrigerantUsageContent from './RefrigerantUsageContent';

// 탭 인터페이스 정의
interface UtilityTab {
  id: string;
  title: string;
  component: React.ReactNode;
}

const UtilityUsageTabContent: React.FC = () => {
  // 탭 정의
  const tabs: UtilityTab[] = [
    {
      id: 'compressed-air',
      title: '압축공기 사용량',
      component: <CompressedAirUsageContent />,
    },
    {
      id: 'industrial-gas',
      title: '산업용가스 사용량',
      component: <IndustrialGasUsageContent />,
    },
    {
      id: 'refrigerant',
      title: '냉매 충진량',
      component: <RefrigerantUsageContent />,
    },
  ];

  // 활성화된 탭 상태 관리
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold text-gray-800 mb-6'>6. 유틸리티 사용량</h2>
      
      {/* 유틸리티 탭 네비게이션 */}
      <div className='mb-6 border-b border-gray-200'>
        <ul className='flex flex-wrap -mb-px'>
          {tabs.map((tab) => (
            <li key={tab.id} className='mr-2'>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`inline-block p-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                }`}
              >
                {tab.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 탭 컨텐츠 */}
      <div className='mt-4'>
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default UtilityUsageTabContent;
