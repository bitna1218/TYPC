'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaSave } from 'react-icons/fa';
import PowerUsageSection from './PowerUsageSection';
import UnitProcessSelector from './UnitProcessSelector';
import AllocationMethodSection from './AllocationMethodSection';
import PowerAllocationSection from './PowerAllocationSection';
import SteamUsageSection from './SteamUsageSection';

// 인터페이스 정의 - Main data structures for the tab
export interface PowerUsageData {
  id: string;
  dataRange: string; // Should always be '사업장' for this table
  powerType: string;
  unit: string;
  monthlyUsage: { month: number; amount: number }[];
  totalAmount: number;
  dqi: 'M' | 'C' | 'E' | '';
  attachedFile?: File | null;
}

// 스팀 사용량을 위한 인터페이스
export interface SteamUsageData {
  id: string;
  dataRange: string; // Should always be '사업장' for this table
  steamType: string;
  unit: string;
  monthlyUsage: { month: number; amount: number }[];
  totalAmount: number;
  dqi: 'M' | 'C' | 'E' | '';
  attachedFile?: File | null;
}

export interface MeasurementData {
  id: string;
  dataRange: '사업장' | '건물' | '공정' | '세부공정' | '설비' | '';
  buildingId?: string;
  processId?: string;
  subProcessId?: string;
  facilityId?: string;
  buildingName?: string; // Store name for display convenience, updated on ID change
  processName?: string;
  subProcessName?: string;
  facilityName?: string;
  monthlyMeasurement: { month: number; amount: number }[];
  totalAmount: number;
  dqi: 'M' | 'C' | 'E' | '';
  attachedFile?: File | null;
}

export interface AllocationSettings {
  hasMeasurement: boolean;
  measurementRange: '건물' | '공정' | '세부공정' | '설비' | null;
  useAllocation: boolean;
  allocationMethod: '설비 정보' | '제품 생산량' | '비율 직접 입력';
  selectedUnitProcesses: string[];
}

export interface PowerAllocation {
  scope: '사업장' | '건물' | '공정';
  scopeId?: string;
  scopeName?: string;
  unitProcessAllocations: {
    unitProcessId: string;
    unitProcessName: string;
    ratio: number;
  }[];
  totalRatio: number;
}

// --- Helper/Prop Type Interfaces (to be used by child components) ---
export interface PowerTypeInfo {
  id: string;
  name: string;
}

// 스팀 타입 정보를 위한 인터페이스
export interface SteamTypeInfo {
  id: string;
  name: string;
}

export interface BuildingInfo {
  id: string;
  name: string;
}

export interface ProcessInfo {
  id: string;
  name: string;
  buildingId: string; // Essential for filtering processes by building
}

export interface SubProcessInfo {
  id: string;
  name: string;
  processId: string; // Essential for filtering sub-processes by process
}

export interface FacilityInfo {
  id: string;
  name: string;
  // A facility can be directly under a building, a process, or a sub-process.
  // Or it can be standalone if not fitting the hierarchy (though less common for this context)
  buildingId: string; // All facilities should belong to a building at the top level.
  processId?: string | null; // Null if directly under building or part of sub-process
  subProcessId?: string | null; // Null if directly under building or process
}

// UnitProcess 정보를 위한 인터페이스 (만약 별도로 없다면 DUMMY_UNIT_PROCESSES 구조를 따름)
// 이 파일을 직접 수정할 수 없으므로, DUMMY_UNIT_PROCESSES 데이터에 직접 필드를 추가하는 것으로 가정합니다.
// 실제로는 이 인터페이스를 정의하고 export 하는 것이 좋습니다.
export interface UnitProcessInfo {
  id: string;
  name: string;
  estimatedPowerConsumption?: number; // 설비 정보 기반 계산용 (단위: kWh 등 가정)
  productionVolume?: number; // 제품 생산량 기반 계산용 (단위: 개, ton 등 가정)
}

