import { FaChevronDown, FaChevronUp, FaTimes, FaSave } from 'react-icons/fa';
import { IndustryClassification } from '@/app/demo/data/koreanStandardIndustry';
import { RefObject } from 'react';

interface BasicInfoSectionProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  representative: string;
  setRepresentative: (value: string) => void;
  registrationNumber: string;
  setRegistrationNumber: (value: string) => void;
  industry: string;
  industryCategory: string;
  address: string;
  setAddress: (value: string) => void;
  companyPhoneNumber: string;
  setCompanyPhoneNumber: (value: string) => void;
  selectedEmissionProcesses: string[];
  setSelectedEmissionProcesses: (processes: string[]) => void;
  filteredIndustries: IndustryClassification[];
  showIndustryReference: boolean;
  setShowIndustryReference: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleIndustrySelect: (industry: IndustryClassification) => void;
  isEmissionExpanded: boolean;
  toggleEmissionExpanded: () => void;
  toggleEmissionProcess: (process: string) => void;
  removeEmissionProcess: (process: string) => void;
  emissionProcesses: string[];
  emissionSectionRef: RefObject<HTMLDivElement>;
  onSave: () => void;
  isSaved: boolean;
}

export default function BasicInfoSection({
  companyName,
  setCompanyName,
  representative,
  setRepresentative,
  registrationNumber,
  setRegistrationNumber,
  industry,
  industryCategory,
  address,
  setAddress,
  companyPhoneNumber,
  setCompanyPhoneNumber,
  selectedEmissionProcesses,
  filteredIndustries,
  showIndustryReference,
  setShowIndustryReference,
  searchTerm,
  setSearchTerm,
  handleIndustrySelect,
  isEmissionExpanded,
  toggleEmissionExpanded,
  toggleEmissionProcess,
  removeEmissionProcess,
  emissionProcesses,
  emissionSectionRef,
  onSave,
  isSaved,
}: BasicInfoSectionProps) {
  // 선택된 공정배출 프로세스 수 계산
  const selectedEmissionCount = selectedEmissionProcesses.length;

  return (
    <div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <h3 className="font-semibold text-gray-700">기본 정보</h3>
        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="rounded-full bg-green-50 px-2 py-1 text-sm text-green-600">
              저장됨
            </span>
          )}
          <button
            type="button"
            onClick={onSave}
            className={`flex items-center rounded-md px-3 py-1.5 text-sm ${
              isSaved
                ? 'bg-gray-100 text-gray-500'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <FaSave className="mr-1" /> 법인정보 저장
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* 법인명 */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
          <label className="flex items-center font-medium text-gray-700 md:col-span-3">
            <div className="flex items-center">
              <span className="mr-2 text-blue-500">✓</span>
              법인명<span className="ml-1 text-red-500">*</span>
            </div>
          </label>
          <div className="md:col-span-7">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="법인명을 입력하세요"
            />
          </div>
          <div className="md:col-span-2"></div>
        </div>

        {/* 대표자 */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
          <label className="font-medium text-gray-700 md:col-span-3">
            <span className="mr-2 text-blue-500">✓</span>
            대표자
          </label>
          <div className="md:col-span-7">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={representative}
              onChange={(e) => setRepresentative(e.target.value)}
              placeholder="대표자명을 입력하세요"
            />
          </div>
          <div className="md:col-span-2"></div>
        </div>

        {/* 법인등록번호 */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
          <label className="font-medium text-gray-700 md:col-span-3">
            <span className="mr-2 text-blue-500">✓</span>
            법인등록번호
          </label>
          <div className="md:col-span-7">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="000000-0000000 형식으로 입력하세요"
            />
          </div>
          <div className="md:col-span-2"></div>
        </div>

        {/* 지정업종(대표업종) */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
          <label className="flex items-center font-medium text-gray-700 md:col-span-3">
            <div className="flex items-center">
              <span className="mr-2 text-blue-500">✓</span>
              지정업종(대표업종) <span className="ml-1 text-red-500">*</span>
            </div>
          </label>
          <div className="md:col-span-5">
            <div className="relative flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-left focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={industry || '제조업'}
                  readOnly
                />
              </div>
              <button
                type="button"
                className="ml-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                onClick={() => setShowIndustryReference(true)}
              >
                업종조회
              </button>

              {showIndustryReference && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto rounded-lg bg-gray-600 bg-opacity-50 p-4">
                  <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-2 shadow-xl">
                    {/* 모달 헤더 */}
                    <div className="flex items-center justify-between border-b p-4">
                      <h3 className="text-lg font-medium">한국표준산업분류</h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setShowIndustryReference(false)}
                      >
                        <span className="sr-only">닫기</span>
                        <FaTimes />
                      </button>
                    </div>

                    {/* 안내 텍스트와 검색 */}
                    <div className="border-b p-4">
                      <div className="mb-3 text-sm text-green-600">
                        중분류 코드 선택 지정업종 선택 시 자동 표출
                      </div>
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="업종 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* 테이블 헤더 */}
                    <div className="grid grid-cols-2 border-b bg-gray-50 px-4 py-2">
                      <div className="text-center text-sm font-medium text-gray-700">
                        지정업종(대표업종)
                      </div>
                      <div className="text-center text-sm font-medium text-gray-700">
                        구분
                      </div>
                    </div>

                    {/* 테이블 내용 */}
                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: '60vh' }}
                    >
                      {filteredIndustries.map((ind: IndustryClassification) => (
                        <div
                          key={ind.id}
                          className="grid cursor-pointer grid-cols-2 border-b px-4 py-3 hover:bg-gray-50"
                          onClick={() => {
                            handleIndustrySelect(ind);
                            setShowIndustryReference(false);
                          }}
                        >
                          <div className="text-center text-sm text-gray-900">
                            {ind.name} ({ind.code})
                          </div>
                          <div className="text-center text-sm text-gray-900">
                            {ind.category}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 구분 필드 */}
          <div className="flex items-center md:col-span-2">
            <span className="mr-2 font-medium text-gray-700">구분</span>
          </div>
          <div className="md:col-span-2">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-700 focus:outline-none"
              value={industryCategory || '제조업, 건설업'}
              readOnly
            />
          </div>
        </div>

        {/* 법인소재지 */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
          <label className="flex items-center font-medium text-gray-700 md:col-span-3">
            <div className="flex items-center">
              <span className="mr-2 text-blue-500">✓</span>
              법인소재지<span className="ml-1 text-red-500">*</span>
            </div>
          </label>
          <div className="md:col-span-7">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="본사 주소를 입력하세요"
            />
          </div>
          <div className="md:col-span-2"></div>
        </div>

        {/* 법인 전화번호 */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
          <label className="font-medium text-gray-700 md:col-span-3">
            <span className="mr-2 text-blue-500">✓</span>
            법인 전화번호
          </label>
          <div className="md:col-span-7">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={companyPhoneNumber}
              onChange={(e) => setCompanyPhoneNumber(e.target.value)}
              placeholder="000-0000-0000 형식으로 입력하세요"
            />
          </div>
          <div className="md:col-span-2"></div>
        </div>

        {/* 공정배출유무 */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
          <label className="flex items-center pt-2 font-medium text-gray-700 md:col-span-3">
            <div className="flex items-center">
              <span className="mr-2 text-blue-500">✓</span>
              공정배출유무
            </div>
          </label>
          <div className="md:col-span-7" ref={emissionSectionRef}>
            <div className="rounded-md border border-gray-200 bg-yellow-50">
              {/* 헤더 영역 */}
              <div className="flex items-center justify-between border-b border-gray-200 p-3">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={toggleEmissionExpanded}
                    className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    {isEmissionExpanded ? (
                      <FaChevronUp className="mr-2" />
                    ) : (
                      <FaChevronDown className="mr-2" />
                    )}
                    <span>
                      공정 선택{' '}
                      {selectedEmissionCount > 0
                        ? `(${selectedEmissionCount})`
                        : ''}
                    </span>
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  해당하는 공정을 모두 선택하세요
                </div>
              </div>

              {/* 선택된 공정 표시 영역 */}
              {selectedEmissionCount > 0 && (
                <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-white p-3">
                  {selectedEmissionProcesses.map((process, index) => (
                    <div
                      key={`selected-${index}`}
                      className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                    >
                      <span>{process}</span>
                      <button
                        onClick={() => removeEmissionProcess(process)}
                        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 펼쳐진 상태일 때만 모든 옵션 표시 */}
              {isEmissionExpanded && (
                <div className="max-h-60 overflow-y-auto bg-white p-3">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {emissionProcesses.map((process, index) => (
                      <div
                        key={index}
                        className="flex items-center rounded p-2 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 rounded text-blue-600"
                          id={`process-${index}`}
                          checked={selectedEmissionProcesses.includes(process)}
                          onChange={() => toggleEmissionProcess(process)}
                        />
                        <label
                          htmlFor={`process-${index}`}
                          className="ml-2 cursor-pointer select-none text-sm"
                        >
                          {process}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
