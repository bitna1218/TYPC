// components/electricity-steam/PowerUsageSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import Tooltip from '../Tooltip';
import {
  PowerUsageData,
  MeasurementData,
  AllocationSettings,
  PowerTypeInfo,
  BuildingInfo,
  ProcessInfo,
  SubProcessInfo,
  FacilityInfo,
} from './ElectricitySteamTabContent';
import SteamUsageMobileView from './SteamUsageMobileView';
import SteamUsageDesktopView from './SteamUsageDesktopView';

interface SteamUsageSectionProps {
  powerUsageData: PowerUsageData[];
  setPowerUsageData: React.Dispatch<React.SetStateAction<PowerUsageData[]>>;
  measurementData: MeasurementData[];
  setMeasurementData: React.Dispatch<React.SetStateAction<MeasurementData[]>>;
  correctionData: MeasurementData[];
  allocationSettings: AllocationSettings;
  setAllocationSettings: React.Dispatch<
    React.SetStateAction<AllocationSettings>
  >;
  showMeasurementTable: boolean;
  showCorrectionTable: boolean;
  powerTypesForUsage: PowerTypeInfo[];
  dummyBuildings: BuildingInfo[];
  dummyProcesses: ProcessInfo[];
  dummySubProcesses: SubProcessInfo[];
  dummyFacilities: FacilityInfo[];
}

