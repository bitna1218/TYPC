'use client';

import React from 'react';
import { FaSave } from 'react-icons/fa';
import UnitProcessSelector from '../common/UnitProcessSelector';

interface UnitProcess {
  id: string;
  name: string;
  processGroup: string;
}

interface BoilerAllocation {
  unitProcessId: string;
  unitProcessName: string;
  processGroup: string;
  ratio: number;
  description?: string;
  individualDescription?: string;
  attachedFile?: File | null;
}

interface BoilerData {
  id: string;
  name: string;
  relatedUnitProcesses: string[];
  allocationMethod: 'steam-usage' | 'product-volume' | 'facility-info' | 'direct-input';
  allocations: BoilerAllocation[];
  totalRatio: number;
  ratioCalculationDescription: string;
}

interface BoilerDetailFormProps {
  boiler: BoilerData;
  unitProcesses: UnitProcess[];
  onUpdate: (boilerId: string, updates: Partial<BoilerData>) => void;
  onSave: (boilerId: string) => void;
}

const BoilerDetailForm: React.FC<BoilerDetailFormProps> = ({
  boiler,
  unitProcesses,
  onUpdate,
  onSave,
}) => {
  // 단위공정 선택 변경 핸들러
  const handleUnitProcessSelectionChange = (selectedProcesses: string[]) => {
    // 선택된 단위공정들로 할당 정보 업데이트
    const newAllocations = selectedProcesses.map((upId) => {
      const existingAllocation = boiler.allocations.find(
        (alloc) => alloc.unitProcessId === upId,
      );
      const unitProcess = unitProcesses.find((up) => up.id === upId);
      return (
        existingAllocation || {
          unitProcessId: upId,
          unitProcessName: unitProcess?.name || '',
          processGroup: unitProcess?.processGroup || '',
          ratio: 0,
          description:
            boiler.allocationMethod === 'direct-input'
              ? '직접 입력'
              : '자동 계산',
        }
      );
    });

    const totalRatio = newAllocations.reduce(
      (sum, alloc) => sum + alloc.ratio,
      0,
    );

    onUpdate(boiler.id, {
      relatedUnitProcesses: selectedProcesses,
      allocations: newAllocations,
      totalRatio: parseFloat(totalRatio.toFixed(1)),
    });
  };

  // 할당 방법 변경 핸들러
  const handleAllocationMethodChange = (method: string) => {
    const newAllocations = boiler.allocations.map((alloc) => ({
      ...alloc,
      description: method === 'direct-input' ? '직접 입력' : '자동 계산',
    }));

    onUpdate(boiler.id, {
      allocationMethod: method as BoilerData['allocationMethod'],
      allocations: newAllocations,
    });
  };

  // 비율 변경 핸들러
  const handleRatioChange = (unitProcessId: string, value: string) => {
    const parsedValue = parseFloat(value);
    const newAllocations = boiler.allocations.map((alloc) =>
      alloc.unitProcessId === unitProcessId
        ? { ...alloc, ratio: isNaN(parsedValue) ? 0 : parsedValue }
        : alloc,
    );

    const totalRatio = newAllocations.reduce(
      (sum, alloc) => sum + alloc.ratio,
      0,
    );

    onUpdate(boiler.id, {
      allocations: newAllocations,
      totalRatio: parseFloat(totalRatio.toFixed(1)),
    });
  };

  // 비율 산정방법 설명 변경 핸들러
  const handleDescriptionChange = (description: string) => {
    onUpdate(boiler.id, {
      ratioCalculationDescription: description,
    });
  };

  // 개별 설명 변경 핸들러
  const handleIndividualDescriptionChange = (unitProcessId: string, description: string) => {
    const newAllocations = boiler.allocations.map((alloc) =>
      alloc.unitProcessId === unitProcessId
        ? { ...alloc, individualDescription: description }
        : alloc,
    );

    onUpdate(boiler.id, {
      allocations: newAllocations,
    });
  };

  // 개별 파일 첨부 핸들러
  const handleIndividualFileChange = (unitProcessId: string, file: File | null) => {
    const newAllocations = boiler.allocations.map((alloc) =>
      alloc.unitProcessId === unitProcessId
        ? { ...alloc, attachedFile: file }
        : alloc,
    );

    onUpdate(boiler.id, {
      allocations: newAllocations,
    });
  };

  const isReadOnlyRatio = (method: string) => method !== 'direct-input';

  // 저장 핸들러
  const handleSave = () => {
    // 검증 로직
    if (boiler.relatedUnitProcesses.length === 0) {
      alert('단위공정을 선택해주세요.');
      return;
    }

    if (Math.abs(boiler.totalRatio - 100) >= 0.01) {
      alert('할당 비율의 합이 100%가 되어야 합니다.');
      return;
    }

    onSave(boiler.id);
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white p-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">
          {boiler.name} 상세 설정
        </h3>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center rounded-md text-sm bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          <FaSave className="mr-2" />
          저장
        </button>
      </div>

      <div className="space-y-6">
        {/* 관련 단위공정 선택 */}
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
          <UnitProcessSelector
            title="단위공정 선택"
            unitProcesses={unitProcesses}
            selectedProcesses={boiler.relatedUnitProcesses}
            onSelectionChange={handleUnitProcessSelectionChange}
            showBoilerIndicator={false}
            className="mb-0"
          />
        </div>

        {/* 할당 방법 선택 */}
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  할당방법:
                </label>
                <select
                  value={boiler.allocationMethod}
                  onChange={(e) => handleAllocationMethodChange(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="steam-usage">스팀 사용량</option>
                  <option value="product-volume">제품 생산량</option>
                  <option value="direct-input">비율 직접 입력</option>
                </select>
              </div>
            </div>
          </div>

          {/* 설명 메시지 */}
          <div className="mt-4 space-y-2">
            {boiler.allocationMethod === 'product-volume' && (
              <div className="rounded border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm text-blue-700">
                  제품 생산량 기반으로 자동 할당됩니다. 별도 입력이 필요하지 않습니다.
                </p>
              </div>
            )}

            {boiler.allocationMethod === 'steam-usage' && (
              <div className="rounded border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm text-blue-700">
                  스팀 사용량 기반으로 자동 할당됩니다. 별도 입력이 필요하지 않습니다.
                </p>
              </div>
            )}

            {boiler.allocationMethod === 'direct-input' && (
              <div className="rounded border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-sm text-yellow-700">
                  단위공정별로 비율을 직접 입력해야 합니다. 각 범위별로 비율 합계가 100%가 되어야 합니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 할당 비율 작성 */}
        {boiler.relatedUnitProcesses.length > 0 && (
          <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
            <div className="mb-4">
              <h4 className="mb-2 flex items-center text-base font-semibold text-gray-800">
                보일러 할당 비율
              </h4>

              <div className="mb-4 flex items-center space-x-4">
                <input
                  type="text"
                  value={boiler.ratioCalculationDescription}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="비율 산정방법 설명"
                />
                <button
                  type="button"
                  className="rounded border border-gray-400 bg-gray-200 px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-300"
                  onClick={() => alert('파일 첨부 기능은 준비 중입니다.')}
                >
                  파일 첨부
                </button>
              </div>
            </div>

            {/* 할당 비율 테이블 */}
            <div className="rounded-lg border border-blue-300 bg-white shadow">
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
                    {boiler.allocations.map((allocation) => (
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
                            <input
                              type="number"
                              value={allocation.ratio.toString()}
                              onChange={(e) =>
                                handleRatioChange(allocation.unitProcessId, e.target.value)
                              }
                              readOnly={isReadOnlyRatio(boiler.allocationMethod)}
                              className={`w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                                isReadOnlyRatio(boiler.allocationMethod)
                                  ? 'cursor-not-allowed bg-gray-100'
                                  : ''
                              }`}
                              style={
                                boiler.allocationMethod === 'direct-input' 
                                  ? { backgroundColor: '#FFFF99' } 
                                  : {}
                              }
                              placeholder={
                                isReadOnlyRatio(boiler.allocationMethod)
                                  ? '자동 계산된 비율'
                                  : '비율(%)'
                              }
                            />
                            <span className="text-sm text-gray-500">%</span>
                          </div>
                        </td>

                        {/* (3) 할당 비율 설명 */}
                        <td className="border border-gray-300 px-3 py-2">
                          {boiler.allocationMethod === 'direct-input' ? (
                            <input
                              type="text"
                              value={allocation.individualDescription || ''}
                              onChange={(e) =>
                                handleIndividualDescriptionChange(
                                  allocation.unitProcessId, 
                                  e.target.value
                                )
                              }
                              className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              placeholder="할당 비율 설명"
                              style={{ backgroundColor: '#FFFF99' }}
                            />
                          ) : (
                            <span className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              {allocation.description}
                            </span>
                          )}
                        </td>

                        {/* (4) 파일 첨부 */}
                        <td className="border border-gray-300 px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="file" 
                              onChange={(e) => 
                                handleIndividualFileChange(
                                  allocation.unitProcessId, 
                                  e.target.files?.[0] || null
                                )
                              }
                              className="w-full text-xs" 
                              accept="*/*" 
                            />
                            {allocation.attachedFile && (
                              <span className="text-xs text-green-600">✓</span>
                            )}
                          </div>
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
                            Math.abs(boiler.totalRatio - 100) < 0.01
                              ? 'border border-green-300 bg-green-100 text-green-700'
                              : 'border border-red-300 bg-red-100 text-red-700'
                          }`}
                        >
                          {boiler.totalRatio.toFixed(1)}%
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2"></td>
                      <td className="border border-gray-300 px-3 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {Math.abs(boiler.totalRatio - 100) >= 0.01 && (
                <p className="mt-2 text-center text-xs text-red-600">
                  ⚠️ 비율의 합이 정확히 100%가 되어야 합니다.
                </p>
              )}
            </div>
          </div>
        )}

        {boiler.relatedUnitProcesses.length === 0 && (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-700">
              관련 단위공정을 선택해주세요.
            </p>
          </div>
        )}
      </div>


    </div>
  );
};

export default BoilerDetailForm;
