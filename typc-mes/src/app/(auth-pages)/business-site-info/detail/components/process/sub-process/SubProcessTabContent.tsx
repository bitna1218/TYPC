'use client';

import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus, FaInfoCircle, FaTrash, FaTimes, FaSave } from 'react-icons/fa';
import Tooltip from '../../common/Tooltip';
import { ProcessDetail } from '../ProcessTabContent'; // 상위 공정 타입 임포트
import PowerEquipmentTabContent from './equipment/PowerEquipmentTabContent'; // 전력 사용 설비 컴포넌트 임포트
import OutsourcingSelectionModal from './OutsourcingSelectionModal'; // 외주업체 선택 모달 임포트

// --- Interfaces ---
export interface SubProcessItem {
  id: number;
  parentProcessId: number; // 상위 4-1 공정의 ID
  buildingName: string; // 건물명 (상위 공정에서 가져옴, 읽기 전용)
  processClassification: string; // 공정 구분 (상위 공정에서 가져옴, 읽기 전용)
  processName: string; // 공정명 (상위 공정에서 가져옴, 읽기 전용)
  subProcessName: string; // 세부공정명 (편집 가능)
  outsourcingCompanies: string[]; // 외주업체명 배열 (다중 선택)
  description?: string; // 세부공정 설명 (편집 가능)
}

export type SubProcessInputValue = string | number | string[] | null | undefined;

// 통합된 세부공정 정보 인터페이스 (표시용)
interface ProcessWithSubProcesses {
  parentProcess: ProcessDetail;
  subProcesses: SubProcessItem[];
}

interface SubProcessTabContentProps {
  // 4-1에서 생성된 전체 공정 목록을 받아옴
  allProcessItems: ProcessDetail[]; 
}

// 더미 외주업체 목록 (향후 실제 데이터 또는 API 연동)
const DUMMY_OUTSOURCING_COMPANIES = [
  '외주업체 A', '외주업체 B', '외주업체 C', '협력사 D', '협력사 E', '외주업체 F'
];

