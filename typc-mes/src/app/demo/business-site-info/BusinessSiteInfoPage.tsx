'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/app/demo/components/Layout';
import { LocalStorage } from '@/utils/storage';
import PageHeader from './components/PageHeader';
import SameAsCompanySelector from './components/SameAsCompanySelector';
import CompanyBusinessSiteTable from './components/CompanyBusinessSiteTable';
import BusinessSiteTableControls from './components/BusinessSiteTableControls';
import BusinessSiteTable from './components/BusinessSiteTable';
import NavigationButtons from './components/NavigationButtons';
import TestControls from './components/TestControls';
import ContinueWorkModal from './components/ContinueWorkModal';
import { BusinessSite, CompanyInfo, StepStatus } from './types';

export default function BusinessSiteInfo() {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [isSameAsCompany, setIsSameAsCompany] = useState<boolean>(true);
  const [businessSites, setBusinessSites] = useState<BusinessSite[]>([
    { 
      id: '1', 
      name: '본사 사업장', 
      isSelected: false,
      businessInfoStatus: 'completed',
      manufacturingProcessStatus: 'available',
      utilityFacilityStatus: 'locked'
    },
    { 
      id: '2', 
      name: '부산 공장', 
      isSelected: false,
      businessInfoStatus: 'completed',
      manufacturingProcessStatus: 'completed',
      utilityFacilityStatus: 'available'
    },
    { 
      id: '3', 
      name: '인천 물류센터', 
      isSelected: false,
      businessInfoStatus: 'in-progress',
      manufacturingProcessStatus: 'locked',
      utilityFacilityStatus: 'locked'
    },
    { 
      id: '4', 
      name: '', 
      isSelected: false,
      businessInfoStatus: 'available',
      manufacturingProcessStatus: 'locked',
      utilityFacilityStatus: 'locked'
    },
  ]);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [companyInfo] = useState<CompanyInfo>({
    name: '(주)쓰리뷰',
    representative: '김희명',
    registrationNumber: '123-45-67890',
  });
  
  // 기존 사업장 목록이 있는지 확인 (실제로는 API에서 가져올 데이터)
  const [hasExistingBusinessSites] = useState<boolean>(false);
  
  // 작성중 상태 모달 관리
  const [continueWorkModal, setContinueWorkModal] = useState<{
    isOpen: boolean;
    stepName: string;
    siteName?: string;
    onContinue: () => void;
    onNew: () => void;
  }>({
    isOpen: false,
    stepName: '',
    onContinue: () => {},
    onNew: () => {},
  });
  
  // 법인과 사업장 동일 시 상태 관리
  const [companyBusinessSiteStatus, setCompanyBusinessSiteStatus] = useState({
    businessInfoStatus: 'completed' as StepStatus,
    manufacturingProcessStatus: 'in-progress' as StepStatus,
    utilityFacilityStatus: 'locked' as StepStatus,
  });

  useEffect(() => {
    const program = LocalStorage.get('selectedProgram');
    const year = LocalStorage.get('selectedYear');

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
  }, [router]);

  // 실제 환경에서는 API를 통해 기존 사업장 데이터를 확인
  useEffect(() => {
    // 예시: 기존 사업장 데이터가 있는지 확인하는 로직
    // const checkExistingBusinessSites = async () => {
    //   const existingSites = await api.getBusinessSites();
    //   setHasExistingBusinessSites(existingSites.length > 0);
    // };
    // checkExistingBusinessSites();
  }, []);

  const addBusinessSite = () => {
    const newId = (businessSites.length + 1).toString();
    setBusinessSites([
      ...businessSites,
      { 
        id: newId, 
        name: '', 
        isSelected: false,
        businessInfoStatus: 'available',
        manufacturingProcessStatus: 'locked',
        utilityFacilityStatus: 'locked'
      },
    ]);
  };

  const removeBusinessSite = () => {
    if (businessSites.length <= 1) {
      alert('최소 1개 이상의 사업장이 필요합니다.');
      return;
    }

    const selectedIds = businessSites
      .filter((site) => site.isSelected)
      .map((site) => site.id);

    if (selectedIds.length === 0) {
      alert('삭제할 사업장을 선택해주세요.');
      return;
    }

    if (selectedIds.length === businessSites.length) {
      alert(
        '최소 1개 이상의 사업장은 유지되어야 합니다. 삭제할 사업장을 다시 선택해주세요.',
      );
      return;
    }

    if (
      confirm(`선택한 ${selectedIds.length}개의 사업장을 삭제하시겠습니까?`)
    ) {
      const filteredSites = businessSites.filter((site) => !site.isSelected);

      if (filteredSites.length === 0) {
        setBusinessSites([businessSites[0]]);
        setBusinessSites((prevSites) =>
          prevSites.map((site) => ({ ...site, isSelected: false })),
        );
      } else {
        setBusinessSites(filteredSites);
      }

      setSelectedCount(0);
    }
  };

  const toggleSiteSelection = (id: string) => {
    const updatedSites = businessSites.map((site) => {
      if (site.id === id) {
        const newSelected = !site.isSelected;
        return { ...site, isSelected: newSelected };
      }
      return site;
    });

    setBusinessSites(updatedSites);
    const newSelectedCount = updatedSites.filter(
      (site) => site.isSelected,
    ).length;
    setSelectedCount(newSelectedCount);
  };

  const updateBusinessSiteName = (id: string, name: string) => {
    setBusinessSites(
      businessSites.map((site) => (site.id === id ? { ...site, name } : site)),
    );
  };

  const handleSameAsCompanyToggle = (value: boolean) => {
    setIsSameAsCompany(value);
  };

  const handlePrevious = () => {
    router.push('/demo/organization-info');
  };

  const handleCloseModal = () => {
    setContinueWorkModal(prev => ({ ...prev, isOpen: false }));
  };



  // 테스트용 상태 업데이트 함수들
  const handleUpdateSiteStatus = (
    siteId: string, 
    field: keyof Pick<BusinessSite, 'businessInfoStatus' | 'manufacturingProcessStatus' | 'utilityFacilityStatus'>, 
    status: StepStatus
  ) => {
    setBusinessSites(prevSites => 
      prevSites.map(site => 
        site.id === siteId ? { ...site, [field]: status } : site
      )
    );
  };

  const handleUpdateCompanyStatus = (field: string, status: StepStatus) => {
    setCompanyBusinessSiteStatus(prevStatus => ({
      ...prevStatus,
      [field]: status
    }));
  };

  // 각 단계별 클릭 핸들러들
  const handleBusinessInfoClick = (siteId?: string) => {
    const targetId = siteId || '1';
    const site = isSameAsCompany 
      ? { name: companyInfo.name, businessInfoStatus: companyBusinessSiteStatus.businessInfoStatus }
      : businessSites.find((site) => site.id === targetId);

    if (site?.businessInfoStatus === 'in-progress') {
      // 작성중 상태일 때 모달 표시
      setContinueWorkModal({
        isOpen: true,
        stepName: '사업장 정보',
        siteName: site.name,
        onContinue: () => {
          setContinueWorkModal(prev => ({ ...prev, isOpen: false }));
          navigateToBusinessInfo(targetId, site.name, true);
        },
        onNew: () => {
          setContinueWorkModal(prev => ({ ...prev, isOpen: false }));
          navigateToBusinessInfo(targetId, site.name, false);
        },
      });
    } else {
      navigateToBusinessInfo(targetId, site?.name || '', false);
    }
  };

  const navigateToBusinessInfo = (siteId: string, siteName: string, isResume: boolean) => {
    LocalStorage.set('selectedSiteId', siteId);
    LocalStorage.set('selectedSiteName', siteName);
    const resumeParam = isResume ? '&resume=true' : '';
    router.push(`/demo/business-site-info/detail?id=${siteId}${resumeParam}`);
  };

  const handleManufacturingProcessClick = (siteId?: string) => {
    const targetId = siteId || '1';
    const site = isSameAsCompany 
      ? { 
          name: companyInfo.name,
          businessInfoStatus: companyBusinessSiteStatus.businessInfoStatus,
          manufacturingProcessStatus: companyBusinessSiteStatus.manufacturingProcessStatus
        }
      : businessSites.find((site) => site.id === targetId);

    if (site?.businessInfoStatus !== 'completed') {
      alert('사업장 정보 작성을 먼저 완료하세요.');
      return;
    }

    if (site?.manufacturingProcessStatus === 'in-progress') {
      // 작성중 상태일 때 모달 표시
      setContinueWorkModal({
        isOpen: true,
        stepName: '제조공정 데이터',
        siteName: site.name,
        onContinue: () => {
          setContinueWorkModal(prev => ({ ...prev, isOpen: false }));
          router.push(`/demo/manufacturing-process-data?siteId=${targetId}&resume=true`);
        },
        onNew: () => {
          setContinueWorkModal(prev => ({ ...prev, isOpen: false }));
          router.push(`/demo/manufacturing-process-data?siteId=${targetId}`);
        },
      });
    } else {
      router.push(`/demo/manufacturing-process-data?siteId=${targetId}`);
    }
  };

  const handleUtilityFacilityClick = (siteId?: string) => {
    const targetId = siteId || '1';
    const site = isSameAsCompany 
      ? { 
          name: companyInfo.name,
          ...companyBusinessSiteStatus
        }
      : businessSites.find((site) => site.id === targetId);

    if (site?.businessInfoStatus !== 'completed') {
      alert('사업장 정보 작성을 먼저 완료하세요.');
      return;
    }

    if (site?.manufacturingProcessStatus !== 'completed') {
      alert('제조공정 데이터 작성을 먼저 완료하세요.');
      return;
    }

    if (site?.utilityFacilityStatus === 'in-progress') {
      // 작성중 상태일 때 모달 표시
      setContinueWorkModal({
        isOpen: true,
        stepName: '유틸리티시설 데이터',
        siteName: site.name,
        onContinue: () => {
          setContinueWorkModal(prev => ({ ...prev, isOpen: false }));
          router.push(`/demo/utility-facility-data?siteId=${targetId}&resume=true`);
        },
        onNew: () => {
          setContinueWorkModal(prev => ({ ...prev, isOpen: false }));
          router.push(`/demo/utility-facility-data?siteId=${targetId}`);
        },
      });
    } else {
      router.push(`/demo/utility-facility-data?siteId=${targetId}`);
    }
  };



  return (
    <Layout
      selectedProgram={selectedProgram}
      selectedYear={selectedYear}
      activeMenu="site-info"
    >
      <PageHeader selectedProgram={selectedProgram} />
      {/* 테스트용 컨트롤. 데모 환경에서만 보임 */}
      <TestControls
        businessSites={businessSites}
        onUpdateSiteStatus={handleUpdateSiteStatus}
        companyBusinessSiteStatus={companyBusinessSiteStatus}
        onUpdateCompanyStatus={handleUpdateCompanyStatus}
        isSameAsCompany={isSameAsCompany}
      />

      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        {/* 기존 사업장이 없을 때만 "법인과 사업장 동일" 선택 표시 */}
        {!hasExistingBusinessSites && (
          <SameAsCompanySelector
            isSameAsCompany={isSameAsCompany}
            onToggle={handleSameAsCompanyToggle}
          />
        )}

        {isSameAsCompany ? (
          <CompanyBusinessSiteTable
            companyName={companyInfo.name}
            businessInfoStatus={companyBusinessSiteStatus.businessInfoStatus}
            manufacturingProcessStatus={companyBusinessSiteStatus.manufacturingProcessStatus}
            utilityFacilityStatus={companyBusinessSiteStatus.utilityFacilityStatus}
            onBusinessInfoClick={() => handleBusinessInfoClick()}
            onManufacturingProcessClick={() => handleManufacturingProcessClick()}
            onUtilityFacilityClick={() => handleUtilityFacilityClick()}
          />
        ) : (
          <div className="space-y-4">
            <BusinessSiteTableControls
              selectedCount={selectedCount}
              totalSitesCount={businessSites.length}
              onAdd={addBusinessSite}
              onDelete={removeBusinessSite}
            />
            <BusinessSiteTable
              businessSites={businessSites}
              onToggleSelection={toggleSiteSelection}
              onUpdateName={updateBusinessSiteName}
              onBusinessInfoClick={handleBusinessInfoClick}
              onManufacturingProcessClick={handleManufacturingProcessClick}
              onUtilityFacilityClick={handleUtilityFacilityClick}
            />
          </div>
        )}
      </div>

      <NavigationButtons onPrevious={handlePrevious} />

      {/* 작업 방식 선택 모달 */}
      <ContinueWorkModal
        isOpen={continueWorkModal.isOpen}
        onClose={handleCloseModal}
        onNewWork={continueWorkModal.onNew}
        onContinueWork={continueWorkModal.onContinue}
        stepName={continueWorkModal.stepName}
        siteName={continueWorkModal.siteName}
      />
    </Layout>
  );
}
