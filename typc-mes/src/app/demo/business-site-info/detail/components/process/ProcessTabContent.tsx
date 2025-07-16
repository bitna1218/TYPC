'use client';

import React, { useState, useEffect } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaInfoCircle,
  FaSave,
} from 'react-icons/fa';
import Tooltip from '../common/Tooltip'; // Corrected path
import SubProcessTabContent from './sub-process/SubProcessTabContent'; // 세부공정 컴포넌트 임포트
import ProcessDeskTopForm from './ProcessDeskTopForm'; // 데스크톱 폼 컴포넌트 임포트
import ProcessMobileForm from './ProcessMobileForm'; // 모바일 폼 컴포넌트 임포트

// --- Interfaces ---
export interface ProcessDetail {
  id: number;
  processClassification: '제조' | '유틸리티' | '환경오염물질 처리' | '';
  processName: string;
  processDescription: string;
  buildingName?: string; // 세부공정으로 전달할 때 추가되는 필드
}

export interface ProcessDetailWithBuilding extends ProcessDetail {
  buildingName: string; // 세부공정에서 사용할 때는 필수
}

export interface BuildingWithProcesses {
  buildingId: number;
  buildingName: string;
  isProductionRelated: boolean;
  processes: ProcessDetail[];
}

// 건물 데이터 인터페이스 (기존 유지)
export interface BuildingOption {
  id: number;
  name: string;
  isProductionRelated: boolean;
}

export type ProcessInputValue = string | number | null | undefined;

interface ProcessTabContentProps {
  siteId?: string;
  buildingsList?: BuildingOption[];
  utilityEquipmentList?: string[];
  environmentalFacilitiesList?: string[];
}

// 더미 데이터 (향후 실제 데이터로 대체)
const DUMMY_BUILDINGS: BuildingOption[] = [
  { id: 1, name: '제1공장동', isProductionRelated: true },
  { id: 2, name: '제2공장동', isProductionRelated: true },
  // { id: 3, name: '행정동', isProductionRelated: false },
];
// UtilityQuestionnaire에서 '예'로 선택된 항목들 (실제로는 해당 컴포넌트에서 전달받아야 함)
const DUMMY_UTILITY_EQUIPMENT = ['스팀 생산보일러', '공기압축기'];
// 환경오염물질 처리시설에서 '예'로 선택된 항목들 (실제로는 해당 컴포넌트에서 전달받아야 함)
const DUMMY_ENVIRONMENTAL_FACILITIES = ['폐수처리장', '대기오염방지시설'];

