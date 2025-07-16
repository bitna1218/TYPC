'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, RefObject } from 'react';
import Layout from '@/app/demo/components/Layout';
import { FaFileImport, FaArrowRight } from 'react-icons/fa';
import {
  IndustryClassification,
  industryClassifications,
} from '@/app/demo/data/koreanStandardIndustry';
import LoadDataModal from '@/app/demo/components/LoadDataModal';
import BasicInfoSection from '@/app/demo/organization-info/BasicInfoSection';
import ContactInfoSection from '@/app/demo/organization-info/ContactInfoSection';
import { loadYearData } from '../services/yearDataService';
import { LocalStorage } from '@/utils/storage';

// 공정배출 리스트 데이터
const emissionProcesses = [
  '시멘트생산',
  '석회생산',
  '탄산염 사용공정',
  '유리생산',
  '마그네슘생산',
  '인산생산 (비료)',
  '석유정제',
  '암모니아생산',
  '질산생산',
  '아프디산생산',
  '카바이드생산',
  '소다회생산 (Na2CO3)',
  '석유화학제품생산',
  '불소화합물(HFC, PFC, SF6)생산',
  '카프로락탐생산',
  '철강(코크스로, 소결로, 석회소성로) 생산',
  '합금철생산',
  '아연생산',
  '납생산',
  '전자산업',
  '연료전지',
];

