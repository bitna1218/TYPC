import React, { useState, useEffect, useMemo, JSX } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaSave,
  FaExclamationTriangle,
  FaLightbulb,
} from 'react-icons/fa';
import Tooltip from '../../components/common/Tooltip';
import { ProductItem } from '../products/ProductTabcontent';
import { ProductGroupItem } from '../products/product-groups/ProductGroupSection';
import UnitProcessDeskTopView from './UnitProcessDeskTopView';
import UnitProcessMobileView from './UnitProcessMobileView';

// --- Interfaces ---
export interface SubProcessInfo {
  id: string;
  name: string;
}

export interface ProcessWithSubProcesses {
  id: string;
  processName: string;
  processClassification: '제조' | '유틸리티' | '환경오염물질 처리' | '';
  subProcesses: SubProcessInfo[];
}

export interface UnitProcessDefinition {
  id: string | number;
  name: string;
  subProcessIds: string[];
  order: number; // 단위공정 순서
  isNewlyAdded?: boolean;
  isRecommended?: boolean; // 추천으로 생성된 항목 식별
}

export interface ProductProcessMapContextItem {
  id: string;
  name: string;
  type: 'product' | 'productGroup';
  orders: Record<string, number>;
}

// 검증 결과 타입
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface UnitProcessTabContentProps {
  siteId?: string;
  allManufacturingProcesses?: ProcessWithSubProcesses[];
  allProducts?: ProductItem[];
  allProductGroups?: ProductGroupItem[];
  fetchProductProcessMaps?: (mainProcessId: string) => Promise<
    {
      mappableItemId: string;
      mappableItemType: 'product' | 'productGroup';
      subProcessOrders: { subProcessId: string; order: number }[];
    }[]
  >;
  onSaveUnitProcesses?: (
    mainProcessId: string,
    definitions: Omit<UnitProcessDefinition, 'isNewlyAdded' | 'isRecommended'>[]
  ) => Promise<void>;
  fetchUnitProcessDefinitions?: (
    mainProcessId: string
  ) => Promise<UnitProcessDefinition[]>;
}

// 더미 데이터
const DUMMY_MFG_PROCESSES: ProcessWithSubProcesses[] = [
  {
    id: 'proc1',
    processName: '조립 공정 A (더미)',
    processClassification: '제조',
    subProcesses: [
      { id: 'sub_A1', name: '부품 검사' },
      { id: 'sub_A2', name: '기본 골격 조립' },
      { id: 'sub_A3', name: '최종 검수' },
      { id: 'sub_A4', name: '포장' },
    ],
  },
  {
    id: 'proc2',
    processName: '가공 공정 B (더미)',
    processClassification: '제조',
    subProcesses: [
      { id: 'sub_B1', name: '원자재 절단' },
      { id: 'sub_B2', name: 'CNC 가공' },
      { id: 'sub_B3', name: '표면 처리' },
    ],
  },
];

const DUMMY_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    classification: '제품',
    productName: '제품 X (조립A)',
    modelName: 'ModelX',
    salesUnit: 'EA',
    weightPerUnit: '10',
    cnHsCode: '760611',
    processName: '조립 공정 A (더미)',
    customerNames: [],
    itemCbam: '알루미늄 판',
    itemGroupCbam: '압연 알루미늄',
    unitProcessName: '조립라인 #1',
  },
  {
    id: 2,
    classification: '제품',
    productName: '제품 Y (조립A)',
    modelName: 'ModelY',
    salesUnit: 'EA',
    weightPerUnit: '20',
    cnHsCode: '760611',
    processName: '조립 공정 A (더미)',
    customerNames: [],
    itemCbam: '알루미늄 판',
    itemGroupCbam: '압연 알루미늄',
    unitProcessName: '조립라인 #1',
  },
  {
    id: 3,
    classification: '제품',
    productName: '제품 Z (가공B)',
    modelName: 'ModelZ',
    salesUnit: 'EA',
    weightPerUnit: '30',
    cnHsCode: '720851',
    processName: '가공 공정 B (더미)',
    customerNames: [],
    itemCbam: '후판',
    itemGroupCbam: '탄소강',
    unitProcessName: 'CNC머신 #3',
  },
];

