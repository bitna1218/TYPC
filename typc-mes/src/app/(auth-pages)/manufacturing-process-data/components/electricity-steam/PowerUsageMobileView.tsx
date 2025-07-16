'use client';

import React, { useState } from 'react';
import {
  FaUpload,
  FaPlus,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
} from 'react-icons/fa';
import Tooltip from '../Tooltip';
import {
  PowerUsageData,
  MeasurementData,
  PowerTypeInfo, // Import from central location
  BuildingInfo,
  ProcessInfo,
  SubProcessInfo,
  FacilityInfo,
} from './ElectricitySteamTabContent';

const MEASUREMENT_DATA_RANGE_OPTIONS_MOBILE: MeasurementData['dataRange'][] = [
  '건물',
  '공정',
  '세부공정',
  '설비',
];

interface PowerUsageMobileViewProps {
  powerUsageData: PowerUsageData[];
  measurementData: MeasurementData[];

  powerTypesForUsage: PowerTypeInfo[];
  dummyBuildings: BuildingInfo[];
  dummyProcesses: ProcessInfo[];
  dummySubProcesses: SubProcessInfo[];
  dummyFacilities: FacilityInfo[];

  onAddPowerUsageItem: () => void;
  onDeletePowerUsageItem: (id: string) => void;
  onPowerUsageFieldChange: (
    id: string,
    field: keyof PowerUsageData,
    value: string | number
  ) => void;
  onPowerUsageMonthlyChange: (id: string, month: number, value: string) => void;
  onPowerUsageFileChange: (id: string, file: File | null) => void;

  onAddMeasurementItem: () => void;
  onDeleteMeasurementItem: () => void;
  onMeasurementFieldChange: (
    id: string,
    field: keyof MeasurementData,
    value: string
  ) => void;
  onMeasurementMonthlyChange: (
    id: string,
    month: number,
    value: string
  ) => void;
  onMeasurementFileChange: (id: string, file: File | null) => void;

  showMeasurementTable: boolean;
}

const FieldLabel: React.FC<{
  label: string;
  tooltipText?: string;
  htmlFor?: string;
}> = ({ label, tooltipText, htmlFor }) => (
  <div className='flex items-center mb-1'>
    <label
      htmlFor={htmlFor}
      className='block text-xs font-medium text-gray-600'
    >
      {label}
    </label>
    {tooltipText && (
      <Tooltip text={tooltipText} position='top'>
        <FaInfoCircle
          className='ml-1.5 text-gray-400 cursor-pointer'
          size={13}
        />
      </Tooltip>
    )}
  </div>
);

interface PowerUsageItemCardProps {
  item: PowerUsageData;
  powerTypesForUsage: PowerTypeInfo[];
  onFieldChange: (
    id: string,
    field: keyof PowerUsageData,
    value: string | number
  ) => void;
  onMonthlyChange: (id: string, month: number, value: string) => void;
  onFileChange: (id: string, file: File | null) => void;
  onDeleteItem: (id: string) => void;
  isOnlyItem: boolean;
}

