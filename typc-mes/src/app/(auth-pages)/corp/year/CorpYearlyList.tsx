'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaCalendarAlt, FaPlus, FaSearch } from 'react-icons/fa';
import YearStatusModal from '@/components/YearStatusModal';
import { useMutation } from '@tanstack/react-query';
import {
  CorpYearListItem,
  deleteYearCorp,
  DeleteYearCorpParams,
} from '@/http/endpoints/corpYear';
import { dummyUser } from '@/data/dummy';
import YearCorpCard from './YearCorpCard';
import { route } from '@/constants/route';
import useToastMessage from '@/hooks/useToastMessage';
import { LocalStorage } from '@/utils/storage';
import { AxiosError } from 'axios';
import useCorpYear from '@/hooks/useCorpYear';

// 연도별 데이터 인터페이스
export interface YearData {
  idYearCorp: string;
  year: number;
  corporationName: string;
  siteCount?: number;
  industry: string;
  status?: 'completed' | 'in-progress' | 'not-started';
  lastModified?: string;
}

export default function CorpYearlyList() {
  const router = useRouter();
  const { toast } = useToastMessage();
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedYearForModal] = useState<number | null>(null);
  const [yearStatus] = useState<'completed' | 'in-progress' | 'not-started'>(
    'not-started',
  );

  // 새 연도 등록용 상태
  const [newYear, setNewYear] = useState<string>('');

  // 기간 선택용 상태
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState<number>(currentYear - 20);
  const [endYear, setEndYear] = useState<number>(currentYear);

  const { allCorpYearListResponse, isLoading, isError, refetchCorpYearList } =
    useCorpYear();

  const filteredCorpYearList = useMemo(() => {
    if (!allCorpYearListResponse?.result?.content) {
      return [];
    }
    return allCorpYearListResponse.result.content.filter(
      (item: CorpYearListItem) =>
        item.year >= startYear && item.year <= endYear,
    );
  }, [allCorpYearListResponse, startYear, endYear]);

  const transformedCorpYearData: YearData[] = useMemo(() => {
    return filteredCorpYearList.map((item: CorpYearListItem) => ({
      idYearCorp: item.id,
      year: item.year,
      corporationName: item.name_corp,
      // siteCount: 0,
      industry: item.biz_type,
      // status: 'not-started',
      lastModified: item.created_at,
    }));
  }, [filteredCorpYearList]);

  // 기간 유효성 검사
  const validatePeriod = (start: number, end: number): string | null => {
    if (start > end) {
      return '시작 연도는 종료 연도보다 작거나 같아야 합니다.';
    }
    if (end > currentYear) {
      return `종료 연도는 현재 연도(${currentYear})를 넘을 수 없습니다.`;
    }
    if (start < 1990) {
      return '시작 연도는 1990년 이후여야 합니다.';
    }
    return null;
  };

  // 기간 변경 핸들러
  const handlePeriodChange = (type: 'start' | 'end', value: string) => {
    const year = parseInt(value);
    if (!year) return;

    if (type === 'start') {
      const error = validatePeriod(year, endYear);
      if (error) {
        alert(error);
        return;
      }
      setStartYear(year);
    } else {
      const error = validatePeriod(startYear, year);
      if (error) {
        alert(error);
        return;
      }
      setEndYear(year);
    }
  };

  useEffect(() => {
    const program = LocalStorage.get('selectedProgram');
    if (program) {
      setSelectedProgram(program);
    } else {
      router.push('/');
    }
  }, [router]);

  // 새 연도 등록
  const handleAddNewYear = () => {
    if (!newYear) {
      toast.info('연도를 입력해주세요.');
      return;
    }
    const year = parseInt(newYear);

    // 유효성 검사
    if (!year || year < 1990 || year > currentYear + 1) {
      alert(
        '올바른 연도를 입력해주세요. (1990년 ~ ' + (currentYear + 1) + '년)',
      );
      return;
    }

    // 중복 검사
    if (
      allCorpYearListResponse?.result?.content.some(
        (data) => data.year === year,
      )
    ) {
      alert('이미 등록된 연도입니다.');
      return;
    }

    setNewYear('');

    // 바로 등록 화면으로 이동
    LocalStorage.set('selectedYear', year.toString());
    LocalStorage.set('loadYearData', 'false');
    router.push(route.corp.year.create.path);
  };

  const handleConfirm = (): void => {
    if (selectedYearForModal) {
      LocalStorage.set('selectedYear', selectedYearForModal.toString());
      LocalStorage.set('loadYearData', 'true');
      router.push(route.corp.year.create.path);
    }
    setShowStatusModal(false);
  };

  const handleNewStart = (): void => {
    if (selectedYearForModal) {
      LocalStorage.set('selectedYear', selectedYearForModal.toString());
      LocalStorage.set('loadYearData', 'false');
      router.push(route.corp.year.create.path);
    }
    setShowStatusModal(false);
  };

  const handleEditYear = (yearData: YearData): void => {
    LocalStorage.set('selectedYear', yearData.year.toString());
    LocalStorage.set('loadYearData', 'true');
    router.push(route.corp.year.edit.path(yearData.idYearCorp));
  };

  const deleteCorpYearMutation = useMutation({
    mutationFn: (payload: DeleteYearCorpParams) => deleteYearCorp(payload),
    onSuccess: () => {
      toast.success('선택한 연도의 법인 정보가 삭제되었습니다.');
      refetchCorpYearList();
    },
    onError: (error) => {
      toast.error(
        '연도별 법인 정보 삭제 중 오류가 발생했습니다.',
        error as AxiosError,
      );
    },
  });

  const handleDeleteCorpYear = (yearDataToDelete: YearData) => {
    deleteCorpYearMutation.mutate({
      corp_year_id: yearDataToDelete.idYearCorp,
      deleted_by: dummyUser.id,
    });
  };

  if (isLoading) {
    return (
      <>
        <div className="flex h-full items-center justify-center">
          <p className="text-lg text-gray-500">데이터를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="flex h-full flex-col items-center justify-center">
          <p className="mb-4 text-lg text-red-500">
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
          <p className="text-gray-600">
            잠시 후 다시 시도해주세요. 문제가 지속되면 관리자에게 문의하세요.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-gray-800">연도별 법인 관리</h2>
          <div className="ml-4 flex items-center text-gray-500">
            <span>
              {selectedProgram === 'common' ? '공통기준정보' : selectedProgram}
            </span>
            <span className="mx-2">&gt;</span>
            <span>조직정보</span>
            <span className="mx-2">&gt;</span>
            <span className="font-medium text-blue-600">연도별 법인 관리</span>
          </div>
        </div>
      </div>

      {/* 기간 선택 영역 */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <div className="mb-3 flex items-center">
          <FaSearch className="mr-2 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            기간 선택 조회
          </h3>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              시작연도:
            </label>
            <select
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={startYear}
              onChange={(e) => handlePeriodChange('start', e.target.value)}
            >
              {Array.from(
                { length: currentYear - 1990 + 1 },
                (_, i) => currentYear - i,
              ).map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
          </div>

          <span className="text-gray-500">~</span>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              종료연도:
            </label>
            <select
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={endYear}
              onChange={(e) => handlePeriodChange('end', e.target.value)}
            >
              {Array.from(
                { length: currentYear - 1990 + 1 },
                (_, i) => currentYear - i,
              ).map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 새 연도 등록 영역 */}
      <div className="mb-8 rounded-lg bg-blue-50 p-4">
        <div className="mb-3 flex items-center">
          <FaPlus className="mr-2 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">새 연도 등록</h3>
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex-1">
            <input
              type="number"
              className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="연도 입력 (예: 2023)"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              min="1990"
              max={currentYear + 1}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddNewYear();
                }
              }}
            />
          </div>
          <button
            className="flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            onClick={handleAddNewYear}
          >
            <FaPlus className="mr-1 h-4 w-4" />
            등록
          </button>
        </div>
      </div>

      {/* 전체 연도 영역 */}
      {transformedCorpYearData.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {transformedCorpYearData.map((yearData) => {
              return (
                <YearCorpCard
                  key={yearData.idYearCorp}
                  yearData={yearData}
                  onClickEdit={handleEditYear}
                  onDelete={handleDeleteCorpYear}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 등록된 연도가 없거나 필터링 결과가 없을 때 */}
      {!isLoading && !isError && transformedCorpYearData.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <FaCalendarAlt className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-600">
            선택한 기간에 등록된 연도가 없습니다
          </h3>
          <p className="text-gray-500">
            다른 기간을 선택하거나 새 연도를 등록해주세요.
          </p>
        </div>
      ) : null}

      {/* 모달들 */}
      {selectedYearForModal && (
        <>
          <YearStatusModal
            isOpen={showStatusModal}
            onClose={() => setShowStatusModal(false)}
            onConfirm={handleConfirm}
            onNewStart={
              yearStatus === 'in-progress' ? handleNewStart : undefined
            }
            status={yearStatus}
            year={selectedYearForModal.toString()}
          />
        </>
      )}
    </>
  );
}
