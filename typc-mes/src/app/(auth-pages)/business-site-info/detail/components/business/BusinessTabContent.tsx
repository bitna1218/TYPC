'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BusinessInfoForm, { BusinessData } from './BusinessInfoForm';
import CBAMCountryInfoForm, { CBAMCountryData } from './CBAMCountryInfoForm';
import BusinessLocationQuestionnaire, {
  BuildingsData,
} from './BusinessLocationQuestionnaire';
import UtilityQuestionnaire, { UtilityData } from './UtilityQuestionnaire';
import DataManageQuestionnaire, {
  DataManagementData,
} from './DataManageQuestionnaire';
import ConfirmationModal from '../common/ConfirmationModal';
import FactorySiteQuestionnaire, {
  FactorySiteData,
} from './FactorySiteQuestionnaire';
import { FaSave } from 'react-icons/fa';

interface BusinessTabContentProps {
  selectedProgram: string;
  siteId?: string;
  onTabChange?: (tabId: string) => void;
}

export default function BusinessTabContent({
  selectedProgram,
  siteId,
  onTabChange,
}: BusinessTabContentProps) {
  const router = useRouter();

  // 비즈니스 데이터 접근 함수 저장
  const [getBusinessData, setGetBusinessData] = useState<
    (() => BusinessData) | null
  >(null);

  // 데이터 관리 방식 데이터 접근 함수 저장
  const [getDataManagementData, setGetDataManagementData] = useState<
    (() => DataManagementData) | null
  >(null);

  // 유틸리티 시설 데이터 접근 함수 저장
  const [getUtilityData, setGetUtilityData] = useState<
    (() => UtilityData) | null
  >(null);

  // 건물 정보 데이터 접근 함수 저장
  const [getBuildingsData, setGetBuildingsData] = useState<
    (() => BuildingsData) | null
  >(null);

  // CBAM 국가 정보 데이터 접근 함수 저장 (조건부)
  const [getCBAMCountryData, setGetCBAMCountryData] = useState<
    (() => CBAMCountryData) | null
  >(null);

  // 공장 부지 설문 데이터 접근 함수 저장 (조건부)
  const [getFactorySiteData, setGetFactorySiteData] = useState<
    (() => FactorySiteData) | null
  >(null);

  // 각 컴포넌트별 저장 상태 관리
  const [businessInfoSaved, setBusinessInfoSaved] = useState<boolean>(false);
  const [cbamCountrySaved, setCbamCountrySaved] = useState<boolean>(false);
  const [factorySiteSaved, setFactorySiteSaved] = useState<boolean>(false);
  const [buildingsSaved, setBuildingsSaved] = useState<boolean>(false);
  const [utilitySaved, setUtilitySaved] = useState<boolean>(false);
  const [dataManagementSaved, setDataManagementSaved] =
    useState<boolean>(false);

  // 모든 컴포넌트가 저장되었는지 확인
  const [allSaved, setAllSaved] = useState<boolean>(false);

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    message: string;
    onConfirm: () => void;
  }>({ message: '', onConfirm: () => {} });

  // 모든 컴포넌트가 저장되었는지 확인
  useEffect(() => {
    const requiredSections = [businessInfoSaved];
    const optionalSections = [
      cbamCountrySaved,
      factorySiteSaved,
      buildingsSaved,
      utilitySaved,
      dataManagementSaved,
    ];

    // 필수 섹션은 모두 저장되어야 함
    const requiredSaved = requiredSections.every((saved) => saved);

    // 선택적 섹션은 적어도 하나 이상 저장되어야 함 (여기서는 예시로 구현, 실제 요구사항에 맞게 수정 필요)
    const optionalSaved = optionalSections.some((saved) => saved);

    setAllSaved(requiredSaved && optionalSaved);
  }, [
    businessInfoSaved,
    cbamCountrySaved,
    factorySiteSaved,
    buildingsSaved,
    utilitySaved,
    dataManagementSaved,
  ]);

  // 비즈니스 폼 데이터 수집 함수 설정
  const handleBusinessDataChange = useCallback((dataFn: () => BusinessData) => {
    setGetBusinessData(() => dataFn);
  }, []);

  // 데이터 관리 방식 데이터 수집 함수 설정
  const handleDataManagementChange = useCallback(
    (dataFn: () => DataManagementData) => {
      setGetDataManagementData(() => dataFn);
    },
    [],
  );

  // 유틸리티 시설 데이터 수집 함수 설정
  const handleUtilityDataChange = useCallback((dataFn: () => UtilityData) => {
    setGetUtilityData(() => dataFn);
  }, []);

  // 건물 정보 데이터 수집 함수 설정
  const handleBuildingsDataChange = useCallback(
    (dataFn: () => BuildingsData) => {
      setGetBuildingsData(() => dataFn);
    },
    [],
  );

  // CBAM 국가 정보 데이터 수집 함수 설정
  const handleCBAMCountryDataChange = useCallback(
    (dataFn: () => CBAMCountryData) => {
      console.log('CBAM 국가 정보 데이터 수집 함수 설정', selectedProgram);
      setGetCBAMCountryData(() => dataFn);
    },
    [selectedProgram],
  );

  // 공장 부지 설문 데이터 수집 함수 설정
  const handleFactorySiteDataChange = useCallback(
    (dataFn: () => FactorySiteData) => {
      setGetFactorySiteData(() => dataFn);
    },
    [],
  );

  // 개별 컴포넌트 저장 함수
  const saveBusinessInfo = () => {
    if (!getBusinessData) {
      alert('사업장 기본 정보가 준비되지 않았습니다.');
      return;
    }

    const businessData = getBusinessData();
    console.log('사업장 기본 정보 저장:', businessData);

    // 여기에 API 호출 로직 추가
    // 예: saveBusinessInfoApi(businessData).then(() => setBusinessInfoSaved(true));

    // 임시: API 호출 성공 가정
    setBusinessInfoSaved(true);
    alert('사업장 기본 정보가 저장되었습니다.');
  };

  const saveCBAMCountry = () => {
    if (!getCBAMCountryData) {
      alert('CBAM 국가 정보가 준비되지 않았습니다.');
      return;
    }

    const cbamCountryData = getCBAMCountryData();
    console.log('CBAM 국가 정보 저장:', cbamCountryData);

    // 여기에 API 호출 로직 추가
    // 예: saveCBAMCountryApi(cbamCountryData).then(() => setCbamCountrySaved(true));

    // 임시: API 호출 성공 가정
    setCbamCountrySaved(true);
    alert('CBAM 국가 정보가 저장되었습니다.');
  };

  const saveFactorySite = () => {
    if (!getFactorySiteData) {
      alert('공장 부지 정보가 준비되지 않았습니다.');
      return;
    }

    const factorySiteData = getFactorySiteData();
    console.log('공장 부지 정보 저장:', factorySiteData);

    // 여기에 API 호출 로직 추가
    // 예: saveFactorySiteApi(factorySiteData).then(() => setFactorySiteSaved(true));

    // 임시: API 호출 성공 가정
    setFactorySiteSaved(true);
    alert('공장 부지 정보가 저장되었습니다.');
  };

  const saveBuildings = () => {
    if (!getBuildingsData) {
      alert('사업장 건물 정보가 준비되지 않았습니다.');
      return;
    }

    const buildingsData = getBuildingsData();
    console.log('사업장 건물 정보 저장:', buildingsData);

    // 여기에 API 호출 로직 추가
    // 예: saveBuildingsApi(buildingsData).then(() => setBuildingsSaved(true));

    // 임시: API 호출 성공 가정
    setBuildingsSaved(true);
    alert('사업장 건물 정보가 저장되었습니다.');
  };

  const saveUtility = () => {
    if (!getUtilityData) {
      alert('유틸리티 시설 정보가 준비되지 않았습니다.');
      return;
    }

    const utilityData = getUtilityData();
    console.log('유틸리티 시설 정보 저장:', utilityData);

    // 여기에 API 호출 로직 추가
    // 예: saveUtilityApi(utilityData).then(() => setUtilitySaved(true));

    // 임시: API 호출 성공 가정
    setUtilitySaved(true);
    alert('유틸리티 시설 정보가 저장되었습니다.');
  };

  const saveDataManagement = () => {
    if (!getDataManagementData) {
      alert('데이터 관리 방식 정보가 준비되지 않았습니다.');
      return;
    }

    const dataManagementData = getDataManagementData();
    console.log('데이터 관리 방식 정보 저장:', dataManagementData);

    // 여기에 API 호출 로직 추가
    // 예: saveDataManagementApi(dataManagementData).then(() => setDataManagementSaved(true));

    // 임시: API 호출 성공 가정
    setDataManagementSaved(true);
    alert('데이터 관리 방식 정보가 저장되었습니다.');
  };

  // 저장 버튼 클릭 핸들러 - 모달 열기
  const handleSaveClick = () => {
    if (allSaved) {
      // 모든 컴포넌트가 저장되었으면 다음 탭으로 이동 확인 모달
      setModalData({
        message: '다음 탭으로 이동하시겠습니까?',
        onConfirm: handleModalNextConfirm,
      });
    } else {
      // 일부만 저장되었거나 저장되지 않았으면 저장 확인 모달
      setModalData({
        message: '저장하시겠습니까?',
        onConfirm: handleModalSaveConfirm,
      });
    }
    setIsModalOpen(true);
  };

  // 모달 취소 핸들러
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // 모달 저장 확인 핸들러
  const handleModalSaveConfirm = () => {
    setIsModalOpen(false);

    // 모든 데이터 수집
    const allData: {
      businessInfo?: BusinessData;
      dataManagement?: DataManagementData;
      utility?: UtilityData;
      buildings?: BuildingsData;
      cbamCountry?: CBAMCountryData;
      factorySite?: FactorySiteData;
    } = {};

    // 비즈니스 데이터 수집
    if (getBusinessData) {
      allData.businessInfo = getBusinessData();
    }

    // 데이터 관리 방식 데이터 수집
    if (getDataManagementData) {
      allData.dataManagement = getDataManagementData();
    }

    // 유틸리티 시설 데이터 수집
    if (getUtilityData) {
      allData.utility = getUtilityData();
    }

    // 건물 정보 데이터 수집
    if (getBuildingsData) {
      allData.buildings = getBuildingsData();
    }

    // CBAM 국가 정보 또는 공장 부지 설문 데이터 수집 (조건부)
    if (getCBAMCountryData) {
      allData.cbamCountry = getCBAMCountryData();
    }

    if (getFactorySiteData) {
      allData.factorySite = getFactorySiteData();
    }

    console.log('저장할 데이터:', allData);

    // 여기서 데이터 저장 API 호출
    // TODO: API 호출 구현

    // 모든 컴포넌트 저장 상태 설정
    setBusinessInfoSaved(true);
    setCbamCountrySaved(true);
    setFactorySiteSaved(true);
    setBuildingsSaved(true);
    setUtilitySaved(true);
    setDataManagementSaved(true);

    alert('사업장 정보가 저장되었습니다.');
  };

  // 모달 다음 확인 핸들러
  const handleModalNextConfirm = () => {
    setIsModalOpen(false);

    // 다음 탭(고객 및 공급업체)으로 이동
    if (onTabChange) {
      onTabChange('customer-supplier');
    }
  };

  // 저장 버튼 렌더링 함수
  const renderSaveButton = (
    label: string,
    onSaveFunction: () => void,
    isSaved: boolean,
  ) => {
    return (
      <div className="flex items-center gap-2">
        {isSaved && (
          <span className="rounded-full bg-green-50 px-2 py-1 text-sm text-green-600">
            저장됨
          </span>
        )}
        <button
          type="button"
          onClick={onSaveFunction}
          className={`flex items-center rounded-md px-3 py-1.5 text-sm ${
            isSaved
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          <FaSave className="mr-1" /> {label} 저장
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 사업장 기본 정보 폼 */}
      <div className="rounded-lg bg-white shadow-md">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-700">1-1. 사업장 기본 정보</h3>
          {renderSaveButton('사업장 정보', saveBusinessInfo, businessInfoSaved)}
        </div>
        <div className="p-4">
          <BusinessInfoForm
            siteId={siteId}
            onDataChange={handleBusinessDataChange}
          />
        </div>
      </div>

      {/* CBAM 관련 컴포넌트들 (CBAM 프로그램 선택 시에만 표시) */}
      <div className="rounded-lg bg-white shadow-md">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-700">1-2. CBAM 국가 정보</h3>
          {renderSaveButton('CBAM 정보', saveCBAMCountry, cbamCountrySaved)}
        </div>
        <div className="p-4">
          <CBAMCountryInfoForm onDataChange={handleCBAMCountryDataChange} />
        </div>
      </div>

      {/* CBAM이 아닌 프로그램일 때만 설문 표시 */}
      <div className="rounded-lg bg-white shadow-md">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-700">1-3. 공장 부지 정보</h3>
          {renderSaveButton(
            '공장 부지 정보',
            saveFactorySite,
            factorySiteSaved,
          )}
        </div>
        <div className="p-4">
          <FactorySiteQuestionnaire
            onDataChange={handleFactorySiteDataChange}
          />
        </div>
      </div>

      {/* 사업장 건물 컴포넌트 */}
      <div className="rounded-lg bg-white shadow-md">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-700">1-4. 사업장 건물 정보</h3>
          {renderSaveButton('건물 정보', saveBuildings, buildingsSaved)}
        </div>
        <div className="p-4">
          <BusinessLocationQuestionnaire
            onDataChange={handleBuildingsDataChange}
          />
        </div>
      </div>

      {/* 유틸리티 시설 및 환경오염물질 처리 시설 조사 */}
      <div className="rounded-lg bg-white shadow-md">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-700">
            1-5. 유틸리티 시설 정보
          </h3>
          {renderSaveButton('유틸리티 정보', saveUtility, utilitySaved)}
        </div>
        <div className="p-4">
          <UtilityQuestionnaire onDataChange={handleUtilityDataChange} />
        </div>
      </div>

      {/* 데이터 관리 방식 */}
      <div className="rounded-lg bg-white shadow-md">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-700">1-6. 데이터 관리 방식</h3>
          {renderSaveButton(
            '관리 방식',
            saveDataManagement,
            dataManagementSaved,
          )}
        </div>
        <div className="p-4">
          <DataManageQuestionnaire onDataChange={handleDataManagementChange} />
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="mt-8 flex flex-col justify-between gap-3 md:flex-row md:gap-0">
        <button
          type="button"
          className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none"
          onClick={() => router.back()}
        >
          취소
        </button>
        <button
          type="button"
          className={`rounded-md px-6 py-2 focus:outline-none ${
            allSaved
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-300 text-gray-500'
          }`}
          onClick={allSaved ? handleSaveClick : undefined}
          disabled={!allSaved}
        >
          {allSaved ? '다음' : '저장'}
        </button>
      </div>

      {/* 확인 모달 */}
      <ConfirmationModal
        isOpen={isModalOpen}
        message={modalData.message}
        onConfirm={modalData.onConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
}