const DUMMY_PRODUCT_GROUPS: ProductGroupItem[] = [
  {
    id: 'group1',
    groupName: '제품군 Alpha (조립A)',
    productIds: ['1', '2'],
    processName: '조립 공정 A (더미)',
  },
];

// 자동 추천 로직 (개선된 버전)
const generateRecommendedUnitProcesses = (
  availableSubProcesses: SubProcessInfo[],
  contextTableItems: ProductProcessMapContextItem[]
): UnitProcessDefinition[] => {
  if (availableSubProcesses.length === 0) return [];

  // 각 세부공정이 어떤 제품/제품군에서 사용되는지 분석
  const subProcessUsage = new Map<string, Set<string>>();

  contextTableItems.forEach((item) => {
    Object.keys(item.orders).forEach((subProcessId) => {
      if (!subProcessUsage.has(subProcessId)) {
        subProcessUsage.set(subProcessId, new Set());
      }
      subProcessUsage.get(subProcessId)!.add(item.id);
    });
  });

  // 동일한 제품/제품군 조합을 가진 세부공정들을 그룹화
  const groupedSubProcesses: string[][] = [];
  const processed = new Set<string>();

  availableSubProcesses.forEach((sp) => {
    if (processed.has(sp.id)) return;

    const currentGroup = [sp.id];
    const currentUsage = subProcessUsage.get(sp.id) || new Set();

    // 같은 제품/제품군 조합을 가진 다른 세부공정 찾기
    availableSubProcesses.forEach((otherSp) => {
      if (otherSp.id !== sp.id && !processed.has(otherSp.id)) {
        const otherUsage = subProcessUsage.get(otherSp.id) || new Set();
        if (setsEqual(currentUsage, otherUsage) && currentUsage.size > 0) {
          currentGroup.push(otherSp.id);
        }
      }
    });

    currentGroup.forEach((id) => processed.add(id));
    groupedSubProcesses.push(currentGroup);
  });

  // 그룹별로 단위공정 생성
  return groupedSubProcesses.map((group, index) => {
    const groupNames = group
      .map((id) => availableSubProcesses.find((sp) => sp.id === id)?.name || '')
      .filter(Boolean);

    return {
      id: `recommended_${Date.now()}_${index}`,
      name:
        group.length === 1
          ? `${groupNames[0]} (단위)`
          : `통합공정 ${index + 1} (${groupNames.join(', ')})`,
      subProcessIds: group,
      order: index + 1, // 순서 추가
      isRecommended: true,
    };
  });
};

// Set 비교 유틸리티
function setsEqual<T>(set1: Set<T>, set2: Set<T>): boolean {
  return set1.size === set2.size && [...set1].every((x) => set2.has(x));
}

