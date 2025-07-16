'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaPen,
  FaCalendarAlt,
  FaTrash,
  FaPlus,
  FaBuilding,
  FaIndustry,
  FaCheck,
  FaClock,
  FaExclamationCircle,
  FaSearch,
} from 'react-icons/fa';
import YearStatusModal from '@/app/demo/components/YearStatusModal';
import Layout from '../components/Layout';
import { LocalStorage } from '@/utils/storage';

// 연도별 데이터 인터페이스
interface YearData {
  year: number;
  corporationName: string;
  siteCount: number;
  industry: string;
  status: 'completed' | 'in-progress' | 'not-started';
  lastModified?: string;
}

// 삭제 확인 모달 컴포넌트
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  year: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  year,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative z-10 mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="px-6 py-4">
          <div className="mb-4 flex items-center justify-center text-red-600">
            <div className="rounded-full bg-red-100 p-3">
              <FaExclamationCircle className="h-6 w-6" />
            </div>
          </div>
          <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
            {year}년도 데이터를 삭제하시겠습니까?
          </h3>
          <p className="mb-6 text-center text-gray-600">
            삭제된 데이터는 복구할 수 없습니다.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              취소
            </button>
            <button
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              onClick={onConfirm}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function YearSelection() {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedYearForModal, setSelectedYearForModal] = useState<
    number | null
  >(null);
  const [yearStatus, setYearStatus] = useState<
    'completed' | 'in-progress' | 'not-started'
  >('not-started');

  // 새 연도 등록용 상태
  const [newYear, setNewYear] = useState<string>('');

  // 기간 선택용 상태
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState<number>(currentYear - 2);
  const [endYear, setEndYear] = useState<number>(currentYear);

  // 연도별 데이터 (실제 구현에서는 서버에서 가져옴)
  const [yearDataList, setYearDataList] = useState<YearData[]>([
    {
      year: 2023,
      corporationName: '(주)쓰리뷰',
      siteCount: 1,
      industry: '제조업',
      status: 'completed',
      lastModified: '2024.12.15',
    },
    {
      year: 2024,
      corporationName: '(주)쓰리뷰',
      siteCount: 2,
      industry: '제조업',
      status: 'in-progress',
      lastModified: '2025.01.20',
    },
    {
      year: 2025,
      corporationName: '',
      siteCount: 0,
      industry: '',
      status: 'not-started',
    },
  ]);

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

  // 등록된 연도들을 그룹화 (기간 필터링 적용)
  const getYearGroups = () => {
    const filteredYearData = yearDataList.filter(
      (data) => data.year >= startYear && data.year <= endYear,
    );

    const registeredYears = filteredYearData
      .map((data) => data.year)
      .sort((a, b) => b - a);

    if (registeredYears.length === 0) return [];

    const groups = [];
    const startDecade =
      Math.floor(registeredYears[registeredYears.length - 1] / 10) * 10;
    const endDecade = Math.floor(registeredYears[0] / 10) * 10;

    for (let decade = endDecade; decade >= startDecade; decade -= 10) {
      const yearsInDecade = registeredYears.filter(
        (year) => year >= decade && year < decade + 10,
      );

      if (yearsInDecade.length > 0) {
        groups.push({
          id: `${decade}s`,
          title: `${decade}~${decade + 9}`,
          years: yearsInDecade,
          expanded: true,
        });
      }
    }

    return groups;
  };

  useEffect(() => {
    const program = LocalStorage.get('selectedProgram');
    if (program) {
      setSelectedProgram(program);
    } else {
      router.push('/');
    }
  }, [router]);

  // 연도 데이터 가져오기
  const getYearData = (year: number): YearData => {
    return (
      yearDataList.find((data) => data.year === year) || {
        year,
        corporationName: '',
        siteCount: 0,
        industry: '',
        status: 'not-started',
      }
    );
  };

  // 새 연도 등록
  const handleAddNewYear = () => {
    const year = parseInt(newYear);

    // 유효성 검사
    if (!year || year < 1990 || year > currentYear + 1) {
      alert(
        '올바른 연도를 입력해주세요. (1990년 ~ ' + (currentYear + 1) + '년)',
      );
      return;
    }

    // 중복 검사
    if (yearDataList.some((data) => data.year === year)) {
      alert('이미 등록된 연도입니다.');
      return;
    }

    // 새 연도 추가
    const newYearData: YearData = {
      year,
      corporationName: '',
      siteCount: 0,
      industry: '',
      status: 'not-started',
    };

    setYearDataList((prev) =>
      [...prev, newYearData].sort((a, b) => b.year - a.year),
    );
    setNewYear('');

    // 바로 등록 화면으로 이동
    setSelectedYear(year.toString());
    LocalStorage.set('selectedYear', year.toString());
    LocalStorage.set('loadYearData', 'false');
    router.push('/demo/organization-info');
  };

  // 상태별 색상 및 아이콘
  const getStatusDisplay = (
    status: 'completed' | 'in-progress' | 'not-started',
  ) => {
    switch (status) {
      case 'completed':
        return {
          color: 'text-green-600 bg-green-50',
          icon: <FaCheck className="h-3 w-3" />,
          text: '작성완료',
        };
      case 'in-progress':
        return {
          color: 'text-blue-600 bg-blue-50',
          icon: <FaClock className="h-3 w-3" />,
          text: '작성중',
        };
      case 'not-started':
        return {
          color: 'text-gray-500 bg-gray-50',
          icon: <FaCalendarAlt className="h-3 w-3" />,
          text: '미작성',
        };
    }
  };

  // 연도 등록/수정 처리
  const handleYearAction = (year: number, action: 'register' | 'edit') => {
    const yearData = getYearData(year);

    if (action === 'register' || yearData.status === 'not-started') {
      setSelectedYear(year.toString());
      LocalStorage.set('selectedYear', year.toString());
      LocalStorage.set('loadYearData', 'false');
      router.push('/demo/organization-info');
    } else {
      setSelectedYearForModal(year);
      setYearStatus(yearData.status);
      setShowStatusModal(true);
    }
  };

  // 연도 삭제 처리
  const handleDeleteYear = (year: number) => {
    setSelectedYearForModal(year);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedYearForModal) {
      setYearDataList((prev) =>
        prev.filter((data) => data.year !== selectedYearForModal),
      );
    }
    setShowDeleteModal(false);
    setSelectedYearForModal(null);
  };

  const handleConfirm = (): void => {
    if (selectedYearForModal) {
      setSelectedYear(selectedYearForModal.toString());
      LocalStorage.set('selectedYear', selectedYearForModal.toString());
      LocalStorage.set('loadYearData', 'true');
      router.push('/demo/organization-info');
    }
    setShowStatusModal(false);
  };

  const handleNewStart = (): void => {
    if (selectedYearForModal) {
      setSelectedYear(selectedYearForModal.toString());
      LocalStorage.set('selectedYear', selectedYearForModal.toString());
      LocalStorage.set('loadYearData', 'false');
      router.push('/demo/organization-info');
    }
    setShowStatusModal(false);
  };

  // 연도 카드 컴포넌트
  const YearCard: React.FC<{ yearData: YearData }> = ({ yearData }) => {
    const statusDisplay = getStatusDisplay(yearData.status);
    const isDataExists = yearData.status !== 'not-started';

    return (
      <div className="rounded-lg bg-white p-4 shadow transition-all duration-200 hover:shadow-md">
        {/* 헤더 */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <h4 className="text-xl font-bold text-gray-800">{yearData.year}</h4>
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusDisplay.color}`}
            >
              {statusDisplay.icon}
              <span className="ml-1">{statusDisplay.text}</span>
            </span>
          </div>

          {/* 삭제 버튼 */}
          <button
            className="p-1 text-gray-400 transition-colors hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteYear(yearData.year);
            }}
            title="삭제"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>

        {/* 상세 정보 */}
        {isDataExists ? (
          <div className="mb-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <FaBuilding className="mr-2 h-4 w-4" />
              <span>법인명: {yearData.corporationName}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaIndustry className="mr-2 h-4 w-4" />
              <span>사업장 수: {yearData.siteCount}개</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span>업종: {yearData.industry}</span>
            </div>
            {yearData.lastModified && (
              <p className="mt-2 text-xs text-gray-500">
                최종 수정: {yearData.lastModified}
              </p>
            )}
          </div>
        ) : (
          <div className="mb-4 py-4">
            <p className="text-center text-sm text-gray-400">
              등록된 데이터가 없습니다
            </p>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex space-x-2">
          {isDataExists ? (
            <button
              className="flex flex-1 items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700"
              onClick={() => handleYearAction(yearData.year, 'edit')}
            >
              <FaPen className="mr-1 h-3 w-3" />
              수정
            </button>
          ) : (
            <button
              className="flex flex-1 items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700"
              onClick={() => handleYearAction(yearData.year, 'register')}
            >
              <FaPlus className="mr-1 h-3 w-3" />
              등록
            </button>
          )}
        </div>
      </div>
    );
  };

  // 연도 필터링 (기간 선택에 따라)
  const filterYears = (years: number[]): number[] => {
    return years.filter((year) => year >= startYear && year <= endYear);
  };

  const yearGroups = getYearGroups();
  const filteredYearDataList = yearDataList.filter(
    (data) => data.year >= startYear && data.year <= endYear,
  );

  return (
    <Layout
      selectedProgram={selectedProgram}
      selectedYear={selectedYear}
      activeMenu="year-selection"
    >
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
                (_, i) => 1990 + i,
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
                (_, i) => 1990 + i,
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
            disabled={!newYear}
          >
            <FaPlus className="mr-1 h-4 w-4" />
            등록
          </button>
        </div>
      </div>

      {/* 전체 연도 영역 */}
      {yearGroups.map((group) => {
        const filteredYears = filterYears(group.years);

        return (
          <div key={group.id} className="mb-6">
            {group.expanded && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredYears.map((year) => {
                  const yearData = getYearData(year);
                  return <YearCard key={year} yearData={yearData} />;
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* 등록된 연도가 없거나 필터링 결과가 없을 때 */}
      {yearDataList.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <FaCalendarAlt className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-600">
            등록된 연도가 없습니다
          </h3>
          <p className="text-gray-500">
            위의 새 연도 등록에서 연도를 추가해주세요.
          </p>
        </div>
      ) : filteredYearDataList.length === 0 ? (
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

          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            year={selectedYearForModal.toString()}
          />
        </>
      )}
    </Layout>
  );
}
