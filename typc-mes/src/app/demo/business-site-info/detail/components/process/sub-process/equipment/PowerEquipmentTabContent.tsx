'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaChevronDown, FaChevronUp, FaSave, FaInfoCircle } from 'react-icons/fa';
import { SubProcessItem } from '../SubProcessTabContent';
import { ProcessDetail } from '../../ProcessTabContent';
import Tooltip from '../../../common/Tooltip';

// --- Interfaces ---
export interface PowerEquipmentItem {
  id: number;
  parentSubProcessId: number; // 이 설비가 속한 4-2 세부공정의 ID
  equipmentName: string; // (4) 설비명
  capacityKw: number | ''; // (5) 용량(kW)
  numberOfUnits: number | ''; // (6) 대수(unit)
  dailyOperationHours: number | ''; // (7) 일평균 가동시간(h/d)
  annualOperationDays: number | ''; // (8) 연간 가동일수(d/yr)
  calculatedUsageKwh?: number; // (9) 사용량(kWh) - 자동계산
}

export type PowerEquipmentInputValue = string | number | null | undefined;

// 공정별 그룹화된 데이터 구조
interface ProcessWithSubProcesses {
  parentProcess: ProcessDetail;
  subProcesses: SubProcessItem[];
}

interface PowerEquipmentTabContentProps {
  allSubProcessItems: SubProcessItem[];
  allProcessItems: ProcessDetail[];
}

