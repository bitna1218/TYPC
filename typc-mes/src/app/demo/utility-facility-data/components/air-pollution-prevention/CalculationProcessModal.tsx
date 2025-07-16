'use client';

import React from 'react';
import { FaTimes } from 'react-icons/fa';

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
  totalFlow: number;
  dqi: 'M' | 'C' | 'E' | '';
  allocationMethod: 'gas-flow' | 'product-volume' | 'direct-input';
  allocations: FacilityAllocation[];
  attachedFile?: File | null;
  remarks: string;
}

interface CalculationProcessModalProps {
  show: boolean;
  facility: AirPollutionFacilityInput;
  unitProcesses: UnitProcess[];
  onClose: () => void;
}

const CalculationProcessModal: React.FC<CalculationProcessModalProps> = ({
  show,
  facility,
  onClose,
}) => {
  if (!show) return null;

  const renderGasFlowCalculation = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-800">
        배가스 유량 기준 계산과정
      </h3>

      <div className="rounded-lg bg-blue-50 p-4">
        <h4 className="mb-2 font-medium text-gray-800">계산 공식</h4>
        <p className="text-sm text-gray-700">
          각 단위공정별 할당비율(%) = (해당 단위공정의 월별 유량 합계 / 전체
          유량 합계) × 100
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-800">단위공정별 계산 결과</h4>
        {facility.allocations.map((allocation) => {
          // 더미 계산 로직 (실제로는 각 단위공정별 월별 유량 데이터 필요)
          const processFlow =
            facility.totalFlow / facility.relatedUnitProcesses.length;
          const calculationStep = `${processFlow.toFixed(1)} ÷ ${facility.totalFlow.toFixed(1)} × 100`;

          return (
            <div
              key={allocation.unitProcessId}
              className="rounded border border-gray-200 p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {allocation.unitProcessName}
                </span>
                <span className="text-sm text-blue-600">
                  {allocation.ratio.toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-gray-600">
                계산: {calculationStep} = {allocation.ratio.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded bg-gray-50 p-3">
        <div className="text-sm font-medium text-gray-800">
          전체 유량 합계: {facility.totalFlow.toLocaleString()} ㎥/hr
        </div>
        <div className="mt-1 text-sm text-gray-600">
          총 할당비율:{' '}
          {facility.allocations.reduce((sum, a) => sum + a.ratio, 0).toFixed(1)}
          %
        </div>
      </div>
    </div>
  );

  const renderProductVolumeCalculation = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-green-800">
        제품 생산량 기준 계산과정
      </h3>

      <div className="rounded-lg bg-green-50 p-4">
        <h4 className="mb-2 font-medium text-gray-800">계산 공식</h4>
        <p className="text-sm text-gray-700">
          각 단위공정별 할당비율(%) = (해당 단위공정의 제품 생산량 합계 / 전체
          제품 생산량 합계) × 100
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-800">단위공정별 계산 결과</h4>
        {facility.allocations.map((allocation) => {
          // 더미 계산 로직 (실제로는 제품 생산량 데이터에서 가져와야 함)
          const dummyProductVolume = Math.round(Math.random() * 1000 + 500);
          const totalProductVolume =
            facility.relatedUnitProcesses.length * dummyProductVolume;
          const calculationStep = `${dummyProductVolume.toLocaleString()} ÷ ${totalProductVolume.toLocaleString()} × 100`;

          return (
            <div
              key={allocation.unitProcessId}
              className="rounded border border-gray-200 p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {allocation.unitProcessName}
                </span>
                <span className="text-sm text-green-600">
                  {allocation.ratio.toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-gray-600">
                제품 생산량: {dummyProductVolume.toLocaleString()} kg
              </div>
              <div className="text-xs text-gray-600">
                계산: {calculationStep} = {allocation.ratio.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded bg-gray-50 p-3">
        <div className="text-sm font-medium text-gray-800">
          전체 제품 생산량 합계:{' '}
          {(facility.relatedUnitProcesses.length * 750).toLocaleString()} kg
        </div>
        <div className="mt-1 text-sm text-gray-600">
          총 할당비율:{' '}
          {facility.allocations.reduce((sum, a) => sum + a.ratio, 0).toFixed(1)}
          %
        </div>
      </div>
    </div>
  );

  const renderDirectInputCalculation = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-purple-800">비율 직접 입력</h3>

      <div className="rounded-lg bg-purple-50 p-4">
        <h4 className="mb-2 font-medium text-gray-800">입력 방식</h4>
        <p className="text-sm text-gray-700">
          사용자가 각 단위공정별 할당 비율을 직접 입력합니다.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-800">현재 설정된 비율</h4>
        {facility.allocations.map((allocation) => (
          <div
            key={allocation.unitProcessId}
            className="rounded border border-gray-200 p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {allocation.unitProcessName}
              </span>
              <span className="text-sm text-purple-600">
                {allocation.ratio.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded bg-gray-50 p-3">
        <div className="text-sm font-medium text-gray-800">
          총 할당비율:{' '}
          {facility.allocations.reduce((sum, a) => sum + a.ratio, 0).toFixed(1)}
          %
        </div>
        {facility.allocations.reduce((sum, a) => sum + a.ratio, 0) !== 100 && (
          <div className="mt-1 text-sm text-red-600">
            ⚠️ 총 비율이 100%가 되도록 조정해주세요.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {facility.facilityName} - 할당 비율 계산과정
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {facility.allocationMethod === 'gas-flow' &&
            renderGasFlowCalculation()}
          {facility.allocationMethod === 'product-volume' &&
            renderProductVolumeCalculation()}
          {facility.allocationMethod === 'direct-input' &&
            renderDirectInputCalculation()}
        </div>

        {/* 푸터 */}
        <div className="flex justify-end border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculationProcessModal;