// 더미 데이터
export const DUMMY_POWER_TYPES_FOR_USAGE: PowerTypeInfo[] = [
  { id: 'hanjeon', name: '한전 전기' },
  { id: 'ppa_solar', name: 'PPA-태양광' },
  { id: 'ppa_wind', name: 'PPA-풍력' },
  { id: 'ppa_etc', name: 'PPA-기타' },
  { id: 'rec_solar', name: 'REC-태양광' },
  { id: 'rec_wind', name: 'REC-풍력' },
  { id: 'rec_etc', name: 'REC-기타' },
  { id: 'etc_power', name: '기타 전력' },
];

// 스팀 종류를 위한 더미 데이터
export const DUMMY_STEAM_TYPES_FOR_USAGE: SteamTypeInfo[] = [
  { id: 'high_pressure', name: '고압 스팀' },
  { id: 'medium_pressure', name: '중압 스팀' },
  { id: 'low_pressure', name: '저압 스팀' },
  { id: 'purchased_steam', name: '외부 구매 스팀' },
  { id: 'self_produced', name: '자체 생산 스팀' },
  { id: 'condensate', name: '응축수' },
  { id: 'etc_steam', name: '기타 스팀' },
];

export const DUMMY_UNIT_PROCESSES: UnitProcessInfo[] = [
  {
    id: 'unit1',
    name: '단위공정 1',
    estimatedPowerConsumption: 1500,
    productionVolume: 100,
  },
  {
    id: 'unit2',
    name: '단위공정 4',
    estimatedPowerConsumption: 2500,
    productionVolume: 300,
  },
  {
    id: 'unit3',
    name: '단위공정 5',
    estimatedPowerConsumption: 2000,
    productionVolume: 150,
  },
  {
    id: 'unit4',
    name: '단위공정 Alpha',
    estimatedPowerConsumption: 3000,
    productionVolume: 200,
  }, // 추가 데이터
  {
    id: 'unit5',
    name: '단위공정 Beta',
    estimatedPowerConsumption: 1000,
    productionVolume: 50,
  }, // 추가 데이터
];

export const DUMMY_BUILDINGS: BuildingInfo[] = [
  { id: 'buildingA', name: '건물 A' },
  { id: 'buildingB', name: '건물 B' },
];

export const DUMMY_PROCESSES: ProcessInfo[] = [
  { id: 'processA1', name: '공정 A-1 (건물 A 소속)', buildingId: 'buildingA' },
  { id: 'processA2', name: '공정 A-2 (건물 A 소속)', buildingId: 'buildingA' },
  { id: 'processB1', name: '공정 B-1 (건물 B 소속)', buildingId: 'buildingB' },
];

export const DUMMY_SUB_PROCESSES: SubProcessInfo[] = [
  {
    id: 'subProcessA1-1',
    name: '세부공정 A-1-1 (공정 A-1 소속)',
    processId: 'processA1',
  },
  {
    id: 'subProcessA2-1',
    name: '세부공정 A-2-1 (공정 A-2 소속)',
    processId: 'processA2',
  },
  {
    id: 'subProcessB1-1',
    name: '세부공정 B-1-1 (공정 B-1 소속)',
    processId: 'processB1',
  },
];

export const DUMMY_FACILITIES: FacilityInfo[] = [
  // 건물 A 소속 설비들
  {
    id: 'facilityA_direct',
    name: '설비 Alpha (건물 A 직접 소속)',
    buildingId: 'buildingA',
    processId: null,
    subProcessId: null,
  },
  {
    id: 'facilityA1_direct',
    name: '설비 Beta (공정 A-1 직접 소속)',
    buildingId: 'buildingA',
    processId: 'processA1',
    subProcessId: null,
  },
  {
    id: 'facilityA1_1_leaf',
    name: '설비 Gamma (세부공정 A-1-1 소속)',
    buildingId: 'buildingA',
    processId: 'processA1',
    subProcessId: 'subProcessA1-1',
  },
  {
    id: 'facilityA2_1_leaf',
    name: '설비 Delta (세부공정 A-2-1 소속)',
    buildingId: 'buildingA',
    processId: 'processA2',
    subProcessId: 'subProcessA2-1',
  },

  // 건물 B 소속 설비들
  {
    id: 'facilityB_direct',
    name: '설비 Epsilon (건물 B 직접 소속)',
    buildingId: 'buildingB',
    processId: null,
    subProcessId: null,
  },
  {
    id: 'facilityB1_direct',
    name: '설비 Zeta (공정 B-1 직접 소속)',
    buildingId: 'buildingB',
    processId: 'processB1',
    subProcessId: null,
  },
  {
    id: 'facilityB1_1_leaf',
    name: '설비 Eta (세부공정 B-1-1 소속)',
    buildingId: 'buildingB',
    processId: 'processB1',
    subProcessId: 'subProcessB1-1',
  },
];

