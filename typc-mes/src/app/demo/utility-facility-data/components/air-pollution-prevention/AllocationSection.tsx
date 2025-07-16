'use client';

import React, { useState } from 'react';
import { FaCalculator } from 'react-icons/fa';
import CalculationProcessModal from './CalculationProcessModal';

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

interface AllocationSectionProps {
  facility: AirPollutionFacilityInput;
  unitProcesses: UnitProcess[];
  onUpdate: (updates: Partial<AirPollutionFacilityInput>) => void;
}

const AllocationSection: React.FC<AllocationSectionProps> = ({
  facility,
  unitProcesses,
  onUpdate,
}) => {
  const [showCalculationModal, setShowCalculationModal] = useState(false);

  // 할당방법 변경
  const handleAllocationMethodChange = (
    method: 'gas-flow' | 'product-volume' | 'direct-input',
  ) => {
    let newAllocations = facility.allocations;

    if (method === 'gas-flow') {
      // 배가스 유량 기준으로 자동 계산
      newAllocations = facility.relatedUnitProcesses.map((processId) => {
        const process = unitProcesses.find((p) => p.id === processId);
        // 실제로는 각 단위공정별 유량 데이터를 기준으로 계산
        const ratio =
          Math.round((100 / facility.relatedUnitProcesses.length) * 10) / 10;

        return {
          unitProcessId: processId,
          unitProcessName: process?.name || '',
          processGroup: process?.processGroup || '',
          ratio,
          description: '배가스 유량 기준',
        };
      });
    } else if (method === 'product-volume') {
      // 제품 생산량 기준으로 자동 계산 (더미 로직)
      newAllocations = facility.relatedUnitProcesses.map((processId) => {
        const process = unitProcesses.find((p) => p.id === processId);
        // 실제로는 제품 생산량 데이터를 기준으로 계산
        const ratio =
          Math.round((100 / facility.relatedUnitProcesses.length) * 10) / 10;

        return {
          unitProcessId: processId,
          unitProcessName: process?.name || '',
          processGroup: process?.processGroup || '',
          ratio,
          description: '제품 생산량 기준',
        };
      });
    } else {
      // 직접 입력은 기존 비율 유지하되 0으로 초기화
      newAllocations = facility.relatedUnitProcesses.map((processId) => {
        const process = unitProcesses.find((p) => p.id === processId);
        const existing = facility.allocations.find(
          (a) => a.unitProcessId === processId,
        );

        return {
          unitProcessId: processId,
          unitProcessName: process?.name || '',
          processGroup: process?.processGroup || '',
          ratio: existing?.ratio || 0,
          description: '직접 입력',
        };
      });
    }

    onUpdate({
      allocationMethod: method,
      allocations: newAllocations,
    });
  };

  // 할당 비율 변경 (직접 입력 시)
  const handleAllocationRatioChange = (processId: string, ratio: number) => {
    const newAllocations = facility.allocations.map((allocation) =>
      allocation.unitProcessId === processId
        ? { ...allocation, ratio }
        : allocation,
    );

    onUpdate({
      allocations: newAllocations,
    });
  };

  // 할당방법 선택 가능 여부 확인
  const getAvailableMethods = () => {
    const hasFlowData = facility.totalFlow > 0 && facility.hasFlowManagement;
    const hasBoilerProcess = facility.relatedUnitProcesses.some((upId) => {
      const process = unitProcesses.find((up) => up.id === upId);
      return process?.hasBoiler;
    });

    return {
      'gas-flow': hasFlowData,
      'product-volume': !hasBoilerProcess,
      'direct-input': true,
    };
  };

  const availableMethods = getAvailableMethods();

  return (
    <div className="mt-6">
      <h4 className="text-md mb-3 font-medium text-gray-800">
        (2) 단위공정으로 할당
      </h4>

      {/* 할당 방법 선택 */}
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            할당 방법:
          </label>
          <div className="flex items-center space-x-2">
            <select
              value={facility.allocationMethod}
              onChange={(e) =>
                handleAllocationMethodChange(
                  e.target.value as
                    | 'gas-flow'
                    | 'product-volume'
                    | 'direct-input',
                )
              }
              disabled={facility.hasFlowManagement} // 유량관리 "예" 시 변경 불가
              className="rounded border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              {facility.hasFlowManagement ? (
                // 유량관리 "예"일 때: 배가스 유량만 선택 가능
                <option value="gas-flow">배가스 유량</option>
              ) : (
                // 유량관리 "아니오"일 때: 제품생산량, 직접 비율 입력만 선택 가능
                <>
                  <option
                    value="product-volume"
                    disabled={!availableMethods['product-volume']}
                  >
                    제품 생산량{' '}
                    {!availableMethods['product-volume'] &&
                      '(보일러 연동 시설 제외)'}
                  </option>
                  <option value="direct-input">비율 직접 입력</option>
                </>
              )}
            </select>

            <button
              onClick={() => setShowCalculationModal(true)}
              className="flex items-center rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
            >
              <FaCalculator className="mr-1" size={10} />
              계산과정
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          목록: 배가스 유량, 제품 생산량, 비율 직접 입력
        </div>
      </div>

      {/* 할당 방법 설명 */}
      <div className="mb-4 rounded-lg bg-green-50 p-3">
        {facility.hasFlowManagement ? (
          <div className="text-sm text-green-700">
            <strong>
              유량 관리 &apos;예&apos; 선택 시 → 할당 방법을 무조건 &apos;배가스
              유량&apos;으로 설정됩니다.
            </strong>
            <br />
            단위공정명, 비율은 월별 배가스 유량 데이터를 기준으로 자동으로
            계산됩니다.
          </div>
        ) : (
          <div className="text-sm text-green-700">
            <strong>
              유량 관리 &apos;아니오&apos; 선택 시 → 제품 생산량 또는 비율 직접
              입력을 선택할 수 있습니다.
            </strong>
            <br />
            관련 단위공정으로 &apos;보일러&apos;가 포함된 경우 할당 방법으로
            제품 생산량 선택이 불가합니다.
            <br />
            할당방법으로 제품 생산량을 선택했을 때 단위공정 별 제품 생산량이
            합산되어 비율로 계산되어 나옵니다.
          </div>
        )}
      </div>

      {/* 할당 비율 표시 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-blue-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">
                (1) 단위공정명
              </th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">
                (2) 비율
              </th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">
                (3) 할당 비율 설명
              </th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">
                (4) 파일 첨부
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {facility.allocations.map((allocation) => (
              <tr key={allocation.unitProcessId} className="hover:bg-gray-50">
                {/* (1) 단위공정명 - 자동표출 */}
                <td className="border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  {allocation.unitProcessName}
                  <span className="ml-1 text-xs text-gray-500">
                    ({allocation.processGroup})
                  </span>
                </td>

                {/* (2) 비율 */}
                <td className="border border-gray-300 px-3 py-2">
                  <div className="flex items-center space-x-2">
                    {facility.allocationMethod === 'direct-input' ? (
                      <input
                        type="number"
                        value={allocation.ratio}
                        onChange={(e) =>
                          handleAllocationRatioChange(
                            allocation.unitProcessId,
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        min="0"
                        max="100"
                        step="0.1"

                      />
                    ) : (
                      <span className="w-20 rounded bg-gray-50 px-2 py-1 text-right text-sm text-gray-600">
                        {allocation.ratio.toFixed(1)}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </td>

                {/* (3) 할당 비율 설명 - 자동표출 */}
                <td className="border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  {allocation.description}
                </td>

                {/* (4) 파일 첨부 */}
                <td className="border border-gray-300 px-3 py-2">
                  <input type="file" className="w-full text-xs" accept="*/*" />
                </td>
              </tr>
            ))}

            {/* 합계 행 */}
            <tr className="bg-blue-50 font-semibold">
              <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                합계
              </td>
              <td className="border border-gray-300 px-3 py-2 text-right text-sm">
                <div
                  className={`inline-block rounded px-2 py-1 text-sm font-bold ${
                    Math.abs(facility.allocations.reduce((sum, a) => sum + a.ratio, 0) - 100) < 0.01
                      ? 'border border-green-300 bg-green-100 text-green-700'
                      : 'border border-red-300 bg-red-100 text-red-700'
                  }`}
                >
                  {facility.allocations
                    .reduce((sum, a) => sum + a.ratio, 0)
                    .toFixed(1)}%
                </div>
              </td>
              <td className="border border-gray-300 px-3 py-2"></td>
              <td className="border border-gray-300 px-3 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 100% 검증 메시지 */}
      {Math.abs(facility.allocations.reduce((sum, a) => sum + a.ratio, 0) - 100) >= 0.01 && (
        <p className="mt-2 text-center text-xs text-red-600">
          ⚠️ 비율의 합이 정확히 100%가 되어야 합니다.
        </p>
      )}

      {/* 계산과정 모달 */}
      <CalculationProcessModal
        show={showCalculationModal}
        facility={facility}
        unitProcesses={unitProcesses}
        onClose={() => setShowCalculationModal(false)}
      />
    </div>
  );
};

export default AllocationSection;
