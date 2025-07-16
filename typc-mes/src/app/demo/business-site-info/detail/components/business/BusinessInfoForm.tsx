'use client';

import { useState, useEffect } from 'react';
import { FaInfoCircle, FaUpload, FaSearch } from 'react-icons/fa';
import ContactSelectionModal from './ContactSelectionModal';
import {
  IndustryClassification,
  industryClassifications,
} from '@/app/demo/data/koreanStandardIndustry';

type EmissionScale = 'A' | 'B' | 'C';

export interface BusinessData {
  siteName: string;
  siteIndustry: string;
  siteCategory: string;
  siteLocation: string;
  phoneNumber: string;
  contactName: string;
  contactDepartment: string;
  contactPosition: string;
  contactPhone: string;
  contactMobile: string;
  contactEmail: string;
  emissionScale: EmissionScale;
  layoutFile: File | null;
}

// 담당자 인터페이스
interface Contact {
  id: string;
  name: string;
  department: string;
  position: string;
  phone: string;
  mobile: string;
  email: string;
}

interface BusinessInfoFormProps {
  siteId?: string;
  onDataChange?: (getDataFn: () => BusinessData) => void;
}

export default function BusinessInfoForm({
  siteId,
  onDataChange,
}: BusinessInfoFormProps) {
  const [siteName, setSiteName] = useState<string>('');
  const [siteIndustry, setSiteIndustry] = useState<string>('');
  const [siteCategory, setSiteCategory] = useState<string>('');
  const [siteLocation, setSiteLocation] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [contactDepartment, setContactDepartment] = useState<string>('');
  const [contactPosition, setContactPosition] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactMobile, setContactMobile] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [emissionScale, setEmissionScale] = useState<EmissionScale>('A');
  const [layoutFile, setLayoutFile] = useState<File | null>(null);
  const [showEmissionInfo, setShowEmissionInfo] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);

  // 업종 선택 관련
  const [showIndustryDropdown, setShowIndustryDropdown] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 데이터 로드 (사이트 ID가 있는 경우)
  useEffect(() => {
    if (siteId) {
      console.log(`사업장 ID: ${siteId} 데이터를 가져옵니다.`);

      // 예시: API 호출 후 데이터 설정
      // fetchSiteData(siteId).then(data => {
      //   setSiteName(data.name);
      //   setSiteIndustry(data.industry);
      //   // ... 다른 필드들
      // });
    }
  }, [siteId]);

  // 필터링된 산업분류 목록
  const filteredIndustries = searchTerm
    ? industryClassifications.filter(
        (industry) =>
          industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          industry.code.includes(searchTerm) ||
          industry.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : industryClassifications;

  // 산업 선택 핸들러
  const handleIndustrySelect = (industry: IndustryClassification) => {
    setSiteIndustry(industry.name);
    setSiteCategory(industry.category);
    setShowIndustryDropdown(false);
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLayoutFile(e.target.files[0]);
    }
  };

  // 담당자 선택 핸들러
  const handleContactSelect = (contact: Contact) => {
    setContactName(contact.name);
    setContactDepartment(contact.department);
    setContactPosition(contact.position);
    setContactPhone(contact.phone);
    setContactMobile(contact.mobile);
    setContactEmail(contact.email);
  };

  // 상위 컴포넌트에 데이터 수집 함수 전달
  useEffect(() => {
    // Moved getBusinessData inside this useEffect
    const getBusinessData = () => {
      return {
        siteName,
        siteIndustry,
        siteCategory,
        siteLocation,
        phoneNumber,
        contactName,
        contactDepartment,
        contactPosition,
        contactPhone,
        contactMobile,
        contactEmail,
        emissionScale,
        layoutFile,
      };
    };

    if (onDataChange) {
      onDataChange(getBusinessData);
    }
  }, [
    siteName,
    siteIndustry,
    siteCategory,
    siteLocation,
    phoneNumber,
    contactName,
    contactDepartment,
    contactPosition,
    contactPhone,
    contactMobile,
    contactEmail,
    emissionScale,
    layoutFile,
    onDataChange,
    // getBusinessData, // Removed from dependencies as it's defined inside
  ]);

  return (
    <div className="p-4 md:p-6">
      {/* 체크리스트 형식의 입력 폼 */}
      <div className="space-y-6 md:space-y-8">
        {/* 사업장 대표 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center text-blue-700 md:col-span-3">
            <span className="mr-2 text-blue-600">✓</span>
            <span>사업장 대표</span>
          </div>
          <div className="md:col-span-9">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-4 py-2 md:w-2/3"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>
        </div>

        {/* 사업장 업종 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center text-blue-700 md:col-span-3">
            <span className="mr-2 text-blue-600">✓</span>
            <span>
              사업장 업종 <span className="text-red-500">*</span>
            </span>
          </div>
          <div className="relative md:col-span-9">
            <div
              className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 px-4 py-2 md:w-2/3"
              onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
            >
              <span>{siteIndustry || '업종 선택'}</span>
              <span className="text-gray-500">▼</span>
            </div>

            {showIndustryDropdown && (
              <div className="absolute z-[100] mt-1 w-full overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg md:w-2/3">
                <div className="border-b border-gray-300 bg-white p-3">
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="업종 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="sticky top-0 z-[101] bg-gray-100">
                      <tr className="border-b border-gray-300">
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-700">
                          업종명
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-700">
                          코드
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredIndustries.length > 0 ? (
                        filteredIndustries.map((ind) => (
                          <tr
                            key={ind.id}
                            className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                            onClick={() => handleIndustrySelect(ind)}
                          >
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {ind.name}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {ind.code}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className="px-4 py-4 text-center text-gray-500"
                          >
                            검색 결과가 없습니다
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 구분 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center text-blue-700 md:col-span-3">
            <span className="mr-2 text-blue-600">✓</span>
            <span>구분</span>
          </div>
          <div className="md:col-span-9">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 md:w-2/3"
              value={siteCategory}
              readOnly
            />
          </div>
        </div>

        {/* 사업장 소재지 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center text-blue-700 md:col-span-3">
            <span className="mr-2 text-blue-600">✓</span>
            <span>
              사업장 소재지 <span className="text-red-500">*</span>
            </span>
          </div>
          <div className="md:col-span-9">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-4 py-2 md:w-2/3"
              value={siteLocation}
              onChange={(e) => setSiteLocation(e.target.value)}
            />
          </div>
        </div>

        {/* 사업장 전화번호 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center text-blue-700 md:col-span-3">
            <span className="mr-2 text-blue-600">✓</span>
            <span>사업장 전화번호</span>
          </div>
          <div className="md:col-span-9">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-4 py-2 md:w-2/3"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="000-0000-0000"
            />
          </div>
        </div>

        {/* 사업장 담당자 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center text-blue-700 md:col-span-3">
            <span className="mr-2 text-blue-600">✓</span>
            <span>
              사업장 담당자 <span className="text-red-500">*</span>
            </span>
          </div>
          <div className="md:col-span-6">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2"
                value={contactName}
                readOnly
                placeholder="담당자 조회를 통해 선택하세요"
              />
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="flex items-center whitespace-nowrap rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
                title="담당자 조회"
              >
                <FaSearch className="mr-1" />
                담당자 조회
              </button>
            </div>
          </div>
        </div>

        {/* 부서 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center pl-0 text-gray-700 md:col-span-3 md:pl-8">
            <span>부서</span>
          </div>
          <div className="md:col-span-6">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2"
              value={contactDepartment}
              readOnly
            />
          </div>
        </div>

        {/* 직급 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center pl-0 text-gray-700 md:col-span-3 md:pl-8">
            <span>직급</span>
          </div>
          <div className="md:col-span-6">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2"
              value={contactPosition}
              readOnly
            />
          </div>
        </div>

        {/* 전화번호 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center pl-0 text-gray-700 md:col-span-3 md:pl-8">
            <span>전화번호</span>
          </div>
          <div className="md:col-span-6">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2"
              value={contactPhone}
              readOnly
              placeholder="000-0000-0000"
            />
          </div>
        </div>

        {/* 휴대폰 번호 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center pl-0 text-gray-700 md:col-span-3 md:pl-8">
            <span>휴대폰 번호</span>
          </div>
          <div className="md:col-span-6">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2"
              value={contactMobile}
              readOnly
              placeholder="000-0000-0000"
            />
          </div>
        </div>

        {/* 이메일 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center pl-0 text-gray-700 md:col-span-3 md:pl-8">
            <span>이메일</span>
          </div>
          <div className="md:col-span-6">
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2"
              value={contactEmail}
              readOnly
            />
          </div>
        </div>

        {/* 배출량 시설규모 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center text-blue-700 md:col-span-3">
            <span className="mr-2 text-blue-600">✓</span>
            <span>배출량 시설규모</span>
          </div>
          <div className="md:col-span-9">
            <div className="flex w-full flex-col md:w-2/3 md:flex-row md:items-center">
              <select
                className="w-full rounded-md border border-gray-300 px-4 py-2"
                value={emissionScale}
                onChange={(e) =>
                  setEmissionScale(e.target.value as EmissionScale)
                }
              >
                <option value="A">A 그룹</option>
                <option value="B">B 그룹</option>
                <option value="C">C 그룹</option>
              </select>
              <div className="relative mt-2 md:ml-2 md:mt-0">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
                  onClick={() => setShowEmissionInfo(!showEmissionInfo)}
                >
                  <FaInfoCircle size={20} />
                </button>
                {showEmissionInfo && (
                  <div className="absolute right-0 z-50 mt-2 w-72 rounded-md border border-gray-300 bg-white p-4 shadow-lg md:w-96">
                    <h4 className="mb-2 text-sm font-semibold">
                      배출량에 따른 시설규모 분류
                    </h4>
                    <table className="min-w-full text-xs">
                      <tbody>
                        <tr className="border-b">
                          <td className="px-2 py-2 font-medium">A 그룹</td>
                          <td className="px-2 py-2">
                            연간 5만 톤 미만의 배출시설
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-2 py-2 font-medium">B 그룹</td>
                          <td className="px-2 py-2">
                            연간 5만 톤 이상, 연간 50만 톤 미만의 배출시설
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 font-medium">C 그룹</td>
                          <td className="px-2 py-2">
                            연간 50만 톤 이상의 배출시설
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 시설배치도 */}
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
          <div className="flex items-center text-blue-700 md:col-span-3">
            <span className="mr-2 text-blue-600">✓</span>
            <span>시설배치도</span>
          </div>
          <div className="md:col-span-9">
            <div className="flex w-full flex-col md:w-2/3">
              <label className="flex w-fit cursor-pointer items-center rounded-md border border-blue-300 bg-blue-50 px-4 py-2 text-blue-700 hover:bg-blue-100">
                <FaUpload className="mr-2" />
                <span>파일 선택</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>

              {layoutFile ? (
                <div className="mt-2 flex items-center">
                  <span className="mr-2 max-w-xs break-all text-sm text-gray-700">
                    {layoutFile.name}
                  </span>
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => setLayoutFile(null)}
                  >
                    삭제
                  </button>
                </div>
              ) : (
                <span className="mt-1 text-sm text-gray-500">
                  선택된 파일 없음
                </span>
              )}

              <p className="mt-1 text-sm text-gray-500">
                PDF, JPG, JPEG, PNG 파일 (최대 10MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 담당자 선택 모달 */}
      <ContactSelectionModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSelectContact={handleContactSelect}
        corporationName={siteName || '사업장'}
      />
    </div>
  );
}
