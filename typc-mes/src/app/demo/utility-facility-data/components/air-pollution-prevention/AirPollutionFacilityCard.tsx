'use client';

import React from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import FlowInputTable from './FlowInputTable';
import AllocationSection from './AllocationSection';
import UnitProcessSelector from '../common/UnitProcessSelector';

interface UnitProcess {
  id: string;
  name: string;
  processGroup: string;
  hasBoiler?: boolean;
}

interface MonthlyFlowData {
  month: number;
  flow: number;
}

interface UnitProcessFlowData {
  unitProcessId: string;
  monthlyFlowData: MonthlyFlowData[];
  totalFlow: number;
}

interface FacilityAllocation {
  unitProcessId: string;
  unitProcessName: string;
  processGroup: string;
  ratio: number;
  description?: string;
}

interface AirPollutionFacilityInput {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  relatedUnitProcesses: string[];
  hasFlowManagement: boolean;
  monthlyFlowData: MonthlyFlowData[];
  unitProcessFlowData: UnitProcessFlowData[];
  totalFlow: number;
  dqi: 'M' | 'C' | 'E' | '';
  allocationMethod: 'gas-flow' | 'product-volume' | 'direct-input';
  allocations: FacilityAllocation[];
  attachedFile?: File | null;
  remarks: string;
}

interface AirPollutionFacilityCardProps {
  facility: AirPollutionFacilityInput;
  unitProcesses: UnitProcess[];
  onUpdate: (facilityId: string, updates: Partial<AirPollutionFacilityInput>) => void;
  onDelete: (facilityId: string) => void;
  onSave: (facilityId: string) => void;
  canDelete: boolean;
}

