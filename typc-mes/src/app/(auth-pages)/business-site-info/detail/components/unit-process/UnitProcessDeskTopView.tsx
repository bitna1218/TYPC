import React from 'react';
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

interface UnitProcessDeskTopViewProps {
  selectedMainProcessId: string;
  allManufacturingProcesses: ProcessWithSubProcesses[];
  selectedMainProcess: ProcessWithSubProcesses | undefined;
  availableSubProcesses: SubProcessInfo[];
  contextTableItems: ProductProcessMapContextItem[];
  isLoadingContextTable: boolean;
  unitProcessDefinitions: UnitProcessDefinition[];
  isLoadingDefinitions: boolean;
  guidanceText: string;

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

// 공정 흐름도 컴포넌트 (계속)
const ProcessFlowDiagram: React.FC<{
  unitProcessDefinitions: UnitProcessDefinition[];
  availableSubProcesses: SubProcessInfo[];
}> = ({ unitProcessDefinitions, availableSubProcesses }) => {
  if (unitProcessDefinitions.length === 0) {
    return (
      <div className='border rounded-lg p-4 bg-gray-50 text-center'>
        <p className='text-gray-500 text-sm'>
          단위공정을 정의하면 여기에 공정 흐름도가 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className='border rounded-lg p-4 bg-gray-50'>
      <h4 className='text-sm font-medium mb-3 flex items-center'>
        <span>공정 흐름도</span>
        <span className='ml-2 text-xs text-gray-500'>
          (정의된 단위공정 순서)
        </span>
      </h4>
      <div className='flex items-center space-x-4 overflow-x-auto pb-2'>
        {unitProcessDefinitions
          .sort((a, b) => a.order - b.order)
          .map((unitProcess, index) => (
          <div key={unitProcess.id} className='flex items-center flex-shrink-0'>
            <div className='border-2 border-green-500 rounded-lg p-3 bg-white min-w-[140px] shadow-sm'>
              <div className='text-center font-medium text-sm text-gray-800 mb-2'>
                {unitProcess.name || '(이름 없음)'}
                {unitProcess.isRecommended && (
                  <FaLightbulb
                    className='inline ml-1 text-yellow-500'
                    size={12}
                    title='추천 단위공정'
                  />
                )}
              </div>
              <div className='space-y-1'>
                {unitProcess.subProcessIds.length > 0 ? (
                  unitProcess.subProcessIds.map((subId) => {
                    const subProcess = availableSubProcesses.find(
                      (sp) => sp.id === subId
                    );
                    return (
                      <div
                        key={subId}
                        className='bg-blue-100 border border-blue-300 rounded px-2 py-1 text-xs text-center'
                      >
                        {subProcess?.name || '(알 수 없음)'}
                      </div>
                    );
                  })
                ) : (
                  <div className='bg-red-100 border border-red-300 rounded px-2 py-1 text-xs text-center text-red-600'>
                    세부공정 없음
                  </div>
                )}
              </div>
            </div>
            {index < unitProcessDefinitions.length - 1 && (
              <div className='text-gray-400 mx-2 text-lg font-bold'>→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 개선된 순서 표시 컴포넌트
const OrderBadge: React.FC<{ order: number }> = ({ order }) => {
  const getOrderColor = (order: number) => {
    if (order === 1) return 'bg-green-200 text-green-800 border-green-300';
    if (order === 2) return 'bg-blue-200 text-blue-800 border-blue-300';
    if (order === 3) return 'bg-purple-200 text-purple-800 border-purple-300';
    if (order === 4) return 'bg-orange-200 text-orange-800 border-orange-300';
    return 'bg-gray-200 text-gray-700 border-gray-300';
  };

  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold border ${getOrderColor(
        order
      )}`}
    >
      {order}
    </span>
  );
};

// 드래그 가능한 단위공정 정의 아이템 컴포넌트
interface SortableUnitProcessItemProps {
  definition: UnitProcessDefinition;
  availableSubProcesses: SubProcessInfo[];
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
}

const SortableUnitProcessItem: React.FC<SortableUnitProcessItemProps> = ({
  definition,
  availableSubProcesses,
  onUnitProcessChange,
  onSubProcessToggle,
  onDeleteUnitProcess,
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
      className={`bg-white border rounded-lg p-4 shadow-sm ${
        definition.isRecommended
          ? 'border-yellow-300 bg-yellow-50'
          : 'border-gray-300'
      }`}
    >
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center flex-grow'>
          {/* 드래그 핸들 */}
          <div
            {...attributes}
            {...listeners}
            className='cursor-grab active:cursor-grabbing mr-3 p-1 text-gray-400 hover:text-gray-600'
          >
            <FaGripVertical />
          </div>
          
          <input
            id={`unit-process-name-desktop-${definition.id}`}
            type='text'
            value={definition.name}
            onChange={(e) =>
              onUnitProcessChange(definition.id, 'name', e.target.value)
            }
            placeholder='단위공정 이름 (필수)'
            className='text-md font-semibold border-b-2 border-gray-300 focus:border-indigo-500 outline-none flex-grow mr-4 py-1 bg-transparent'
          />
          {definition.isRecommended && (
            <span className='flex items-center text-xs text-yellow-600 mr-2'>
              <FaLightbulb className='mr-1' size={12} />
              추천
            </span>
          )}
        </div>
        <button
          onClick={() => onDeleteUnitProcess(definition.id)}
          className='min-h-[44px] min-w-[44px] text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500'
          aria-label='단위공정 삭제'
        >
          <FaTrash />
        </button>
      </div>

      <div className='mt-2'>
        <p className='text-xs text-gray-600 mb-2'>
          이 단위공정에 포함할 세부공정 선택:
        </p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs'>
          {availableSubProcesses.map((sp) => (
            <label
              key={sp.id}
              className='flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer min-h-[44px]'
            >
              <input
                type='checkbox'
                checked={definition.subProcessIds.includes(sp.id)}
                onChange={() => onSubProcessToggle(definition.id, sp.id)}
                className='form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
              />
              <span className='flex-grow'>{sp.name}</span>
            </label>
          ))}
        </div>
        {definition.subProcessIds.length === 0 && (
          <p className='text-red-500 text-xs mt-2 flex items-center'>
            <FaExclamationTriangle className='mr-1' size={12} />
            경고: 이 단위공정에는 할당된 세부공정이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

const UnitProcessDeskTopView: React.FC<UnitProcessDeskTopViewProps> = ({
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
  return (
    <div className='space-y-6'>
      {/* 1. 공정명 선택 */}
      <div className='p-4 bg-gray-50 rounded-md border'>
        <label
          htmlFor='mainProcessSelectUnitProcessDesktop'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          공정명 선택 (공정 구분이 &apos;제조 공정&apos;인 공정)
        </label>
        <select
          id='mainProcessSelectUnitProcessDesktop'
          value={selectedMainProcessId}
          onChange={(e) => onSelectMainProcess(e.target.value)}
          className='w-full md:w-1/2 lg:w-1/3 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
          {/* 2. 공정 흐름도 (새로 추가) */}
          <ProcessFlowDiagram
            unitProcessDefinitions={unitProcessDefinitions}
            availableSubProcesses={availableSubProcesses}
          />

          {/* 3. 참고용: 5-3 제품공정 현황 테이블 (개선된 버전) */}
          <div className='border rounded-md p-4'>
            <h3 className='text-md font-semibold text-gray-700 mb-3'>
              참고: 제품/제품군별 세부공정 순서 (5-3 결과)
            </h3>
            {isLoadingContextTable ? (
              <p>참고 테이블 로딩 중...</p>
            ) : availableSubProcesses.length > 0 &&
              contextTableItems.length > 0 ? (
              <div className='overflow-x-auto text-xs max-w-full'>
                <table className='min-w-full border-collapse border border-gray-300'>
                  <thead className='bg-gray-100 sticky top-0 z-20'>
                    <tr>
                      <th className='border border-gray-300 px-3 py-2 font-medium text-gray-600 whitespace-nowrap sticky left-0 bg-gray-100 z-30 min-w-[140px]'>
                        제품/제품군
                      </th>
                      {availableSubProcesses.map((sp) => (
                        <th
                          key={sp.id}
                          className='border border-gray-300 px-3 py-2 font-medium text-gray-600 whitespace-nowrap min-w-[100px] text-center'
                        >
                          {sp.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className='bg-white'>
                    {contextTableItems.map((item) => (
                      <tr key={item.id} className='hover:bg-gray-50'>
                        <td className='border border-gray-300 px-3 py-2 whitespace-nowrap sticky left-0 bg-white hover:bg-gray-50 z-10'>
                          <span
                            className={`font-medium ${
                              item.type === 'productGroup'
                                ? 'text-blue-600'
                                : 'text-gray-800'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className='text-gray-400 ml-1 text-[10px]'>
                            ({item.type === 'product' ? '제품' : '제품군'})
                          </span>
                        </td>
                        {availableSubProcesses.map((sp) => {
                          const order = item.orders[sp.id];
                          return (
                            <td
                              key={sp.id}
                              className='border border-gray-300 p-2 whitespace-nowrap text-center'
                            >
                              {order !== undefined && (
                                <OrderBadge order={order} />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className='text-sm text-gray-500 py-3'>
                {availableSubProcesses.length === 0
                  ? '선택된 공정명에 세부공정이 없습니다.'
                  : '선택된 공정명에 연결된 제품/제품군 정보(5-3)가 없거나, 해당 제품/제품군이 없습니다.'}
              </p>
            )}
          </div>

          {/* 4. 단위공정 정의 영역 (개선된 버전) */}
          <div className='border rounded-md p-4'>
            <div className='flex justify-between items-center mb-4'>
              <div className='flex items-center space-x-2'>
                <h3 className='text-md font-semibold text-gray-700'>
                  단위공정 정의 목록
                </h3>
                <Tooltip text="공정을 옮겨서 단위공정 순서를 변경할 수 있습니다" position="bottom">
                  <FaInfoCircle className='text-gray-400 hover:text-gray-600 cursor-pointer' />
                </Tooltip>
              </div>
              <button
                type='button'
                onClick={onAddUnitProcess}
                disabled={availableSubProcesses.length === 0}
                className='min-h-[44px] px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm flex items-center disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                <FaPlus className='mr-2' /> 단위공정 추가
              </button>
            </div>

            {isLoadingDefinitions ? (
              <p>단위공정 목록 로딩 중...</p>
            ) : availableSubProcesses.length === 0 ? (
              <p className='text-sm text-gray-500 py-3'>
                단위공정을 정의하려면 먼저 선택된 공정명에 세부공정이 등록되어
                있어야 합니다.
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
                  <div className='space-y-4'>
                    {unitProcessDefinitions
                      .sort((a, b) => a.order - b.order)
                      .map((def) => (
                        <SortableUnitProcessItem
                          key={def.id}
                          definition={def}
                          availableSubProcesses={availableSubProcesses}
                          onUnitProcessChange={onUnitProcessChange}
                          onSubProcessToggle={onSubProcessToggle}
                          onDeleteUnitProcess={onDeleteUnitProcess}
                        />
                      ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className='text-center py-8'>
                <p className='text-sm text-gray-500 mb-3'>
                  정의된 단위공정이 없습니다.
                </p>
                <p className='text-xs text-gray-400'>
                  &quot;단위공정 추가&quot; 버튼으로 새로 만들거나, 추천 기능을
                  사용하세요.
                </p>
              </div>
            )}
          </div>
        </>
      )}
      {!selectedMainProcessId && (
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg mb-2'>
            먼저 공정명을 선택해주세요.
          </p>
          <p className='text-gray-400 text-sm'>
            선택한 공정의 세부공정을 기반으로 단위공정을 정의할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default UnitProcessDeskTopView;
