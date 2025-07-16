import React, { useState, useEffect, useMemo } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaSave,
  FaPlus,
  FaTrash,
  FaFileUpload,
} from 'react-icons/fa';
import Tooltip from '../../components/common/Tooltip';
import WasteProcessorModal from './WasteProcessorModal';
import WasteProcessModal from './WasteProcessModal';

// 인터페이스 정의
export interface WasteItem {
  id: string | number;
  wasteName: string; // (1) 폐기물명
  wasteCategory: '지정' | '일반' | ''; // (2) 폐기물 구분
  treatmentMethod: string; // (3) 처리 방법
  treatmentCompanies: string[]; // (4) 처리 업체
  processNames: string[]; // (5) 공정명
  fileAttachment?: File | null; // (6) 파일 첨부
  isNewlyAdded?: boolean;
}

interface WasteTabContentProps {
  siteId?: string;
  // 폐기물 처리업체 목록 (2-3에서 가져옴)
  allTreatmentCompanies?: string[];
  // 공정 목록 (4-1에서 가져옴)
  allProcesses?: string[];
  // 저장 함수
  onSaveWastes?: (wastes: Omit<WasteItem, 'isNewlyAdded'>[]) => Promise<void>;
  // 폐기물 목록 로드 함수
  fetchWastes?: () => Promise<WasteItem[]>;
}

// 더미 데이터
const DUMMY_TREATMENT_COMPANIES = [
  '(주)환경처리',
  '그린환경산업',
  '클린텍환경',
  '에코리싸이클',
  '한국폐기물처리',
  '대한환경솔루션',
];

const DUMMY_PROCESSES = [
  '조립 공정 A',
  '가공 공정 B',
  '포장 공정 C',
  '검사 공정 D',
  '표면처리 공정',
];

// 처리 방법 옵션
const TREATMENT_METHODS = ['매립', '소각', '재활용'];

// Mock functions
const mockSaveWastes = async (wastes: Omit<WasteItem, 'isNewlyAdded'>[]) => {
  console.log('[Mock] Saving wastes:', wastes);
  alert('폐기물 정보가 (콘솔에) 저장되었습니다.');
};

const mockFetchWastes = async (): Promise<WasteItem[]> => {
  console.log('[Mock] Fetching wastes');
  return [];
};