const AirPollutionFacilityCard: React.FC<AirPollutionFacilityCardProps> = ({
  facility,
  unitProcesses,
  onUpdate,
  onDelete,
  onSave,
  canDelete,
}) => {


  // 유량 관리 여부 변경
  const handleFlowManagementChange = (hasFlow: boolean) => {
    const updates: Partial<AirPollutionFacilityInput> = {
      hasFlowManagement: hasFlow,
    };

    if (hasFlow) {
      // 유량 관리 활성화 시 할당방법을 무조건 배가스 유량으로 설정
      updates.allocationMethod = 'gas-flow';
    } else {
      // 유량 관리 비활성화 시 관련 데이터 초기화
      updates.monthlyFlowData = facility.monthlyFlowData.map(data => ({ ...data, flow: 0 }));
      updates.unitProcessFlowData = facility.unitProcessFlowData.map(data => ({
        ...data,
        monthlyFlowData: data.monthlyFlowData.map(month => ({ ...month, flow: 0 })),
        totalFlow: 0,
      }));
      updates.totalFlow = 0;
      updates.dqi = '';
      // 아니오 선택시 제품생산량 또는 직접 입력 중 하나 선택 (기본값: 제품생산량)
      updates.allocationMethod = 'product-volume';
    }

    onUpdate(facility.facilityId, updates);
  };

  // 월별 유량 변경
  const handleMonthlyFlowChange = (unitProcessId: string, month: number, flow: number) => {
    // 해당 단위공정의 월별 유량 데이터 업데이트
    const newUnitProcessFlowData = facility.unitProcessFlowData.map(data => {
      if (data.unitProcessId === unitProcessId) {
        const newMonthlyData = data.monthlyFlowData.map(monthData =>
          monthData.month === month ? { ...monthData, flow } : monthData
        );
        const newTotalFlow = newMonthlyData.reduce((sum, monthData) => sum + monthData.flow, 0);
        return {
          ...data,
          monthlyFlowData: newMonthlyData,
          totalFlow: newTotalFlow,
        };
      }
      return data;
    });

    // 해당 단위공정이 없으면 새로 추가
    if (!newUnitProcessFlowData.find(data => data.unitProcessId === unitProcessId)) {
      const monthlyFlowData = Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        flow: index + 1 === month ? flow : 0,
      }));
      newUnitProcessFlowData.push({
        unitProcessId,
        monthlyFlowData,
        totalFlow: flow,
      });
    }

    // 전체 시설의 월별 유량 및 총 유량 계산
    const facilityMonthlyFlowData = Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;
      const monthlyTotal = newUnitProcessFlowData.reduce((sum, processData) => {
        const monthData = processData.monthlyFlowData.find(m => m.month === monthNumber);
        return sum + (monthData?.flow || 0);
      }, 0);
      return { month: monthNumber, flow: monthlyTotal };
    });

    const totalFlow = facilityMonthlyFlowData.reduce((sum, data) => sum + data.flow, 0);

    // 유량 데이터가 입력되면 할당방법을 자동으로 배기가스 유량으로 설정
    const hasFlowData = totalFlow > 0;
    const newAllocationMethod = hasFlowData && facility.hasFlowManagement ? 'gas-flow' : facility.allocationMethod;

    // 배가스 유량으로 할당방법이 변경되면 자동으로 비율 계산
    let newAllocations = facility.allocations;
    if (newAllocationMethod === 'gas-flow' && facility.relatedUnitProcesses.length > 0) {
      newAllocations = facility.relatedUnitProcesses.map(processId => {
        const process = unitProcesses.find(p => p.id === processId);
        const processData = newUnitProcessFlowData.find(data => data.unitProcessId === processId);
        const processFlow = processData?.totalFlow || 0;
        const ratio = totalFlow > 0 ? (processFlow / totalFlow) * 100 : 0;
        
        return {
          unitProcessId: processId,
          unitProcessName: process?.name || '',
          processGroup: process?.processGroup || '',
          ratio: Math.round(ratio * 10) / 10,
          description: '배가스 유량 기준',
        };
      });
    }

    onUpdate(facility.facilityId, {
      monthlyFlowData: facilityMonthlyFlowData,
      unitProcessFlowData: newUnitProcessFlowData,
      totalFlow,
      allocationMethod: newAllocationMethod,
      allocations: newAllocations,
    });
  };

  // 단위공정 선택 변경 핸들러
  const handleUnitProcessSelectionChange = (selectedProcesses: string[]) => {
    // 선택된 단위공정으로 할당 배열 업데이트
    const newAllocations = selectedProcesses.map(processId => {
      const process = unitProcesses.find(p => p.id === processId);
      const existing = facility.allocations.find(a => a.unitProcessId === processId);
      return {
        unitProcessId: processId,
        unitProcessName: process?.name || '',
        processGroup: process?.processGroup || '',
        ratio: existing?.ratio || 0,
        description: existing?.description || '직접 입력',
      };
    });

    // 선택된 단위공정에 대한 유량 데이터 초기화
    const newUnitProcessFlowData = selectedProcesses.map(processId => {
      const existing = facility.unitProcessFlowData.find(data => data.unitProcessId === processId);
      return existing || {
        unitProcessId: processId,
        monthlyFlowData: Array.from({ length: 12 }, (_, index) => ({
          month: index + 1,
          flow: 0,
        })),
        totalFlow: 0,
      };
    });

    onUpdate(facility.facilityId, {
      relatedUnitProcesses: selectedProcesses,
      allocations: newAllocations,
      unitProcessFlowData: newUnitProcessFlowData,
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      {/* 시설 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={facility.facilityName}
            onChange={(e) => onUpdate(facility.facilityId, { facilityName: e.target.value })}
            className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
            placeholder="시설명"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSave(facility.facilityId)}
            className="flex items-center rounded-md text-sm bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <FaSave className="mr-1" size={12} />
            저장
          </button>
          
          {canDelete && (
            <button
              onClick={() => onDelete(facility.facilityId)}
              className="text-red-600 hover:text-red-800"
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 관련 단위공정 선택 */}
      <UnitProcessSelector
        title="관련 단위공정"
        unitProcesses={unitProcesses}
        selectedProcesses={facility.relatedUnitProcesses}
        onSelectionChange={handleUnitProcessSelectionChange}
        showBoilerIndicator={true}
      />

      {/* 배가스 유량 관리 여부 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-md font-medium text-gray-800 mb-3">
          대기오염방지시설로 유입되는 배가스의 유량을 관리합니까?
        </h4>
        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="radio"
              name={`flowManagement-${facility.facilityId}`}
              checked={facility.hasFlowManagement}
              onChange={() => handleFlowManagementChange(true)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">예</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name={`flowManagement-${facility.facilityId}`}
              checked={!facility.hasFlowManagement}
              onChange={() => handleFlowManagementChange(false)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">아니오</span>
          </label>
        </div>
        
        {facility.hasFlowManagement && (
          <div className="mt-4 text-sm text-green-700 bg-green-50 p-2 rounded">
            &apos;예&apos; 선택 시 아래 표 활성화
          </div>
        )}
      </div>

      {/* 배가스 유입유량 테이블 - 유량관리 시에만 표시 */}
      {facility.hasFlowManagement && (
        <FlowInputTable
          facility={facility}
          unitProcesses={unitProcesses}
          onMonthlyFlowChange={handleMonthlyFlowChange}
          onDQIChange={(dqi) => onUpdate(facility.facilityId, { dqi })}
          onFileChange={(file) => onUpdate(facility.facilityId, { attachedFile: file })}
          onRemarksChange={(remarks) => onUpdate(facility.facilityId, { remarks })}
        />
      )}

      {/* 단위공정으로 할당 */}
      {facility.relatedUnitProcesses.length > 0 && (
        <AllocationSection
          facility={facility}
          unitProcesses={unitProcesses}
          onUpdate={(updates) => onUpdate(facility.facilityId, updates)}
        />
      )}


    </div>
  );
};

export default AirPollutionFacilityCard; 