const PowerUsageItemCard: React.FC<PowerUsageItemCardProps> = ({
  item,
  powerTypesForUsage,
  onFieldChange,
  onMonthlyChange,
  onFileChange,
  onDeleteItem,
  isOnlyItem,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAllMonths, setShowAllMonths] = useState(false);

  const powerTypeName =
    powerTypesForUsage.find((pt) => pt.id === item.powerType)?.name ||
    '전력 사용량';

  return (
    <div className='border border-gray-200 rounded-lg shadow-sm mb-3 bg-white'>
      <div
        className='flex justify-between items-center p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 rounded-t-lg'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className='font-semibold text-gray-700 text-sm truncate pr-2'>
          {powerTypeName} (단위: {item.unit})
        </h4>
        <div className='flex items-center'>
          <button
            type='button'
            className='p-1 text-gray-500 hover:text-gray-700'
          >
            {isExpanded ? (
              <FaChevronUp size={14} />
            ) : (
              <FaChevronDown size={14} />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className='p-3 space-y-4 text-xs'>
          <div>
            <FieldLabel
              label='(1) 데이터 범위'
              htmlFor={`dataRange_power_${item.id}`}
            />
            <p
              id={`dataRange_power_${item.id}`}
              className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 h-[34px] flex items-center'
            >
              {item.dataRange}
            </p>
          </div>
          <div>
            <FieldLabel
              label='(2) 전력 종류'
              htmlFor={`powerType_${item.id}`}
            />
            <select
              id={`powerType_${item.id}`}
              value={item.powerType}
              onChange={(e) =>
                onFieldChange(item.id, 'powerType', e.target.value)
              }
              className='w-full p-2 border border-gray-300 rounded-md h-[34px] bg-white shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
            >
              <option value=''>전력 종류 선택</option>
              {powerTypesForUsage.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel label='(3) 단위' htmlFor={`unit_power_${item.id}`} />
            <p
              id={`unit_power_${item.id}`}
              className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 h-[34px] flex items-center'
            >
              {item.unit}
            </p>
          </div>

          <div className='border-t pt-3'>
            <FieldLabel label='(5) 월별 구매전력 사용량 데이터' />
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-1`}>
              {item.monthlyUsage
                .slice(0, showAllMonths ? 12 : 6)
                .map((monthData) => (
                  <div key={monthData.month}>
                    <label
                      htmlFor={`month_power_${item.id}_${monthData.month}`}
                      className='block text-xs font-normal text-gray-500 mb-0.5'
                    >
                      {monthData.month}월
                    </label>
                    <input
                      type='number'
                      id={`month_power_${item.id}_${monthData.month}`}
                      value={monthData.amount || ''}
                      onChange={(e) =>
                        onMonthlyChange(
                          item.id,
                          monthData.month,
                          e.target.value
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded-md text-xs text-right shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-[34px]'
                      placeholder='0'
                      min='0'
                      step='any'
                    />
                  </div>
                ))}
            </div>
            {item.monthlyUsage.length > 6 && (
              <button
                onClick={() => setShowAllMonths(!showAllMonths)}
                className='text-blue-600 hover:text-blue-700 text-xs py-1.5 px-2 mt-2 rounded-md bg-blue-50 hover:bg-blue-100 w-full text-center'
              >
                {showAllMonths ? '간략히 보기' : '전체 월 보기'}
              </button>
            )}
          </div>

          <div>
            <FieldLabel label='(4) 합계' htmlFor={`total_power_${item.id}`} />
            <p
              id={`total_power_${item.id}`}
              className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 h-[34px] flex items-center justify-end font-medium'
            >
              {item.totalAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <FieldLabel label='(6) DQI' htmlFor={`dqi_power_${item.id}`} />
            <p
              id={`dqi_power_${item.id}`}
              className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 h-[34px] flex items-center'
            >
              {item.dqi}
            </p>
          </div>
          <div>
            <FieldLabel label='(7) 파일첨부' />
            <div className='flex items-center space-x-2'>
              <label className='cursor-pointer p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-blue-200 text-xs flex items-center shadow-sm'>
                <FaUpload className='inline mr-1.5' /> 파일 선택
                <input
                  type='file'
                  className='hidden'
                  onChange={(e) =>
                    onFileChange(item.id, e.target.files?.[0] || null)
                  }
                />
              </label>
              {item.attachedFile && (
                <span
                  className='text-gray-500 truncate max-w-[150px]'
                  title={item.attachedFile.name}
                >
                  {item.attachedFile.name}
                </span>
              )}
            </div>
          </div>
          <div className='flex justify-end pt-3 mt-2 border-t border-gray-200'>
            <button
              type='button'
              onClick={() => onDeleteItem(item.id)}
              className={`p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 text-xs flex items-center shadow-sm ${
                isOnlyItem ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label='항목 삭제'
              disabled={isOnlyItem}
            >
              <FaTrash className='mr-1' /> 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface MeasurementItemCardProps {
  item: MeasurementData;
  index: number;
  dummyBuildings: BuildingInfo[];
  dummyProcesses: ProcessInfo[];
  dummySubProcesses: SubProcessInfo[];
  dummyFacilities: FacilityInfo[];
  onFieldChange: (
    id: string,
    field: keyof MeasurementData,
    value: string
  ) => void;
  onMonthlyChange: (id: string, month: number, value: string) => void;
  onFileChange: (id: string, file: File | null) => void;
  onDeleteItem: () => void;
}

const MeasurementItemCard: React.FC<MeasurementItemCardProps> = ({
  item,
  index,
  onFieldChange,
  onMonthlyChange,
  onFileChange,
  onDeleteItem,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAllMonths, setShowAllMonths] = useState(false);

  const cardTitle = item.dataRange
    ? `${item.dataRange}: ${
        item.facilityName ||
        item.subProcessName ||
        item.processName ||
        item.buildingName ||
        '항목'
      }`
    : '데이터 범위 선택';

  return (
    <div className='border border-gray-200 rounded-lg shadow-sm mb-3 bg-white'>
      <div
        className='flex justify-between items-center p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 rounded-t-lg'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className='font-semibold text-gray-700 text-sm truncate pr-2'>
          {cardTitle}
        </h4>
        <button type='button' className='p-1 text-gray-500 hover:text-gray-700'>
          {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </button>
      </div>

      {isExpanded && (
        <div className='p-3 space-y-4 text-xs'>
          <div>
            <FieldLabel
              label='(1) 데이터 범위'
              htmlFor={`dataRange_measure_${item.id}`}
              tooltipText='계측 범위를 선택하세요 (건물, 공정 등)'
            />
            {index === 0 ? (
              <select
                id={`dataRange_measure_${item.id}`}
                value={item.dataRange}
                onChange={(e) =>
                  onFieldChange(
                    item.id,
                    'dataRange',
                    e.target.value as MeasurementData['dataRange']
                  )
                }
                className='w-full p-2 border border-gray-300 rounded-md h-[34px] bg-white shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value=''>범위 선택</option>
                {MEASUREMENT_DATA_RANGE_OPTIONS_MOBILE.map((rangeOpt) => (
                  <option key={rangeOpt} value={rangeOpt}>
                    {rangeOpt}
                  </option>
                ))}
              </select>
            ) : (
              <p
                id={`dataRange_measure_${item.id}`}
                className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 h-[34px] flex items-center'
              >
                {item.dataRange}
              </p>
            )}
          </div>

          {item.buildingName && (
            <div>
              <FieldLabel
                label='(2) 건물명'
                htmlFor={`buildingName_measure_${item.id}`}
              />
              <p
                id={`buildingName_measure_${item.id}`}
                className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 h-[34px] flex items-center'
              >
                {item.buildingName}
              </p>
            </div>
          )}

          {item.processName && (
            <div>
              <FieldLabel
                label='(3) 공정명'
                htmlFor={`processName_measure_${item.id}`}
              />
              <p
                id={`processName_measure_${item.id}`}
                className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 h-[34px] flex items-center'
              >
                {item.processName}
              </p>
            </div>
          )}

          {item.subProcessName && (
            <div>
              <FieldLabel
                label='(4) 세부공정명'
                htmlFor={`subProcessName_measure_${item.id}`}
              />
              <p
                id={`subProcessName_measure_${item.id}`}
                className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 h-[34px] flex items-center'
              >
                {item.subProcessName}
              </p>
            </div>
          )}

          {item.facilityName && (
            <div>
              <FieldLabel
                label='(5) 설비명'
                htmlFor={`facilityName_measure_${item.id}`}
              />
              <p
                id={`facilityName_measure_${item.id}`}
                className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 h-[34px] flex items-center'
              >
                {item.facilityName}
              </p>
            </div>
          )}

          <div className='border-t pt-3'>
            <FieldLabel label='(7) 월별 계측 전력 사용량' />
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-1`}>
              {item.monthlyMeasurement
                .slice(0, showAllMonths ? 12 : 6)
                .map((monthData) => (
                  <div key={monthData.month}>
                    <label
                      htmlFor={`month_measure_${item.id}_${monthData.month}`}
                      className='block text-xs font-normal text-gray-500 mb-0.5'
                    >
                      {monthData.month}월
                    </label>
                    <input
                      type='number'
                      id={`month_measure_${item.id}_${monthData.month}`}
                      value={monthData.amount || ''}
                      onChange={(e) =>
                        onMonthlyChange(
                          item.id,
                          monthData.month,
                          e.target.value
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded-md text-xs text-right shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-[34px]'
                      placeholder='0'
                      min='0'
                      step='any'
                    />
                  </div>
                ))}
            </div>
            {item.monthlyMeasurement.length > 6 && (
              <button
                onClick={() => setShowAllMonths(!showAllMonths)}
                className='text-blue-600 hover:text-blue-700 text-xs py-1.5 px-2 mt-2 rounded-md bg-blue-50 hover:bg-blue-100 w-full text-center'
              >
                {showAllMonths ? '간략히 보기' : '전체 월 보기'}
              </button>
            )}
          </div>

          <div>
            <FieldLabel label='(6) 합계' htmlFor={`total_measure_${item.id}`} />
            <p
              id={`total_measure_${item.id}`}
              className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 h-[34px] flex items-center justify-end font-medium'
            >
              {item.totalAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <FieldLabel label='(8) DQI' htmlFor={`dqi_measure_${item.id}`} />
            <p
              id={`dqi_measure_${item.id}`}
              className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 h-[34px] flex items-center'
            >
              {item.dqi}
            </p>
          </div>
          <div>
            <FieldLabel label='(9) 파일첨부' />
            <div className='flex items-center space-x-2'>
              <label className='cursor-pointer p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 border border-blue-200 text-xs flex items-center shadow-sm'>
                <FaUpload className='inline mr-1.5' /> 파일 선택
                <input
                  type='file'
                  className='hidden'
                  onChange={(e) =>
                    onFileChange(item.id, e.target.files?.[0] || null)
                  }
                />
              </label>
              {item.attachedFile && (
                <span
                  className='text-gray-500 truncate max-w-[150px]'
                  title={item.attachedFile.name}
                >
                  {item.attachedFile.name}
                </span>
              )}
            </div>
          </div>
          {index === 0 && (
            <div className='flex justify-end pt-3 mt-2 border-t border-gray-200'>
              <button
                type='button'
                onClick={() => onDeleteItem()}
                className='p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 text-xs flex items-center shadow-sm'
                aria-label='전체 계측값 삭제'
              >
                <FaTrash className='mr-1' /> 전체 삭제
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PowerUsageMobileView: React.FC<PowerUsageMobileViewProps> = ({
  powerUsageData,
  measurementData,
  powerTypesForUsage,
  dummyBuildings,
  dummyProcesses,
  dummySubProcesses,
  dummyFacilities,
  onAddPowerUsageItem,
  onDeletePowerUsageItem,
  onPowerUsageFieldChange,
  onPowerUsageMonthlyChange,
  onPowerUsageFileChange,
  onAddMeasurementItem,
  onDeleteMeasurementItem,
  onMeasurementFieldChange,
  onMeasurementMonthlyChange,
  onMeasurementFileChange,
  showMeasurementTable,
}) => {
  return (
    <div className='space-y-6 p-1'>
      <section>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='text-lg font-semibold text-gray-800'>
            (1) 사업장 전력 사용량
          </h3>
          <button
            type='button'
            onClick={onAddPowerUsageItem}
            className='px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center shadow-sm transition-colors'
            disabled={powerUsageData.length >= 5} // Example: Limit to 5 items for mobile
          >
            <FaPlus className='mr-1.5' size={14} /> 항목 추가
          </button>
        </div>
        {powerUsageData.length > 0 ? (
          powerUsageData.map((item) => (
            <PowerUsageItemCard
              key={item.id}
              item={item}
              powerTypesForUsage={powerTypesForUsage}
              onFieldChange={onPowerUsageFieldChange}
              onMonthlyChange={onPowerUsageMonthlyChange}
              onFileChange={onPowerUsageFileChange}
              onDeleteItem={onDeletePowerUsageItem}
              isOnlyItem={powerUsageData.length === 1}
            />
          ))
        ) : (
          <p className='text-center text-gray-500 text-sm py-4 bg-gray-50 rounded-md'>
            사업장 전력 사용량 정보가 없습니다. &quot;항목 추가&quot; 버튼을
            클릭하여 추가해주세요.
          </p>
        )}
      </section>

      {showMeasurementTable && (
        <section className='mt-6 pt-4 border-t'>
          <div className='flex justify-between items-center mb-3'>
            <h3 className='text-lg font-semibold text-gray-800 flex items-center'>
              (2) 건물/공정/설비 전력 계측값
              <Tooltip text='실제 계측된 전력량 데이터를 입력합니다.'>
                <FaInfoCircle className='ml-1.5 text-blue-500 cursor-pointer' />
              </Tooltip>
            </h3>
            <button
              type='button'
              onClick={onAddMeasurementItem}
              className='px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center shadow-sm transition-colors'
            >
              <FaPlus className='mr-1.5' size={14} /> 데이터 범위 선택
            </button>
          </div>
          {measurementData.length > 0 ? (
            measurementData.map((item, index) => (
              <MeasurementItemCard
                key={item.id}
                item={item}
                index={index}
                dummyBuildings={dummyBuildings}
                dummyProcesses={dummyProcesses}
                dummySubProcesses={dummySubProcesses}
                dummyFacilities={dummyFacilities}
                onFieldChange={onMeasurementFieldChange}
                onMonthlyChange={onMeasurementMonthlyChange}
                onFileChange={onMeasurementFileChange}
                onDeleteItem={onDeleteMeasurementItem}
              />
            ))
          ) : (
            <p className='text-center text-gray-500 text-sm py-4 bg-gray-50 rounded-md'>
              데이터 범위를 선택하면 해당하는 모든 항목이 자동으로 표시됩니다.
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default PowerUsageMobileView;
