'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/app/demo/components/Layout';
import BoilerTabContent from './components/boiler/BoilerTabContent';
import AirPollutionPreventionTabContent from './components/air-pollution-prevention/AirPollutionPreventionTabContent';
import { LocalStorage } from '@/utils/storage';

interface TabProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const Tab: React.FC<TabProps> = ({ id, label, isActive, onClick }) => {
  return (
    <div
      className={`cursor-pointer rounded-t-lg px-3 py-2 text-sm transition-colors md:px-6 md:py-3 md:text-base ${
        isActive
          ? 'bg-gray-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      onClick={() => onClick(id)}
    >
      {label}
    </div>
  );
};

interface UtilityFacilityDataPageProps {
  siteId?: string;
}

export default function UtilityFacilityDataPage({
  siteId,
}: UtilityFacilityDataPageProps) {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // 사업장 정보 상태 관리
  const [siteName, setSiteName] = useState<string>('사업장');
  const [currentSiteId, setCurrentSiteId] = useState<string>('');

  // 탭 관련 상태
  const [activeTab, setActiveTab] = useState<string>('boiler');

  // 모바일 탭 관련
  const [showMobileTabMenu, setShowMobileTabMenu] = useState<boolean>(false);

  useEffect(() => {
    // 브라우저에서만 실행되도록 합니다
    const program = LocalStorage.get('selectedProgram');
    const year = LocalStorage.get('selectedYear');

    // 사업장 정보 가져오기
    const storedSiteName = LocalStorage.get('selectedSiteName');
    const storedSiteId = LocalStorage.get('selectedSiteId');

    if (program) {
      setSelectedProgram(program);
    } else {
      router.push('/');
    }

    if (year) {
      setSelectedYear(year);
    } else {
      router.push('/demo/year-selection');
    }

    // 사업장 정보 설정
    if (storedSiteName) {
      setSiteName(storedSiteName);
    }

    if (storedSiteId || siteId) {
      setCurrentSiteId(siteId || storedSiteId || '');
    }

    // 실제 구현에서는 사업장 ID를 기반으로 서버에서 데이터를 가져옵니다
    if (siteId) {
      console.log(`사업장 ID: ${siteId} 유틸리티설비데이터를 가져옵니다.`);
    }
  }, [router, siteId]);

  // 탭 변경 핸들러
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setShowMobileTabMenu(false);
  };

  // 탭 데이터
  const tabs = [
    { id: 'boiler', label: '1. 보일러' },
    { id: 'air-pollution-prevention', label: '2. 대기오염방지시설' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'boiler':
        return <BoilerTabContent siteId={currentSiteId} />;
      case 'air-pollution-prevention':
        return <AirPollutionPreventionTabContent siteId={currentSiteId} />;
      default:
        return (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <p className="py-10 text-center text-gray-500">
              선택된 탭을 찾을 수 없습니다.
            </p>
          </div>
        );
    }
  };

  return (
    <Layout
      selectedProgram={selectedProgram}
      selectedYear={selectedYear}
      activeMenu="utility-facility-data"
    >
      {/* 사업장 이름 및 유틸리티설비데이터 헤더 */}
      <div className="mb-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-700">{siteName}</h1>
        </div>
        <div className="flex items-center justify-between">
          <div className="mt-2 flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              유틸리티설비데이터
            </h2>
            <div className="ml-4 flex items-center text-gray-500">
              <span>
                {selectedProgram === 'common'
                  ? '공통기준정보'
                  : selectedProgram}
              </span>
              <span className="mx-2">&gt;</span>
              <span className="font-medium text-blue-600">
                유틸리티설비데이터
              </span>
            </div>
          </div>
          <div className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
            * 표시는 필수 항목
          </div>
        </div>
      </div>

      {/* 모바일 탭 드롭다운 메뉴 (xl 이하 화면에서 표시) */}
      <div className="relative mb-4 xl:hidden">
        <div
          className="flex cursor-pointer items-center justify-between rounded-t-lg bg-gray-600 p-3 text-white"
          onClick={() => setShowMobileTabMenu(!showMobileTabMenu)}
        >
          <span>{tabs.find((tab) => tab.id === activeTab)?.label}</span>
          <span>{showMobileTabMenu ? '▲' : '▼'}</span>
        </div>

        {showMobileTabMenu && (
          <div className="absolute left-0 right-0 top-full z-10 mt-0 rounded-b-lg border border-gray-300 bg-white shadow-lg">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`cursor-pointer p-3 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 font-medium text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 데스크탑 탭 네비게이션 (xl 이상 화면에서 표시) */}
      <div className="mb-6 hidden overflow-x-auto xl:flex">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={handleTabChange}
          />
        ))}
      </div>

      {/* 활성화된 탭 내용 표시 */}
      {renderTabContent()}
    </Layout>
  );
}
