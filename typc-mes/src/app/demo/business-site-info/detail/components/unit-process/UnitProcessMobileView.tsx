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
import { useSortable } from '@dnd-kit/sortable';
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
    value: string | string[],
  ) => void;
  onSubProcessToggle: (
    unitProcessDefId: string | number,
    subProcessId: string,
  ) => void;
  onDeleteUnitProcess: (id: string | number) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

// 드래그 가능한 모바일 단위공정 정의 아이템 컴포넌트
interface SortableUnitProcessItemMobileProps {
  definition: UnitProcessDefinition;
  availableSubProcesses: SubProcessInfo[];
  expandedDefinitionCardId: string | number | null;
  onUnitProcessChange: (
    id: string | number,
    field: keyof UnitProcessDefinition,
    value: string | string[],
  ) => void;
  onSubProcessToggle: (
    unitProcessDefId: string | number,
    subProcessId: string,
  ) => void;
  onDeleteUnitProcess: (id: string | number) => void;
  onToggleDefinitionCard: (id: string | number) => void;
}

const SortableUnitProcessItemMobile: React.FC<
  SortableUnitProcessItemMobileProps
> = ({
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
      className={`rounded-lg border bg-white shadow-sm transition-all duration-200 ${
        definition.isRecommended
          ? 'border-yellow-300 bg-yellow-50'
          : 'border-gray-200 hover:shadow-md'
      }`}
    >
      <div
        className="touch-target flex cursor-pointer items-center justify-between p-3 transition-colors duration-150 hover:bg-gray-50"
        onClick={() => onToggleDefinitionCard(definition.id)}
      >
        <div className="flex flex-grow items-center">
          {/* 드래그 핸들 */}
          <div
            {...attributes}
            {...listeners}
            className="mr-2 cursor-grab p-1 text-gray-400 hover:text-gray-600 active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <FaGripVertical size={12} />
          </div>

          <input
            id={`unit-process-name-mobile-${definition.id}`}
            type="text"
            value={definition.name}
            onChange={(e) =>
              onUnitProcessChange(definition.id, 'name', e.target.value)
            }
            onClick={(e) => e.stopPropagation()}
            placeholder="단위공정 이름"
            className="touch-target mr-2 flex-grow border-b border-gray-300 bg-transparent py-1 text-xs font-medium outline-none transition-colors duration-200 focus:border-indigo-500"
          />
          {definition.isRecommended && (
            <span className="mr-1 flex items-center rounded-full bg-yellow-100 px-1.5 py-0.5 text-[9px] text-yellow-600">
              <FaLightbulb className="mr-0.5" size={8} />
              추천
            </span>
          )}
        </div>
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteUnitProcess(definition.id);
            }}
            className="touch-target mr-1 rounded-md p-2 text-red-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            aria-label="삭제"
          >
            <FaTrash size={12} />
          </button>
          {expandedDefinitionCardId === definition.id ? (
            <FaChevronUp size={12} className="text-gray-500" />
          ) : (
            <FaChevronDown size={12} className="text-gray-500" />
          )}
        </div>
      </div>

      {expandedDefinitionCardId === definition.id && (
        <div className="border-t bg-gray-50 p-3">
          <p className="mb-2 text-[10px] text-gray-600">
            포함할 세부공정 선택:
          </p>
          <div className="grid grid-cols-1 gap-2 text-[10px]">
            {availableSubProcesses.map((sp) => (
              <label
                key={sp.id}
                className="touch-target flex cursor-pointer items-center space-x-2 rounded-md border bg-white p-2 transition-colors duration-150 hover:bg-white"
              >
                <input
                  type="checkbox"
                  checked={definition.subProcessIds.includes(sp.id)}
                  onChange={() => onSubProcessToggle(definition.id, sp.id)}
                  className="form-checkbox h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="flex-grow text-xs">{sp.name}</span>
              </label>
            ))}
          </div>
          {definition.subProcessIds.length === 0 && (
            <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-2">
              <p className="flex items-center text-[10px] text-red-600">
                <FaExclamationTriangle
                  className="mr-1 flex-shrink-0"
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
    }),
  );
  const [expandedDefinitionCardId, setExpandedDefinitionCardId] = useState<
    string | number | null
  >(null);

  const toggleDefinitionCard = (id: string | number) => {
    setExpandedDefinitionCardId(expandedDefinitionCardId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* 1. 공정명 선택 */}
      <div className="rounded-md border bg-gray-50 p-3">
        <label
          htmlFor="mainProcessSelectUnitProcessMobile"
          className="mb-1 block text-xs font-medium text-gray-700"
        >
          공정명 선택 (제조 공정)
        </label>
        <select
          id="mainProcessSelectUnitProcessMobile"
          value={selectedMainProcessId}
          onChange={(e) => onSelectMainProcess(e.target.value)}
          className="touch-target w-full rounded-md border border-gray-300 bg-white p-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        >
          <option value="">공정을 선택하세요</option>
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
          {/* 3. 단위공정 정의 영역 (카드 리스트) */}
          <div className="rounded-md border">
            <div className="flex items-center justify-between border-b bg-gray-100 p-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  단위공정 정의
                </h3>
                <Tooltip
                  text="공정을 옮겨서 단위공정 순서를 변경할 수 있습니다"
                  position="bottom"
                >
                  <FaInfoCircle
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    size={12}
                  />
                </Tooltip>
              </div>
              <button
                type="button"
                onClick={onAddUnitProcess}
                disabled={availableSubProcesses.length === 0}
                className="touch-target flex items-center rounded-md bg-green-500 px-3 py-2 text-xs text-white transition-colors duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <FaPlus className="mr-1" size={10} /> 추가
              </button>
            </div>

            {isLoadingDefinitions ? (
              <p className="p-3 text-xs">단위공정 목록 로딩 중...</p>
            ) : availableSubProcesses.length === 0 ? (
              <p className="p-3 text-xs text-gray-500">
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
                  <div className="space-y-2 p-3">
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
              <div className="px-3 py-6 text-center">
                <p className="mb-2 text-xs text-gray-500">
                  정의된 단위공정이 없습니다.
                </p>
                <p className="mb-3 text-[10px] text-gray-400">
                  &quot;추가&quot; 버튼으로 새로 만드세요.
                </p>
                <div className="rounded-md border border-blue-200 bg-blue-50 p-2">
                  <p className="text-[10px] text-blue-600">
                    💡 추천 단위공정이 자동 생성되었습니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {!selectedMainProcessId && (
        <div className="px-3 py-8 text-center">
          <div className="mx-auto max-w-sm">
            <p className="mb-2 text-sm text-gray-500">
              먼저 공정명을 선택해주세요.
            </p>
            <p className="mb-4 text-xs text-gray-400">
              선택한 공정의 세부공정을 기반으로 단위공정을 정의할 수 있습니다.
            </p>
            <div className="rounded-md border bg-gray-50 p-3">
              <p className="text-xs text-gray-600">
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