interface ElectricitySteamTabContentProps {
  siteId?: string;
}

const ElectricitySteamTabContent: React.FC<ElectricitySteamTabContentProps> = ({
  siteId,
}) => {
  // 상태 관리
  const [powerUsageData, setPowerUsageData] = useState<PowerUsageData[]>([]);
  const [measurementData, setMeasurementData] = useState<MeasurementData[]>([]);
  const [correctionData, setCorrectionData] = useState<MeasurementData[]>([]);

  // 스팀 사용량 관련 상태 추가
  const [steamUsageData, setSteamUsageData] = useState<SteamUsageData[]>([]);
  const [steamMeasurementData, setSteamMeasurementData] = useState<
    MeasurementData[]
  >([]);
  const [steamCorrectionData, setSteamCorrectionData] = useState<
    MeasurementData[]
  >([]);

  const [allocationSettings, setAllocationSettings] =
    useState<AllocationSettings>({
      hasMeasurement: false,
      measurementRange: null,
      useAllocation: true, // 기본 활성화
      allocationMethod: '제품 생산량',
      selectedUnitProcesses: [],
    });

  // 스팀 할당 설정 추가
  const [steamAllocationSettings, setSteamAllocationSettings] =
    useState<AllocationSettings>({
      hasMeasurement: false,
      measurementRange: null,
      useAllocation: true, // 기본 활성화
      allocationMethod: '제품 생산량',
      selectedUnitProcesses: [],
    });

  const [powerAllocations, setPowerAllocations] = useState<PowerAllocation[]>(
    []
  );

  // 스팀 할당 데이터 추가
  const [steamAllocations, setSteamAllocations] = useState<PowerAllocation[]>(
    []
  );

  // 할당 데이터 생성 함수
  const generateAllocationData = useCallback(() => {
    let allocationsToSet: PowerAllocation[] = [];
    const selectedProcessesDetails = allocationSettings.selectedUnitProcesses
      .map((id) => DUMMY_UNIT_PROCESSES.find((p) => p.id === id))
      .filter((p) => p !== undefined) as UnitProcessInfo[];

    let ratios: number[] = [];

    if (allocationSettings.allocationMethod === '설비 정보') {
      const totalPowerConsumption = selectedProcessesDetails.reduce(
        (sum, p) => sum + (p.estimatedPowerConsumption || 0),
        0
      );
      ratios = selectedProcessesDetails.map((p) =>
        totalPowerConsumption > 0
          ? ((p.estimatedPowerConsumption || 0) / totalPowerConsumption) * 100
          : 0
      );
    } else if (allocationSettings.allocationMethod === '제품 생산량') {
      const totalProductionVolume = selectedProcessesDetails.reduce(
        (sum, p) => sum + (p.productionVolume || 0),
        0
      );
      ratios = selectedProcessesDetails.map((p) =>
        totalProductionVolume > 0
          ? ((p.productionVolume || 0) / totalProductionVolume) * 100
          : 0
      );
    } else {
      // 비율 직접 입력
      ratios = selectedProcessesDetails.map(() => 0); // 기본값 0
    }

    const unitProcessAllocations = selectedProcessesDetails.map(
      (process, index) => ({
        unitProcessId: process.id,
        unitProcessName: process.name,
        ratio:
          ratios[index] !== undefined
            ? parseFloat(ratios[index].toFixed(1))
            : 0, // 소수점 1자리까지, toFixed는 문자열 반환하므로 parseFloat
      })
    );

    // 각 비율의 합계가 100%가 되도록 마지막 항목 조정 (오차 보정)
    // 이 로직은 자동계산 시에만 의미가 있음. 직접 입력 시에는 사용자가 100% 맞춰야 함.
    if (
      allocationSettings.allocationMethod !== '비율 직접 입력' &&
      unitProcessAllocations.length > 0
    ) {
      const sumOfRatios = unitProcessAllocations.reduce(
        (sum, upa) => sum + upa.ratio,
        0
      );
      const difference = 100 - sumOfRatios;
      if (Math.abs(difference) > 0.01) {
        // 부동소수점 오차 감안
        unitProcessAllocations[unitProcessAllocations.length - 1].ratio +=
          difference;
        unitProcessAllocations[unitProcessAllocations.length - 1].ratio =
          parseFloat(
            unitProcessAllocations[
              unitProcessAllocations.length - 1
            ].ratio.toFixed(1)
          );
      }
      // 재조정 후 전체 합 다시 계산
    }

    const totalRatioSum = unitProcessAllocations.reduce(
      (sum, upa) => sum + upa.ratio,
      0
    );

    if (!allocationSettings.hasMeasurement) {
      allocationsToSet = [
        {
          scope: '사업장',
          scopeName: '사업장 전체',
          unitProcessAllocations,
          totalRatio: parseFloat(totalRatioSum.toFixed(1)),
        },
      ];
    } else if (allocationSettings.measurementRange === '건물') {
      allocationsToSet = DUMMY_BUILDINGS.map((building) => ({
        scope: '건물',
        scopeId: building.id,
        scopeName: building.name,
        unitProcessAllocations, // 모든 건물에 동일한 단위공정 및 계산된 비율 적용
        totalRatio: parseFloat(totalRatioSum.toFixed(1)),
      }));
    } else if (allocationSettings.measurementRange === '공정') {
      allocationsToSet = DUMMY_PROCESSES.map((process) => ({
        scope: '공정',
        scopeId: process.id,
        scopeName: process.name,
        unitProcessAllocations, // 모든 공정에 동일한 단위공정 및 계산된 비율 적용
        totalRatio: parseFloat(totalRatioSum.toFixed(1)),
      }));
    }
    setPowerAllocations(allocationsToSet);
  }, [allocationSettings]);

  // 스팀 할당 데이터 생성 함수
  const generateSteamAllocationData = useCallback(() => {
    let allocationsToSet: PowerAllocation[] = [];
    const selectedProcessesDetails =
      steamAllocationSettings.selectedUnitProcesses
        .map((id) => DUMMY_UNIT_PROCESSES.find((p) => p.id === id))
        .filter((p) => p !== undefined) as UnitProcessInfo[];

    let ratios: number[] = [];

    if (steamAllocationSettings.allocationMethod === '설비 정보') {
      const totalPowerConsumption = selectedProcessesDetails.reduce(
        (sum, p) => sum + (p.estimatedPowerConsumption || 0),
        0
      );
      ratios = selectedProcessesDetails.map((p) =>
        totalPowerConsumption > 0
          ? ((p.estimatedPowerConsumption || 0) / totalPowerConsumption) * 100
          : 0
      );
    } else if (steamAllocationSettings.allocationMethod === '제품 생산량') {
      const totalProductionVolume = selectedProcessesDetails.reduce(
        (sum, p) => sum + (p.productionVolume || 0),
        0
      );
      ratios = selectedProcessesDetails.map((p) =>
        totalProductionVolume > 0
          ? ((p.productionVolume || 0) / totalProductionVolume) * 100
          : 0
      );
    } else {
      // 비율 직접 입력
      ratios = selectedProcessesDetails.map(() => 0); // 기본값 0
    }

    const unitProcessAllocations = selectedProcessesDetails.map(
      (process, index) => ({
        unitProcessId: process.id,
        unitProcessName: process.name,
        ratio:
          ratios[index] !== undefined
            ? parseFloat(ratios[index].toFixed(1))
            : 0, // 소수점 1자리까지, toFixed는 문자열 반환하므로 parseFloat
      })
    );

    // 각 비율의 합계가 100%가 되도록 마지막 항목 조정 (오차 보정)
    // 이 로직은 자동계산 시에만 의미가 있음. 직접 입력 시에는 사용자가 100% 맞춰야 함.
    if (
      steamAllocationSettings.allocationMethod !== '비율 직접 입력' &&
      unitProcessAllocations.length > 0
    ) {
      const sumOfRatios = unitProcessAllocations.reduce(
        (sum, upa) => sum + upa.ratio,
        0
      );
      const difference = 100 - sumOfRatios;
      if (Math.abs(difference) > 0.01) {
        // 부동소수점 오차 감안
        unitProcessAllocations[unitProcessAllocations.length - 1].ratio +=
          difference;
        unitProcessAllocations[unitProcessAllocations.length - 1].ratio =
          parseFloat(
            unitProcessAllocations[
              unitProcessAllocations.length - 1
            ].ratio.toFixed(1)
          );
      }
      // 재조정 후 전체 합 다시 계산
    }

    const totalRatioSum = unitProcessAllocations.reduce(
      (sum, upa) => sum + upa.ratio,
      0
    );

    if (!steamAllocationSettings.hasMeasurement) {
      allocationsToSet = [
        {
          scope: '사업장',
          scopeName: '사업장 전체',
          unitProcessAllocations,
          totalRatio: parseFloat(totalRatioSum.toFixed(1)),
        },
      ];
    } else if (steamAllocationSettings.measurementRange === '건물') {
      allocationsToSet = DUMMY_BUILDINGS.map((building) => ({
        scope: '건물',
        scopeId: building.id,
        scopeName: building.name,
        unitProcessAllocations, // 모든 건물에 동일한 단위공정 및 계산된 비율 적용
        totalRatio: parseFloat(totalRatioSum.toFixed(1)),
      }));
    } else if (steamAllocationSettings.measurementRange === '공정') {
      allocationsToSet = DUMMY_PROCESSES.map((process) => ({
        scope: '공정',
        scopeId: process.id,
        scopeName: process.name,
        unitProcessAllocations, // 모든 공정에 동일한 단위공정 및 계산된 비율 적용
        totalRatio: parseFloat(totalRatioSum.toFixed(1)),
      }));
    }
    setSteamAllocations(allocationsToSet);
  }, [steamAllocationSettings]);

  // 초기 데이터 생성
  useEffect(() => {
    if (siteId) {
    }
    // Initialize with one default power usage item
    const initialPowerData: PowerUsageData[] = [
      {
        id: 'power_1', // Changed to a more generic ID
        dataRange: '사업장',
        powerType: DUMMY_POWER_TYPES_FOR_USAGE[0]?.id || '', // Default to first available power type
        unit: 'kWh',
        monthlyUsage: Array.from({ length: 12 }, (_, index) => ({
          month: index + 1,
          amount: 0,
        })),
        totalAmount: 0,
        dqi: 'M', // Default DQI to 'M'
        attachedFile: null,
      },
    ];
    setPowerUsageData(initialPowerData);

    // 스팀 사용량 초기 데이터 생성
    const initialSteamData: SteamUsageData[] = [
      {
        id: 'steam_1',
        dataRange: '사업장',
        steamType: DUMMY_STEAM_TYPES_FOR_USAGE[0]?.id || '',
        unit: 'ton',
        monthlyUsage: Array.from({ length: 12 }, (_, index) => ({
          month: index + 1,
          amount: 0,
        })),
        totalAmount: 0,
        dqi: 'M',
        attachedFile: null,
      },
    ];
    setSteamUsageData(initialSteamData);
  }, [siteId]);

  // measurementRange 자동 설정
  useEffect(() => {
    if (allocationSettings.hasMeasurement && measurementData.length > 0) {
      // measurementData에서 가장 흔한 dataRange를 measurementRange로 설정
      const dataRanges = measurementData
        .map(item => item.dataRange)
        .filter((range): range is '건물' | '공정' | '세부공정' | '설비' => 
          range !== '' && range !== '사업장'
        );
      
      if (dataRanges.length > 0) {
        // 가장 빈번한 dataRange 찾기
        const rangeCounts = dataRanges.reduce((acc, range) => {
          acc[range] = (acc[range] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const mostCommonRange = Object.entries(rangeCounts)
          .sort(([,a], [,b]) => b - a)[0][0] as '건물' | '공정' | '세부공정' | '설비';
        
        setAllocationSettings(prev => ({
          ...prev,
          measurementRange: mostCommonRange
        }));
      }
    } else {
      setAllocationSettings(prev => ({
        ...prev,
        measurementRange: null
      }));
    }

    // 스팀도 동일하게 처리
    if (steamAllocationSettings.hasMeasurement && steamMeasurementData.length > 0) {
      const steamDataRanges = steamMeasurementData
        .map(item => item.dataRange)
        .filter((range): range is '건물' | '공정' | '세부공정' | '설비' => 
          range !== '' && range !== '사업장'
        );
      
      if (steamDataRanges.length > 0) {
        const steamRangeCounts = steamDataRanges.reduce((acc, range) => {
          acc[range] = (acc[range] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const steamMostCommonRange = Object.entries(steamRangeCounts)
          .sort(([,a], [,b]) => b - a)[0][0] as '건물' | '공정' | '세부공정' | '설비';
        
        setSteamAllocationSettings(prev => ({
          ...prev,
          measurementRange: steamMostCommonRange
        }));
      }
    } else {
      setSteamAllocationSettings(prev => ({
        ...prev,
        measurementRange: null
      }));
    }
  }, [measurementData, allocationSettings.hasMeasurement, steamMeasurementData, steamAllocationSettings.hasMeasurement]);

  // 보정값 계산
  useEffect(() => {
    if (allocationSettings.hasMeasurement && measurementData.length > 0) {
      const corrections = calculateCorrectionValues(
        powerUsageData,
        measurementData
      );
      setCorrectionData(corrections);
    } else {
      setCorrectionData([]);
    }

    // 스팀 보정값 계산
    if (
      steamAllocationSettings.hasMeasurement &&
      steamMeasurementData.length > 0
    ) {
      const steamCorrections = calculateCorrectionValues(
        steamUsageData as unknown as PowerUsageData[], // 타입 호환을 위한 임시 캐스팅
        steamMeasurementData
      );
      setSteamCorrectionData(steamCorrections);
    } else {
      setSteamCorrectionData([]);
    }
  }, [
    powerUsageData,
    measurementData,
    allocationSettings.hasMeasurement,
    steamUsageData,
    steamMeasurementData,
    steamAllocationSettings.hasMeasurement,
  ]);

  // 할당 데이터 생성
  useEffect(() => {
    if (
      allocationSettings.selectedUnitProcesses && // selectedUnitProcesses 배열 자체가 존재하는지 확인
      allocationSettings.selectedUnitProcesses.length > 0 &&
      allocationSettings.measurementRange !== '세부공정' &&
      allocationSettings.measurementRange !== '설비'
    ) {
      generateAllocationData();
    } else {
      // 선택된 단위공정이 없거나,
      // measurementRange가 세부공정/설비인 경우 할당 데이터 초기화
      setPowerAllocations([]);
    }
  }, [allocationSettings, generateAllocationData]); // measurementData 제거, generateAllocationData는 allocationSettings에 의존

  // 스팀 할당 데이터 생성
  useEffect(() => {
    if (
      steamAllocationSettings.selectedUnitProcesses &&
      steamAllocationSettings.selectedUnitProcesses.length > 0 &&
      steamAllocationSettings.measurementRange !== '세부공정' &&
      steamAllocationSettings.measurementRange !== '설비'
    ) {
      generateSteamAllocationData();
    } else {
      // 선택된 단위공정이 없거나,
      // measurementRange가 세부공정/설비인 경우 할당 데이터 초기화
      setSteamAllocations([]);
    }
  }, [steamAllocationSettings, generateSteamAllocationData]);

  // 보정값 계산 함수
  const calculateCorrectionValues = (
    businessData: PowerUsageData[],
    measurements: MeasurementData[]
  ): MeasurementData[] => {
    return measurements.map((measurement) => {
      const correctedMonthly = measurement.monthlyMeasurement.map(
        (monthData) => {
          const businessTotal = businessData.reduce((sum, business) => {
            const monthBusiness = business.monthlyUsage.find(
              (m) => m.month === monthData.month
            );
            return sum + (monthBusiness?.amount || 0);
          }, 0);

          const measurementTotal = measurements.reduce((sum, measure) => {
            const monthMeasure = measure.monthlyMeasurement.find(
              (m) => m.month === monthData.month
            );
            return sum + (monthMeasure?.amount || 0);
          }, 0);

          const ratio =
            measurementTotal > 0 ? monthData.amount / measurementTotal : 0;
          return {
            month: monthData.month,
            amount: businessTotal * ratio,
          };
        }
      );

      const totalAmount = correctedMonthly.reduce(
        (sum, data) => sum + data.amount,
        0
      );

      return {
        ...measurement,
        monthlyMeasurement: correctedMonthly,
        totalAmount,
        dqi: 'C', // 보정값의 DQI는 항상 'C' (Calculated)
        attachedFile: null, // 보정값 테이블에는 파일첨부 없음
      };
    });
  };

  // 전력 사용량 저장 핸들러
  const handleSavePower = () => {
    console.log('Power Usage Data:', powerUsageData);
    console.log('Measurement Data:', measurementData);
    console.log('Allocation Settings:', allocationSettings);
    console.log('Power Allocations:', powerAllocations);
    alert('전력 사용량 데이터가 저장되었습니다.');
  };

  // 스팀 사용량 저장 핸들러
  const handleSaveSteam = () => {
    console.log('Steam Usage Data:', steamUsageData);
    console.log('Steam Measurement Data:', steamMeasurementData);
    console.log('Steam Allocation Settings:', steamAllocationSettings);
    console.log('Steam Allocations:', steamAllocations);
    alert('스팀 사용량 데이터가 저장되었습니다.');
  };

  // 조건부 렌더링 결정
  const showMeasurementTable = allocationSettings.hasMeasurement;
  const showCorrectionTable = allocationSettings.hasMeasurement;
  const showAllocationMethod = 
    allocationSettings.measurementRange !== '세부공정' &&
    allocationSettings.measurementRange !== '설비';
  const showUnitProcessSelector = 
    allocationSettings.measurementRange !== '세부공정' &&
    allocationSettings.measurementRange !== '설비';
  const showAllocationSection =
    allocationSettings.measurementRange !== '세부공정' &&
    allocationSettings.measurementRange !== '설비';

  // 스팀 관련 조건부 렌더링 결정
  const showSteamMeasurementTable = steamAllocationSettings.hasMeasurement;
  const showSteamCorrectionTable = steamAllocationSettings.hasMeasurement;
  const showSteamAllocationMethod = 
    steamAllocationSettings.measurementRange !== '세부공정' &&
    steamAllocationSettings.measurementRange !== '설비';
  const showSteamUnitProcessSelector = 
    steamAllocationSettings.measurementRange !== '세부공정' &&
    steamAllocationSettings.measurementRange !== '설비';
  const showSteamAllocationSection =
    steamAllocationSettings.measurementRange !== '세부공정' &&
    steamAllocationSettings.measurementRange !== '설비';

  return (
    <>
      <div className='bg-white rounded-lg shadow-md p-6'>
        {/* 헤더 */}
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold text-gray-800'>
            전력/스팀 사용량
          </h2>
        </div>

        {/* --- 전력 사용량 관련 섹션 시작 --- */}
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-800'>
              3-1. 전력 사용량
            </h3>
            <button
              onClick={handleSavePower}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center text-sm'
            >
              <FaSave className='mr-2' />
              저장
            </button>
          </div>

          {/* 안내 문구 (전력용) */}
          <div className='mb-6 space-y-2'>
            <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
              <p className='text-green-700 text-sm'>
                계측 값이 있는지 & 할당 방법을 [1-5. 데이터 관리 방식]에서
                가져옴
              </p>
            </div>
          </div>

          {/* 전력 사용량 섹션 컴포넌트 */}
          <PowerUsageSection
            powerUsageData={powerUsageData}
            setPowerUsageData={setPowerUsageData}
            measurementData={measurementData}
            setMeasurementData={setMeasurementData}
            correctionData={correctionData}
            allocationSettings={allocationSettings}
            setAllocationSettings={setAllocationSettings}
            showMeasurementTable={showMeasurementTable}
            showCorrectionTable={showCorrectionTable}
            powerTypesForUsage={DUMMY_POWER_TYPES_FOR_USAGE}
            dummyBuildings={DUMMY_BUILDINGS}
            dummyProcesses={DUMMY_PROCESSES}
            dummySubProcesses={DUMMY_SUB_PROCESSES}
            dummyFacilities={DUMMY_FACILITIES}
          />

          {/* 할당방법 섹션 (전력용) */}
          {showAllocationMethod && (
            <AllocationMethodSection
              allocationSettings={allocationSettings}
              setAllocationSettings={setAllocationSettings}
            />
          )}

          {/* 단위공정 선택 (전력용) */}
          {showUnitProcessSelector && (
            <UnitProcessSelector
              selectedUnitProcesses={allocationSettings.selectedUnitProcesses}
              onSelectionChange={(processes) =>
                setAllocationSettings((prev) => ({
                  ...prev,
                  selectedUnitProcesses: processes,
                }))
              }
              unitProcesses={DUMMY_UNIT_PROCESSES}
            />
          )}

          {/* 전력 사용량 비율 할당 (전력용) */}
          {showAllocationSection && (
            <PowerAllocationSection
              powerAllocations={powerAllocations}
              setPowerAllocations={setPowerAllocations}
              allocationSettings={allocationSettings}
            />
          )}
        </div>
        {/* --- 전력 사용량 관련 섹션 끝 --- */}
      </div>
      <div className='bg-white rounded-lg shadow-md p-6 mt-4'>
        {/* --- 스팀 사용량 관련 섹션 시작 --- */}
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-800'>
              3-2. 스팀 사용량
            </h3>
            <button
              onClick={handleSaveSteam}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center text-sm'
            >
              <FaSave className='mr-2' />
              저장
            </button>
          </div>

          {/* 안내 문구 (스팀용) */}
          <div className='mb-6 space-y-2'>
            <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
              <p className='text-green-700 text-sm'>
                계측 값이 있는지 & 할당 방법을 [1-5. 데이터 관리 방식]에서
                가져옴
              </p>
            </div>
          </div>

          {/* 스팀 사용량 섹션 컴포넌트 */}
          <SteamUsageSection
            powerUsageData={steamUsageData as unknown as PowerUsageData[]} // 호환성을 위한 타입 캐스팅
            setPowerUsageData={
              setSteamUsageData as unknown as React.Dispatch<
                React.SetStateAction<PowerUsageData[]>
              >
            }
            measurementData={steamMeasurementData}
            setMeasurementData={setSteamMeasurementData}
            correctionData={steamCorrectionData}
            allocationSettings={steamAllocationSettings}
            setAllocationSettings={setSteamAllocationSettings}
            showMeasurementTable={showSteamMeasurementTable}
            showCorrectionTable={showSteamCorrectionTable}
            powerTypesForUsage={
              DUMMY_STEAM_TYPES_FOR_USAGE as unknown as PowerTypeInfo[]
            }
            dummyBuildings={DUMMY_BUILDINGS}
            dummyProcesses={DUMMY_PROCESSES}
            dummySubProcesses={DUMMY_SUB_PROCESSES}
            dummyFacilities={DUMMY_FACILITIES}
          />

          {/* 할당방법 섹션 (스팀용) */}
          {showSteamAllocationMethod && (
            <AllocationMethodSection
              allocationSettings={steamAllocationSettings}
              setAllocationSettings={setSteamAllocationSettings}
            />
          )}

          {/* 단위공정 선택 (스팀용) */}
          {showSteamUnitProcessSelector && (
            <UnitProcessSelector
              selectedUnitProcesses={
                steamAllocationSettings.selectedUnitProcesses
              }
              onSelectionChange={(processes) =>
                setSteamAllocationSettings((prev) => ({
                  ...prev,
                  selectedUnitProcesses: processes,
                }))
              }
              unitProcesses={DUMMY_UNIT_PROCESSES}
            />
          )}

          {/* 스팀 사용량 비율 할당 (스팀용) */}
          {showSteamAllocationSection && (
            <PowerAllocationSection
              powerAllocations={steamAllocations}
              setPowerAllocations={setSteamAllocations}
              allocationSettings={steamAllocationSettings}
            />
          )}
        </div>
        {/* --- 스팀 사용량 관련 섹션 끝 --- */}
      </div>
    </>
  );
};

export default ElectricitySteamTabContent;