export default function OrganizationInfo() {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [showIndustryReference, setShowIndustryReference] = useState(false);
  const [isEmissionExpanded, setIsEmissionExpanded] = useState(false);
  const emissionSectionRef = useRef<HTMLDivElement>(null);
  const [isLoadDataModalOpen, setIsLoadDataModalOpen] = useState(false);

  // 저장 상태 관리
  const [isBasicInfoSaved, setIsBasicInfoSaved] = useState(false);
  const [isContactInfoSaved, setIsContactInfoSaved] = useState(false);

  // 담당자 인터페이스
  interface Contact {
    id: string;
    name: string;
    department: string;
    position: string;
    phone: string;
    mobile: string;
    email: string;
    isSaved: boolean;
    isNew?: boolean;
  }

  // 폼 상태
  const [companyName, setCompanyName] = useState('');
  const [representative, setRepresentative] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [industry, setIndustry] = useState('');
  const [industryCategory, setIndustryCategory] = useState('');
  const [selectedEmissionProcesses, setSelectedEmissionProcesses] = useState<
    string[]
  >([]);
  const [address, setAddress] = useState('');
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState('');

  // 담당자 목록 상태
  const [contacts, setContacts] = useState<Contact[]>([]);

  // 검색어
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // 브라우저에서만 실행되도록 합니다
    const program = LocalStorage.get('selectedProgram');
    const year = LocalStorage.get('selectedYear');
    const shouldLoadData = LocalStorage.get('loadYearData');

    if (program) {
      setSelectedProgram(program);
    } else {
      router.push('/');
    }

    if (year) {
      setSelectedYear(year);

      // 데이터 로드 여부에 따라 처리
      if (shouldLoadData === 'true' && year) {
        // 데이터 로드
        const data = loadYearData(parseInt(year));

        // 폼 상태 업데이트
        setCompanyName(data.companyName);
        setRepresentative(data.representative);
        setRegistrationNumber(data.registrationNumber);
        setIndustry(data.industry);
        setIndustryCategory(data.industryCategory);
        setSelectedEmissionProcesses(data.selectedEmissionProcesses);
        setAddress(data.address);
        setCompanyPhoneNumber(data.companyPhoneNumber);

        // 기존 단일 담당자 데이터를 contacts 배열로 마이그레이션
        if (data.name) {
          const primaryContact: Contact = {
            id: 'primary_contact',
            name: data.name,
            department: data.department,
            position: data.position,
            phone: data.phoneNumber,
            mobile: data.mobileNumber,
            email: data.email,
            isSaved: true,
          };
          setContacts([primaryContact]);
        }
      }

      // 로컬 스토리지 플래그 초기화
      localStorage.removeItem('loadYearData');
    } else {
      router.push('/demo/year-selection');
    }
  }, [router]);

  // 법인정보 저장
  const handleSaveBasicInfo = () => {
    // 필수 항목 검증
    if (!companyName.trim()) {
      alert('법인명을 입력해주세요.');
      return;
    }
    if (!industry.trim()) {
      alert('지정업종을 선택해주세요.');
      return;
    }
    if (!address.trim()) {
      alert('법인소재지를 입력해주세요.');
      return;
    }

    // 실제 구현에서는 API 호출
    console.log('법인정보 저장:', {
      companyName,
      representative,
      registrationNumber,
      industry,
      industryCategory,
      address,
      companyPhoneNumber,
      selectedEmissionProcesses,
    });

    setIsBasicInfoSaved(true);
    alert('법인정보가 저장되었습니다.');
  };

  // 연락처정보 저장
  const handleSaveContactInfo = (contactsData: Contact[]) => {
    // 필수 항목 검증
    if (contactsData.length === 0) {
      alert('최소 1명의 담당자를 등록해주세요.');
      return;
    }

    // 실제 구현에서는 API 호출
    console.log('연락처정보 저장:', {
      contacts: contactsData,
    });

    setIsContactInfoSaved(true);
    alert('연락처정보가 저장되었습니다.');
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (!isBasicInfoSaved) {
      alert('법인정보를 먼저 저장해주세요.');
      return;
    }
    if (!isContactInfoSaved) {
      alert('연락처정보를 먼저 저장해주세요.');
      return;
    }
    router.push('/demo/business-site-info');
  };

  // 필터링된 산업분류 목록
  const filteredIndustries = searchTerm
    ? industryClassifications.filter(
        (industry) =>
          industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          industry.code.includes(searchTerm) ||
          industry.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : industryClassifications;

  // 공정배출 프로세스 토글
  const toggleEmissionProcess = (process: string) => {
    if (selectedEmissionProcesses.includes(process)) {
      setSelectedEmissionProcesses(
        selectedEmissionProcesses.filter((p: string) => p !== process),
      );
    } else {
      setSelectedEmissionProcesses([...selectedEmissionProcesses, process]);
    }
    // 데이터 변경 시 저장 상태 초기화
    setIsBasicInfoSaved(false);
  };

  // 산업 선택 핸들러
  const handleIndustrySelect = (ind: IndustryClassification) => {
    setIndustry(ind.name);
    setIndustryCategory(ind.category);
    setShowIndustryReference(false);
    // 데이터 변경 시 저장 상태 초기화
    setIsBasicInfoSaved(false);
  };

  const toggleEmissionExpanded = () => {
    setIsEmissionExpanded(!isEmissionExpanded);
  };

  // 선택된 프로세스 제거
  const removeEmissionProcess = (process: string) => {
    setSelectedEmissionProcesses(
      selectedEmissionProcesses.filter((p: string) => p !== process),
    );
    // 데이터 변경 시 저장 상태 초기화
    setIsBasicInfoSaved(false);
  };

  // 다른 연도 데이터 불러오기 핸들러
  const handleLoadYearData = (year: number) => {
    const data = loadYearData(year);

    // 폼 상태 업데이트
    setCompanyName(data.companyName);
    setRepresentative(data.representative);
    setRegistrationNumber(data.registrationNumber);
    setIndustry(data.industry);
    setIndustryCategory(data.industryCategory);
    setSelectedEmissionProcesses(data.selectedEmissionProcesses);
    setAddress(data.address);
    setCompanyPhoneNumber(data.companyPhoneNumber);

    // 기존 단일 담당자 데이터를 contacts 배열로 마이그레이션
    if (data.name) {
      const primaryContact: Contact = {
        id: 'primary_contact',
        name: data.name,
        department: data.department,
        position: data.position,
        phone: data.phoneNumber,
        mobile: data.mobileNumber,
        email: data.email,
        isSaved: true,
      };
      setContacts([primaryContact]);
    } else {
      setContacts([]);
    }

    // 저장 상태 초기화
    setIsBasicInfoSaved(false);
    setIsContactInfoSaved(false);
  };

  // 데이터가 로드되었는지 확인하는 함수
  const isDataLoaded = () => {
    return (
      companyName !== '' || representative !== '' || registrationNumber !== ''
    );
  };

  // 기본정보 변경 핸들러들 (저장 상태 초기화 포함)
  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value);
    setIsBasicInfoSaved(false);
  };

  const handleRepresentativeChange = (value: string) => {
    setRepresentative(value);
    setIsBasicInfoSaved(false);
  };

  const handleRegistrationNumberChange = (value: string) => {
    setRegistrationNumber(value);
    setIsBasicInfoSaved(false);
  };

  // 기본정보 변경 핸들러들 (저장 상태 초기화 포함) - address, companyPhoneNumber 추가
  const handleAddressChange = (value: string) => {
    setAddress(value);
    setIsBasicInfoSaved(false);
  };

  const handleCompanyPhoneNumberChange = (value: string) => {
    setCompanyPhoneNumber(value);
    setIsBasicInfoSaved(false);
  };

  // 데이터 로드는 이미 첫 번째 useEffect에서 처리되므로 별도 useEffect 불필요

  return (
    <Layout
      selectedProgram={selectedProgram}
      selectedYear={selectedYear}
      activeMenu="organization-info"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">법인</h2>
          <button
            type="button"
            onClick={() => setIsLoadDataModalOpen(true)}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDataLoaded()
                ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
            disabled={isDataLoaded()}
            title={
              isDataLoaded()
                ? '이미 데이터가 로드되었습니다'
                : '다른 연도 데이터 불러오기'
            }
          >
            <FaFileImport
              className={isDataLoaded() ? 'text-gray-400' : 'text-blue-500'}
            />
            <span>불러오기</span>
          </button>
        </div>
        <div className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
          * 표시는 필수 항목
        </div>
      </div>

      {/* 기본 정보 섹션 */}
      <BasicInfoSection
        companyName={companyName}
        setCompanyName={handleCompanyNameChange}
        representative={representative}
        setRepresentative={handleRepresentativeChange}
        registrationNumber={registrationNumber}
        setRegistrationNumber={handleRegistrationNumberChange}
        industry={industry}
        industryCategory={industryCategory}
        address={address}
        setAddress={handleAddressChange}
        companyPhoneNumber={companyPhoneNumber}
        setCompanyPhoneNumber={handleCompanyPhoneNumberChange}
        selectedEmissionProcesses={selectedEmissionProcesses}
        setSelectedEmissionProcesses={setSelectedEmissionProcesses}
        filteredIndustries={filteredIndustries}
        showIndustryReference={showIndustryReference}
        setShowIndustryReference={setShowIndustryReference}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleIndustrySelect={handleIndustrySelect}
        isEmissionExpanded={isEmissionExpanded}
        toggleEmissionExpanded={toggleEmissionExpanded}
        toggleEmissionProcess={toggleEmissionProcess}
        removeEmissionProcess={removeEmissionProcess}
        emissionProcesses={emissionProcesses}
        emissionSectionRef={emissionSectionRef as RefObject<HTMLDivElement>}
        onSave={handleSaveBasicInfo}
        isSaved={isBasicInfoSaved}
      />

      {/* 연락처 정보 섹션 */}
      <ContactInfoSection
        contacts={contacts}
        setContacts={setContacts}
        onSave={handleSaveContactInfo}
        isBasicInfoSaved={isBasicInfoSaved}
        companyName={companyName}
      />

      {/* 데이터 불러오기 모달 */}
      <LoadDataModal
        isOpen={isLoadDataModalOpen}
        onClose={() => setIsLoadDataModalOpen(false)}
        onLoadData={handleLoadYearData}
        currentYear={selectedYear || undefined}
      />

      {/* 버튼 영역 */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => router.push('/demo/year-selection')}
        >
          취소
        </button>
        <button
          type="button"
          className={`flex items-center rounded-md px-6 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isBasicInfoSaved && isContactInfoSaved
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              : 'cursor-not-allowed bg-gray-300 text-gray-500'
          }`}
          onClick={handleNext}
          disabled={!isBasicInfoSaved || !isContactInfoSaved}
        >
          <span>다음</span>
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </Layout>
  );
}
