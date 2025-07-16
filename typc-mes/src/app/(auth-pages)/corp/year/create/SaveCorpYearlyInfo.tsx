import React from 'react';
import { FaChevronDown, FaChevronUp, FaTimes, FaSave } from 'react-icons/fa';
import { EmissionProcessItem } from '@/constants/coprYear';
import { UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { CommonCode } from '@/http/endpoints/commonCode';

export type GroupedIndustry = CommonCode & { subItems: CommonCode[] };

// 법인 기본 정보 인터페이스
export type CorpYearlyInfoData = {
  id_corp: string; // 법인 ID
  name_corp: string; // 법인명
  name_ceo: string; // 대표자명
  no_corp: string; // 법인등록번호
  biz_type: string; // 지정업종 코드
  biz_type_name: string; // 지정업종 이름 (UI 표시용)
  proc_ems_types: string[]; // 공정배출 유무
  address: string; // 법인소재지
  phone: string; // 법인 전화번호
  post_code: string; // 우편번호
  desc: string; // 설명
};

interface SaveCorpYearlyInfoProps {
  // React Hook Form related
  register: UseFormRegister<CorpYearlyInfoData>;
  errors: FieldErrors<CorpYearlyInfoData>;
  control: Control<CorpYearlyInfoData>; // Kept for potential future use with Controller
  onSubmitForm: React.FormEventHandler<HTMLFormElement>;

  // Values for display/interaction (controlled by RHF in parent)
  watchedBizTypeName: string;
  watchedProcEmsTypes: string[];

  // UI state and handlers for UI elements not directly part of RHF inputs
  filteredIndustries: GroupedIndustry[];
  showIndustryReference: boolean;
  setShowIndustryReference: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onIndustrySelect: (industry: CommonCode) => void;
  isEmissionExpanded: boolean;
  toggleEmissionExpanded: () => void;
  onToggleEmissionProcess: (processValue: string) => void;
  onRemoveEmissionProcess: (processValue: string) => void;
  emissionProcesses: EmissionProcessItem[];
  isSaved: boolean; // To show "저장됨" badge, controlled by parent
  l1CategoryName: string;
}

export default function SaveCorpYearlyInfo({
  register,
  errors,
  // control, // Not used directly in this iteration but good to have if <Controller> is needed
  onSubmitForm,
  watchedBizTypeName,
  watchedProcEmsTypes,
  filteredIndustries,
  showIndustryReference,
  setShowIndustryReference,
  searchTerm,
  setSearchTerm,
  onIndustrySelect,
  isEmissionExpanded,
  toggleEmissionExpanded,
  onToggleEmissionProcess,
  onRemoveEmissionProcess,
  emissionProcesses,
  isSaved,
  l1CategoryName,
}: SaveCorpYearlyInfoProps) {
  // 선택된 공정배출 프로세스 수 계산
  const selectedEmissionCount = watchedProcEmsTypes.length;

  const getProcessLabel = (value: string) => {
    return emissionProcesses.find((p) => p.value === value)?.label || value;
  };

  return (
    <form
      onSubmit={onSubmitForm}
      className="mb-8 overflow-hidden rounded-lg bg-white shadow"
    >
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <h3 className="font-semibold text-gray-700">기본 정보</h3>
        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="rounded-full bg-green-50 px-2 py-1 text-sm text-green-600">
              저장됨
            </span>
          )}
          <button
            type="submit"
            className={`flex items-center rounded-md px-3 py-1.5 text-sm ${
              isSaved
                ? 'bg-gray-100 text-gray-500'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            disabled={isSaved} // Disable save button if already saved and not dirty
          >
            <FaSave className="mr-1" /> 법인정보 저장
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* 법인명 */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
          <label className="flex items-center font-medium text-gray-700 md:col-span-3">
            <div className="flex items-center">
              <span className="mr-2 text-blue-500">✓</span>
              법인명<span className="ml-1 text-red-500">*</span>
            </div>
          </label>
          <div className="md:col-span-7">
            <input
              type="text"
              className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${errors.name_corp ? 'border-red-500' : 'border-gray-300'}`}
              {...register('name_corp', { required: '법인명을 입력해주세요.' })}
              placeholder="법인명을 입력하세요"
            />
            {errors.name_corp && (
              <p className="mt-1 text-xs text-red-500">
                {errors.name_corp.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2"></div>
        </div>

        {/* 대표자 */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
          <label className="font-medium text-gray-700 md:col-span-3">
            <div className="flex items-center">
              <span className="mr-2 text-blue-500">✓</span>
              대표자<span className="ml-1 text-red-500">*</span>
            </div>
          </label>
          <div className="md:col-span-7">
            <input
              type="text"
              className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${errors.name_ceo ? 'border-red-500' : 'border-gray-300'}`}
              {...register('name_ceo', {
                required: '대표자명을 입력해주세요.',
              })}
              placeholder="대표자명을 입력하세요"
            />
            {errors.name_ceo && (
              <p className="mt-1 text-xs text-red-500">
                {errors.name_ceo.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2"></div>
        </div>

        {/* 법인등록번호 */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
          <label className="font-medium text-gray-700 md:col-span-3">
            <div className="flex items-center">
              <span className="mr-2 text-blue-500">✓</span>
              법인등록번호<span className="ml-1 text-red-500">*</span>
            </div>
          </label>
          <div className="md:col-span-7">
            <input
              type="text"
              className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${errors.no_corp ? 'border-red-500' : 'border-gray-300'}`}
              {...register('no_corp', {
                required: '법인등록번호를 입력해주세요.',
              })}
              placeholder="000000-0000000 형식으로 입력하세요"
            />
            {errors.no_corp && (
              <p className="mt-1 text-xs text-red-500">
                {errors.no_corp.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2"></div>
        </div>

        {/* 지정업종(대표업종) & 대분류 */}
        <div className="grid grid-cols-1 items-start gap-x-4 gap-y-2 md:grid-cols-12">
          <label className="flex items-center pt-2 font-medium text-gray-700 md:col-span-3">
            <div className="flex items-center">
              <span className="mr-2 text-blue-500">✓</span>
              지정업종(대표업종)<span className="ml-1 text-red-500">*</span>
            </div>
          </label>
          <div className="relative md:col-span-4">
            <div
              className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2"
              onClick={() => setShowIndustryReference(!showIndustryReference)}
            >
              <span>{watchedBizTypeName || '업종을 선택하세요'}</span>
              <span className="text-gray-500">
                {showIndustryReference ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {errors.biz_type && (
              <p className="mt-1 text-xs text-red-500">
                {errors.biz_type.message}
              </p>
            )}

            {showIndustryReference && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg">
                <div className="border-b border-gray-200 p-3">
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="업종 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: '40vh' }}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredIndustries.length > 0 ? (
                        filteredIndustries.map((l1) => (
                          <React.Fragment key={l1.detail_code}>
                            <tr className="bg-gray-100">
                              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-800">
                                {l1.code_name}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-600">
                                {l1.detail_code}
                              </td>
                            </tr>
                            {l1.subItems.map((l2) => (
                              <tr
                                key={l2.detail_code}
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => onIndustrySelect(l2)}
                              >
                                <td className="whitespace-nowrap px-4 py-3 pl-8 text-sm text-gray-800">
                                  {l2.code_name}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                  {l2.detail_code}
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className="px-4 py-4 text-center text-sm text-gray-500"
                          >
                            검색 결과가 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <label className="flex items-center pt-2 font-medium text-gray-700 md:col-span-1 md:justify-end">
            대분류
          </label>
          <div className="md:col-span-4">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 focus:outline-none"
              value={l1CategoryName}
              readOnly
            />
          </div>
        </div>

        {/* 우편번호 */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
          <label className="flex items-center font-medium text-gray-700 md:col-span-3">
            <div className="flex items-center">
              <span className="mr-2 text-blue-500">✓</span>
              우편번호<span className="ml-1 text-red-500">*</span>
            </div>
          </label>
          <div className="md:col-span-7">
            <input
              type="text"
              className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${errors.post_code ? 'border-red-500' : 'border-gray-300'}`}
              {...register('post_code', {
                required: '우편번호를 입력해주세요.',
              })}
              placeholder="우편번호를 입력하세요"
            />
            {errors.post_code && (
              <p className="mt-1 text-xs text-red-500">
                {errors.post_code.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2"></div>
        </div>

        {/* 법인소재지 */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
          <label className="flex items-center font-medium text-gray-700 md:col-span-3">
            <div className="flex items-center">
              <span className="mr-2 text-blue-500">✓</span>
              법인소재지<span className="ml-1 text-red-500">*</span>
            </div>
          </label>
          <div className="md:col-span-7">
            <input
              type="text"
              className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              {...register('address', {
                required: '법인소재지를 입력해주세요.',
              })}
              placeholder="본사 주소를 입력하세요"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2"></div>
        </div>

        {/* 법인 전화번호 */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
          <label className="font-medium text-gray-700 md:col-span-3">
            <div className="flex items-center">
              <span className="mr-2 text-blue-500">✓</span>
              법인 전화번호<span className="ml-1 text-red-500">*</span>
            </div>
          </label>
          <div className="md:col-span-7">
            <input
              type="text"
              className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              {...register('phone', {
                required: '법인 전화번호를 입력해주세요.',
                pattern: {
                  value: /^\d{2,3}-\d{3,4}-\d{4}$/,
                  message: '000-0000-0000 형식으로 입력하세요.',
                },
              })}
              placeholder="000-0000-0000 형식으로 입력하세요"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2"></div>
        </div>

        {/* 설명 */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
          <label className="flex items-center pt-2 font-medium text-gray-700 md:col-span-3">
            <div className="flex items-center">
              <span className="mr-2 text-blue-500">✓</span>
              설명
            </div>
          </label>
          <div className="md:col-span-7">
            <textarea
              className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${errors.desc ? 'border-red-500' : 'border-gray-300'}`}
              {...register('desc', {
                maxLength: {
                  value: 255,
                  message: '설명은 255자 이내로 입력해주세요.',
                },
              })}
              placeholder="법인에 대한 설명을 입력하세요"
              rows={3}
              maxLength={255}
            />
            {errors.desc && (
              <p className="mt-1 text-xs text-red-500">{errors.desc.message}</p>
            )}
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
          <div className="md:col-span-7">
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
                  {watchedProcEmsTypes.map(
                    // Use watched value
                    (processValue) => (
                      <div
                        key={processValue}
                        className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                      >
                        <span>{getProcessLabel(processValue)}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveEmissionProcess(processValue)} // Call parent handler
                          className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* 펼쳐진 상태일 때만 모든 옵션 표시 */}
              {isEmissionExpanded && (
                <div className="max-h-60 overflow-y-auto bg-white p-3">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {emissionProcesses.map((processItem) => (
                      <div
                        key={processItem.value}
                        className="flex items-center rounded p-2 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 rounded text-blue-600"
                          id={`process-${processItem.value}`}
                          checked={watchedProcEmsTypes.includes(
                            // Use watched value
                            processItem.value,
                          )}
                          onChange={
                            () => onToggleEmissionProcess(processItem.value) // Call parent handler
                          }
                        />
                        <label
                          htmlFor={`process-${processItem.value}`}
                          className="ml-2 cursor-pointer select-none text-sm"
                        >
                          {processItem.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {errors.proc_ems_types && (
              <p className="mt-1 text-xs text-red-500">
                {errors.proc_ems_types.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
