'use client';

import React, { useState, useEffect } from 'react';
import AirPollutionFacilityCard from './AirPollutionFacilityCard';
import FacilitySummaryCard from './FacilitySummaryCard';

interface UnitProcess {
  id: string;
  name: string;
  processGroup: string;
  hasBoiler?: boolean; // 보일러 연동 여부
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



interface AirPollutionPreventionTabContentProps {
  siteId?: string;
}

const AirPollutionPreventionTabContent: React.FC<
  AirPollutionPreventionTabContentProps
> = ({ siteId }) => {
  // 더미 데이터 - 단위공정 목록 (보일러 연동 정보 포함)
  const unitProcesses: UnitProcess[] = [
    {
      id: 'up1',
      name: '폴리에틸렌 생산공정',
      processGroup: '중합공정',
      hasBoiler: true,
    },
    {
      id: 'up2',
      name: '폴리프로필렌 생산공정',
      processGroup: '중합공정',
      hasBoiler: true,
    },
    {
      id: 'up3',
      name: '에틸렌 생산공정',
      processGroup: '분해공정',
      hasBoiler: false,
    },
    {
      id: 'up4',
      name: '프로필렌 생산공정',
      processGroup: '분해공정',
      hasBoiler: false,
    },
    {
      id: 'up5',
      name: '벤젠 생산공정',
      processGroup: '방향족공정',
      hasBoiler: false,
    },
    {
      id: 'up6',
      name: '톨루엔 생산공정',
      processGroup: '방향족공정',
      hasBoiler: false,
    },
  ];

  const [facilityInputData, setFacilityInputData] = useState<
    AirPollutionFacilityInput[]
  >([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);

  // 초기 데이터 생성 - 3개의 대기오염방지시설
  useEffect(() => {
    console.log('siteId', siteId);
    const initialData: AirPollutionFacilityInput[] = [
      {
        facilityId: 'facility1',
        facilityName: '대기오염방지시설 1',
        facilityType: 'bag-filter',
        relatedUnitProcesses: [],
        hasFlowManagement: false,
        monthlyFlowData: Array.from({ length: 12 }, (_, index) => ({
          month: index + 1,
          flow: 0,
        })),
        unitProcessFlowData: [],
        totalFlow: 0,
        dqi: '',
        allocationMethod: 'product-volume',
        allocations: [],
        attachedFile: null,
        remarks: '',
      },
      {
        facilityId: 'facility2',
        facilityName: '대기오염방지시설 2',
        facilityType: 'rto',
        relatedUnitProcesses: [],
        hasFlowManagement: false,
        monthlyFlowData: Array.from({ length: 12 }, (_, index) => ({
          month: index + 1,
          flow: 0,
        })),
        unitProcessFlowData: [],
        totalFlow: 0,
        dqi: '',
        allocationMethod: 'product-volume',
        allocations: [],
        attachedFile: null,
        remarks: '',
      },
      {
        facilityId: 'facility3',
        facilityName: '대기오염방지시설 3',
        facilityType: 'scrubber',
        relatedUnitProcesses: [],
        hasFlowManagement: false,
        monthlyFlowData: Array.from({ length: 12 }, (_, index) => ({
          month: index + 1,
          flow: 0,
        })),
        unitProcessFlowData: [],
        totalFlow: 0,
        dqi: '',
        allocationMethod: 'product-volume',
        allocations: [],
        attachedFile: null,
        remarks: '',
      },
    ];
    setFacilityInputData(initialData);
  }, [siteId]);

  // 첫 번째 시설을 기본 선택
  useEffect(() => {
    if (facilityInputData.length > 0 && !selectedFacilityId) {
      setSelectedFacilityId(facilityInputData[0].facilityId);
    }
  }, [facilityInputData, selectedFacilityId]);

  // 시설 삭제 (3개 시설 고정이므로 삭제 불가)
  const handleDeleteFacility = () => {
    alert('고정된 대기오염방지시설은 삭제할 수 없습니다.');
  };

  // 시설 업데이트
  const handleUpdateFacility = (
    facilityId: string,
    updates: Partial<AirPollutionFacilityInput>,
  ) => {
    setFacilityInputData((prev) =>
      prev.map((facility) =>
        facility.facilityId === facilityId
          ? { ...facility, ...updates }
          : facility,
      ),
    );
  };

  // 개별 시설 저장 핸들러
  const handleSaveFacility = (facilityId: string) => {
    const facility = facilityInputData.find(f => f.facilityId === facilityId);
    if (facility) {
      console.log('Saving facility data:', facility);
      alert(`${facility.facilityName} 데이터가 저장되었습니다.`);
    }
  };

  // 선택된 시설 찾기
  const selectedFacility = facilityInputData.find(f => f.facilityId === selectedFacilityId);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          2. 대기오염방지시설
        </h2>
      </div>

      {/* 안내 문구 */}
      <div className="mb-6 space-y-2">
        <div className="rounded-md border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">
            제조 단위공정, 보일러 단위공정이 목록으로 나옵니다.
          </p>
        </div>
      </div>

      {/* 시설별 요약 카드 - 가로 스크롤 */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-medium text-gray-800">시설 현황</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {facilityInputData.map((facility) => (
            <FacilitySummaryCard
              key={facility.facilityId}
              facility={facility}
              unitProcesses={unitProcesses}
              isSelected={facility.facilityId === selectedFacilityId}
              onClick={() => setSelectedFacilityId(facility.facilityId)}
            />
          ))}
        </div>
      </div>

      {/* 선택된 시설의 상세 정보 */}
      {selectedFacility && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-medium text-gray-800">
            {selectedFacility.facilityName} 상세 정보
          </h3>
          <AirPollutionFacilityCard
            facility={selectedFacility}
            unitProcesses={unitProcesses}
            onUpdate={handleUpdateFacility}
            onDelete={handleDeleteFacility}
            onSave={handleSaveFacility}
            canDelete={false}
          />
        </div>
      )}
    </div>
  );
};

export default AirPollutionPreventionTabContent;