const SubProcessTabContent: React.FC<SubProcessTabContentProps> = ({ 
  allProcessItems 
}) => {
  const [subProcessSectionCollapsed, setSubProcessSectionCollapsed] = useState(false);
  const [allSubProcessItems, setAllSubProcessItems] = useState<SubProcessItem[]>([]);
  const [selectedSubProcessId, setSelectedSubProcessId] = useState<number | null>(null);
  const [hasSavedSubProcesses, setHasSavedSubProcesses] = useState(false);
  const [collapsedProcesses, setCollapsedProcesses] = useState<Set<number>>(new Set());
  
  // 외주업체 선택 모달 상태
  const [outsourcingModalOpen, setOutsourcingModalOpen] = useState(false);
  const [currentSubProcessForModal, setCurrentSubProcessForModal] = useState<SubProcessItem | null>(null);

  // 필터 상태
  const [filters, setFilters] = useState({
    buildingName: '',
    processClassification: '',
    hasOutsourcing: '' // '전체', '외주포함', '외주제외'
  });

  const guidanceText = `
공정 별로 포함하는 세부공정을 작성합니다.\n
공정 구분이 '제조'일 경우엔 하나의 공정 안에 여러 개의 세부공정을 만들 수 있습니다.\n
공정 구분이 '유틸리티', '환경오염물질처리'일 경우엔 공정 안에 세부공정을 1개만 작성할 수 있습니다.\n
외주업체명을 선택한 세부공정은 설비도 조사하지 않고, 제조 공정 데이터 쓸 때에도 쓰지 않습니다.
  `;

  // 공정별로 그룹화된 데이터 준비
  const processWithSubProcesses: ProcessWithSubProcesses[] = allProcessItems.map(process => ({
    parentProcess: process,
    subProcesses: allSubProcessItems.filter(sp => sp.parentProcessId === process.id)
  }));

  // 필터링된 데이터 (모든 공정 그룹은 항상 표시)
  const filteredProcessWithSubProcesses = processWithSubProcesses
    .filter(group => {
      // 공정 자체 필터링 (건물명, 공정구분)
      if (filters.buildingName && group.parentProcess.buildingName !== filters.buildingName) return false;
      if (filters.processClassification && group.parentProcess.processClassification !== filters.processClassification) return false;
      return true;
    })
    .map(group => ({
      ...group,
      subProcesses: group.subProcesses.filter(sp => {
        // 세부공정 필터링 (외주업체 여부만)
        if (filters.hasOutsourcing === '외주포함' && sp.outsourcingCompanies.length === 0) return false;
        if (filters.hasOutsourcing === '외주제외' && sp.outsourcingCompanies.length > 0) return false;
        return true;
      })
    }));

  // 전체 세부공정 수
  const totalSubProcessCount = allSubProcessItems.length;
  const filteredSubProcessCount = filteredProcessWithSubProcesses.reduce(
    (sum, group) => sum + group.subProcesses.length, 0
  );

  // 고유 건물명과 공정구분 추출 (필터 옵션용)
  const uniqueBuildings = Array.from(new Set(allProcessItems.map(p => p.buildingName)));
  const uniqueClassifications = Array.from(new Set(allProcessItems.map(p => p.processClassification)));

  // 공정 접기/펼치기 핸들러
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

  // 상위 공정 정보 변경 시 세부공정 데이터 자동 동기화
  useEffect(() => {
    console.log('Loading sub-process data for all processes');
    console.log('Received allProcessItems:', allProcessItems); // 디버깅용
    
    // 상위 공정 정보가 변경되었을 때 세부공정의 정보도 자동 업데이트
    setAllSubProcessItems(prev => 
      prev.map(item => {
        const parentProcess = allProcessItems.find(p => p.id === item.parentProcessId);
        if (parentProcess && parentProcess.buildingName) {
          return {
            ...item,
            buildingName: parentProcess.buildingName,
            processClassification: parentProcess.processClassification,
            processName: parentProcess.processName,
          };
        }
        return item;
      })
    );

    // 자동 생성 제거: 사용자가 직접 "세부공정 추가" 버튼을 클릭해야 세부공정이 생성됨
  }, [allProcessItems]);

  const handleAddSubProcess = (parentProcessId: number) => {
    const parentProcess = allProcessItems.find(p => p.id === parentProcessId);
    if (!parentProcess) return;

    // 유틸리티/환경오염물질 처리 공정은 세부공정 1개만 허용
    const existingSubProcesses = allSubProcessItems.filter(sp => sp.parentProcessId === parentProcessId);
    if ((parentProcess.processClassification === '유틸리티' || 
         parentProcess.processClassification === '환경오염물질 처리') && 
         existingSubProcesses.length >= 1) {
      alert(`${parentProcess.processClassification} 공정에는 하나의 세부공정만 추가할 수 있습니다.`);
      return;
    }

    setAllSubProcessItems(prevItems => {
      const newId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.id)) + 1 : 1;
      const newItem: SubProcessItem = {
        id: newId,
        parentProcessId: parentProcessId,
        buildingName: parentProcess.buildingName || '',
        processClassification: parentProcess.processClassification,
        processName: parentProcess.processName,
        subProcessName: '',
        outsourcingCompanies: [],
        description: '',
      };
      setSelectedSubProcessId(newId);
      return [...prevItems, newItem];
    });
  };

  const handleDeleteSubProcess = (id: number) => {
    if (window.confirm('선택한 세부공정을 삭제하시겠습니까?')) {
      setAllSubProcessItems(prevItems => prevItems.filter(item => item.id !== id));
      if (selectedSubProcessId === id) {
        setSelectedSubProcessId(null);
      }
    }
  };

  const handleSubProcessInputChange = (
    id: number, 
    field: keyof SubProcessItem, 
    value: SubProcessInputValue
  ) => {
    setAllSubProcessItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };



  const handleRemoveOutsourcingCompany = (subProcessId: number, company: string) => {
    setAllSubProcessItems(prevItems =>
      prevItems.map(item => {
        if (item.id === subProcessId) {
          return { 
            ...item, 
            outsourcingCompanies: item.outsourcingCompanies.filter(c => c !== company) 
          };
        }
        return item;
      })
    );
  };

  const handleSaveSubProcesses = () => {
    if (allSubProcessItems.some(item => !item.subProcessName.trim())) {
      alert('세부공정명은 필수 항목입니다.');
      return;
    }
    console.log('Saving All Sub-Process Data:', allSubProcessItems);
    alert(`${allSubProcessItems.length}개의 세부공정 정보가 저장되었습니다. (콘솔 확인)`);
    setHasSavedSubProcesses(true);
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

  // 외주업체 모달 핸들러
  const handleOpenOutsourcingModal = (subProcess: SubProcessItem) => {
    setCurrentSubProcessForModal(subProcess);
    setOutsourcingModalOpen(true);
  };

  const handleCloseOutsourcingModal = () => {
    setOutsourcingModalOpen(false);
    setCurrentSubProcessForModal(null);
  };

  const handleOutsourcingSelectionChange = (companies: string[]) => {
    if (currentSubProcessForModal) {
      handleSubProcessInputChange(currentSubProcessForModal.id, 'outsourcingCompanies', companies);
    }
  };

  // 외주업체 선택 컴포넌트 (모달 버전)
  const OutsourcingSelector: React.FC<{ 
    subProcess: SubProcessItem; 
  }> = ({ subProcess }) => {
    return (
      <div className="space-y-2">
        {/* 선택된 외주업체 태그들 */}
        <div className="flex flex-wrap gap-1">
          {subProcess.outsourcingCompanies.map((company, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border border-gray-200"
            >
              {company}
              <button
                type="button"
                onClick={() => handleRemoveOutsourcingCompany(subProcess.id, company)}
                className="ml-1 text-gray-600 hover:text-gray-800"
              >
                <FaTimes size={10} />
              </button>
            </span>
          ))}
        </div>
        
        {/* 외주업체 선택 버튼 */}
        <button
          type="button"
          onClick={() => handleOpenOutsourcingModal(subProcess)}
          className="w-full px-3 py-2 text-left border border-gray-300 rounded-md hover:bg-gray-100 text-sm flex justify-between items-center"
        >
          <span className="text-gray-700">
            {subProcess.outsourcingCompanies.length > 0 
              ? `외주업체 수정 (${subProcess.outsourcingCompanies.length}개)` 
              : '외주업체 선택'
            }
          </span>
          <FaPlus className="text-gray-600" />
        </button>
      </div>
    );
  };

  if (allProcessItems.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6 mt-6'>
        <div className='flex items-center space-x-2 mb-4'>
          <h2 className='text-xl font-semibold text-gray-800'>4-2. 세부공정</h2>
        </div>
        <p className="text-gray-500">먼저 4-1. 공정 정보를 입력해주세요. 세부공정을 추가할 공정이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg mt-12'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          <h2 className='text-xl font-semibold text-gray-800'>4-2. 세부공정</h2>
          <Tooltip text={guidanceText} position="bottom">
            <FaInfoCircle className='text-gray-400 hover:text-gray-600 cursor-pointer' />
          </Tooltip>
          <button
            type='button'
            className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
            onClick={() => setSubProcessSectionCollapsed(!subProcessSectionCollapsed)}
            aria-label={subProcessSectionCollapsed ? '세부공정 섹션 펼치기' : '세부공정 섹션 접기'}
          >
            {subProcessSectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            총 {totalSubProcessCount}개 세부공정 
            {filteredSubProcessCount !== totalSubProcessCount && ` (${filteredSubProcessCount}개 표시)`}
          </div>
          {allSubProcessItems.length > 0 && renderSaveButton(handleSaveSubProcesses, hasSavedSubProcesses, "세부공정")}
        </div>
      </div>

      {!subProcessSectionCollapsed && (
        <>
          {/* 필터 섹션 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <label className="block text-xs font-medium text-gray-600 mb-1">외주업체</label>
                <select 
                  value={filters.hasOutsourcing}
                  onChange={(e) => setFilters(prev => ({ ...prev, hasOutsourcing: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">전체</option>
                  <option value="외주포함">외주업체 포함</option>
                  <option value="외주제외">외주업체 제외</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setFilters({ buildingName: '', processClassification: '', hasOutsourcing: '' })}
                  className="w-full px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          </div>

          {/* 통합 테이블 - Option A 시각적 계층화 */}
          <div className="space-y-6">
            {filteredProcessWithSubProcesses.map((group) => {
              const isExpanded = !collapsedProcesses.has(group.parentProcess.id);
              
              return (
                <div key={group.parentProcess.id} className="border rounded-lg overflow-hidden">
                  {/* 공정 헤더 - 클릭 가능 */}
                  <div 
                    className={`
                      flex justify-between items-center p-4 cursor-pointer transition-colors
                      ${isExpanded ? 'bg-blue-50 border-b border-blue-200' : 'bg-gray-100 hover:bg-gray-200'}
                    `}
                    onClick={() => handleToggleProcess(group.parentProcess.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {group.parentProcess.buildingName?.includes('공장') ? '🏭' : '🏢'}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {group.parentProcess.buildingName} - {group.parentProcess.processName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {group.parentProcess.processClassification} | 세부공정 {group.subProcesses.length}개
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {isExpanded ? '접기' : '펼치기'}
                      </span>
                      <div className="p-1 hover:bg-gray-200 rounded">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </div>
                  </div>

                  {/* 공정 내용 - 조건부 렌더링 */}
                  {isExpanded && (
                    <div className="p-4 bg-white">
                      <div className="flex justify-end mb-4">
                        <button
                          type="button"
                          onClick={() => handleAddSubProcess(group.parentProcess.id)}
                          disabled={
                            (group.parentProcess.processClassification === '유틸리티' || 
                             group.parentProcess.processClassification === '환경오염물질 처리') && 
                            group.subProcesses.length >= 1
                          }
                          className={`px-3 py-1 text-white rounded-md text-sm flex items-center ${
                            (group.parentProcess.processClassification === '유틸리티' || 
                             group.parentProcess.processClassification === '환경오염물질 처리') && 
                            group.subProcesses.length >= 1
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                          title={
                            (group.parentProcess.processClassification === '유틸리티' || 
                             group.parentProcess.processClassification === '환경오염물질 처리') && 
                            group.subProcesses.length >= 1
                              ? `${group.parentProcess.processClassification} 공정에는 세부공정을 1개만 추가할 수 있습니다.`
                              : ''
                          }
                        >
                          <FaPlus className="mr-1" /> 세부공정 추가
                        </button>
                      </div>
                      
                      {/* 데스크톱 테이블 - 시각적 계층화 적용 */}
                      <div className="hidden lg:block overflow-x-auto">
                        {group.subProcesses.length > 0 ? (
                          <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[8%]">
                                  번호
                                </th>
                                <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                                  건물명
                                </th>
                                <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[12%]">
                                  공정구분
                                </th>
                                <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                                  공정명
                                </th>
                                <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                                  세부공정명
                                </th>
                                <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                                  외주업체명
                                </th>
                                <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                                  세부공정 설명
                                </th>
                                <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[5%]">
                                  작업
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {group.subProcesses.map((subProcess, index) => (
                                <tr key={subProcess.id}>
                                  <td className="px-3 py-3 whitespace-nowrap text-center">{index + 1}</td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    {subProcess.buildingName}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    {subProcess.processClassification}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    {subProcess.processName}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    <input
                                      type="text"
                                      value={subProcess.subProcessName}
                                      onChange={(e) => handleSubProcessInputChange(subProcess.id, 'subProcessName', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                      placeholder="세부공정명 입력"
                                    />
                                  </td>
                                  <td className="px-3 py-3">
                                    <OutsourcingSelector 
                                      subProcess={subProcess} 
                                    />
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap">
                                    <input
                                      type="text"
                                      value={subProcess.description || ''}
                                      onChange={(e) => handleSubProcessInputChange(subProcess.id, 'description', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                      placeholder="세부공정 설명 (선택)"
                                    />
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSubProcess(subProcess.id)}
                                      className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100"
                                      aria-label="삭제"
                                    >
                                      <FaTrash />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            <p className="mb-2">등록된 세부공정이 없습니다.</p>
                            <p className="text-sm">세부공정을 추가하시려면 <strong>&ldquo;세부공정 추가&rdquo;</strong> 버튼을 클릭하세요.</p>
                          </div>
                        )}
                      </div>

                      {/* 모바일 카드 - 시각적 계층화 적용 */}
                      <div className="lg:hidden">
                        {group.subProcesses.length > 0 ? (
                          <div className="space-y-3">
                            {group.subProcesses.map((subProcess, index) => (
                              <div key={subProcess.id} className="border rounded-lg overflow-hidden">
                                {/* 읽기 전용 정보 섹션 */}
                                <div className="bg-gray-100 p-3 border-b">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className="text-sm font-medium text-gray-600">세부공정 #{index + 1}</span>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {subProcess.buildingName} | {subProcess.processClassification} | {subProcess.processName}
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSubProcess(subProcess.id)}
                                      className="p-1 text-red-500 hover:text-red-700"
                                      aria-label="삭제"
                                    >
                                      <FaTrash size={12} />
                                    </button>
                                  </div>
                                </div>
                                
                                {/* 편집 가능 정보 섹션 */}
                                <div className="p-3 bg-white space-y-3">
                                  <div className="bg-yellow-50 p-2 rounded">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">세부공정명</label>
                                    <input
                                      type="text"
                                      value={subProcess.subProcessName}
                                      onChange={(e) => handleSubProcessInputChange(subProcess.id, 'subProcessName', e.target.value)}
                                      className="w-full p-2 border border-yellow-300 rounded-md text-sm bg-white"
                                      placeholder="세부공정명 입력"
                                    />
                                  </div>
                                  <div className="bg-orange-50 p-2 rounded">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">외주업체명</label>
                                    <OutsourcingSelector 
                                      subProcess={subProcess} 
                                    />
                                  </div>
                                  <div className="bg-yellow-50 p-2 rounded">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">세부공정 설명</label>
                                    <textarea
                                      value={subProcess.description || ''}
                                      onChange={(e) => handleSubProcessInputChange(subProcess.id, 'description', e.target.value)}
                                      className="w-full p-2 border border-yellow-300 rounded-md text-sm h-20 bg-white"
                                      placeholder="세부공정 설명 (선택)"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            <p className="mb-2">등록된 세부공정이 없습니다.</p>
                            <p className="text-sm">세부공정을 추가하시려면 <strong>&ldquo;세부공정 추가&rdquo;</strong> 버튼을 클릭하세요.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}


            
            {filteredProcessWithSubProcesses.length === 0 && allSubProcessItems.length > 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>필터 조건에 맞는 세부공정이 없습니다.</p>
                <p className="text-sm mt-1">필터를 조정해주세요.</p>
              </div>
            )}
          </div>


        </>
      )}

      {/* 4-3. 전력 사용 설비 섹션: 세부공정이 저장되었을 때 표시 */}
      {hasSavedSubProcesses && (
        <PowerEquipmentTabContent 
          allSubProcessItems={allSubProcessItems}
          allProcessItems={allProcessItems}
        />
      )}

      {/* 외주업체 선택 모달 */}
      <OutsourcingSelectionModal
        isOpen={outsourcingModalOpen}
        onClose={handleCloseOutsourcingModal}
        availableCompanies={DUMMY_OUTSOURCING_COMPANIES}
        selectedCompanies={currentSubProcessForModal?.outsourcingCompanies || []}
        onSelectionChange={handleOutsourcingSelectionChange}
        processName={currentSubProcessForModal ? 
          `${currentSubProcessForModal.buildingName} - ${currentSubProcessForModal.processName}` : 
          ''
        }
      />
    </div>
  );
};

export default SubProcessTabContent; 