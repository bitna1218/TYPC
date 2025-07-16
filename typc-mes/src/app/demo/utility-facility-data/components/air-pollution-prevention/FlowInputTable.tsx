'use client';

import React from 'react';
import { FaUpload } from 'react-icons/fa';

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

// 단위공정별 월별 유량 데이터 추가
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

interface FlowInputTableProps {
  facility: AirPollutionFacilityInput;
  unitProcesses: UnitProcess[];
  onMonthlyFlowChange: (unitProcessId: string, month: number, flow: number) => void;
  onDQIChange: (dqi: 'M' | 'C' | 'E' | '') => void;
  onFileChange: (file: File | null) => void;
  onRemarksChange: (remarks: string) => void;
}

const FlowInputTable: React.FC<FlowInputTableProps> = ({
  facility,
  unitProcesses,
  onMonthlyFlowChange,
  onDQIChange,
  onFileChange,
  onRemarksChange,
}) => {
  return (
    <div className="mb-6">
      <h4 className="text-md mb-3 font-medium text-gray-800">
        (1) 배가스 유입유량
      </h4>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-blue-100">
            <tr>
              <th
                rowSpan={2}
                className="min-w-[120px] whitespace-nowrap border border-gray-300 px-2 py-3 align-middle text-sm font-medium text-gray-700"
              >
                (1)
                <br />
                단위공정명
              </th>
              <th
                rowSpan={2}
                className="min-w-[80px] whitespace-nowrap border border-gray-300 px-2 py-3 align-middle text-sm font-medium text-gray-700"
              >
                (2)
                <br />
                단위
              </th>
              <th
                rowSpan={2}
                className="min-w-[100px] whitespace-nowrap border border-gray-300 px-2 py-3 align-middle text-sm font-medium text-gray-700"
              >
                (3)
                <br />
                합계
              </th>
              <th
                colSpan={12}
                className="whitespace-nowrap border border-gray-300 px-2 py-3 align-middle text-sm font-medium text-gray-700"
              >
                (4) 월별 유입 유량
              </th>
              <th
                rowSpan={2}
                className="min-w-[80px] whitespace-nowrap border border-gray-300 px-2 py-3 align-middle text-sm font-medium text-gray-700"
              >
                (5)
                <br />
                DQI
              </th>
              <th
                rowSpan={2}
                className="min-w-[100px] whitespace-nowrap border border-gray-300 px-2 py-3 align-middle text-sm font-medium text-gray-700"
              >
                (6)
                <br />
                파일첨부
              </th>
              <th
                rowSpan={2}
                className="min-w-[100px] whitespace-nowrap border border-gray-300 px-2 py-3 align-middle text-sm font-medium text-gray-700"
              >
                비고
              </th>
            </tr>
            <tr>
              {Array.from({ length: 12 }, (_, i) => (
                <th
                  key={i}
                  className="min-w-[70px] whitespace-nowrap border border-gray-300 px-1 py-2 align-middle text-xs font-medium text-gray-700"
                >
                  {i + 1}월
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {/* 관련 단위공정별 행 생성 */}
            {facility.relatedUnitProcesses.length > 0 ? (
              facility.relatedUnitProcesses.map((processId) => {
                const process = unitProcesses.find((p) => p.id === processId);
                // 해당 단위공정의 월별 유량 데이터 찾기
                const unitProcessData = facility.unitProcessFlowData.find(
                  (data) => data.unitProcessId === processId
                );
                const processFlowData = unitProcessData?.monthlyFlowData || 
                  Array.from({ length: 12 }, (_, index) => ({
                    month: index + 1,
                    flow: 0,
                  }));
                const processTotal = unitProcessData?.totalFlow || 0;

                return (
                  <tr
                    key={processId}
                    className={`hover:bg-gray-50 ${!facility.hasFlowManagement ? 'opacity-50' : ''}`}
                  >
                    {/* (1) 단위공정명 - 자동표출 */}
                    <td className="whitespace-nowrap border border-gray-300 bg-gray-50 px-2 py-2 align-middle text-sm text-gray-600">
                      {process?.name || ''}
                    </td>

                    {/* (2) 단위 - 자동표출 */}
                    <td className="whitespace-nowrap border border-gray-300 bg-gray-50 px-2 py-2 text-center align-middle text-sm text-gray-600">
                      ㎥/hr
                    </td>

                    {/* (3) 합계 - 자동계산 */}
                    <td className="whitespace-nowrap border border-gray-300 bg-gray-50 px-2 py-2 text-right align-middle text-sm text-gray-600">
                      {processTotal.toLocaleString()}
                    </td>

                    {/* (4) 월별 유입유량 - 입력 */}
                    {processFlowData.map((monthData) => (
                      <td
                        key={monthData.month}
                        className="whitespace-nowrap border border-gray-300 px-1 py-1 align-middle"
                        style={{
                          backgroundColor: facility.hasFlowManagement
                            ? ''
                            : '#f3f4f6',
                        }}
                      >
                        <input
                          type="number"
                          value={monthData.flow || ''}
                          onChange={(e) =>
                            onMonthlyFlowChange(
                              processId,
                              monthData.month,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          disabled={!facility.hasFlowManagement}
                          className="w-full border-0 px-1 py-1 text-right text-xs focus:ring-1 focus:ring-blue-500 disabled:bg-transparent"
                          placeholder="0"
                          min="0"
                          step="0.01"
                          style={{ backgroundColor: 'transparent' }}
                        />
                      </td>
                    ))}

                    {/* (5) DQI - 첫 번째 행에만 표시 */}
                    {processId === facility.relatedUnitProcesses[0] && (
                      <td
                        rowSpan={facility.relatedUnitProcesses.length}
                        className="whitespace-nowrap border border-gray-300 px-1 py-1 align-middle"
                        style={{
                          backgroundColor: facility.hasFlowManagement
                            ? '#FFE6CC'
                            : '#f3f4f6',
                        }}
                      >
                        <select
                          value={facility.dqi}
                          onChange={(e) =>
                            onDQIChange(e.target.value as 'M' | 'C' | 'E' | '')
                          }
                          disabled={!facility.hasFlowManagement}
                          className="w-full border-0 px-1 py-1 text-xs focus:ring-1 focus:ring-blue-500 disabled:bg-transparent"
                          style={{ backgroundColor: 'transparent' }}
                        >
                          <option value="">-</option>
                          <option value="M">M</option>
                          <option value="C">C</option>
                          <option value="E">E</option>
                        </select>
                      </td>
                    )}

                    {/* (6) 파일첨부 - 첫 번째 행에만 표시 */}
                    {processId === facility.relatedUnitProcesses[0] && (
                      <td
                        rowSpan={facility.relatedUnitProcesses.length}
                        className="whitespace-nowrap border border-gray-300 px-2 py-2 align-middle"
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                onFileChange(e.target.files?.[0] || null)
                              }
                              disabled={!facility.hasFlowManagement}
                            />
                            <FaUpload
                              className={`${facility.hasFlowManagement ? 'text-blue-500 hover:text-blue-700' : 'text-gray-400'}`}
                            />
                          </label>
                          {facility.attachedFile && (
                            <span className="max-w-[80px] truncate text-xs text-gray-600">
                              {facility.attachedFile.name}
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {/* 비고 - 첫 번째 행에만 표시 */}
                    {processId === facility.relatedUnitProcesses[0] && (
                      <td
                        rowSpan={facility.relatedUnitProcesses.length}
                        className="whitespace-nowrap border border-gray-300 px-1 py-1 align-middle"
                      >
                        <input
                          type="text"
                          value={facility.remarks}
                          onChange={(e) => onRemarksChange(e.target.value)}
                          disabled={!facility.hasFlowManagement}
                          className="w-full border-0 px-1 py-1 text-xs focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                          placeholder="비고 입력"
                        />
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              // 단위공정이 선택되지 않은 경우
              <tr className="hover:bg-gray-50">
                <td
                  colSpan={17}
                  className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                >
                  관련 단위공정을 먼저 선택해주세요.
                </td>
              </tr>
            )}

            {/* 합계 행 */}
            {facility.relatedUnitProcesses.length > 0 && (
              <tr className="bg-blue-50 font-semibold">
                <td
                  colSpan={2}
                  className="whitespace-nowrap border border-gray-300 px-2 py-2 text-center align-middle text-sm"
                >
                  합계
                </td>
                <td className="whitespace-nowrap border border-gray-300 px-2 py-2 text-right align-middle text-sm">
                  {facility.totalFlow.toLocaleString()}
                </td>
                {Array.from({ length: 12 }, (_, i) => {
                  const monthlyTotal = facility.unitProcessFlowData.reduce((sum, processData) => {
                    const monthData = processData.monthlyFlowData.find(m => m.month === i + 1);
                    return sum + (monthData?.flow || 0);
                  }, 0);
                  return (
                    <td
                      key={`total-month-${i + 1}`}
                      className="whitespace-nowrap border border-gray-300 px-1 py-2 text-right align-middle text-sm"
                    >
                      {monthlyTotal.toLocaleString()}
                    </td>
                  );
                })}
                <td className="whitespace-nowrap border border-gray-300 px-2 py-2 align-middle"></td>
                <td className="whitespace-nowrap border border-gray-300 px-2 py-2 align-middle"></td>
                <td className="whitespace-nowrap border border-gray-300 px-1 py-1 align-middle"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!facility.hasFlowManagement && (
        <div className="mt-2 text-sm text-gray-500">
          * 배가스 유량 관리를 &apos;예&apos;로 선택하면 테이블이 활성화됩니다.
        </div>
      )}
    </div>
  );
};

export default FlowInputTable;
