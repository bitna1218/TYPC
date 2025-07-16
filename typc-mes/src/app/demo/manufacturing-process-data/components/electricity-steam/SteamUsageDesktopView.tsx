'use client';

import React from 'react';
import { FaUpload, FaPlus, FaTrash, FaInfoCircle } from 'react-icons/fa';
import Tooltip from '../Tooltip'; // Assuming Tooltip is in a common folder
import {
  PowerUsageData,
  MeasurementData,
  PowerTypeInfo, // Import from central location
  BuildingInfo,
  ProcessInfo,
  SubProcessInfo,
  FacilityInfo,
} from './ElectricitySteamTabContent'; // Interfaces from the main content file

// MEASUREMENT_RANGES_OPTIONS_DESKTOP is still useful here
const MEASUREMENT_DATA_RANGE_OPTIONS: MeasurementData['dataRange'][] = [
  '건물',
  '공정',
  '세부공정',
  '설비',
];

interface SteamUsageDesktopViewProps {
  powerUsageData: PowerUsageData[];
  measurementData: MeasurementData[];
  correctionData: MeasurementData[]; // For the correction table

  // Data for select options
  powerTypesForUsage: PowerTypeInfo[];
  dummyBuildings: BuildingInfo[];
  dummyProcesses: ProcessInfo[];
  dummySubProcesses: SubProcessInfo[];
  dummyFacilities: FacilityInfo[];

  // Handlers
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
  showCorrectionTable: boolean;
}