const ProcessTabContent: React.FC<ProcessTabContentProps> = ({
  siteId,
  buildingsList = DUMMY_BUILDINGS,
  utilityEquipmentList = DUMMY_UTILITY_EQUIPMENT,
  environmentalFacilitiesList = DUMMY_ENVIRONMENTAL_FACILITIES
}) => {
  const [processSectionCollapsed, setProcessSectionCollapsed] = useState(false);
  const [buildingsWithProcesses, setBuildingsWithProcesses] = useState<BuildingWithProcesses[]>([]);
  const [collapsedBuildings, setCollapsedBuildings] = useState<Set<number>>(new Set());
  const [hasSavedProcesses, setHasSavedProcesses] = useState(false);

  const processClassificationOptions: ProcessDetail['processClassification'][] = [
    '제조',
    '유틸리티',
    '환경오염물질 처리',
  ];

  const guidanceText = `
    건물 별로 포함하고 있는 공정의 공정 구분을 선택하고 공정명과 설명을 작성합니다.\n
    전력 사용량을 건물 단위로 관리하는 경우, 실제 해당 건물에 속한 공정이 아닌 건물의 전력 사용량의 관점에서 건물 전력 사용량에 포함되어 있는 공정들을 작성합니다.\n
    전력 사용량을 사업장 단위로 관리하는 경우, 대기오염방지시설과 같이 건물의 구분이 어려운 시설의 경우에는 별도의 건물로 작성할 수 있습니다.
  `;

  // 건물 목록을 기반으로 초기 데이터 설정
  useEffect(() => {
    if (buildingsList.length > 0 && buildingsWithProcesses.length === 0) {
      // 비생산 관련 건물들을 기본적으로 접어놓기
      const nonProductionBuildings = new Set(
        buildingsList.filter(building => !building.isProductionRelated).map(building => building.id)
      );
      setCollapsedBuildings(nonProductionBuildings);

      // 생산 관련 건물만 기본 공정을 생성
      const initialBuildings = buildingsList.map(building => ({
        buildingId: building.id,
        buildingName: building.name,
        isProductionRelated: building.isProductionRelated,
        processes: building.isProductionRelated ? [
          {
            id: 1,
            processClassification: '' as ProcessDetail['processClassification'],
            processName: '',
            processDescription: '',
          }
        ] : []
      }));
      setBuildingsWithProcesses(initialBuildings);
    }
  }, [buildingsList, buildingsWithProcesses.length]);

  useEffect(() => {
    if (siteId) {
      console.log(`ProcessTabContent: Loading data for site ID ${siteId}`);
      // 여기에 siteId 기반 데이터 로딩 로직 추가
    }
  }, [siteId]);

  // 건물 아코디언 토글 핸들러
  const handleToggleBuilding = (buildingId: number) => {
    setCollapsedBuildings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(buildingId)) {
        newSet.delete(buildingId);
        // 건물을 펼칠 때 공정이 없다면 기본 공정 추가
        const building = buildingsWithProcesses.find(b => b.buildingId === buildingId);
        if (building && building.processes.length === 0) {
          handleAddProcess(buildingId);
        }
      } else {
        newSet.add(buildingId);
      }
      return newSet;
    });
  };

  const handleAddProcess = (buildingId: number) => {
    setBuildingsWithProcesses(prevBuildings =>
      prevBuildings.map(building => {
        if (building.buildingId === buildingId) {
          const newProcessId = building.processes.length > 0
            ? Math.max(...building.processes.map(p => p.id)) + 1
            : 1;
          const newProcess: ProcessDetail = {
            id: newProcessId,
            processClassification: '',
            processName: '',
            processDescription: '',
          };
          return {
            ...building,
            processes: [...building.processes, newProcess]
          };
        }
        return building;
      })
    );
  };

  const handleDeleteProcess = (buildingId: number, processId: number) => {
    setBuildingsWithProcesses(prevBuildings =>
      prevBuildings.map(building => {
        if (building.buildingId === buildingId) {
          if (building.processes.length <= 1) {
            alert('각 건물마다 최소 1개 이상의 공정 정보가 필요합니다.');
            return building;
          }
          return {
            ...building,
            processes: building.processes.filter(process => process.id !== processId)
          };
        }
        return building;
      })
    );
  };

  const handleProcessInputChange = (
    buildingId: number,
    processId: number,
    field: keyof ProcessDetail,
    value: ProcessInputValue
  ) => {
    setBuildingsWithProcesses(prevBuildings =>
      prevBuildings.map(building => {
        if (building.buildingId === buildingId) {
          return {
            ...building,
            processes: building.processes.map(process => {
              if (process.id === processId) {
                const updatedProcess = { ...process, [field]: value };
                // 공정 구분 변경 시 공정명 초기화
                if (field === 'processClassification') {
                  updatedProcess.processName = '';
                }
                return updatedProcess;
              }
              return process;
            })
          };
        }
        return building;
      })
    );
  };

  const handleSaveProcesses = () => {
    // 공정이 있는 건물들만 검증 (빈 processes 배열 제외)
    const buildingsWithActualProcesses = buildingsWithProcesses.filter(building => 
      building.processes.length > 0
    );

    // 공정이 있는 건물 중에서 미완성 데이터가 있는지 확인
    const hasIncompleteData = buildingsWithActualProcesses.some(building =>
      building.processes.some(process =>
        !process.processClassification.trim() || !process.processName.trim()
      )
    );

    if (hasIncompleteData) {
      alert('공정이 등록된 건물의 공정 구분과 공정명은 필수 항목입니다.')
      return;
    }

    // 최소 1개 이상의 공정이 있는지 확인
    if (buildingsWithActualProcesses.length === 0) {
      alert('최소 1개 이상의 건물에 공정 정보를 등록해주세요.');
      return;
    }

    console.log('Saving Process Data:', { 
      buildingsWithActualProcesses: buildingsWithActualProcesses,
      totalBuildings: buildingsWithProcesses.length,
      processedBuildings: buildingsWithActualProcesses.length 
    });
    alert('공정 정보가 저장되었습니다. (콘솔 확인)');
    setHasSavedProcesses(true);
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

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mt-6'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          <h2 className='text-xl font-semibold text-gray-800'>4-1. 공정</h2>
          <Tooltip text={guidanceText} position='bottom'>
            <FaInfoCircle className='text-gray-400 hover:text-gray-600 cursor-pointer' />
          </Tooltip>
          <button
            type='button'
            className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
            onClick={() => setProcessSectionCollapsed(!processSectionCollapsed)}
            aria-label={
              processSectionCollapsed ? '공정 섹션 펼치기' : '공정 섹션 접기'
            }
          >
            {processSectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </button>
        </div>
        {renderSaveButton(handleSaveProcesses, hasSavedProcesses, "공정")}
      </div>

      {!processSectionCollapsed && (
        <div className='space-y-8'>
          <div className='space-y-4'>
            {buildingsWithProcesses.map((building) => {
              const isExpanded = !collapsedBuildings.has(building.buildingId);
              
              return (
                <div key={building.buildingId} className='border rounded-md overflow-hidden'>
                  {/* 건물 헤더 - 클릭 가능 */}
                  <div 
                    className={`
                      flex justify-between items-center p-4 cursor-pointer transition-colors
                      ${isExpanded ? 'bg-blue-50 border-b border-blue-200' : 'bg-gray-100 hover:bg-gray-200'}
                      ${building.isProductionRelated ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-gray-400'}
                    `}
                    onClick={() => handleToggleBuilding(building.buildingId)}
                  >
                    <div className='flex items-center space-x-3'>
                      <span className='text-lg'>
                        {building.isProductionRelated ? '🏭' : '🏢'}
                      </span>
                      <h3 className='text-lg font-semibold text-gray-700'>
                        {building.buildingName}
                      </h3>
                      {building.isProductionRelated && (
                        <span className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded'>
                          생산관련
                        </span>
                      )}
                      {building.processes.length > 0 && (
                        <span className='text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded'>
                          공정 {building.processes.length}개
                        </span>
                      )}
                    </div>
                    
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm text-gray-500'>
                        {isExpanded ? '접기' : '펼치기'}
                      </span>
                      <div className='p-1 hover:bg-gray-200 rounded'>
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </div>
                  </div>

                  {/* 건물 내용 - 조건부 렌더링 */}
                  {isExpanded && (
                    <div className='p-4 bg-white'>
                      <div className='flex justify-end mb-4'>
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddProcess(building.buildingId);
                          }}
                          className='px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center'
                        >
                          <FaPlus className='mr-1' /> 공정 추가
                        </button>
                      </div>
                      
                      {/* 모바일 뷰 */}
                      <div className='lg:hidden'>
                        <ProcessMobileForm
                          buildingId={building.buildingId}
                          processes={building.processes}
                          processClassificationOptions={processClassificationOptions}
                          utilityEquipmentList={utilityEquipmentList}
                          environmentalFacilitiesList={environmentalFacilitiesList}
                          onProcessInputChange={handleProcessInputChange}
                          onDeleteProcess={handleDeleteProcess}
                        />
                      </div>

                      {/* 데스크톱 뷰 */}
                      <div className='hidden lg:block'>
                        <ProcessDeskTopForm
                          buildingId={building.buildingId}
                          processes={building.processes}
                          processClassificationOptions={processClassificationOptions}
                          utilityEquipmentList={utilityEquipmentList}
                          environmentalFacilitiesList={environmentalFacilitiesList}
                          onProcessInputChange={handleProcessInputChange}
                          onDeleteProcess={handleDeleteProcess}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {buildingsWithProcesses.length === 0 && (
              <p className='text-center text-gray-500 py-4'>건물 정보를 불러오는 중...</p>
            )}
          </div>


        </div>
      )}

      {/* 4-2. 세부공정 섹션: 저장 후, 공정 아이템이 있을 때만 표시 */}
      {hasSavedProcesses && buildingsWithProcesses.length > 0 && (
        <SubProcessTabContent 
          allProcessItems={buildingsWithProcesses.flatMap((building, buildingIndex) => 
            building.processes.map((process) => ({
              id: buildingIndex * 1000 + process.id, // 전역적으로 고유한 ID 생성
              buildingName: building.buildingName,
              processClassification: process.processClassification,
              processName: process.processName,
              processDescription: process.processDescription,
            }))
          )} 
        />
      )}
    </div>
  );
};

export default ProcessTabContent;