const PowerEquipmentTabContent: React.FC<PowerEquipmentTabContentProps> = ({
  allSubProcessItems,
  allProcessItems,
}) => {
  const [managesEquipmentInfo, setManagesEquipmentInfo] = useState<'yes' | 'no' | null>(null);
  const [equipmentItems, setEquipmentItems] = useState<PowerEquipmentItem[]>([]);
  const [collapsedProcesses, setCollapsedProcesses] = useState<Set<number>>(new Set());

  // 필터 상태
  const [filters, setFilters] = useState({
    buildingName: '',
    processClassification: '',
    processName: '',
    hasEquipment: '' // '전체', '설비있음', '설비없음'
  });

  const guidanceText = `
    전력 사용 설비의 정보 (용량, 가동시간)를 관리하고 있는지 확인합니다.\n
    질문에서 "아니오" 선택 시: OCF만 사용하는 경우 작성할 필요 없습니다.\n
    대상제품의 탄소배출량을 정확하게 계산하기 위해서는 사업장 전력 사용량을 해당 제품에 할당해야 합니다.\n
    설비운영 정보를 기반으로 할당하는 방법이 가장 정확하므로, 설비정보 작성을 권장합니다.
  `;

  // 유틸리티 시설이 있는지 확인
  const hasUtilityFacility = allSubProcessItems.some(
    subProcess => subProcess.processClassification === '유틸리티'
  );

  // 공정별로 그룹화된 데이터 준비
  const processWithSubProcesses: ProcessWithSubProcesses[] = allProcessItems.map(process => ({
    parentProcess: process,
    subProcesses: allSubProcessItems.filter(sp => sp.parentProcessId === process.id)
  })).filter(group => group.subProcesses.length > 0); // 세부공정이 있는 공정만

  // 고유 값들 추출 (필터 옵션용)
  const uniqueBuildings = Array.from(new Set(allProcessItems.map(p => p.buildingName)));
  const uniqueClassifications = Array.from(new Set(allProcessItems.map(p => p.processClassification)));
  const uniqueProcessNames = Array.from(new Set(allProcessItems.map(p => p.processName)));

  // 필터링된 데이터
  const filteredProcessWithSubProcesses = processWithSubProcesses
    .filter(group => {
      // 공정 자체 필터링 (건물명, 공정구분, 공정명)
      if (filters.buildingName && group.parentProcess.buildingName !== filters.buildingName) return false;
      if (filters.processClassification && group.parentProcess.processClassification !== filters.processClassification) return false;
      if (filters.processName && group.parentProcess.processName !== filters.processName) return false;
      return true;
    })
    .map(group => ({
      ...group,
      subProcesses: group.subProcesses.filter(sp => {
        // 세부공정 필터링 (설비 유무)
        const subProcessEquipments = equipmentItems.filter(item => item.parentSubProcessId === sp.id);
        if (filters.hasEquipment === '설비있음' && subProcessEquipments.length === 0) return false;
        if (filters.hasEquipment === '설비없음' && subProcessEquipments.length > 0) return false;
        return true;
      })
    }))
    .filter(group => group.subProcesses.length > 0); // 필터링 후 세부공정이 있는 공정만

  // 전체 세부공정 수와 필터링된 세부공정 수
  const totalSubProcessCount = processWithSubProcesses.reduce((sum, group) => sum + group.subProcesses.length, 0);
  const filteredSubProcessCount = filteredProcessWithSubProcesses.reduce((sum, group) => sum + group.subProcesses.length, 0);

  // 유틸리티 시설이 있으면 자동으로 "예" 선택
  useEffect(() => {
    if (hasUtilityFacility && managesEquipmentInfo === null) {
      setManagesEquipmentInfo('yes');
    }
  }, [hasUtilityFacility, managesEquipmentInfo]);

  const handleToggleProcess = (processId: number) => {
    setCollapsedProcesses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(processId)) {
        newSet.delete(processId);
      } else {
        newSet.add(processId);
      }
      return newSet;
    });
  };

  const handleAddEquipment = (subProcessId: number) => {
    const newId = equipmentItems.length > 0 ? Math.max(...equipmentItems.map(item => item.id)) + 1 : 1;
    const newItem: PowerEquipmentItem = {
      id: newId,
      parentSubProcessId: subProcessId,
      equipmentName: '',
      capacityKw: '',
      numberOfUnits: '',
      dailyOperationHours: '',
      annualOperationDays: '',
      calculatedUsageKwh: 0,
    };
    setEquipmentItems(prev => [...prev, newItem]);
  };

  const handleDeleteEquipment = (id: number) => {
    if (window.confirm('선택한 설비를 삭제하시겠습니까?')) {
      setEquipmentItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleEquipmentInputChange = (
    id: number,
    field: keyof PowerEquipmentItem,
    value: PowerEquipmentInputValue
  ) => {
    setEquipmentItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // 사용량 자동 계산
          if (['capacityKw', 'numberOfUnits', 'dailyOperationHours', 'annualOperationDays'].includes(field)) {
            const cap = parseFloat(String(updatedItem.capacityKw)) || 0;
            const num = parseFloat(String(updatedItem.numberOfUnits)) || 0;
            const hours = parseFloat(String(updatedItem.dailyOperationHours)) || 0;
            const days = parseFloat(String(updatedItem.annualOperationDays)) || 0;
            updatedItem.calculatedUsageKwh = cap * num * hours * days;
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  // 비율 계산 함수들
  const calculateSubProcessRatio = (subProcessId: number, equipmentUsage: number): number => {
    const subProcessEquipments = equipmentItems.filter(item => item.parentSubProcessId === subProcessId);
    const totalSubProcessUsage = subProcessEquipments.reduce((sum, item) => sum + (item.calculatedUsageKwh || 0), 0);
    return totalSubProcessUsage > 0 ? (equipmentUsage / totalSubProcessUsage) * 100 : 0;
  };

  const calculateProcessRatio = (subProcessId: number): number => {
    const subProcess = allSubProcessItems.find(sp => sp.id === subProcessId);
    if (!subProcess) return 0;
    
    const sameProcessSubProcesses = allSubProcessItems.filter(sp => sp.parentProcessId === subProcess.parentProcessId);
    const processEquipments = equipmentItems.filter(item => 
      sameProcessSubProcesses.some(sp => sp.id === item.parentSubProcessId)
    );
    const totalProcessUsage = processEquipments.reduce((sum, item) => sum + (item.calculatedUsageKwh || 0), 0);
    const subProcessUsage = equipmentItems.filter(item => item.parentSubProcessId === subProcessId)
      .reduce((sum, item) => sum + (item.calculatedUsageKwh || 0), 0);
    
    return totalProcessUsage > 0 ? (subProcessUsage / totalProcessUsage) * 100 : 0;
  };

  const calculateBuildingRatio = (subProcessId: number): number => {
    const subProcess = allSubProcessItems.find(sp => sp.id === subProcessId);
    if (!subProcess) return 0;
    
    const sameBuildingSubProcesses = allSubProcessItems.filter(sp => sp.buildingName === subProcess.buildingName);
    const buildingEquipments = equipmentItems.filter(item => 
      sameBuildingSubProcesses.some(sp => sp.id === item.parentSubProcessId)
    );
    const totalBuildingUsage = buildingEquipments.reduce((sum, item) => sum + (item.calculatedUsageKwh || 0), 0);
    const subProcessUsage = equipmentItems.filter(item => item.parentSubProcessId === subProcessId)
      .reduce((sum, item) => sum + (item.calculatedUsageKwh || 0), 0);
    
    return totalBuildingUsage > 0 ? (subProcessUsage / totalBuildingUsage) * 100 : 0;
  };

  const calculateSiteRatio = (subProcessId: number): number => {
    const totalSiteUsage = equipmentItems.reduce((sum, item) => sum + (item.calculatedUsageKwh || 0), 0);
    const subProcessUsage = equipmentItems.filter(item => item.parentSubProcessId === subProcessId)
      .reduce((sum, item) => sum + (item.calculatedUsageKwh || 0), 0);
    
    return totalSiteUsage > 0 ? (subProcessUsage / totalSiteUsage) * 100 : 0;
  };

  const [hasSavedEquipment, setHasSavedEquipment] = useState(false);

  const handleSaveEquipment = () => {
    if (equipmentItems.some(item => !item.equipmentName.trim())) {
      alert('설비명은 필수 항목입니다.');
      return;
    }
    console.log('Saving Power Equipment Data:', {
      managesEquipmentInfo,
      items: equipmentItems,
    });
    alert('전력 사용 설비 정보가 저장되었습니다. (콘솔 확인)');
    setHasSavedEquipment(true);
  };

  // 저장 버튼 렌더링 함수
  const renderSaveButton = (
    onSave: () => void,
    isSaved: boolean,
    label: string
  ) => (
    <div className='flex items-center gap-2'>
      {isSaved && (
        <span className='text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full'>
          저장됨
        </span>
      )}
      <button
        type='button'
        onClick={onSave}
        className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
          isSaved
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        <FaSave className='mr-1' />
        {label} 저장
      </button>
    </div>
  );

  if (allSubProcessItems.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6 mt-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>4-3. 전력 사용 설비</h3>
        <p className="text-gray-500">먼저 4-2. 세부공정 정보를 저장해주세요. 설비 정보를 입력할 세부공정이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg mt-12'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          <h3 className='text-xl font-semibold text-gray-800'>
            4-3. 전력 사용 설비
            <span className='text-sm font-normal text-gray-600 ml-2'>
              유틸리티 시설이 있을 경우 반드시 작성합니다.
            </span>
          </h3>
          <Tooltip text={guidanceText} position="bottom">
            <FaInfoCircle className='text-gray-400 hover:text-gray-600 cursor-pointer' />
          </Tooltip>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            총 {totalSubProcessCount}개 세부공정 
            {filteredSubProcessCount !== totalSubProcessCount && ` (${filteredSubProcessCount}개 표시)`}
          </div>
          {equipmentItems.length > 0 && renderSaveButton(handleSaveEquipment, hasSavedEquipment, "설비")}
        </div>
      </div>

      {/* 전력 사용 설비 정보 관리 여부 */}
      <div className='mb-6 p-4 border border-green-200 bg-green-50 rounded-md'>
        <p className='text-sm font-medium text-green-700 mb-2'>
          ✓ 전력 사용 설비의 정보 (용량, 가동시간)를 관리하고 있나요?
        </p>
        {hasUtilityFacility && (
          <p className='text-xs text-blue-600 mb-2'>
            유틸리티 시설이 감지되어 자동으로 &quot;예&quot;가 선택됩니다.
          </p>
        )}
        <div className='flex items-center space-x-6'>
          <label className='flex items-center space-x-2 cursor-pointer'>
            <input
              type='radio'
              name='managesEquipment'
              value='yes'
              checked={managesEquipmentInfo === 'yes'}
              onChange={() => setManagesEquipmentInfo('yes')}
              className='form-radio h-4 w-4 text-green-600'
            />
            <span className='text-sm'>예</span>
          </label>
          <label className='flex items-center space-x-2 cursor-pointer'>
            <input
              type='radio'
              name='managesEquipment'
              value='no'
              checked={managesEquipmentInfo === 'no'}
              onChange={() => setManagesEquipmentInfo('no')}
              className='form-radio h-4 w-4 text-red-600'
              disabled={hasUtilityFacility}
            />
            <span className={`text-sm ${hasUtilityFacility ? 'text-gray-400' : ''}`}>아니오</span>
          </label>
        </div>
      </div>

      {managesEquipmentInfo === 'yes' && (
        <>
          {/* 필터 섹션 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">건물명</label>
                <select 
                  value={filters.buildingName}
                  onChange={(e) => setFilters(prev => ({ ...prev, buildingName: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">전체</option>
                  {uniqueBuildings.map(building => (
                    <option key={building} value={building}>{building}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">공정구분</label>
                <select 
                  value={filters.processClassification}
                  onChange={(e) => setFilters(prev => ({ ...prev, processClassification: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">전체</option>
                  {uniqueClassifications.map(classification => (
                    <option key={classification} value={classification}>{classification}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">공정명</label>
                <select 
                  value={filters.processName}
                  onChange={(e) => setFilters(prev => ({ ...prev, processName: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">전체</option>
                  {uniqueProcessNames.map(processName => (
                    <option key={processName} value={processName}>{processName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">설비 유무</label>
                <select 
                  value={filters.hasEquipment}
                  onChange={(e) => setFilters(prev => ({ ...prev, hasEquipment: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">전체</option>
                  <option value="설비있음">설비 있음</option>
                  <option value="설비없음">설비 없음</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setFilters({ buildingName: '', processClassification: '', processName: '', hasEquipment: '' })}
                  className="w-full px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          </div>

          {/* 공정별 그룹화된 설비 목록 */}
          <div className="space-y-6">
            {filteredProcessWithSubProcesses.map((group) => {
              const isExpanded = !collapsedProcesses.has(group.parentProcess.id);
              
              return (
                <div key={group.parentProcess.id} className="border rounded-lg overflow-hidden">
                  {/* 공정 헤더 */}
                  <div 
                    className="bg-blue-50 px-4 py-3 border-b cursor-pointer"
                    onClick={() => handleToggleProcess(group.parentProcess.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {group.parentProcess.buildingName?.includes('공장') ? '🏭' : '🏢'}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {group.parentProcess.buildingName} - {group.parentProcess.processName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {group.parentProcess.processClassification} | 세부공정 {group.subProcesses.length}개
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {isExpanded ? '접기' : '펼치기'}
                        </span>
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </div>
                  </div>

                  {/* 공정 내용 */}
                  {isExpanded && (
                    <div className="p-4 bg-white">
                      {/* 데스크톱 테이블 */}
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
                                공정구분
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[150px]">
                                공정명
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[180px]">
                                세부공정명
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[150px]">
                                설비명
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
                                용량(kW)
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
                                대수
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[160px]">
                                일평균 가동시간(h/d)
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[160px]">
                                연간 가동일수(d/yr)
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[130px]">
                                사용량(kWh)
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[130px]">
                                세부공정기준(%)
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
                                공정기준(%)
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
                                건물기준(%)
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[130px]">
                                사업장기준(%)
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[130px]">
                                단위공정기준(%)
                              </th>
                              <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[80px]">
                                작업
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {group.subProcesses.map((subProcess) => {
                              const subProcessEquipments = equipmentItems.filter(
                                item => item.parentSubProcessId === subProcess.id
                              );
                              
                              if (subProcessEquipments.length === 0) {
                                // 설비가 없을 때 기본 행 표시
                                return (
                                  <tr key={`${subProcess.id}-empty`}>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                      {subProcess.processClassification}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                      {subProcess.processName}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                      <div className="flex justify-between items-center">
                                        <span>{subProcess.subProcessName}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleAddEquipment(subProcess.id)}
                                          className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 flex items-center"
                                        >
                                          <FaPlus size={10} className="mr-1" /> 추가
                                        </button>
                                      </div>
                                    </td>
                                    <td colSpan={12} className="px-3 py-3 text-center text-gray-500">
                                      설비 정보가 없습니다. &quot;추가&quot; 버튼을 클릭하여 설비를 추가해주세요.
                                    </td>
                                  </tr>
                                );
                              }
                              
                              return subProcessEquipments.map((equipment, equipmentIndex) => (
                                <tr key={equipment.id}>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    {equipmentIndex === 0 ? subProcess.processClassification : ''}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    {equipmentIndex === 0 ? subProcess.processName : ''}
                                  </td>
                                                                      <td className="px-3 py-3 whitespace-nowrap">
                                    <div className="flex justify-between items-center">
                                      <span>{equipmentIndex === 0 ? subProcess.subProcessName : ''}</span>
                                      {equipmentIndex === 0 && (
                                        <button
                                          type="button"
                                          onClick={() => handleAddEquipment(subProcess.id)}
                                          className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 flex items-center"
                                        >
                                          <FaPlus size={10} className="mr-1" /> 추가
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                  
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    <input
                                      type="text"
                                      value={equipment.equipmentName}
                                      onChange={(e) => handleEquipmentInputChange(equipment.id, 'equipmentName', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                      placeholder="설비명 입력"
                                    />
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    <input
                                      type="number"
                                      value={equipment.capacityKw}
                                      onChange={(e) => handleEquipmentInputChange(equipment.id, 'capacityKw', parseFloat(e.target.value) || '')}
                                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                      placeholder="용량"
                                    />
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    <input
                                      type="number"
                                      value={equipment.numberOfUnits}
                                      onChange={(e) => handleEquipmentInputChange(equipment.id, 'numberOfUnits', parseFloat(e.target.value) || '')}
                                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                      placeholder="대수"
                                    />
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    <input
                                      type="number"
                                      value={equipment.dailyOperationHours}
                                      onChange={(e) => handleEquipmentInputChange(equipment.id, 'dailyOperationHours', parseFloat(e.target.value) || '')}
                                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                      placeholder="시간"
                                    />
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    <input
                                      type="number"
                                      value={equipment.annualOperationDays}
                                      onChange={(e) => handleEquipmentInputChange(equipment.id, 'annualOperationDays', parseFloat(e.target.value) || '')}
                                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                      placeholder="일수"
                                    />
                                  </td>
                                  
                                  <td className="px-3 py-3 whitespace-nowrap font-medium">
                                    {equipment.calculatedUsageKwh?.toLocaleString() || '0'}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    {calculateSubProcessRatio(subProcess.id, equipment.calculatedUsageKwh || 0).toFixed(1)}%
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    {calculateProcessRatio(subProcess.id).toFixed(1)}%
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    {calculateBuildingRatio(subProcess.id).toFixed(1)}%
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    {calculateSiteRatio(subProcess.id).toFixed(1)}%
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-gray-500">
                                    -
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteEquipment(equipment.id)}
                                      className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100"
                                      aria-label="삭제"
                                    >
                                      <FaTrash />
                                    </button>
                                  </td>
                                </tr>
                              ));
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* 모바일 카드 (간단 버전) */}
                      <div className="lg:hidden">
                        {group.subProcesses.map((subProcess) => {
                          const subProcessEquipments = equipmentItems.filter(
                            item => item.parentSubProcessId === subProcess.id
                          );
                          
                          return (
                            <div key={subProcess.id} className="mb-4 border rounded-lg overflow-hidden">
                              <div className="bg-gray-100 p-3 border-b">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h5 className="font-medium text-gray-800">{subProcess.subProcessName}</h5>
                                    <p className="text-xs text-gray-600">
                                      {subProcess.processClassification} | {subProcess.processName}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleAddEquipment(subProcess.id)}
                                    className="px-2 py-1 bg-green-500 text-white rounded text-xs flex items-center"
                                  >
                                    <FaPlus size={10} className="mr-1" /> 추가
                                  </button>
                                </div>
                              </div>
                              
                              <div className="p-3 space-y-3">
                                {subProcessEquipments.length === 0 ? (
                                  <div className="text-center text-gray-500 py-6">
                                    <p className="text-sm">설비 정보가 없습니다.</p>
                                    <p className="text-xs text-gray-400 mt-1">&quot;추가&quot; 버튼을 클릭하여 설비를 추가해주세요.</p>
                                  </div>
                                ) : (
                                  subProcessEquipments.map((equipment) => (
                                    <div key={equipment.id} className="border rounded p-3 bg-yellow-50">
                                      <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-medium">설비 #{equipment.id}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteEquipment(equipment.id)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <FaTrash size={12} />
                                        </button>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <label className="block text-xs text-gray-600 mb-1">설비명</label>
                                          <input
                                            type="text"
                                            value={equipment.equipmentName}
                                            onChange={(e) => handleEquipmentInputChange(equipment.id, 'equipmentName', e.target.value)}
                                            className="w-full p-2 border rounded text-sm"
                                            placeholder="설비명"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs text-gray-600 mb-1">용량(kW)</label>
                                          <input
                                            type="number"
                                            value={equipment.capacityKw}
                                            onChange={(e) => handleEquipmentInputChange(equipment.id, 'capacityKw', parseFloat(e.target.value) || '')}
                                            className="w-full p-2 border rounded text-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs text-gray-600 mb-1">대수</label>
                                          <input
                                            type="number"
                                            value={equipment.numberOfUnits}
                                            onChange={(e) => handleEquipmentInputChange(equipment.id, 'numberOfUnits', parseFloat(e.target.value) || '')}
                                            className="w-full p-2 border rounded text-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs text-gray-600 mb-1">가동시간(h/d)</label>
                                          <input
                                            type="number"
                                            value={equipment.dailyOperationHours}
                                            onChange={(e) => handleEquipmentInputChange(equipment.id, 'dailyOperationHours', parseFloat(e.target.value) || '')}
                                            className="w-full p-2 border rounded text-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs text-gray-600 mb-1">가동일수(d/yr)</label>
                                          <input
                                            type="number"
                                            value={equipment.annualOperationDays}
                                            onChange={(e) => handleEquipmentInputChange(equipment.id, 'annualOperationDays', parseFloat(e.target.value) || '')}
                                            className="w-full p-2 border rounded text-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs text-gray-600 mb-1">사용량(kWh)</label>
                                          <div className="p-2 bg-blue-50 border rounded text-sm font-medium text-blue-800">
                                            {equipment.calculatedUsageKwh?.toLocaleString() || '0'}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {filteredProcessWithSubProcesses.length === 0 && equipmentItems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>필터 조건에 맞는 세부공정이 없습니다.</p>
                <p className="text-sm mt-1">필터를 조정해주세요.</p>
              </div>
            )}
          </div>


        </>
      )}

      {managesEquipmentInfo === 'no' && (
        <div className='p-4 border border-blue-200 bg-blue-50 rounded-md text-sm text-blue-700'>
          <p>
            대상제품의 탄소배출량을 정확하게 계산하기 위해서는 사업장 전력 사용량을 해당 제품에 할당해야 합니다. 
            설비운영 정보를 기반으로 할당하는 방법이 가장 정확하므로, 설비정보 작성을 권장합니다.
          </p>
        </div>
      )}

      {managesEquipmentInfo !== null && equipmentItems.length > 0 && (
        <div className='mt-6 p-3 bg-green-50 border border-green-200 rounded-md'>
          <p className='text-xs text-green-700'>
            <strong>안내:</strong> 단위공정 기준(%)는 [6. 단위공정] 단계에서 단위공정 설정이 완료된 후에 계산하여 표출합니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default PowerEquipmentTabContent;
