import React, { useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaTrash,
  FaLightbulb,
  FaExclamationTriangle,
  FaGripVertical,
  FaInfoCircle,
} from 'react-icons/fa';
import {
  SubProcessInfo,
  UnitProcessDefinition,
  ProductProcessMapContextItem,
  ProcessWithSubProcesses,
} from './UnitProcessTabContent';
import Tooltip from '../common/Tooltip';
import ProcessFlowVisualizer from '../../components/common/ProcessFlowVisualizer';

interface UnitProcessMobileViewProps {
  selectedMainProcessId: string;
  allManufacturingProcesses: ProcessWithSubProcesses[];
  availableSubProcesses: SubProcessInfo[];
  contextTableItems: ProductProcessMapContextItem[];
  isLoadingContextTable: boolean;
  unitProcessDefinitions: UnitProcessDefinition[];
  isLoadingDefinitions: boolean;

  onSelectMainProcess: (id: string) => void;
  onAddUnitProcess: () => void;
  onUnitProcessChange: (
    id: string | number,
    field: keyof UnitProcessDefinition,
    value: string | string[]
  ) => void;
  onSubProcessToggle: (
    unitProcessDefId: string | number,
    subProcessId: string
  ) => void;
  onDeleteUnitProcess: (id: string | number) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

// 모바일용 순서 표시 컴포넌트
const MobileOrderBadge: React.FC<{ order: number }> = ({ order }) => {
  const getOrderColor = (order: number) => {
    if (order === 1) return 'bg-green-200 text-green-800';
    if (order === 2) return 'bg-blue-200 text-blue-800';
    if (order === 3) return 'bg-purple-200 text-purple-800';
    if (order === 4) return 'bg-orange-200 text-orange-800';
    return 'bg-gray-200 text-gray-700';
  };

  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold transition-transform duration-200 hover:scale-110 ${getOrderColor(
        order
      )}`}
    >
      {order}
    </span>
  );
};

// 드래그 가능한 모바일 단위공정 정의 아이템 컴포넌트
interface SortableUnitProcessItemMobileProps {
  definition: UnitProcessDefinition;
  availableSubProcesses: SubProcessInfo[];
  expandedDefinitionCardId: string | number | null;
  onUnitProcessChange: (
    id: string | number,
    field: keyof UnitProcessDefinition,
    value: string | string[]
  ) => void;
  onSubProcessToggle: (
    unitProcessDefId: string | number,
    subProcessId: string
  ) => void;
  onDeleteUnitProcess: (id: string | number) => void;
  onToggleDefinitionCard: (id: string | number) => void;
}

const SortableUnitProcessItemMobile: React.FC<SortableUnitProcessItemMobileProps> = ({
  definition,
  availableSubProcesses,
  expandedDefinitionCardId,
  onUnitProcessChange,
  onSubProcessToggle,
  onDeleteUnitProcess,
  onToggleDefinitionCard,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: definition.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg shadow-sm transition-all duration-200 ${
        definition.isRecommended
          ? 'border-yellow-300 bg-yellow-50'
          : 'border-gray-200 hover:shadow-md'
      }`}
    >
      <div
        className='flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 touch-target transition-colors duration-150'
        onClick={() => onToggleDefinitionCard(definition.id)}
      >
        <div className='flex items-center flex-grow'>
          {/* 드래그 핸들 */}
          <div
            {...attributes}
            {...listeners}
            className='cursor-grab active:cursor-grabbing mr-2 p-1 text-gray-400 hover:text-gray-600'
            onClick={(e) => e.stopPropagation()}
          >
            <FaGripVertical size={12} />
          </div>
          