const WasteTabContent: React.FC<WasteTabContentProps> = ({
  allTreatmentCompanies = DUMMY_TREATMENT_COMPANIES,
  allProcesses = DUMMY_PROCESSES,
  onSaveWastes = mockSaveWastes,
  fetchWastes = mockFetchWastes,
}) => {
  const [sectionCollapsed, setSectionCollapsed] = useState(false);
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 모달 상태
  const [showProcessorModal, setShowProcessorModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState<
    string | number | null
  >(null);

  const guidanceText = `
    폐기물 처리 정보를 등록합니다.
    각 폐기물별로 구분(지정/일반), 처리 방법, 처리 업체, 발생 공정을 지정할 수 있습니다.
    CBAM 프로그램에서는 이 섹션을 사용하지 않습니다.
  `;

  // 데이터 로드
  useEffect(() => {
    setIsLoading(true);
    fetchWastes()
      .then(setWasteItems)
      .catch((error) => {
        console.error('Error fetching wastes:', error);
        setWasteItems([]);
      })
      .finally(() => setIsLoading(false));
  }, [fetchWastes]);

  const handleAddWaste = () => {
    const newWaste: WasteItem = {
      id: Date.now().toString(),
      wasteName: '',
      wasteCategory: '',
      treatmentMethod: '',
      treatmentCompanies: [],
      processNames: [],
      fileAttachment: null,
      isNewlyAdded: true,
    };
    setWasteItems((prev) => [...prev, newWaste]);
  };

  const handleWasteChange = (
    id: string | number,
    field: keyof WasteItem,
    value: string | string[] | File | null
  ) => {
    setWasteItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value, isNewlyAdded: false } : item
      )
    );
  };

  const handleDeleteWaste = (id: string | number) => {
    if (window.confirm('선택한 폐기물 정보를 삭제하시겠습니까?')) {
      setWasteItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSave = async () => {
    // 유효성 검사
    const emptyNames = wasteItems.filter((item) => !item.wasteName.trim());
    if (emptyNames.length > 0) {
      alert('폐기물명은 필수 입력 항목입니다.');
      return;
    }

    const emptyCategories = wasteItems.filter((item) => !item.wasteCategory);
    if (emptyCategories.length > 0) {
      alert('폐기물 구분은 필수 선택 항목입니다.');
      return;
    }

    setIsLoading(true);
    try {
      const wastesToSave = wasteItems.map((item) => ({
        id: String(item.id),
        wasteName: item.wasteName,
        wasteCategory: item.wasteCategory,
        treatmentMethod: item.treatmentMethod,
        treatmentCompanies: item.treatmentCompanies,
        processNames: item.processNames,
        fileAttachment: item.fileAttachment,
      }));
      await onSaveWastes(wastesToSave);
    } catch (error) {
      console.error('Error saving wastes:', error);
      alert(`저장 중 오류가 발생했습니다: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 처리업체 모달 관련
  const handleOpenProcessorModal = (wasteId: string | number) => {
    setCurrentEditingId(wasteId);
    setShowProcessorModal(true);
  };

  const handleSaveProcessors = (selectedCompanies: string[]) => {
    if (currentEditingId) {
      handleWasteChange(
        currentEditingId,
        'treatmentCompanies',
        selectedCompanies
      );
    }
    setShowProcessorModal(false);
    setCurrentEditingId(null);
  };

  // 공정명 모달 관련
  const handleOpenProcessModal = (wasteId: string | number) => {
    setCurrentEditingId(wasteId);
    setShowProcessModal(true);
  };

  const handleSaveProcesses = (selectedProcesses: string[]) => {
    if (currentEditingId) {
      handleWasteChange(currentEditingId, 'processNames', selectedProcesses);
    }
    setShowProcessModal(false);
    setCurrentEditingId(null);
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (id: string | number, file: File | null) => {
    handleWasteChange(id, 'fileAttachment', file);
  };

  // 새로 추가된 항목에 자동 포커스
  useEffect(() => {
    const newItem = wasteItems.find((item) => item.isNewlyAdded);
    if (newItem) {
      const inputElement = document.getElementById(`waste-name-${newItem.id}`);
      inputElement?.focus();
    }
  }, [wasteItems]);

  const currentWasteForModal = useMemo(() => {
    return wasteItems.find((item) => item.id === currentEditingId);
  }, [wasteItems, currentEditingId]);

  // 선택된 항목들을 태그로 표시하는 컴포넌트
  const SelectedItemsDisplay: React.FC<{
    items: string[];
    onRemove?: (item: string) => void;
    onAdd: () => void;
    placeholder: string;
    maxDisplayed?: number;
    colorScheme?: 'blue' | 'green';
  }> = ({
    items,
    onRemove,
    onAdd,
    placeholder,
    maxDisplayed = 3,
    colorScheme = 'blue',
  }) => {
    const displayItems = items.slice(0, maxDisplayed);
    const remainingCount = items.length - maxDisplayed;

    const getColorClasses = () => {
      if (colorScheme === 'green') {
        return {
          tag: 'bg-green-100 text-green-800 border-green-200',
          button: 'text-green-600 hover:text-green-800',
          addButton:
            'text-green-600 hover:text-green-800 border-green-300 hover:bg-green-50',
        };
      }
      return {
        tag: 'bg-blue-100 text-blue-800 border-blue-200',
        button: 'text-blue-600 hover:text-blue-800',
        addButton:
          'text-blue-600 hover:text-blue-800 border-blue-300 hover:bg-blue-50',
      };
    };

    const colors = getColorClasses();

    return (
      <div className='min-h-[2.5rem] flex flex-wrap items-center gap-1 p-2 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500'>
        {items.length === 0 ? (
          <button
            type='button'
            onClick={onAdd}
            className={`flex-1 text-left text-gray-500 text-sm hover:text-gray-700 min-h-[1.5rem] flex items-center`}
          >
            {placeholder}
          </button>
        ) : (
          <>
            {displayItems.map((item) => (
              <span
                key={item}
                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${colors.tag}`}
              >
                <span className='max-w-[100px] truncate' title={item}>
                  {item}
                </span>
                {onRemove && (
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item);
                    }}
                    className={`ml-1 ${colors.button} hover:bg-white rounded-full p-0.5`}
                  >
                    <svg
                      className='w-3 h-3'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                )}
              </span>
            ))}
            {remainingCount > 0 && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${colors.tag}`}
              >
                +{remainingCount}개 더
              </span>
            )}
            <button
              type='button'
              onClick={onAdd}
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-dashed ${colors.addButton} transition-colors`}
            >
              <svg
                className='w-3 h-3 mr-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 4v16m8-8H4'
                />
              </svg>
              추가
            </button>
          </>
        )}
      </div>
    );
  };

  // 개별 항목 제거 핸들러
  const handleRemoveProcessor = (
    wasteId: string | number,
    processor: string
  ) => {
    const currentWaste = wasteItems.find((item) => item.id === wasteId);
    if (currentWaste) {
      const updatedProcessors = currentWaste.treatmentCompanies.filter(
        (p) => p !== processor
      );
      handleWasteChange(wasteId, 'treatmentCompanies', updatedProcessors);
    }
  };

  const handleRemoveProcess = (wasteId: string | number, process: string) => {
    const currentWaste = wasteItems.find((item) => item.id === wasteId);
    if (currentWaste) {
      const updatedProcesses = currentWaste.processNames.filter(
        (p) => p !== process
      );
      handleWasteChange(wasteId, 'processNames', updatedProcesses);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-4 md:p-6 mt-6'>
      {/* 섹션 헤더 */}
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          <h2 className='text-xl font-semibold text-gray-800'>7. 폐기물</h2>
          <Tooltip text={guidanceText} position='right'>
            <FaInfoCircle className='text-gray-400 hover:text-gray-600 cursor-pointer' />
          </Tooltip>
          <button
            type='button'
            onClick={() => setSectionCollapsed(!sectionCollapsed)}
            className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
            aria-label={
              sectionCollapsed ? '폐기물 섹션 펼치기' : '폐기물 섹션 접기'
            }
          >
            {sectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </button>
        </div>
        {!sectionCollapsed && (
          <div className='flex space-x-2'>
            <button
              type='button'
              onClick={handleAddWaste}
              className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-sm flex items-center'
            >
              <FaPlus className='mr-2' /> 폐기물 추가
            </button>
            <button
              type='button'
              onClick={handleSave}
              disabled={isLoading || wasteItems.length === 0}
              className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-sm flex items-center disabled:opacity-50'
            >
              <FaSave className='mr-2' /> 폐기물 저장
            </button>
          </div>
        )}
      </div>

      {!sectionCollapsed && (
        <>
          {/* 데스크톱 테이블 뷰 */}
          <div className='hidden lg:block'>
            <div className='overflow-x-auto'>
              <table className='min-w-full border-collapse border border-gray-300'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th className='border border-gray-300 px-3 py-2 font-medium text-gray-600 text-sm'>
                      (1) 폐기물명 <span className='text-red-500'>*</span>
                    </th>
                    <th className='border border-gray-300 px-3 py-2 font-medium text-gray-600 text-sm'>
                      (2) 폐기물 구분 <span className='text-red-500'>*</span>
                    </th>
                    <th className='border border-gray-300 px-3 py-2 font-medium text-gray-600 text-sm'>
                      (3) 처리 방법
                    </th>
                    <th className='border border-gray-300 px-3 py-2 font-medium text-gray-600 text-sm'>
                      (4) 처리 업체
                    </th>
                    <th className='border border-gray-300 px-3 py-2 font-medium text-gray-600 text-sm'>
                      (5) 공정명
                    </th>
                    <th className='border border-gray-300 px-3 py-2 font-medium text-gray-600 text-sm'>
                      (6) 파일 첨부
                    </th>
                    <th className='border border-gray-300 px-3 py-2 font-medium text-gray-600 text-sm'>
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className='border border-gray-300 px-3 py-8 text-center text-gray-500'
                      >
                        폐기물 목록 로딩 중...
                      </td>
                    </tr>
                  ) : wasteItems.length > 0 ? (
                    wasteItems.map((item) => (
                      <tr key={item.id} className='hover:bg-gray-50'>
                        {/* (1) 폐기물명 */}
                        <td className="border border-gray-300 p-2 min-w-[120px]">
                          <input
                            id={`waste-name-${item.id}`}
                            type='text'
                            value={item.wasteName}
                            onChange={(e) =>
                              handleWasteChange(
                                item.id,
                                'wasteName',
                                e.target.value
                              )
                            }
                            placeholder='폐기물명 입력'
                            className='w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                          />
                        </td>

                        {/* (2) 폐기물 구분 */}
                        <td className="border border-gray-300 p-2 min-w-[120px]">
                          <select
                            value={item.wasteCategory}
                            onChange={(e) =>
                              handleWasteChange(
                                item.id,
                                'wasteCategory',
                                e.target.value as '지정' | '일반' | ''
                              )
                            }
                            className='w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                          >
                            <option value=''>선택</option>
                            <option value='지정'>지정</option>
                            <option value='일반'>일반</option>
                          </select>
                        </td>

                        {/* (3) 처리 방법 */}
                        <td className="border border-gray-300 p-2 min-w-[120px]">
                          <select
                            value={item.treatmentMethod}
                            onChange={(e) =>
                              handleWasteChange(
                                item.id,
                                'treatmentMethod',
                                e.target.value
                              )
                            }
                            className='w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                          >
                            <option value=''>선택</option>
                            {TREATMENT_METHODS.map((method) => (
                              <option key={method} value={method}>
                                {method}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* (4) 처리 업체 */}
                        <td className="border border-gray-300 p-2 min-w-[200px] max-w-[250px]">
                          <SelectedItemsDisplay
                            items={item.treatmentCompanies}
                            onRemove={(processor) =>
                              handleRemoveProcessor(item.id, processor)
                            }
                            onAdd={() => handleOpenProcessorModal(item.id)}
                            placeholder='처리업체 선택'
                            colorScheme='blue'
                          />
                        </td>

                        {/* (5) 공정명 */}
                        <td className="border border-gray-300 p-2 min-w-[200px] max-w-[250px]">
                          <SelectedItemsDisplay
                            items={item.processNames}
                            onRemove={(process) =>
                              handleRemoveProcess(item.id, process)
                            }
                            onAdd={() => handleOpenProcessModal(item.id)}
                            placeholder='공정명 선택'
                            colorScheme='green'
                          />
                        </td>

                        {/* (6) 파일 첨부 */}
                        <td className="border border-gray-300 p-2 min-w-[120px]">
                          <div className='flex items-center space-x-2'>
                            <input
                              type='file'
                              id={`file-${item.id}`}
                              onChange={(e) =>
                                handleFileUpload(
                                  item.id,
                                  e.target.files?.[0] || null
                                )
                              }
                              className='hidden'
                            />
                            <label
                              htmlFor={`file-${item.id}`}
                              className='cursor-pointer flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800'
                            >
                              <FaFileUpload size={14} />
                              <span>
                                {item.fileAttachment ? '변경' : '첨부'}
                              </span>
                            </label>
                            {item.fileAttachment && (
                              <span className='text-xs text-gray-500 truncate max-w-[100px]'>
                                {item.fileAttachment.name}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 작업 */}
                        <td className='border border-gray-300 p-2 text-center'>
                          <button
                            onClick={() => handleDeleteWaste(item.id)}
                            className='text-red-500 hover:text-red-700 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500'
                            aria-label='폐기물 삭제'
                          >
                            <FaTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className='border border-gray-300 px-3 py-8 text-center text-gray-500'
                      >
                        등록된 폐기물이 없습니다. &quot;폐기물 추가&quot; 버튼을
                        클릭하여 추가해주세요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className='lg:hidden'>
            {isLoading ? (
              <p className='text-center py-8 text-gray-500'>
                폐기물 목록 로딩 중...
              </p>
            ) : wasteItems.length > 0 ? (
              <div className='space-y-4'>
                {wasteItems.map((item) => (
                  <div
                    key={item.id}
                    className='border border-gray-300 rounded-lg p-4 bg-white shadow-sm'
                  >
                    <div className='flex justify-between items-start mb-3'>
                      <h4 className='text-sm font-medium text-gray-700'>
                        폐기물 정보
                      </h4>
                      <button
                        onClick={() => handleDeleteWaste(item.id)}
                        className='text-red-500 hover:text-red-700 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500'
                        aria-label='폐기물 삭제'
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <div className='space-y-3'>
                      {/* 폐기물명 */}
                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                          폐기물명 <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type='text'
                          value={item.wasteName}
                          onChange={(e) =>
                            handleWasteChange(
                              item.id,
                              'wasteName',
                              e.target.value
                            )
                          }
                          placeholder='폐기물명 입력'
                          className='w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                      </div>

                      {/* 폐기물 구분 */}
                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                          폐기물 구분 <span className='text-red-500'>*</span>
                        </label>
                        <select
                          value={item.wasteCategory}
                          onChange={(e) =>
                            handleWasteChange(
                              item.id,
                              'wasteCategory',
                              e.target.value as '지정' | '일반' | ''
                            )
                          }
                          className='w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        >
                          <option value=''>선택</option>
                          <option value='지정'>지정</option>
                          <option value='일반'>일반</option>
                        </select>
                      </div>

                      {/* 처리 방법 */}
                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                          처리 방법
                        </label>
                        <select
                          value={item.treatmentMethod}
                          onChange={(e) =>
                            handleWasteChange(
                              item.id,
                              'treatmentMethod',
                              e.target.value
                            )
                          }
                          className='w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        >
                          <option value=''>선택</option>
                          {TREATMENT_METHODS.map((method) => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 처리 업체 */}
                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                          처리 업체
                        </label>
                        <SelectedItemsDisplay
                          items={item.treatmentCompanies}
                          onRemove={(processor) =>
                            handleRemoveProcessor(item.id, processor)
                          }
                          onAdd={() => handleOpenProcessorModal(item.id)}
                          placeholder='처리업체 선택'
                          colorScheme='blue'
                        />
                      </div>

                      {/* 공정명 */}
                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                          공정명
                        </label>
                        <SelectedItemsDisplay
                          items={item.processNames}
                          onRemove={(process) =>
                            handleRemoveProcess(item.id, process)
                          }
                          onAdd={() => handleOpenProcessModal(item.id)}
                          placeholder='공정명 선택'
                          colorScheme='green'
                          maxDisplayed={2} // 모바일에서는 더 적게 표시
                        />
                      </div>

                      {/* 파일 첨부 */}
                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                          파일 첨부
                        </label>
                        <div className='flex items-center space-x-2'>
                          <input
                            type='file'
                            id={`mobile-file-${item.id}`}
                            onChange={(e) =>
                              handleFileUpload(
                                item.id,
                                e.target.files?.[0] || null
                              )
                            }
                            className='hidden'
                          />
                          <label
                            htmlFor={`mobile-file-${item.id}`}
                            className='cursor-pointer flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded px-3 py-2'
                          >
                            <FaFileUpload size={14} />
                            <span>{item.fileAttachment ? '변경' : '첨부'}</span>
                          </label>
                          {item.fileAttachment && (
                            <span className='text-xs text-gray-500 truncate flex-1'>
                              {item.fileAttachment.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <p className='mb-4'>등록된 폐기물이 없습니다.</p>
                <button
                  onClick={handleAddWaste}
                  className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm'
                >
                  첫 번째 폐기물 추가
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* 처리업체 선택 모달 */}
      <WasteProcessorModal
        showModal={showProcessorModal}
        setShowModal={setShowProcessorModal}
        allTreatmentCompanies={allTreatmentCompanies}
        selectedCompanies={currentWasteForModal?.treatmentCompanies || []}
        onSave={handleSaveProcessors}
      />

      {/* 공정명 선택 모달 */}
      <WasteProcessModal
        showModal={showProcessModal}
        setShowModal={setShowProcessModal}
        allProcesses={allProcesses}
        selectedProcesses={currentWasteForModal?.processNames || []}
        onSave={handleSaveProcesses}
      />
    </div>
  );
};

export default WasteTabContent;
