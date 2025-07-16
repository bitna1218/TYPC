'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductProductionTabContent from './components/product-production/ProductProductionTabContent';
import AuxiliaryMaterialsTabContent from './components/auxiliary-materials/AuxiliaryMaterialsTabContent';
import ElectricitySteamTabContent from './components/electricity-steam/ElectricitySteamTabContent';
import FuelUsageTabContent from './components/fuel-usage/FuelUsageTabContent';
import WaterUsageTabContent from './components/water-usage/WaterUsageTabContent';
import UtilityUsageTabContent from './components/utility-usage/UtilityUsageTabContent';
import WasteGenerationTabContent from './components/waste-generation/WasteGenerationTabContent';
import WasteWaterGenerationTabContent from './components/wastewater-generation/WasteWaterGenerationTabContent';
import FlareStackInputTabContent from './components/flare-stack-input/FlareStackInputTabContent';
import ProcessWasteTabContent from './components/process-waste/ProcessWasteTabContent';
import { route } from '@/constants/route';
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

interface ManufacturingProcessDataPageProps {
  siteId?: string;
}

export default function ManufacturingProcessDataPage({
  siteId,
}: ManufacturingProcessDataPageProps) {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  // 사업장 정보 상태 관리
  const [siteName, setSiteName] = useState<string>('사업장');
  const [currentSiteId, setCurrentSiteId] = useState<string>('');

  // 탭 관련 상태
  const [activeTab, setActiveTab] = useState<string>('product-production');

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

    if (!year) {
      router.push(route.corp.year.path);
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
      console.log(`사업장 ID: ${siteId} 제조공정데이터를 가져옵니다.`);
    }
  }, [router, siteId]);

  // 탭 변경 핸들러
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setShowMobileTabMenu(false);
  };

  // 탭 데이터
  const getTabs = () => {
    const baseTabs = [
      { id: 'product-production', label: '1. 제품생산량' },
      { id: 'auxiliary-materials', label: '2. 부자재 사용량' },
      { id: 'electricity-steam', label: '3. 전력, 스팀 사용량' },
      { id: 'fuel-usage', label: '4. 연료사용량' },
      { id: 'water-usage', label: '5. 용수사용량' },
      { id: 'utility-usage', label: '6. 유틸리티 사용량' },
      { id: 'waste-generation', label: '7. 폐기물 발생량' },
    ];

    // CBAM 프로그램이 아닐 때만 폐수 발생량 탭 추가
    if (selectedProgram !== 'cbam') {
      baseTabs.push({ id: 'wastewater-generation', label: '8. 폐수 발생량' });
      baseTabs.push({ id: 'flare-stack-input', label: '9. 플래어스택 유입량' });
      baseTabs.push({ id: 'process-waste', label: '10. 공정폐기물 발생량' });
    }

    return baseTabs;
  };

  const tabs = getTabs();

  // activeTab이 유효하지 않은 경우 기본 탭으로 변경
  useEffect(() => {
    if (!tabs.find((tab) => tab.id === activeTab)) {
      setActiveTab('product-production');
    }
  }, [tabs, activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'product-production':
        return <ProductProductionTabContent siteId={currentSiteId} />;
      case 'auxiliary-materials':
        return <AuxiliaryMaterialsTabContent siteId={currentSiteId} />;
      case 'electricity-steam':
        return <ElectricitySteamTabContent siteId={currentSiteId} />;
      case 'fuel-usage':
        return <FuelUsageTabContent siteId={currentSiteId} />;
      case 'water-usage':
        return <WaterUsageTabContent siteId={currentSiteId} />;
      case 'utility-usage':
        return <UtilityUsageTabContent />;
      case 'waste-generation':
        return <WasteGenerationTabContent siteId={currentSiteId} />;
      case 'wastewater-generation':
        return <WasteWaterGenerationTabContent siteId={currentSiteId} />;
      case 'flare-stack-input':
        return <FlareStackInputTabContent siteId={currentSiteId} />;
      case 'process-waste':
        return <ProcessWasteTabContent siteId={currentSiteId} />;
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
    <>
      {/* 사업장 이름 및 제조공정데이터 헤더 */}
      <div className="mb-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-700">{siteName}</h1>
        </div>
        <div className="flex items-center justify-between">
          <div className="mt-2 flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">제조공정데이터</h2>
            <div className="ml-4 flex items-center text-gray-500">
              <span>
                {selectedProgram === 'common'
                  ? '공통기준정보'
                  : selectedProgram}
              </span>
              <span className="mx-2">&gt;</span>
              <span className="font-medium text-blue-600">제조공정데이터</span>
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
    </>
  );
}
