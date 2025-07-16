'use client';

import React, { useState, useEffect } from 'react';
import BoilerSummaryCard from './BoilerSummaryCard';
import BoilerDetailForm from './BoilerDetailForm';

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

interface BoilerTabContentProps {
  siteId?: string;
}

const BoilerTabContent: React.FC<BoilerTabContentProps> = () => {
  // 더미 데이터 - 단위공정 목록
  const unitProcesses: UnitProcess[] = [
    { id: 'up1', name: '폴리에틸렌 생산공정', processGroup: '중합공정' },
    { id: 'up2', name: '폴리프로필렌 생산공정', processGroup: '중합공정' },
    { id: 'up3', name: '에틸렌 생산공정', processGroup: '분해공정' },
    { id: 'up4', name: '프로필렌 생산공정', processGroup: '분해공정' },
    { id: 'up5', name: '벤젠 생산공정', processGroup: '방향족공정' },
    { id: 'up6', name: '톨루엔 생산공정', processGroup: '방향족공정' },
  ];

  // 상태 관리
  const [boilers, setBoilers] = useState<BoilerData[]>([
    {
      id: 'boiler1',
      name: '보일러 1',
      relatedUnitProcesses: ['up1', 'up2'],
      allocationMethod: 'steam-usage',
      allocations: [
        {
          unitProcessId: 'up1',
          unitProcessName: '폴리에틸렌 생산공정',
          processGroup: '중합공정',
          ratio: 60,
          description: '스팀 사용량 기준',
        },
        {
          unitProcessId: 'up2',
          unitProcessName: '폴리프로필렌 생산공정',
          processGroup: '중합공정',
          ratio: 40,
          description: '스팀 사용량 기준',
        },
      ],
      totalRatio: 100,
      ratioCalculationDescription: '',
    },
    {
      id: 'boiler2',
      name: '보일러 2',
      relatedUnitProcesses: ['up3', 'up4', 'up5'],
      allocationMethod: 'direct-input',
      allocations: [
        {
          unitProcessId: 'up3',
          unitProcessName: '에틸렌 생산공정',
          processGroup: '분해공정',
          ratio: 45,
          description: '직접 입력',
        },
        {
          unitProcessId: 'up4',
          unitProcessName: '프로필렌 생산공정',
          processGroup: '분해공정',
          ratio: 35,
          description: '직접 입력',
        },
        {
          unitProcessId: 'up5',
          unitProcessName: '벤젠 생산공정',
          processGroup: '방향족공정',
          ratio: 15,
          description: '직접 입력',
        },
      ],
      totalRatio: 95,
      ratioCalculationDescription: '',
    },
    {
      id: 'boiler3',
      name: '보일러 3',
      relatedUnitProcesses: [],
      allocationMethod: 'steam-usage',
      allocations: [],
      totalRatio: 0,
      ratioCalculationDescription: '',
    },
  ]);

  const [selectedBoilerId, setSelectedBoilerId] = useState<string | null>(null);
  const [savedBoilers, setSavedBoilers] = useState<Set<string>>(new Set());

  // 첫 번째 보일러를 기본 선택
  useEffect(() => {
    if (boilers.length > 0 && !selectedBoilerId) {
      setSelectedBoilerId(boilers[0].id);
    }
  }, [boilers, selectedBoilerId]);

  // 보일러 업데이트 핸들러
  const handleUpdateBoiler = (boilerId: string, updates: Partial<BoilerData>) => {
    setBoilers((prev) =>
      prev.map((boiler) =>
        boiler.id === boilerId ? { ...boiler, ...updates } : boiler,
      ),
    );
  };

  // 개별 보일러 저장 핸들러
  const handleSaveBoiler = (boilerId: string) => {
    const boiler = boilers.find((b) => b.id === boilerId);
    if (boiler) {
      console.log('Saving boiler data:', boiler);
      setSavedBoilers((prev) => new Set(prev).add(boilerId));
      alert(`${boiler.name} 데이터가 저장되었습니다.`);
    }
  };

  // 선택된 보일러 찾기
  const selectedBoiler = boilers.find((b) => b.id === selectedBoilerId);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          1. 보일러
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

      {/* 보일러별 요약 카드 - 가로 스크롤 */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-medium text-gray-800">보일러 현황</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {boilers.map((boiler) => (
            <BoilerSummaryCard
              key={boiler.id}
              boiler={boiler}
              unitProcesses={unitProcesses}
              isSelected={boiler.id === selectedBoilerId}
              isSaved={savedBoilers.has(boiler.id)}
              onClick={() => setSelectedBoilerId(boiler.id)}
            />
          ))}
        </div>
      </div>

      {/* 선택된 보일러의 상세 정보 */}
      {selectedBoiler && (
        <div className="mb-6">
          <BoilerDetailForm
            boiler={selectedBoiler}
            unitProcesses={unitProcesses}
            onUpdate={handleUpdateBoiler}
            onSave={handleSaveBoiler}
          />
        </div>
      )}
    </div>
  );
};

export default BoilerTabContent;