// 검증 함수 (강화된 버전)
const validateUnitProcesses = (
  definitions: UnitProcessDefinition[],
  availableSubProcesses: SubProcessInfo[]
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. 기본 검증
  const names = definitions.map((d) => d.name.trim());
  if (names.some((name) => name === '')) {
    errors.push('단위공정 이름은 비워둘 수 없습니다.');
  }

  const uniqueNames = new Set(names);
  if (names.length !== uniqueNames.size) {
    errors.push('단위공정 이름은 중복될 수 없습니다.');
  }

  // 2. 세부공정 중복 할당 검증
  const allSubProcessIds = new Set<string>();
  const duplicateSubProcesses: string[] = [];

  definitions.forEach((def) => {
    def.subProcessIds.forEach((id) => {
      if (allSubProcessIds.has(id)) {
        const subProcess = availableSubProcesses.find((sp) => sp.id === id);
        if (subProcess && !duplicateSubProcesses.includes(subProcess.name)) {
          duplicateSubProcesses.push(subProcess.name);
        }
      }
      allSubProcessIds.add(id);
    });
  });

  if (duplicateSubProcesses.length > 0) {
    errors.push(
      `다음 세부공정이 여러 단위공정에 중복 할당되었습니다: ${duplicateSubProcesses.join(
        ', '
      )}`
    );
  }

  // 3. 할당되지 않은 세부공정 확인
  const unassignedSubProcesses = availableSubProcesses.filter(
    (sp) => !allSubProcessIds.has(sp.id)
  );
  if (unassignedSubProcesses.length > 0) {
    warnings.push(
      `할당되지 않은 세부공정: ${unassignedSubProcesses
        .map((sp) => sp.name)
        .join(', ')}`
    );
  }

  // 4. 빈 단위공정 확인
  const emptyUnitProcesses = definitions.filter(
    (def) => def.subProcessIds.length === 0
  );
  if (emptyUnitProcesses.length > 0) {
    warnings.push(
      `세부공정이 할당되지 않은 단위공정: ${emptyUnitProcesses
        .map((def) => def.name)
        .join(', ')}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Mock functions
const mockFetchProductProcessMaps = async (mainProcessId: string) => {
  console.log(`[Mock] Fetching 5-3 maps for mainProcessId: ${mainProcessId}`);
  if (mainProcessId === 'proc1') {
    return [
      {
        mappableItemId: '1',
        mappableItemType: 'product' as const,
        subProcessOrders: [
          { subProcessId: 'sub_A1', order: 1 },
          { subProcessId: 'sub_A2', order: 2 },
          { subProcessId: 'sub_A3', order: 3 },
        ],
      },
      {
        mappableItemId: '2',
        mappableItemType: 'product' as const,
        subProcessOrders: [
          { subProcessId: 'sub_A1', order: 1 },
          { subProcessId: 'sub_A3', order: 2 },
          { subProcessId: 'sub_A4', order: 3 },
        ],
      },
      {
        mappableItemId: 'group1',
        mappableItemType: 'productGroup' as const,
        subProcessOrders: [
          { subProcessId: 'sub_A1', order: 1 },
          { subProcessId: 'sub_A2', order: 2 },
          { subProcessId: 'sub_A3', order: 3 },
          { subProcessId: 'sub_A4', order: 4 },
        ],
      },
    ];
  }
  return [];
};

const mockFetchUnitProcessDefinitions = async (
  mainProcessId: string
): Promise<UnitProcessDefinition[]> => {
  console.log(
    `[Mock] Fetching unit process definitions for mainProcessId: ${mainProcessId}`
  );
  return [];
};

const mockSaveUnitProcesses = async (
  mainProcessId: string,
  definitions: Omit<UnitProcessDefinition, 'isNewlyAdded' | 'isRecommended'>[]
) => {
  console.log(
    `[Mock] Saving unit processes for mainProcessId: ${mainProcessId}`,
    definitions
  );
  alert('단위공정 정보가 (콘솔에) 저장되었습니다.');
};

const UnitProcessTabContent: React.FC<UnitProcessTabContentProps> = ({
  allManufacturingProcesses = DUMMY_MFG_PROCESSES,
  allProducts = DUMMY_PRODUCTS,
  allProductGroups = DUMMY_PRODUCT_GROUPS,
  fetchProductProcessMaps = mockFetchProductProcessMaps,
  onSaveUnitProcesses = mockSaveUnitProcesses,
  fetchUnitProcessDefinitions = mockFetchUnitProcessDefinitions,
}): JSX.Element => {
  const [sectionCollapsed, setSectionCollapsed] = useState(false);
  const [selectedMainProcessId, setSelectedMainProcessId] =
    useState<string>('');
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  });

  const selectedMainProcess = useMemo(() => {
    return allManufacturingProcesses.find(
      (p) => p.id === selectedMainProcessId
    );
  }, [selectedMainProcessId, allManufacturingProcesses]);

  const availableSubProcesses = useMemo(() => {
    return selectedMainProcess?.subProcesses || [];
  }, [selectedMainProcess]);

  const [contextTableItems, setContextTableItems] = useState<
    ProductProcessMapContextItem[]
  >([]);
  const [isLoadingContextTable, setIsLoadingContextTable] = useState(false);
  const [unitProcessDefinitions, setUnitProcessDefinitions] = useState<
    UnitProcessDefinition[]
  >([]);
  const [isLoadingDefinitions, setIsLoadingDefinitions] = useState(false);

  const guidanceText = `
    선택한 '공정명'에 연결된 '제품/제품군'들이 어떤 '세부공정'을 순서대로 거치는지 위 테이블에서 확인합니다.\n
    이를 바탕으로 아래 영역에서 하나 이상의 '세부공정'을 묶어 하나의 '단위공정'으로 정의합니다.\n
    기본적으로 각 '세부공정'이 추천 단위공정으로 제시되며, 사용자가 수정, 추가, 삭제할 수 있습니다.\n
    정의된 '단위공정'의 이름은 '5-1. 제품 목록'의 (10) 단위공정명 필드에 사용됩니다.
  `;

  // 검증 실행
  useEffect(() => {
    const result = validateUnitProcesses(
      unitProcessDefinitions,
      availableSubProcesses
    );
    setValidationResult(result);
  }, [unitProcessDefinitions, availableSubProcesses]);

  // Effect 1: Manages contextTableItems
  useEffect(() => {
    if (selectedMainProcessId && selectedMainProcess) {
      setIsLoadingContextTable(true);
      fetchProductProcessMaps(selectedMainProcessId)
        .then((maps) => {
          const items: ProductProcessMapContextItem[] = [];
          const currentProcessName = selectedMainProcess.processName;

          allProducts
            .filter((p) => p.processName === currentProcessName)
            .forEach((p) => {
              const pMap = maps.find(
                (m) =>
                  m.mappableItemId === String(p.id) &&
                  m.mappableItemType === 'product'
              );
              items.push({
                id: String(p.id),
                name: p.productName,
                type: 'product',
                orders:
                  pMap?.subProcessOrders.reduce(
                    (acc, cur) => ({ ...acc, [cur.subProcessId]: cur.order }),
                    {}
                  ) || {},
              });
            });

          allProductGroups
            .filter((pg) => pg.processName === currentProcessName)
            .forEach((pg) => {
              const pgMap = maps.find(
                (m) =>
                  m.mappableItemId === pg.id &&
                  m.mappableItemType === 'productGroup'
              );
              items.push({
                id: pg.id,
                name: pg.groupName,
                type: 'productGroup',
                orders:
                  pgMap?.subProcessOrders.reduce(
                    (acc, cur) => ({ ...acc, [cur.subProcessId]: cur.order }),
                    {}
                  ) || {},
              });
            });
          setContextTableItems(items);
        })
        .catch((error) => {
          console.error('Error fetching product process maps:', error);
          setContextTableItems([]);
        })
        .finally(() => setIsLoadingContextTable(false));
    } else {
      setContextTableItems([]);
    }
  }, [
    selectedMainProcessId,
    selectedMainProcess,
    allProducts,
    allProductGroups,
    fetchProductProcessMaps,
  ]);

  // Effect 2: Manages unitProcessDefinitions
  useEffect(() => {
    if (selectedMainProcessId && selectedMainProcess) {
      setIsLoadingDefinitions(true);
      fetchUnitProcessDefinitions(selectedMainProcessId)
        .then((savedDefinitions) => {
          if (savedDefinitions && savedDefinitions.length > 0) {
            setUnitProcessDefinitions(
              savedDefinitions.map((def, index) => ({
                ...def,
                id: def.id || Date.now().toString() + Math.random().toString(),
                order: def.order || index + 1, // order가 없으면 순서대로 부여
              }))
            );
          } else {
            const recommendedDefinitions = generateRecommendedUnitProcesses(
              availableSubProcesses,
              contextTableItems
            );
            setUnitProcessDefinitions(recommendedDefinitions);
          }
        })
        .catch((error) => {
          console.error('Error fetching unit process definitions:', error);
          const recommendedDefinitions = generateRecommendedUnitProcesses(
            availableSubProcesses,
            contextTableItems
          );
          setUnitProcessDefinitions(recommendedDefinitions);
        })
        .finally(() => setIsLoadingDefinitions(false));
    } else {
      setUnitProcessDefinitions([]);
    }
  }, [
    selectedMainProcessId,
    selectedMainProcess,
    fetchUnitProcessDefinitions,
    availableSubProcesses,
    contextTableItems,
  ]);

  const handleAddUnitProcess = () => {
    if (!selectedMainProcessId) {
      alert('먼저 공정명을 선택해주세요.');
      return;
    }
    setUnitProcessDefinitions((prev) => [
      ...prev,
      {
        id: Date.now().toString() + prev.length.toString(),
        name: `새 단위공정 ${prev.length + 1}`,
        subProcessIds: [],
        order: prev.length + 1, // 가장 마지막 순서로 추가
        isNewlyAdded: true,
      },
    ]);
  };

  const handleUnitProcessChange = (
    id: string | number,
    field: keyof UnitProcessDefinition,
    value: string | string[]
  ) => {
    setUnitProcessDefinitions((prev) =>
      prev.map((def) =>
        def.id === id
          ? {
              ...def,
              [field]: value,
              isNewlyAdded: false,
              isRecommended: false,
            }
          : def
      )
    );
  };

  const handleSubProcessToggle = (
    unitProcessDefId: string | number,
    subProcessId: string
  ) => {
    setUnitProcessDefinitions((prev) =>
      prev.map((def) => {
        if (def.id === unitProcessDefId) {
          const newSubProcessIds = def.subProcessIds.includes(subProcessId)
            ? def.subProcessIds.filter((id) => id !== subProcessId)
            : [...def.subProcessIds, subProcessId];
          return {
            ...def,
            subProcessIds: newSubProcessIds,
            isNewlyAdded: false,
            isRecommended: false,
          };
        }
        return def;
      })
    );
  };

  const handleDeleteUnitProcess = (id: string | number) => {
    if (window.confirm('선택한 단위공정을 삭제하시겠습니까?')) {
      setUnitProcessDefinitions((prev) => prev.filter((def) => def.id !== id));
    }
  };

  const handleResetToRecommended = () => {
    if (
      window.confirm(
        '추천 단위공정으로 초기화하시겠습니까? 현재 설정이 모두 삭제됩니다.'
      )
    ) {
      const recommendedDefinitions = generateRecommendedUnitProcesses(
        availableSubProcesses,
        contextTableItems
      );
      setUnitProcessDefinitions(recommendedDefinitions);
    }
  };

  // 드래그앤드롭으로 순서 변경 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setUnitProcessDefinitions((items) => {
        const sortedItems = [...items].sort((a, b) => a.order - b.order);
        const oldIndex = sortedItems.findIndex((item) => item.id === active.id);
        const newIndex = sortedItems.findIndex((item) => item.id === over.id);

        // 배열 순서 변경
        const reorderedItems = [...sortedItems];
        const [movedItem] = reorderedItems.splice(oldIndex, 1);
        reorderedItems.splice(newIndex, 0, movedItem);

        // order 값 재할당
        return reorderedItems.map((item, index) => ({
          ...item,
          order: index + 1,
          isNewlyAdded: false,
          isRecommended: false,
        }));
      });
    }
  };

  const handleSave = async () => {
    if (!selectedMainProcessId) {
      alert('먼저 공정명을 선택해주세요.');
      return;
    }

    const validation = validateUnitProcesses(
      unitProcessDefinitions,
      availableSubProcesses
    );

    if (!validation.isValid) {
      alert(`저장할 수 없습니다:\n${validation.errors.join('\n')}`);
      return;
    }

    if (validation.warnings.length > 0) {
      if (
        !window.confirm(
          `다음 경고사항이 있습니다:\n${validation.warnings.join(
            '\n'
          )}\n\n그대로 저장하시겠습니까?`
        )
      ) {
        return;
      }
    }

    setIsLoadingDefinitions(true);
    try {
      const definitionsToSave = unitProcessDefinitions
        .sort((a, b) => a.order - b.order) // 순서대로 정렬하여 저장
        .map((def) => ({
          id: String(def.id),
          name: def.name,
          subProcessIds: def.subProcessIds,
          order: def.order,
        }));
      await onSaveUnitProcesses(selectedMainProcessId, definitionsToSave);
    } catch (error) {
      console.error('Error saving unit processes:', error);
      alert(`저장 중 오류가 발생했습니다: ${error}`);
    } finally {
      setIsLoadingDefinitions(false);
    }
  };

  // 새로 추가된 단위공정에 자동 포커스
  useEffect(() => {
    const newDef = unitProcessDefinitions.find((def) => def.isNewlyAdded);
    if (newDef) {
      const inputElement =
        document.getElementById(`unit-process-name-desktop-${newDef.id}`) ||
        document.getElementById(`unit-process-name-mobile-${newDef.id}`);
      inputElement?.focus();
    }
  }, [unitProcessDefinitions]);

  return (
    <div className='bg-white rounded-lg shadow-md p-4 md:p-6 mt-6'>
      {/* 섹션 헤더 */}
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          <h2 className='text-xl font-semibold text-gray-800'>6. 단위공정</h2>
          <Tooltip text={guidanceText} position='bottom'>
            <FaInfoCircle className='text-gray-400 hover:text-gray-600 cursor-pointer' />
          </Tooltip>
          <button
            type='button'
            onClick={() => setSectionCollapsed(!sectionCollapsed)}
            className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
            aria-label={
              sectionCollapsed ? '단위공정 섹션 펼치기' : '단위공정 섹션 접기'
            }
          >
            {sectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </button>
        </div>
        {!sectionCollapsed && (
          <div className='flex space-x-2'>
            {availableSubProcesses.length > 0 && (
              <button
                type='button'
                onClick={handleResetToRecommended}
                disabled={isLoadingDefinitions}
                className='px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 text-sm flex items-center disabled:opacity-50'
              >
                <FaLightbulb className='mr-2' /> 추천으로 초기화
              </button>
            )}
            <button
              type='button'
              onClick={handleSave}
              disabled={
                !selectedMainProcessId ||
                isLoadingDefinitions ||
                !validationResult.isValid
              }
              className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-sm flex items-center disabled:opacity-50'
            >
              <FaSave className='mr-2' /> 단위공정 저장
            </button>
          </div>
        )}
      </div>

      {/* 검증 결과 표시 */}
      {!sectionCollapsed &&
        (validationResult.errors.length > 0 ||
          validationResult.warnings.length > 0) && (
          <div className='mb-4 space-y-2'>
            {validationResult.errors.length > 0 && (
              <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                <div className='flex items-center'>
                  <FaExclamationTriangle className='text-red-500 mr-2' />
                  <h4 className='text-sm font-medium text-red-800'>오류</h4>
                </div>
                <ul className='mt-2 text-sm text-red-700 list-disc list-inside'>
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {validationResult.warnings.length > 0 && (
              <div className='bg-yellow-50 border border-yellow-200 rounded-md p-3'>
                <div className='flex items-center'>
                  <FaInfoCircle className='text-yellow-500 mr-2' />
                  <h4 className='text-sm font-medium text-yellow-800'>경고</h4>
                </div>
                <ul className='mt-2 text-sm text-yellow-700 list-disc list-inside'>
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      {!sectionCollapsed && (
        <>
          <div className='hidden lg:block'>
            <UnitProcessDeskTopView
              selectedMainProcessId={selectedMainProcessId}
              allManufacturingProcesses={allManufacturingProcesses}
              selectedMainProcess={selectedMainProcess}
              availableSubProcesses={availableSubProcesses}
              contextTableItems={contextTableItems}
              isLoadingContextTable={isLoadingContextTable}
              unitProcessDefinitions={unitProcessDefinitions}
              isLoadingDefinitions={isLoadingDefinitions}
              guidanceText={guidanceText}
              onSelectMainProcess={setSelectedMainProcessId}
              onAddUnitProcess={handleAddUnitProcess}
              onUnitProcessChange={handleUnitProcessChange}
              onSubProcessToggle={handleSubProcessToggle}
              onDeleteUnitProcess={handleDeleteUnitProcess}
              onDragEnd={handleDragEnd}
            />
          </div>
          <div className='lg:hidden'>
            <UnitProcessMobileView
              selectedMainProcessId={selectedMainProcessId}
              allManufacturingProcesses={allManufacturingProcesses}
              availableSubProcesses={availableSubProcesses}
              contextTableItems={contextTableItems}
              isLoadingContextTable={isLoadingContextTable}
              unitProcessDefinitions={unitProcessDefinitions}
              isLoadingDefinitions={isLoadingDefinitions}
              onSelectMainProcess={setSelectedMainProcessId}
              onAddUnitProcess={handleAddUnitProcess}
              onUnitProcessChange={handleUnitProcessChange}
              onSubProcessToggle={handleSubProcessToggle}
              onDeleteUnitProcess={handleDeleteUnitProcess}
              onDragEnd={handleDragEnd}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UnitProcessTabContent;
