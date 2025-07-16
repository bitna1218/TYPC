'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaPen, FaPlus, FaTrash, FaCheck } from 'react-icons/fa';
import { route } from '@/constants/route';
import { LocalStorage } from '@/utils/storage';

interface BusinessSite {
  id: string;
  name: string;
  isSelected?: boolean;
}

export default function BizSiteList() {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  // 사업장 정보 작성 페이지로 이동
  const goToBusinessSiteDetail = (siteId: string) => {
    // 사업장 정보를 로컬 스토리지에 저장 (Zustand 대신)
    if (isSameAsCompany) {
      // 법인과 사업장이 동일한 경우
      LocalStorage.set('selectedSiteId', siteId);
      LocalStorage.set('selectedSiteName', companyInfo.name);
    } else {
      // 법인과 사업장이 다른 경우
      const site = businessSites.find((site) => site.id === siteId);
      if (site) {
        LocalStorage.set('selectedSiteId', siteId);
        LocalStorage.set('selectedSiteName', site.name);
      }
    }

    // 사업장 ID를 URL 파라미터로 전달
    router.push(`/business-site-info/detail?id=${siteId}`);
  };

  // 법인과 사업장이 동일한지 여부
  const [isSameAsCompany, setIsSameAsCompany] = useState<boolean>(true);

  // 사업장 목록 (법인과 다를 경우)
  const [businessSites, setBusinessSites] = useState<BusinessSite[]>([
    { id: '1', name: '사업장명 작성', isSelected: false },
  ]);

  // 선택된 사업장 수
  const [selectedCount, setSelectedCount] = useState<number>(0);

  // 법인 정보 (이전 화면에서 가져온 정보)
  const [companyInfo] = useState({
    name: '(주)쓰리뷰',
    representative: '김희명',
    registrationNumber: '123-45-67890',
  });

  useEffect(() => {
    // 브라우저에서만 실행되도록 합니다
    const program = LocalStorage.get('selectedProgram');
    const year = LocalStorage.get('selectedYear');

    if (program) {
      setSelectedProgram(program);
    } else {
      router.push('/');
    }

    if (!year) {
      router.push(route.corp.year.path);
    }

    // 실제 구현에서는 이전 페이지에서 저장한 법인 정보를 가져옵니다
    // 예: const savedCompanyInfo = LocalStorage.get('companyInfo');
  }, [router]);

  // 사업장 추가
  const addBusinessSite = () => {
    const newId = (businessSites.length + 1).toString();
    setBusinessSites([
      ...businessSites,
      { id: newId, name: '사업장명 작성', isSelected: false },
    ]);
  };

  // 사업장 삭제
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

    // 모든 사업장이 선택된 경우
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

      // 추가 안전장치: 필터링 후 배열이 비어있는 경우
      if (filteredSites.length === 0) {
        // 첫 번째 사업장은 남기고 나머지만 삭제
        setBusinessSites([businessSites[0]]);
        // 남은 사업장의 선택 상태를 초기화
        setBusinessSites((prevSites) =>
          prevSites.map((site) => ({ ...site, isSelected: false })),
        );
      } else {
        setBusinessSites(filteredSites);
      }

      setSelectedCount(0);
    }
  };

  // 사업장 선택 토글
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

  // 사업장명 변경
  const updateBusinessSiteName = (id: string, name: string) => {
    setBusinessSites(
      businessSites.map((site) => (site.id === id ? { ...site, name } : site)),
    );
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-gray-800">사업장</h2>
          <div className="ml-4 flex items-center text-gray-500">
            <span>
              {selectedProgram === 'common' ? '공통기준정보' : selectedProgram}
            </span>
            <span className="mx-2">&gt;</span>
            <span>사업장 정보</span>
            <span className="mx-2">&gt;</span>
            <span className="font-medium text-blue-600">사업장</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
            * 표시는 필수 항목
          </div>
        </div>
      </div>

      {/* 법인과 사업장 동일 여부 선택 */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center font-medium text-blue-700">
          <span className="text-lg">✓</span>
          <span className="ml-2">법인과 사업장이 동일한가요?</span>

          <div className="ml-6 flex items-center space-x-6">
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600"
                name="sameAsCompany"
                checked={isSameAsCompany}
                onChange={() => setIsSameAsCompany(true)}
              />
              <span className="ml-2">예</span>
            </label>
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600"
                name="sameAsCompany"
                checked={!isSameAsCompany}
                onChange={() => setIsSameAsCompany(false)}
              />
              <span className="ml-2">아니오</span>
            </label>
          </div>
        </div>

        {/* 법인과 사업장이 동일한 경우 */}
        {isSameAsCompany && (
          <div className="overflow-hidden rounded-lg border">
            <div className="grid grid-cols-12 bg-blue-200 px-4 py-3 text-center font-medium">
              <div className="col-span-1">순번</div>
              <div className="col-span-9">
                사업장명<span className="text-red-500">*</span>
              </div>
              <div className="col-span-2">사업장 정보 작성</div>
            </div>

            <div className="grid grid-cols-12 items-center border-t bg-white px-4 py-3 text-center">
              <div className="col-span-1">1</div>
              <div className="col-span-9 px-2">
                <div className="rounded bg-gray-100 px-3 py-2 text-gray-800">
                  {companyInfo.name}
                </div>
              </div>
              <div className="col-span-2 flex justify-center">
                <button
                  className="p-2 text-gray-700 hover:text-blue-700 focus:outline-none"
                  onClick={() => goToBusinessSiteDetail('1')}
                >
                  <FaPen className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 법인과 사업장이 다른 경우 */}
        {!isSameAsCompany && (
          <div className="space-y-4">
            <div className="flex items-center justify-end space-x-2">
              <button
                className="flex items-center rounded bg-blue-100 px-4 py-2 text-blue-800 hover:bg-blue-200"
                onClick={addBusinessSite}
              >
                <FaPlus className="mr-1" /> 추가
              </button>
              <button
                className={`flex items-center rounded px-4 py-2 ${
                  selectedCount > 0 && businessSites.length > 1
                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                    : 'cursor-not-allowed bg-gray-100 text-gray-400'
                }`}
                onClick={
                  selectedCount > 0 && businessSites.length > 1
                    ? removeBusinessSite
                    : undefined
                }
                disabled={selectedCount === 0 || businessSites.length <= 1}
              >
                <FaTrash className="mr-1" /> 삭제
                {selectedCount > 0 ? `(${selectedCount})` : ''}
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border">
              <div className="grid grid-cols-12 bg-blue-200 px-4 py-3 text-center font-medium">
                <div className="col-span-2">순번</div>
                <div className="col-span-8">
                  사업장명<span className="text-red-500">*</span>
                </div>
                <div className="col-span-2">사업장 정보 작성</div>
              </div>

              {businessSites.map((site, index) => (
                <div
                  key={site.id}
                  className={`grid grid-cols-12 items-center border-t bg-white px-4 py-3 text-center ${
                    site.isSelected ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="col-span-2 grid grid-cols-3 items-center">
                    <div className="col-span-1 flex items-center justify-center">
                      {businessSites.length > 1 && (
                        <div
                          className="inline-flex cursor-pointer items-center justify-center"
                          onClick={() => toggleSiteSelection(site.id)}
                        >
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded border ${
                              site.isSelected
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-gray-400 bg-white'
                            }`}
                          >
                            {site.isSelected && (
                              <FaCheck className="text-xs text-white" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">{index + 1}</div>
                  </div>
                  <div className="col-span-8 px-2">
                    <input
                      type="text"
                      className={`w-full px-3 py-2 ${
                        site.isSelected ? 'bg-blue-50' : 'bg-yellow-100'
                      } rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={site.name}
                      onChange={(e) =>
                        updateBusinessSiteName(site.id, e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <button
                      className="p-2 text-gray-700 hover:text-blue-700 focus:outline-none"
                      onClick={() => goToBusinessSiteDetail(site.id)}
                    >
                      <FaPen className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 네비게이션 버튼 */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => router.push(route.corp.year.create.path)}
        >
          이전
        </button>
      </div>
    </>
  );
}