const SteamUsageSection: React.FC<SteamUsageSectionProps> = ({
  powerUsageData,
  setPowerUsageData,
  measurementData,
  setMeasurementData,
  correctionData,
  allocationSettings,
  setAllocationSettings,
  showMeasurementTable,
  showCorrectionTable,
  powerTypesForUsage,
  dummyBuildings,
  dummyProcesses,
  dummySubProcesses,
  dummyFacilities,
}) => {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024); // lg breakpoint
    };
    if (typeof window !== 'undefined') {
      // SSR 안전장치
      checkMobileView();
      window.addEventListener('resize', checkMobileView);
      return () => window.removeEventListener('resize', checkMobileView);
    }
  }, []);

  const handleMeasurementChange = (hasMeasurement: boolean) => {
    setAllocationSettings((prev) => ({
      ...prev,
      hasMeasurement,
    }));
    if (hasMeasurement && measurementData.length === 0) {
      handleAddMeasurementItem();
    } else if (!hasMeasurement) {
      setMeasurementData([]);
    }
  };

  const handleAddPowerUsageItem = () => {
    const newId =
      powerUsageData.length > 0
        ? 'power_' +
          (Math.max(
            ...powerUsageData.map((item) =>
              parseInt(item.id.split('_')[1] || '0')
            )
          ) +
            1)
        : 'power_1';
    const newItem: PowerUsageData = {
      id: newId,
      dataRange: '사업장',
      powerType: powerTypesForUsage[0]?.id || '',
      unit: 'kWh',
      monthlyUsage: Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        amount: 0,
      })),
      totalAmount: 0,
      dqi: 'M',
      attachedFile: null,
    };
    setPowerUsageData((prev) => [...prev, newItem]);
  };

  const handleDeletePowerUsageItem = (id: string) => {
    if (powerUsageData.length <= 1) {
      alert('최소 1개 이상의 사업장 전력 사용량 정보가 필요합니다.');
      return;
    }
    if (window.confirm('선택한 사업장 전력 사용량 항목을 삭제하시겠습니까?')) {
      setPowerUsageData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handlePowerUsageFieldChange = (
    id: string,
    field: keyof PowerUsageData,
    value: string | number
  ) => {
    setPowerUsageData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handlePowerUsageMonthlyChange = (
    id: string,
    month: number,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    setPowerUsageData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedMonthlyUsage = item.monthlyUsage.map((monthData) =>
            monthData.month === month
              ? { ...monthData, amount: numValue }
              : monthData
          );
          const totalAmount = updatedMonthlyUsage.reduce(
            (sum, data) => sum + data.amount,
            0
          );
          return {
            ...item,
            monthlyUsage: updatedMonthlyUsage,
            totalAmount,
          };
        }
        return item;
      })
    );
  };

  const handlePowerUsageFileChange = (id: string, file: File | null) => {
    setPowerUsageData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, attachedFile: file } : item
      )
    );
  };

  const handleAddMeasurementItem = () => {
    // 기존 데이터가 있으면 모두 삭제하고 새로운 빈 항목 하나만 추가
    const newItem: MeasurementData = {
      id: 'measure_1',
      dataRange: '',
      monthlyMeasurement: Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        amount: 0,
      })),
      totalAmount: 0,
      dqi: 'M',
      attachedFile: null,
    };
    setMeasurementData([newItem]);
  };

  const handleDeleteMeasurementItem = () => {
    if (window.confirm('모든 계측값 데이터를 삭제하시겠습니까?')) {
      setMeasurementData([]);
    }
  };

  const handleMeasurementFieldChange = (
    id: string,
    field: keyof MeasurementData,
    value: string
  ) => {
    if (field === 'dataRange') {
      // 데이터 범위가 변경되면 해당 범위의 모든 항목들을 자동 생성
      generateMeasurementItemsForDataRange(value as MeasurementData['dataRange']);
    } else {
      // 기존 단일 항목 수정 로직
      setMeasurementData((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const updatedItem = { ...item, [field]: value };
            if (field === 'buildingId') {
              updatedItem.buildingName = dummyBuildings.find(
                (b) => b.id === value
              )?.name;
              updatedItem.processId = undefined;
              updatedItem.processName = undefined;
              updatedItem.subProcessId = undefined;
              updatedItem.subProcessName = undefined;
              updatedItem.facilityId = undefined;
              updatedItem.facilityName = undefined;
            } else if (field === 'processId') {
              updatedItem.processName = dummyProcesses.find(
                (p) => p.id === value
              )?.name;
              updatedItem.subProcessId = undefined;
              updatedItem.subProcessName = undefined;
              updatedItem.facilityId = undefined;
              updatedItem.facilityName = undefined;
            } else if (field === 'subProcessId') {
              updatedItem.subProcessName = dummySubProcesses.find(
                (sp) => sp.id === value
              )?.name;
              updatedItem.facilityId = undefined;
              updatedItem.facilityName = undefined;
            } else if (field === 'facilityId') {
              updatedItem.facilityName = dummyFacilities.find(
                (f) => f.id === value
              )?.name;
            }
            return updatedItem;
          }
          return item;
        })
      );
    }
  };

  // 데이터 범위에 따라 모든 관련 항목들을 자동 생성하는 함수
  const generateMeasurementItemsForDataRange = (dataRange: MeasurementData['dataRange']) => {
    if (!dataRange) {
      // 빈 선택인 경우 기존 계측 데이터 모두 삭제
      setMeasurementData([]);
      return;
    }

    let newItems: MeasurementData[] = [];
    let idCounter = 1;

    const createBaseItem = (): Omit<MeasurementData, 'id' | 'dataRange' | 'buildingId' | 'processId' | 'subProcessId' | 'facilityId' | 'buildingName' | 'processName' | 'subProcessName' | 'facilityName'> => ({
      monthlyMeasurement: Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        amount: 0,
      })),
      totalAmount: 0,
      dqi: 'M',
      attachedFile: null,
    });

    switch (dataRange) {
      case '건물':
        newItems = dummyBuildings.map((building) => ({
          ...createBaseItem(),
          id: `measure_${idCounter++}`,
          dataRange,
          buildingId: building.id,
          buildingName: building.name,
        }));
        break;

      case '공정':
        newItems = dummyProcesses.map((process) => {
          const building = dummyBuildings.find(b => b.id === process.buildingId);
          return {
            ...createBaseItem(),
            id: `measure_${idCounter++}`,
            dataRange,
            buildingId: process.buildingId,
            buildingName: building?.name,
            processId: process.id,
            processName: process.name,
          };
        });
        break;

      case '세부공정':
        newItems = dummySubProcesses.map((subProcess) => {
          const process = dummyProcesses.find(p => p.id === subProcess.processId);
          const building = dummyBuildings.find(b => b.id === process?.buildingId);
          return {
            ...createBaseItem(),
            id: `measure_${idCounter++}`,
            dataRange,
            buildingId: process?.buildingId,
            buildingName: building?.name,
            processId: process?.id,
            processName: process?.name,
            subProcessId: subProcess.id,
            subProcessName: subProcess.name,
          };
        });
        break;

      case '설비':
        newItems = dummyFacilities.map((facility) => {
          const building = dummyBuildings.find(b => b.id === facility.buildingId);
          const process = facility.processId ? dummyProcesses.find(p => p.id === facility.processId) : undefined;
          const subProcess = facility.subProcessId ? dummySubProcesses.find(sp => sp.id === facility.subProcessId) : undefined;
          return {
            ...createBaseItem(),
            id: `measure_${idCounter++}`,
            dataRange,
            buildingId: facility.buildingId,
            buildingName: building?.name,
            processId: facility.processId || undefined,
            processName: process?.name,
            subProcessId: facility.subProcessId || undefined,
            subProcessName: subProcess?.name,
            facilityId: facility.id,
            facilityName: facility.name,
          };
        });
        break;

      default:
        // 다른 경우는 빈 배열
        newItems = [];
        break;
    }

    setMeasurementData(newItems);
  };

  const handleMeasurementMonthlyChange = (
    id: string,
    month: number,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    setMeasurementData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedMonthlyMeasurement = item.monthlyMeasurement.map(
            (monthData) =>
              monthData.month === month
                ? { ...monthData, amount: numValue }
                : monthData
          );
          const totalAmount = updatedMonthlyMeasurement.reduce(
            (sum, data) => sum + data.amount,
            0
          );
          return {
            ...item,
            monthlyMeasurement: updatedMonthlyMeasurement,
            totalAmount,
          };
        }
        return item;
      })
    );
  };

  const handleMeasurementFileChange = (id: string, file: File | null) => {
    setMeasurementData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, attachedFile: file } : item
      )
    );
  };

  const renderMeasurementQuestion = () => (
    <div className='p-4 bg-blue-50 border border-blue-200 rounded-md shadow'>
      <div className='flex items-center mb-2'>
        <h3 className='text-sm font-semibold text-gray-700 mr-3'>
          건물/공정/세부공정/설비 별 계측 값이 있습니까?
        </h3>
        <Tooltip text='사업장 전체가 아닌, 하위 단위(건물, 공정 등)에서 직접 측정된 전력 사용량 데이터가 있는지 선택합니다.'>
          <FaInfoCircle className='text-blue-500 cursor-pointer' />
        </Tooltip>
      </div>
      <div className='flex items-center space-x-4'>
        {(
          [
            { label: '예', value: true },
            { label: '아니오', value: false },
          ] as const
        ).map((option) => (
          <label
            key={option.label}
            className='flex items-center space-x-2 cursor-pointer'
          >
            <input
              type='radio'
              name='hasMeasurement'
              checked={allocationSettings.hasMeasurement === option.value}
              onChange={() => handleMeasurementChange(option.value)}
              className='form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 transition duration-150 ease-in-out'
            />
            <span className='text-sm text-gray-700'>{option.label}</span>
          </label>
        ))}
      </div>
      {allocationSettings.hasMeasurement && measurementData.length === 0 && (
        <p className='text-xs text-green-600 mt-2'>
          &quot;예&quot;를 선택하셨습니다. (2)번 테이블에 첫 번째 계측 항목이
          추가되었습니다. 내용을 입력해주세요.
        </p>
      )}
    </div>
  );

  return (
    <div className='space-y-6'>
      {renderMeasurementQuestion()}

      {isMobileView ? (
        <SteamUsageMobileView
          powerUsageData={powerUsageData}
          measurementData={measurementData}
          powerTypesForUsage={powerTypesForUsage}
          dummyBuildings={dummyBuildings}
          dummyProcesses={dummyProcesses}
          dummySubProcesses={dummySubProcesses}
          dummyFacilities={dummyFacilities}
          onAddPowerUsageItem={handleAddPowerUsageItem}
          onDeletePowerUsageItem={handleDeletePowerUsageItem}
          onPowerUsageFieldChange={handlePowerUsageFieldChange}
          onPowerUsageMonthlyChange={handlePowerUsageMonthlyChange}
          onPowerUsageFileChange={handlePowerUsageFileChange}
          onAddMeasurementItem={handleAddMeasurementItem}
          onDeleteMeasurementItem={handleDeleteMeasurementItem}
          onMeasurementFieldChange={handleMeasurementFieldChange}
          onMeasurementMonthlyChange={handleMeasurementMonthlyChange}
          onMeasurementFileChange={handleMeasurementFileChange}
          showMeasurementTable={showMeasurementTable}
        />
      ) : (
        <SteamUsageDesktopView
          powerUsageData={powerUsageData}
          measurementData={measurementData}
          correctionData={correctionData}
          powerTypesForUsage={powerTypesForUsage}
          dummyBuildings={dummyBuildings}
          dummyProcesses={dummyProcesses}
          dummySubProcesses={dummySubProcesses}
          dummyFacilities={dummyFacilities}
          onAddPowerUsageItem={handleAddPowerUsageItem}
          onDeletePowerUsageItem={handleDeletePowerUsageItem}
          onPowerUsageFieldChange={handlePowerUsageFieldChange}
          onPowerUsageMonthlyChange={handlePowerUsageMonthlyChange}
          onPowerUsageFileChange={handlePowerUsageFileChange}
          onAddMeasurementItem={handleAddMeasurementItem}
          onDeleteMeasurementItem={handleDeleteMeasurementItem}
          onMeasurementFieldChange={handleMeasurementFieldChange}
          onMeasurementMonthlyChange={handleMeasurementMonthlyChange}
          onMeasurementFileChange={handleMeasurementFileChange}
          showMeasurementTable={showMeasurementTable}
          showCorrectionTable={showCorrectionTable}
        />
      )}
    </div>
  );
};

export default SteamUsageSection;