const SteamUsageDesktopView: React.FC<SteamUsageDesktopViewProps> = ({
  powerUsageData,
  measurementData,
  correctionData,
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
  showCorrectionTable,
}) => {
  const getBuildingName = (id?: string) =>
    dummyBuildings.find((b) => b.id === id)?.name || '-';
  const getProcessName = (id?: string) =>
    dummyProcesses.find((p) => p.id === id)?.name || '-';
  const getSubProcessName = (id?: string) =>
    dummySubProcesses.find((sp) => sp.id === id)?.name || '-';
  const getFacilityName = (id?: string) =>
    dummyFacilities.find((f) => f.id === id)?.name || '-';

  const renderBusinessPowerTable = () => {
    const totalMonthlyUsage = Array(12).fill(0);
    let grandTotalAmount = 0;

    powerUsageData.forEach((item) => {
      item.monthlyUsage.forEach((monthData, index) => {
        totalMonthlyUsage[index] += monthData.amount;
      });
      grandTotalAmount += item.totalAmount;
    });

    return (
      <div className='mb-8 p-1'>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='text-lg font-semibold text-gray-800'>
            (1) 사업장 전력 사용량
          </h3>
          <button
            type='button'
            onClick={onAddPowerUsageItem}
            className='px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center shadow-sm transition-colors'
          >
            <FaPlus className='mr-1.5' size={14} /> 항목 추가
          </button>
        </div>
        <div className='overflow-x-auto shadow-sm border border-gray-200 rounded-lg'>
          <table className='min-w-full border-collapse border border-gray-300'>
            <thead className='bg-gray-100 text-gray-700 text-xs uppercase tracking-wider'>
              <tr>
                <th
                  colSpan={4}
                  className='px-3 py-2.5 font-semibold border-b-2 border-gray-400 text-center whitespace-nowrap bg-gray-200'
                >
                  전력 정보
                </th>
                <th
                  colSpan={12}
                  className='px-3 py-2.5 font-semibold border-b-2 border-gray-400 text-center whitespace-nowrap bg-gray-200'
                >
                  (5) 월별 구매전력 사용량 데이터
                </th>
                <th
                  colSpan={2}
                  className='px-3 py-2.5 font-semibold border-b-2 border-gray-400 text-center whitespace-nowrap bg-gray-200'
                >
                  데이터 품질정보
                </th>
                <th
                  rowSpan={2}
                  className='px-2 py-2.5 font-semibold border-l border-gray-300 w-[50px] align-middle text-center whitespace-nowrap bg-gray-100'
                >
                  삭제
                </th>
              </tr>
              <tr>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[80px] whitespace-nowrap'>
                  (1)
                  <br />
                  데이터
                  <br />
                  범위
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[160px] whitespace-nowrap'>
                  (2)
                  <br />
                  전력 종류
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[70px] whitespace-nowrap'>
                  (3)
                  <br />
                  단위
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[100px] whitespace-nowrap'>
                  (4)
                  <br />
                  합계
                </th>
                {Array.from({ length: 12 }, (_, i) => (
                  <th
                    key={`month-header-${i}`}
                    className='px-2 py-1.5 font-semibold border border-gray-300 text-xs text-center min-w-[70px] whitespace-nowrap'
                  >
                    {i + 1}월
                  </th>
                ))}
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[60px] whitespace-nowrap'>
                  (6)
                  <br />
                  DQI
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[100px] whitespace-nowrap'>
                  (7)
                  <br />
                  파일첨부
                </th>
              </tr>
            </thead>
            <tbody className='bg-white text-xs divide-y divide-gray-200'>
              {powerUsageData.map((item) => (
                <tr key={item.id} className='hover:bg-gray-50 align-top'>
                  <td className='px-2 py-2 text-gray-700 bg-gray-50 align-middle text-center border border-gray-300'>
                    {item.dataRange}
                  </td>
                  <td className='p-1 align-middle border border-gray-300'>
                    <select
                      value={item.powerType}
                      onChange={(e) =>
                        onPowerUsageFieldChange(
                          item.id,
                          'powerType',
                          e.target.value
                        )
                      }
                      className='w-full py-1.5 px-2 text-xs border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value=''>전력 종류 선택</option>
                      {powerTypesForUsage.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='px-2 py-2 text-gray-700 bg-gray-50 align-middle text-center border border-gray-300'>
                    {item.unit}
                  </td>
                  <td className='px-2 py-2 text-gray-700 bg-gray-50 text-right align-middle border border-gray-300'>
                    {item.totalAmount.toLocaleString()}
                  </td>
                  {item.monthlyUsage.map((monthData) => (
                    <td
                      key={monthData.month}
                      className='p-1 align-middle border border-gray-300'
                    >
                      <input
                        type='number'
                        value={monthData.amount || ''}
                        onChange={(e) =>
                          onPowerUsageMonthlyChange(
                            item.id,
                            monthData.month,
                            e.target.value
                          )
                        }
                        className='w-full py-1.5 px-2 text-xs border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right'
                        placeholder='0'
                        min='0'
                        step='any'
                      />
                    </td>
                  ))}
                  <td className='px-2 py-2 text-gray-700 bg-gray-100 align-middle text-center border border-gray-300'>
                    {item.dqi}
                  </td>
                  <td className='p-1 align-middle border border-gray-300'>
                    <div className='flex flex-col items-center justify-center h-full'>
                      <label className='cursor-pointer p-1.5 rounded-md hover:bg-gray-100'>
                        <input
                          type='file'
                          className='hidden'
                          onChange={(e) =>
                            onPowerUsageFileChange(
                              item.id,
                              e.target.files?.[0] || null
                            )
                          }
                        />
                        <FaUpload
                          className='text-blue-500 hover:text-blue-700'
                          size={16}
                        />
                      </label>
                      {item.attachedFile && (
                        <span
                          className='text-xs text-gray-500 mt-0.5 truncate max-w-[80px]'
                          title={item.attachedFile.name}
                        >
                          {item.attachedFile.name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className='px-2 py-2 text-center align-middle border border-gray-300'>
                    <button
                      type='button'
                      onClick={() => onDeletePowerUsageItem(item.id)}
                      className='text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50'
                      aria-label='항목 삭제'
                      disabled={powerUsageData.length <= 1} // 사업장 전력은 최소 1개 유지
                    >
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className='bg-gray-100 font-semibold text-gray-800 text-xs'>
                <td
                  colSpan={3}
                  className='px-3 py-2 text-center border border-gray-300'
                >
                  총계
                </td>
                <td className='px-2 py-2 text-right border border-gray-300'>
                  {grandTotalAmount.toLocaleString()}
                </td>
                {totalMonthlyUsage.map((total, index) => (
                  <td
                    key={`total-month-${index}`}
                    className='px-2 py-2 text-right border border-gray-300'
                  >
                    {total.toLocaleString()}
                  </td>
                ))}
                <td
                  colSpan={3}
                  className='px-2 py-2 border border-gray-300'
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderMeasurementTable = () => {
    if (!showMeasurementTable) return null;

    const totalMonthlyMeasurement = Array(12).fill(0);
    let grandTotalMeasurement = 0;

    measurementData.forEach((item) => {
      item.monthlyMeasurement.forEach((monthData, index) => {
        totalMonthlyMeasurement[index] += monthData.amount;
      });
      grandTotalMeasurement += item.totalAmount;
    });

    return (
      <div className='mb-8 p-1'>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='text-lg font-semibold text-gray-800 flex items-center'>
            (2) 건물/공정/세부공정/설비 스팀 계측값
            <Tooltip text='실제 계측된 스팀 사용량 데이터를 입력합니다. 이 값은 (1)번 사업장 사용량과 (3)번 보정값 계산에 사용됩니다.'>
              <FaInfoCircle className='ml-2 text-blue-500 cursor-pointer' />
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
        <div className='overflow-x-auto shadow-sm border border-gray-200 rounded-lg'>
          <table className='min-w-full border-collapse border border-gray-300'>
            <thead className='bg-gray-100 text-gray-700 text-xs uppercase tracking-wider'>
              <tr>
                <th
                  colSpan={5}
                  className='px-3 py-2.5 font-semibold border-b-2 border-gray-400 text-center whitespace-nowrap bg-gray-200'
                >
                  전력 정보
                </th>
                <th
                  colSpan={13}
                  className='px-3 py-2.5 font-semibold border-b-2 border-gray-400 text-center whitespace-nowrap bg-gray-200'
                >
                  (7) 월별 구매전력 사용량 데이터
                </th>
                <th
                  colSpan={2}
                  className='px-3 py-2.5 font-semibold border-b-2 border-gray-400 text-center whitespace-nowrap bg-gray-200'
                >
                  데이터 품질정보
                </th>
                <th
                  rowSpan={2}
                  className='px-2 py-2.5 font-semibold border-l border-gray-300 w-[50px] align-middle text-center whitespace-nowrap bg-gray-100'
                >
                  삭제
                </th>
              </tr>
              <tr>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[100px] whitespace-nowrap'>
                  (1)
                  <br />
                  데이터
                  <br />
                  범위
                  <Tooltip text='계측값을 입력할 범위를 선택합니다: 건물, 공정, 세부공정, 설비. 선택에 따라 해당하는 모든 항목이 자동으로 표시됩니다.'>
                    <FaInfoCircle
                      className='inline-block ml-1 text-blue-400 cursor-pointer'
                      size={12}
                    />
                  </Tooltip>
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[140px] whitespace-nowrap'>
                  (2)
                  <br />
                  건물명
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[140px] whitespace-nowrap'>
                  (3)
                  <br />
                  공정명
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[140px] whitespace-nowrap'>
                  (4)
                  <br />
                  세부공정명
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[140px] whitespace-nowrap'>
                  (5)
                  <br />
                  설비명
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[100px] whitespace-nowrap bg-gray-100'>
                  (6)
                  <br />
                  합계
                  <br />
                  (kWh)
                </th>
                {Array.from({ length: 12 }, (_, i) => (
                  <th
                    key={i}
                    className='px-2 py-1.5 font-semibold border border-gray-300 text-xs text-center min-w-[70px] whitespace-nowrap'
                  >
                    {i + 1}월
                  </th>
                ))}
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[60px] whitespace-nowrap'>
                  (8)
                  <br />
                  DQI
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[100px] whitespace-nowrap'>
                  (9)
                  <br />
                  파일첨부
                </th>
              </tr>
            </thead>
            <tbody className='bg-white text-xs divide-y divide-gray-200'>
              {measurementData.length === 0 ? (
                <tr>
                  <td colSpan={21} className='px-4 py-8 text-center text-gray-500'>
                    데이터 범위를 선택하면 해당하는 모든 항목이 자동으로 표시됩니다.
                  </td>
                </tr>
              ) : (
                measurementData.map((item, index) => (
                  <tr key={item.id} className='hover:bg-gray-50 align-top'>
                    <td className='p-1 align-middle border border-gray-300'>
                      {index === 0 ? (
                        <select
                          value={item.dataRange}
                          onChange={(e) =>
                            onMeasurementFieldChange(
                              item.id,
                              'dataRange',
                              e.target.value as MeasurementData['dataRange']
                            )
                          }
                          className='w-full py-1.5 px-2 text-xs border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                        >
                          <option value=''>범위 선택</option>
                          {MEASUREMENT_DATA_RANGE_OPTIONS.map((range) => (
                            <option key={range} value={range}>
                              {range}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className='w-full py-1.5 px-2 text-xs border-gray-300 bg-gray-100 rounded-md shadow-sm flex items-center justify-center text-gray-600'>
                          {item.dataRange || '-'}
                        </div>
                      )}
                    </td>
                    <td className='p-1 align-middle border border-gray-300'>
                      <div className='w-full py-1.5 px-2 text-xs border-gray-300 bg-gray-100 rounded-md shadow-sm flex items-center justify-center text-gray-600'>
                        {item.buildingName || '-'}
                      </div>
                    </td>
                    <td className='p-1 align-middle border border-gray-300'>
                      <div className='w-full py-1.5 px-2 text-xs border-gray-300 bg-gray-100 rounded-md shadow-sm flex items-center justify-center text-gray-600'>
                        {item.processName || '-'}
                      </div>
                    </td>
                    <td className='p-1 align-middle border border-gray-300'>
                      <div className='w-full py-1.5 px-2 text-xs border-gray-300 bg-gray-100 rounded-md shadow-sm flex items-center justify-center text-gray-600'>
                        {item.subProcessName || '-'}
                      </div>
                    </td>
                    <td className='p-1 align-middle border border-gray-300'>
                      <div className='w-full py-1.5 px-2 text-xs border-gray-300 bg-gray-100 rounded-md shadow-sm flex items-center justify-center text-gray-600'>
                        {item.facilityName || '-'}
                      </div>
                    </td>
                    <td className='px-2 py-2 text-gray-700 bg-gray-50 text-right align-middle border border-gray-300'>
                      {item.totalAmount.toLocaleString()}
                    </td>
                    {item.monthlyMeasurement.map((monthData) => (
                      <td
                        key={monthData.month}
                        className='p-1 align-middle border border-gray-300'
                      >
                        <input
                          type='number'
                          value={monthData.amount || ''}
                          onChange={(e) =>
                            onMeasurementMonthlyChange(
                              item.id,
                              monthData.month,
                              e.target.value
                            )
                          }
                          className='w-full py-1.5 px-2 text-xs border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right'
                          placeholder='0'
                          min='0'
                          step='any'
                        />
                      </td>
                    ))}
                    <td className='px-2 py-2 text-gray-700 bg-gray-100 align-middle text-center border border-gray-300'>
                      {item.dqi}
                    </td>
                    <td className='p-1 align-middle border border-gray-300'>
                      <div className='flex flex-col items-center justify-center h-full'>
                        <label className='cursor-pointer p-1.5 rounded-md hover:bg-gray-100'>
                          <input
                            type='file'
                            className='hidden'
                            onChange={(e) =>
                              onMeasurementFileChange(
                                item.id,
                                e.target.files?.[0] || null
                              )
                            }
                          />
                          <FaUpload
                            className='text-blue-500 hover:text-blue-700'
                            size={16}
                          />
                        </label>
                        {item.attachedFile && (
                          <span
                            className='text-xs text-gray-500 mt-0.5 truncate max-w-[80px]'
                            title={item.attachedFile.name}
                          >
                            {item.attachedFile.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='px-2 py-2 text-center align-middle border border-gray-300'>
                      {index === 0 ? (
                        <button
                          type='button'
                          onClick={() => onDeleteMeasurementItem()}
                          className='text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50'
                          aria-label='전체 계측값 삭제'
                          title='전체 계측 데이터를 삭제합니다'
                        >
                          <FaTrash size={14} />
                        </button>
                      ) : (
                        <div className='w-full py-1.5 px-2 text-xs text-gray-400 flex items-center justify-center'>
                          -
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
              {measurementData.length > 0 && (
                <tr className='bg-gray-100 font-semibold text-gray-800 text-xs'>
                  <td className='px-3 py-2 text-center border border-gray-300'>
                    총계
                  </td>
                  <td className='px-2 py-2 text-center border border-gray-300 bg-gray-100'></td>
                  <td className='px-2 py-2 text-center border border-gray-300 bg-gray-100'></td>
                  <td className='px-2 py-2 text-center border border-gray-300 bg-gray-100'></td>
                  <td className='px-2 py-2 text-center border border-gray-300 bg-gray-100'></td>
                  <td className='px-2 py-2 text-right border border-gray-300'>
                    {grandTotalMeasurement.toLocaleString()}
                  </td>
                  {totalMonthlyMeasurement.map((total, index) => (
                    <td
                      key={`total-measure-month-${index}`}
                      className='px-2 py-2 text-right border border-gray-300'
                    >
                      {total.toLocaleString()}
                    </td>
                  ))}
                  <td
                    colSpan={3}
                    className='px-2 py-2 border border-gray-300'
                  ></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCorrectionTable = () => {
    if (
      !showCorrectionTable ||
      !showMeasurementTable ||
      correctionData.length === 0
    )
      return null;

    const totalMonthlyCorrection = Array(12).fill(0);
    let grandTotalCorrection = 0;

    correctionData.forEach((item) => {
      item.monthlyMeasurement.forEach((monthData, index) => {
        totalMonthlyCorrection[index] += monthData.amount;
      });
      grandTotalCorrection += item.totalAmount;
    });

    return (
      <div className='mb-8 p-1'>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='text-lg font-semibold text-gray-800 flex items-center'>
            (3) 전력 사용량 보정값
            <Tooltip text='사업장 전체 사용량과 건물/공정/설비별 계측값을 기준으로 보정된 값입니다. 이 값은 수정할 수 없습니다.'>
              <FaInfoCircle className='ml-2 text-blue-500 cursor-pointer' />
            </Tooltip>
          </h3>
        </div>

        <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-xs text-green-800 space-y-1'>
          <p>
            <strong className='font-medium'>
              계측 값이 있을 경우 보정을 반드시 해야 합니다.
            </strong>
          </p>
          <p>표는 2번 표 계측 표와 동일한데 월별 값이 바뀝니다.</p>
          <div>
            <p className='font-medium mt-1.5'>
              월 별로 보정하는 방법 설명입니다.
            </p>
            <p className='pl-2'>
              {' '}
              • 1번 표의 월 총계 값 × [해당 계측 값의 월 전력 사용량 값 / 계측
              값들의 월 전력 사용량 총계 값]
            </p>
            <p className='pl-2 text-green-700'>
              {' '}
              └ [해당 계측 값의 월 전력 사용량 값 / 계측 값들의 월 전력 사용량
              총계 값]은 비율을 구하는 과정입니다.
            </p>
          </div>
          <p className='mt-1.5'>
            (전력 보정 샘플 엑셀 파일을 참고해주세요) -{' '}
            <span className='italic text-gray-500'>
              샘플 파일 링크 기능은 현재 미구현
            </span>
          </p>
          <p className='mt-1.5'>
            LCA, CBAM 솔루션으로 전력 사용량을 가져갈 때에는 데이터 수집 기간에
            해당하는 월의 &lt;보정 → 단위공정에 할당&gt;된 값을 가져갑니다.
          </p>
        </div>

        <div className='overflow-x-auto shadow-sm border border-gray-200 rounded-lg'>
          <table className='min-w-full border-collapse border border-gray-300'>
            <thead className='bg-gray-100 text-gray-700 text-xs uppercase tracking-wider'>
              <tr>
                <th
                  colSpan={5}
                  className='px-3 py-2.5 font-semibold border-b-2 border-gray-400 text-center whitespace-nowrap bg-gray-200'
                >
                  전력 정보
                </th>
                <th
                  colSpan={13}
                  className='px-3 py-2.5 font-semibold border-b-2 border-gray-400 text-center whitespace-nowrap bg-gray-200'
                >
                  (7) 월별 보정된 사용량 데이터
                </th>
                <th
                  colSpan={2}
                  className='px-3 py-2.5 font-semibold border-b-2 border-gray-400 text-center whitespace-nowrap bg-gray-200'
                >
                  데이터 품질정보
                </th>
              </tr>
              <tr>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[100px] whitespace-nowrap'>
                  (1)
                  <br />
                  데이터
                  <br />
                  범위
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[140px] whitespace-nowrap'>
                  (2)
                  <br />
                  건물명
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[140px] whitespace-nowrap'>
                  (3)
                  <br />
                  공정명
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[140px] whitespace-nowrap'>
                  (4)
                  <br />
                  세부공정명
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[140px] whitespace-nowrap'>
                  (5)
                  <br />
                  설비명
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[100px] whitespace-nowrap bg-gray-100'>
                  (6)
                  <br />
                  합계
                  <br />
                  (kWh)
                </th>
                {Array.from({ length: 12 }, (_, i) => (
                  <th
                    key={`correction-month-header-${i}`}
                    className='px-2 py-1.5 font-semibold border border-gray-300 text-xs text-center min-w-[70px] whitespace-nowrap'
                  >
                    {i + 1}월
                  </th>
                ))}
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[60px] whitespace-nowrap'>
                  (8)
                  <br />
                  DQI
                </th>
                <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[100px] whitespace-nowrap'>
                  (9)
                  <br />
                  파일첨부
                </th>
              </tr>
            </thead>
            <tbody className='bg-white text-xs divide-y divide-gray-200'>
              {correctionData.map((item) => (
                <tr key={item.id} className='hover:bg-gray-50 align-top'>
                  <td className='px-2 py-2 text-gray-600 bg-gray-50 align-middle text-center border border-gray-300'>
                    {item.dataRange || '-'}
                  </td>
                  <td className='px-2 py-2 text-gray-600 bg-gray-50 align-middle text-center border border-gray-300'>
                    {getBuildingName(item.buildingId)}
                  </td>
                  <td className='px-2 py-2 text-gray-600 bg-gray-50 align-middle text-center border border-gray-300'>
                    {getProcessName(item.processId)}
                  </td>
                  <td className='px-2 py-2 text-gray-600 bg-gray-50 align-middle text-center border border-gray-300'>
                    {getSubProcessName(item.subProcessId)}
                  </td>
                  <td className='px-2 py-2 text-gray-600 bg-gray-50 align-middle text-center border border-gray-300'>
                    {getFacilityName(item.facilityId)}
                  </td>
                  <td className='px-2 py-2 text-gray-600 bg-gray-50 text-right align-middle border border-gray-300'>
                    {item.totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  {item.monthlyMeasurement.map((monthData) => (
                    <td
                      key={monthData.month}
                      className='px-2 py-2 text-gray-600 bg-gray-50 text-right align-middle border border-gray-300'
                    >
                      {monthData.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  ))}
                  <td className='px-2 py-2 text-gray-600 bg-gray-100 align-middle text-center border border-gray-300'>
                    {item.dqi}
                  </td>
                  <td className='px-2 py-2 text-gray-600 bg-gray-100 align-middle text-center border border-gray-300'>
                    -
                  </td>
                </tr>
              ))}
              <tr className='bg-gray-100 font-semibold text-gray-800 text-xs'>
                <td
                  colSpan={5}
                  className='px-3 py-2 text-center border border-gray-300'
                >
                  총계
                </td>
                <td className='px-2 py-2 text-right border border-gray-300'>
                  {grandTotalCorrection.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                {totalMonthlyCorrection.map((total, index) => (
                  <td
                    key={`total-correction-month-${index}`}
                    className='px-2 py-2 text-right border border-gray-300'
                  >
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                ))}
                <td className='px-2 py-2 text-center border border-gray-300 bg-gray-100'>
                  -
                </td>
                <td className='px-2 py-2 text-center border border-gray-300 bg-gray-100'>
                  -
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      {renderBusinessPowerTable()}
      {renderMeasurementTable()}
      {renderCorrectionTable()}
    </div>
  );
};

export default SteamUsageDesktopView;
