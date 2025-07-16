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
import { useSortable } from '@dnd-kit/sortable';
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
    value: string | string[],
  ) => void;
  onSubProcessToggle: (
    unitProcessDefId: string | number,
    subProcessId: string,
  ) => void;
  onDeleteUnitProcess: (id: string | number) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

// 단위공정 구성 요약 컴포넌트
const UnitProcessSummary: React.FC<{
  unitProcessDefinitions: UnitProcessDefinition[];
  availableSubProcesses: SubProcessInfo[];
}> = ({ unitProcessDefinitions, availableSubProcesses }) => {
  if (unitProcessDefinitions.length === 0) {
    return (
      <div className="rounded-lg border bg-gray-50 p-4 text-center">
        <p className="text-sm text-gray-500">
          단위공정을 정의하면 여기에 구성 요약이 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <h4 className="mb-3 flex items-center text-sm font-medium">
        <span>단위공정 구성 요약</span>
        <span className="ml-2 text-xs text-gray-500">
          (정의된 단위공정별 세부공정 구성)
        </span>
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {unitProcessDefinitions.map((unitProcess) => (
          <div
            key={unitProcess.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <h5 className="flex-1 truncate text-sm font-medium text-gray-800">
                {unitProcess.name || '(이름 없음)'}
              </h5>
              {unitProcess.isRecommended && (
                <span className="ml-2 flex flex-shrink-0 items-center rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-600">
                  <FaLightbulb className="mr-1" size={10} />
                  추천
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="mb-2 text-xs text-gray-500">
                포함된 세부공정 ({unitProcess.subProcessIds.length}개)
              </div>
              {unitProcess.subProcessIds.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {unitProcess.subProcessIds.map((subId) => {
                    const subProcess = availableSubProcesses.find(
                      (sp) => sp.id === subId,
                    );
                    return (
                      <span
                        key={subId}
                        className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700"
                      >
                        {subProcess?.name || '(알 수 없음)'}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center">
                  <span className="flex items-center justify-center text-xs text-red-600">
                    <FaExclamationTriangle className="mr-1" size={10} />
                    세부공정 없음
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 드래그 가능한 단위공정 정의 아이템 컴포넌트
interface SortableUnitProcessItemProps {
  definition: UnitProcessDefinition;
  availableSubProcesses: SubProcessInfo[];
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
      className={`rounded-lg border bg-white p-4 shadow-sm ${
        definition.isRecommended
          ? 'border-yellow-300 bg-yellow-50'
          : 'border-gray-300'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex flex-grow items-center">
          {/* 드래그 핸들 */}
          <div
            {...attributes}
            {...listeners}
            className="mr-3 cursor-grab p-1 text-gray-400 hover:text-gray-600 active:cursor-grabbing"
          >
            <FaGripVertical />
          </div>

          <input
            id={`unit-process-name-desktop-${definition.id}`}
            type="text"
            value={definition.name}
            onChange={(e) =>
              onUnitProcessChange(definition.id, 'name', e.target.value)
            }
            placeholder="단위공정 이름 (필수)"
            className="text-md mr-4 flex-grow border-b-2 border-gray-300 bg-transparent py-1 font-semibold outline-none focus:border-indigo-500"
          />
          {definition.isRecommended && (
            <span className="mr-2 flex items-center text-xs text-yellow-600">
              <FaLightbulb className="mr-1" size={12} />
              추천
            </span>
          )}
        </div>
        <button
          onClick={() => onDeleteUnitProcess(definition.id)}
          className="min-h-[44px] min-w-[44px] rounded-md p-2 text-red-500 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="단위공정 삭제"
        >
          <FaTrash />
        </button>
      </div>

      <div className="mt-2">
        <p className="mb-2 text-xs text-gray-600">
          이 단위공정에 포함할 세부공정 선택:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 md:grid-cols-4">
          {availableSubProcesses.map((sp) => (
            <label
              key={sp.id}
              className="flex min-h-[44px] cursor-pointer items-center space-x-2 rounded-md border p-2 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={definition.subProcessIds.includes(sp.id)}
                onChange={() => onSubProcessToggle(definition.id, sp.id)}
                className="form-checkbox h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="flex-grow">{sp.name}</span>
            </label>
          ))}
        </div>
        {definition.subProcessIds.length === 0 && (
          <p className="mt-2 flex items-center text-xs text-red-500">
            <FaExclamationTriangle className="mr-1" size={12} />
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
  return (
    <div className="space-y-6">
      {/* 1. 공정명 선택 */}
      <div className="rounded-md border bg-gray-50 p-4">
        <label
          htmlFor="mainProcessSelectUnitProcessDesktop"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          공정명 선택 (공정 구분이 &apos;제조 공정&apos;인 공정)
        </label>
        <select
          id="mainProcessSelectUnitProcessDesktop"
          value={selectedMainProcessId}
          onChange={(e) => onSelectMainProcess(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm md:w-1/2 lg:w-1/3"
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
          {/* 2. 단위공정 구성 요약 */}
          <UnitProcessSummary
            unitProcessDefinitions={unitProcessDefinitions}
            availableSubProcesses={availableSubProcesses}
          />
          {/* 3. 단위공정 정의 영역 (개선된 버전) */}
          <div className="rounded-md border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-md font-semibold text-gray-700">
                  단위공정 정의 목록
                </h3>
                <Tooltip
                  text="공정을 옮겨서 단위공정 순서를 변경할 수 있습니다"
                  position="bottom"
                >
                  <FaInfoCircle className="cursor-pointer text-gray-400 hover:text-gray-600" />
                </Tooltip>
              </div>
              <button
                type="button"
                onClick={onAddUnitProcess}
                disabled={availableSubProcesses.length === 0}
                className="flex min-h-[44px] items-center rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                <FaPlus className="mr-2" /> 단위공정 추가
              </button>
            </div>

            {isLoadingDefinitions ? (
              <p>단위공정 목록 로딩 중...</p>
            ) : availableSubProcesses.length === 0 ? (
              <p className="py-3 text-sm text-gray-500">
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
                  <div className="space-y-4">
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
              <div className="py-8 text-center">
                <p className="mb-3 text-sm text-gray-500">
                  정의된 단위공정이 없습니다.
                </p>
                <p className="text-xs text-gray-400">
                  &quot;단위공정 추가&quot; 버튼으로 새로 만들거나, 추천 기능을
                  사용하세요.
                </p>
              </div>
            )}
          </div>
        </>
      )}
      {!selectedMainProcessId && (
        <div className="py-12 text-center">
          <p className="mb-2 text-lg text-gray-500">
            먼저 공정명을 선택해주세요.
          </p>
          <p className="text-sm text-gray-400">
            선택한 공정의 세부공정을 기반으로 단위공정을 정의할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default UnitProcessDeskTopView;