          <input
            id={`unit-process-name-mobile-${definition.id}`}
            type='text'
            value={definition.name}
            onChange={(e) =>
              onUnitProcessChange(definition.id, 'name', e.target.value)
            }
            onClick={(e) => e.stopPropagation()}
            placeholder='단위공정 이름'
            className='text-xs font-medium border-b border-gray-300 focus:border-indigo-500 outline-none flex-grow mr-2 py-1 bg-transparent touch-target transition-colors duration-200'
          />
          {definition.isRecommended && (
            <span className='bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-full text-[9px] flex items-center mr-1'>
              <FaLightbulb className='mr-0.5' size={8} />
              추천
            </span>
          )}
        </div>
        <div className='flex items-center'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteUnitProcess(definition.id);
            }}
            className='touch-target text-red-500 hover:text-red-700 hover:bg-red-50 p-2 mr-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
            aria-label='삭제'
          >
            <FaTrash size={12} />
          </button>
          {expandedDefinitionCardId === definition.id ? (
            <FaChevronUp size={12} className='text-gray-500' />
          ) : (
            <FaChevronDown size={12} className='text-gray-500' />
          )}
        </div>
      </div>

      {expandedDefinitionCardId === definition.id && (
        <div className='p-3 border-t bg-gray-50'>
          <p className='text-[10px] text-gray-600 mb-2'>
            포함할 세부공정 선택:
          </p>
          <div className='grid grid-cols-1 gap-2 text-[10px]'>
            {availableSubProcesses.map((sp) => (
              <label
                key={sp.id}
                className='flex items-center space-x-2 p-2 border rounded-md hover:bg-white cursor-pointer touch-target bg-white transition-colors duration-150'
              >
                <input
                  type='checkbox'
                  checked={definition.subProcessIds.includes(sp.id)}
                  onChange={() =>
                    onSubProcessToggle(definition.id, sp.id)
                  }
                  className='form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                />
                <span className='flex-grow text-xs'>
                  {sp.name}
                </span>
              </label>
            ))}
          </div>
          {definition.subProcessIds.length === 0 && (
            <div className='mt-2 p-2 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-red-600 text-[10px] flex items-center'>
                <FaExclamationTriangle
                  className='mr-1 flex-shrink-0'
                  size={10}
                />
                경고: 할당된 세부공정이 없습니다.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const UnitProcessMobileView: React.FC<UnitProcessMobileViewProps> = ({
  selectedMainProcessId,
  allManufacturingProcesses,
  availableSubProcesses,
  contextTableItems,
  isLoadingContextTable,
  unitProcessDefinitions,
  isLoadingDefinitions,
  onSelectMainProcess,
  onAddUnitProcess,
  onUnitProcessChange,
  onSubProcessToggle,
  onDeleteUnitProcess,
  onDragEnd,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  const [expandedContextCardId, setExpandedContextCardId] = useState<
    string | number | null
  >(null);
  const [expandedDefinitionCardId, setExpandedDefinitionCardId] = useState<
    string | number | null
  >(null);

  const toggleContextCard = (id: string | number) => {
    setExpandedContextCardId(expandedContextCardId === id ? null : id);
  };

  const toggleDefinitionCard = (id: string | number) => {
    setExpandedDefinitionCardId(expandedDefinitionCardId === id ? null : id);
  };

  return (
    <div className='space-y-4'>
      {/* 1. 공정명 선택 */}
      <div className='p-3 bg-gray-50 rounded-md border'>
        <label
          htmlFor='mainProcessSelectUnitProcessMobile'
          className='block text-xs font-medium text-gray-700 mb-1'
        >
          공정명 선택 (제조 공정)
        </label>
        <select
          id='mainProcessSelectUnitProcessMobile'
          value={selectedMainProcessId}
          onChange={(e) => onSelectMainProcess(e.target.value)}
          className='w-full p-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm touch-target'
        >
          <option value=''>공정을 선택하세요</option>
          {allManufacturingProcesses.map((proc) => (
            <option key={proc.id} value={proc.id}>
              {proc.processName}
            </option>
          ))}
        </select>
      </div>

      {selectedMainProcessId && (
        <>
          {/* 2. 공정 흐름도 (ProcessFlowVisualizer 컴포넌트 사용) */}
          <ProcessFlowVisualizer
            unitProcessDefinitions={unitProcessDefinitions}
            availableSubProcesses={availableSubProcesses}
            isMobile={true}
          />

          {/* 3. 참고용: 5-3 제품공정 현황 (카드 리스트) */}
          <div className='border rounded-md'>
            <h3 className='text-sm font-semibold text-gray-700 mb-2 p-3 bg-gray-100 border-b'>
              참고: 제품/제품군별 세부공정 순서
            </h3>
            {isLoadingContextTable ? (
              <p className='p-3 text-xs'>참고 정보 로딩 중...</p>
            ) : availableSubProcesses.length > 0 &&
              contextTableItems.length > 0 ? (
              <div className='space-y-2 p-3'>
                {contextTableItems.map((item) => (
                  <div
                    key={item.id}
                    className='border rounded-md shadow-sm transition-all duration-200'
                  >
                    <div
                      className='flex justify-between items-center p-3 bg-white cursor-pointer hover:bg-gray-50 touch-target transition-colors duration-150'
                      onClick={() => toggleContextCard(item.id)}
                    >
                      <span
                        className={`text-xs font-medium ${
                          item.type === 'productGroup'
                            ? 'text-blue-600'
                            : 'text-gray-800'
                        }`}
                      >
                        {item.name}
                        <span className='text-gray-400 text-[10px] ml-1'>
                          ({item.type === 'product' ? '제품' : '제품군'})
                        </span>
                      </span>
                      {expandedContextCardId === item.id ? (
                        <FaChevronUp size={12} className='text-gray-500' />
                      ) : (
                        <FaChevronDown size={12} className='text-gray-500' />
                      )}
                    </div>
                    {expandedContextCardId === item.id && (
                      <div className='p-3 border-t text-[10px] space-y-2 bg-gray-50'>
                        {availableSubProcesses.length > 0 ? (
                          availableSubProcesses.map((sp) => {
                            const order = item.orders[sp.id];
                            return (
                              <div
                                key={sp.id}
                                className='flex justify-between items-center py-1 px-2 bg-white rounded border'
                              >
                                <span className='text-gray-600 flex-grow'>
                                  {sp.name}:
                                </span>
                                <div className='ml-2'>
                                  {order !== undefined ? (
                                    <MobileOrderBadge order={order} />
                                  ) : (
                                    <span className='text-gray-400 text-xs'>
                                      -
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className='text-gray-500 text-center py-2'>
                            세부공정 정보 없음
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-xs text-gray-500 p-3'>
                {availableSubProcesses.length === 0
                  ? '선택된 공정명에 세부공정이 없습니다.'
                  : '관련 제품/제품군 정보(5-3)가 없습니다.'}
              </p>
            )}
          </div>

          {/* 4. 단위공정 정의 영역 (카드 리스트) */}
          <div className='border rounded-md'>
            <div className='flex justify-between items-center p-3 bg-gray-100 border-b'>
              <div className='flex items-center space-x-2'>
                <h3 className='text-sm font-semibold text-gray-700'>
                  단위공정 정의
                </h3>
                <Tooltip text="공정을 옮겨서 단위공정 순서를 변경할 수 있습니다" position="bottom">
                  <FaInfoCircle className='text-gray-400 hover:text-gray-600 cursor-pointer' size={12} />
                </Tooltip>
              </div>
              <button
                type='button'
                onClick={onAddUnitProcess}
                disabled={availableSubProcesses.length === 0}
                className='touch-target px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-xs flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
              >
                <FaPlus className='mr-1' size={10} /> 추가
              </button>
            </div>

            {isLoadingDefinitions ? (
              <p className='p-3 text-xs'>단위공정 목록 로딩 중...</p>
            ) : availableSubProcesses.length === 0 ? (
              <p className='text-xs text-gray-500 p-3'>
                세부공정이 등록되어야 단위공정을 정의할 수 있습니다.
              </p>
            ) : unitProcessDefinitions.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={unitProcessDefinitions.map((def) => def.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className='space-y-2 p-3'>
                    {unitProcessDefinitions
                      .sort((a, b) => a.order - b.order)
                      .map((def) => (
                        <SortableUnitProcessItemMobile
                          key={def.id}
                          definition={def}
                          availableSubProcesses={availableSubProcesses}
                          expandedDefinitionCardId={expandedDefinitionCardId}
                          onUnitProcessChange={onUnitProcessChange}
                          onSubProcessToggle={onSubProcessToggle}
                          onDeleteUnitProcess={onDeleteUnitProcess}
                          onToggleDefinitionCard={toggleDefinitionCard}
                        />
                      ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className='text-center py-6 px-3'>
                <p className='text-xs text-gray-500 mb-2'>
                  정의된 단위공정이 없습니다.
                </p>
                <p className='text-[10px] text-gray-400 mb-3'>
                  &quot;추가&quot; 버튼으로 새로 만드세요.
                </p>
                <div className='bg-blue-50 border border-blue-200 rounded-md p-2'>
                  <p className='text-[10px] text-blue-600'>
                    💡 추천 단위공정이 자동 생성되었습니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {!selectedMainProcessId && (
        <div className='text-center py-8 px-3'>
          <div className='max-w-sm mx-auto'>
            <p className='text-sm text-gray-500 mb-2'>
              먼저 공정명을 선택해주세요.
            </p>
            <p className='text-xs text-gray-400 mb-4'>
              선택한 공정의 세부공정을 기반으로 단위공정을 정의할 수 있습니다.
            </p>
            <div className='bg-gray-50 border rounded-md p-3'>
              <p className='text-xs text-gray-600'>
                ℹ️ 제조 공정만 선택 가능하며, 세부공정이 등록되어야 합니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitProcessMobileView;
