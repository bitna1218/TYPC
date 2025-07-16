'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BusinessTabContent from './components/business/BusinessTabContent';
import CustomerSupplierTabContent from './components/customer-supplier/CustomerSupplierTabContent';
import PurchasesTabContent from './components/purchases/PurchasesTabContent';
import ProcessTabContent from './components/process/ProcessTabContent';
import ProductTabContent from './components/products/ProductTabcontent';
import UnitProcessTabContent from './components/unit-process/UnitProcessTabContent';
import WasteTabContent from './components/waste/WasteTabContent';
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

interface BusinessSiteDetailProps {
  siteId?: string;
}

export default function BusinessSiteDetail({
  siteId,
}: BusinessSiteDetailProps) {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  // 사업장 정보 상태 관리
  const [siteName, setSiteName] = useState<string>('사업장');
  const [currentSiteId, setCurrentSiteId] = useState<string>('');

  // 탭 관련 상태
  const [activeTab, setActiveTab] = useState<string>('business');

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
      // 예: fetchSiteData(siteId).then(data => { ... })
      console.log(`사업장 ID: ${siteId} 데이터를 가져옵니다.`);
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
      { id: 'business', label: '1. 사업장' },
      { id: 'customer-supplier', label: '2. 고객 및 공급업체' },
      { id: 'purchases', label: '3. 구매상품/투입물' },
      { id: 'process', label: '4. 공정/설비' },
      { id: 'products', label: '5. 제품' },
      { id: 'unit-process', label: '6. 단위공정' },
    ];

    if (selectedProgram !== 'cbam') {
      baseTabs.push({ id: 'waste', label: '7. 폐기물' });
    }
    return baseTabs;
  };

  const tabs = getTabs();

  // activeTab이 유효하지 않은 경우 (예: cbam으로 변경되어 폐기물 탭이 사라졌을 때)
  // 기본 탭으로 변경
  useEffect(() => {
    if (!tabs.find((tab) => tab.id === activeTab)) {
      setActiveTab('business');
    }
  }, [tabs, activeTab]);

  return (
    <>
      {/* 사업장 이름 표시 */}
      <div className="mb-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-700">{siteName}</h1>
        </div>
        <div className="flex items-center justify-between">
          <div className="mt-2 flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              사업장 정보 상세
            </h2>
            <div className="ml-4 flex items-center text-gray-500">
              <span>
                {selectedProgram === 'common'
                  ? '공통기준정보'
                  : selectedProgram}
              </span>
              <span className="mx-2">&gt;</span>
              <span>사업장 정보</span>
              <span className="mx-2">&gt;</span>
              <span>사업장</span>
              <span className="mx-2">&gt;</span>
              <span className="font-medium text-blue-600">
                사업장 정보 상세
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
      {activeTab === 'business' ? (
        <BusinessTabContent
          selectedProgram={selectedProgram}
          siteId={currentSiteId}
          onTabChange={handleTabChange}
        />
      ) : activeTab === 'customer-supplier' ? (
        <CustomerSupplierTabContent
          selectedProgram={selectedProgram}
          siteId={currentSiteId}
          onTabChange={handleTabChange}
        />
      ) : activeTab === 'purchases' ? (
        <PurchasesTabContent
          selectedProgram={selectedProgram}
          siteId={currentSiteId}
          onTabChange={handleTabChange}
        />
      ) : activeTab === 'process' ? (
        <ProcessTabContent siteId={currentSiteId} />
      ) : activeTab === 'products' ? (
        <ProductTabContent siteId={currentSiteId} />
      ) : activeTab === 'unit-process' ? (
        <UnitProcessTabContent siteId={currentSiteId} />
      ) : activeTab === 'waste' ? (
        <WasteTabContent siteId={currentSiteId} />
      ) : (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p className="py-10 text-center text-gray-500">
            {tabs.find((tab) => tab.id === activeTab)?.label} 탭은 개발
            중입니다.
          </p>
        </div>
      )}
    </>
  );
}
