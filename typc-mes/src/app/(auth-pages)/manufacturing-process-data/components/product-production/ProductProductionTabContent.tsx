'use client';

import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaSave, FaUpload } from 'react-icons/fa';
import Tooltip from '../Tooltip';

// 인터페이스 정의
interface UnitProcess {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  classification: string;
  modelName: string;
  salesUnit: string;
  weightPerUnit: number;
  processName: string;
  unitProcessId: string;
}

interface MonthlyProductionData {
  month: number;
  weightTotal: number; // kg 기준
}

interface ProductionInputItem {
  productId: string;
  classification: string;
  productName: string;
  modelName: string;
  salesUnit: string;
  weightPerUnit: number;
  processName: string;
  unitProcessName: string;
  monthlyData: MonthlyProductionData[];
  attachedFile?: File | null;
  remarks: string;
}

interface ProductionSummaryItem {
  unitProcessId: string;
  unitProcessName: string;
  productName: string;
  weightTotalSum: number; // (3) 제품 생산량 중량 합계 (kg)
  weightRatio: number; // (4) 제품 생산량 중량 비율 (%)
  quantityTotalSum: number; // (5) 제품생산량 수량 합계 (EA)
  quantityRatio: number; // (6) 제품 생산량 수량 비율 (%)
}

interface ProductProductionTabContentProps {
  siteId?: string;
}

// 더미 데이터
const DUMMY_UNIT_PROCESSES: UnitProcess[] = [
  { id: 'unit1', name: '단위공정 1' },
  { id: 'unit2', name: '단위공정 2' },
  { id: 'unit3', name: '단위공정 3' },
];

const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'prod1',
    name: '제품 A',
    classification: '제품',
    modelName: '모델-A1',
    salesUnit: 'kg',
    weightPerUnit: 1,
    processName: '조립 공정 A',
    unitProcessId: 'unit1',
  },
  {
    id: 'prod2',
    name: '제품 B',
    classification: '제품',
    modelName: '모델-B1',
    salesUnit: 'EA',
    weightPerUnit: 2.5,
    processName: '가공 공정 B',
    unitProcessId: 'unit1',
  },
  {
    id: 'prod3',
    name: '반제품 C',
    classification: '반제품',
    modelName: '모델-C1',
    salesUnit: 'kg',
    weightPerUnit: 1,
    processName: '포장 공정 C',
    unitProcessId: 'unit2',
  },
  {
    id: 'prod4',
    name: '제품 D',
    classification: '제품',
    modelName: '모델-D1',
    salesUnit: 'L',
    weightPerUnit: 0.8,
    processName: '용광로 작업',
    unitProcessId: 'unit3',
  },
];

const ProductProductionTabContent: React.FC<
  ProductProductionTabContentProps
> = ({ siteId }) => {
  const [productionInputData, setProductionInputData] = useState<
    ProductionInputItem[]
  >([]);
  const [productionSummaryData, setProductionSummaryData] = useState<
    ProductionSummaryItem[]
  >([]);

  // 초기 데이터 생성 - 제품, 반제품만 필터링
  useEffect(() => {
    console.log('siteId', siteId);
    const filteredProducts = DUMMY_PRODUCTS.filter(
      (product) =>
        product.classification === '제품' || product.classification === '반제품'
    );

    const initialInputData: ProductionInputItem[] = filteredProducts.map(
      (product) => {
        const unitProcess = DUMMY_UNIT_PROCESSES.find(
          (up) => up.id === product.unitProcessId
        );
        return {
          productId: product.id,
          classification: product.classification,
          productName: product.name,
          modelName: product.modelName,
          salesUnit: product.salesUnit,
          weightPerUnit: product.weightPerUnit,
          processName: product.processName,
          unitProcessName: unitProcess?.name || '',
          monthlyData: Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            weightTotal: 0,
          })),
          attachedFile: null,
          remarks: '',
        };
      }
    );
    setProductionInputData(initialInputData);
  }, [siteId]);

  // 집계 데이터 계산
  useEffect(() => {
    const summaryMap = new Map<string, ProductionSummaryItem>();

    productionInputData.forEach((item) => {
      const weightTotalSum = item.monthlyData.reduce(
        (sum, data) => sum + data.weightTotal,
        0
      );
      const quantityTotalSum =
        item.salesUnit === 'kg'
          ? weightTotalSum
          : weightTotalSum / item.weightPerUnit; // EA 계산

      const key = `${item.unitProcessName}_${item.productName}`;

      if (summaryMap.has(key)) {
        const existing = summaryMap.get(key)!;
        existing.weightTotalSum += weightTotalSum;
        existing.quantityTotalSum += quantityTotalSum;
      } else {
        summaryMap.set(key, {
          unitProcessId: item.productId, // 임시로 사용
          unitProcessName: item.unitProcessName,
          productName: item.productName,
          weightTotalSum,
          quantityTotalSum,
          weightRatio: 0,
          quantityRatio: 0,
        });
      }
    });

    const summaryArray = Array.from(summaryMap.values());

    // 비율 계산
    const totalWeight = summaryArray.reduce(
      (sum, item) => sum + item.weightTotalSum,
      0
    );
    const totalQuantity = summaryArray.reduce(
      (sum, item) => sum + item.quantityTotalSum,
      0
    );

    summaryArray.forEach((item) => {
      item.weightRatio =
        totalWeight > 0 ? (item.weightTotalSum / totalWeight) * 100 : 0;
      item.quantityRatio =
        totalQuantity > 0 ? (item.quantityTotalSum / totalQuantity) * 100 : 0;
    });

    setProductionSummaryData(summaryArray);
  }, [productionInputData]);

  // 월별 데이터 업데이트
  const handleMonthlyDataChange = (
    productId: string,
    month: number,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;

    setProductionInputData((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const updatedMonthlyData = item.monthlyData.map((monthData) => {
            if (monthData.month === month) {
              return { ...monthData, weightTotal: numValue };
            }
            return monthData;
          });

          return {
            ...item,
            monthlyData: updatedMonthlyData,
          };
        }
        return item;
      })
    );
  };

  // 파일 업로드 핸들러
  const handleFileChange = (productId: string, file: File | null) => {
    setProductionInputData((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, attachedFile: file } : item
      )
    );
  };

  // 비고 변경 핸들러
  const handleRemarksChange = (productId: string, remarks: string) => {
    setProductionInputData((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, remarks } : item
      )
    );
  };

  // 저장 핸들러
  const handleSave = () => {
    console.log('Saving production input data:', productionInputData);
    console.log('Production summary data:', productionSummaryData);
    alert('제품 생산량 데이터가 저장되었습니다.');
  };

  // 상단 입력 테이블 렌더링
  const renderInputTable = () => (
    <div className='mb-8'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        제품 생산량 입력
      </h3>
      <div className='overflow-x-auto'>
        <table className='min-w-full border-collapse border border-gray-300'>
          <thead className='bg-blue-100'>
            <tr>
              <th rowSpan={2} className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm align-middle whitespace-nowrap min-w-[80px]'>
                (1)<br />구분
              </th>
              <th rowSpan={2} className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm align-middle whitespace-nowrap min-w-[120px]'>
                (2)<br />제품명
              </th>
              <th rowSpan={2} className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm align-middle whitespace-nowrap min-w-[100px]'>
                (3)<br />모델명
              </th>
              <th rowSpan={2} className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm align-middle whitespace-nowrap min-w-[80px]'>
                (4)<br />판매공정명
              </th>
              <th rowSpan={2} className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm align-middle whitespace-nowrap min-w-[80px]'>
                (5)<br />단위
              </th>
              <th rowSpan={2} className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm align-middle whitespace-nowrap min-w-[100px]'>
                (6)<br />합계
              </th>
              <th rowSpan={2} className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm align-middle whitespace-nowrap min-w-[120px]'>
                (7)<br />단위 당 중량
              </th>
              <th rowSpan={2} className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm align-middle whitespace-nowrap min-w-[120px]'>
                (8)<br />&quot;단위 당 중량&quot;의 단위
              </th>
              <th rowSpan={2} className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm align-middle whitespace-nowrap min-w-[120px]'>
                (9)<br />환산합계 (kg)
                 <Tooltip text='월별 제품 생산량을 kg 단위로 입력하면, 판매단위 기준으로 자동 환산된 합계입니다.'>
                 <FaInfoCircle className='text-gray-400 hover:text-gray-600 cursor-pointer' />
                </Tooltip>
              </th>
              <th colSpan={12} className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm align-middle whitespace-nowrap'>
                (10) 월별 생산량 (단위: kg)
              </th>
              <th rowSpan={2} className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm align-middle whitespace-nowrap min-w-[100px]'>
                (11)<br />파일첨부
              </th>
              <th rowSpan={2} className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm align-middle whitespace-nowrap min-w-[100px]'>
                비고
              </th>
            </tr>
            <tr>
              {Array.from({ length: 12 }, (_, i) => (
                <th
                  key={i}
                  className='border border-gray-300 px-1 py-2 font-medium text-gray-700 text-xs align-middle whitespace-nowrap min-w-[70px]'
                >
                  {i + 1}월
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white'>
            {productionInputData.map((item) => {
              const totalWeight = item.monthlyData.reduce(
                (sum, data) => sum + data.weightTotal,
                0
              );
              return (
                <tr key={item.productId} className='hover:bg-gray-50'>
                  {/* (1) 구분 - 자동표출 */}
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 align-middle whitespace-nowrap'>
                    {item.classification}
                  </td>
                  {/* (2) 제품명 - 자동표출 */}
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 align-middle whitespace-nowrap'>
                    {item.productName}
                  </td>
                  {/* (3) 모델명 - 자동표출 */}
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 align-middle whitespace-nowrap'>
                    {item.modelName}
                  </td>
                  {/* (4) 판매공정명 - 자동표출 */}
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 align-middle whitespace-nowrap'>
                    {item.processName}
                  </td>
                  {/* (5) 단위 - 자동표출 */}
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 align-middle whitespace-nowrap'>
                    {item.salesUnit}
                  </td>
                  {/* (6) 합계 - 자동계산 (월별 kg 생산량 합계) */} 
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 text-right align-middle whitespace-nowrap'>
                    {totalWeight.toLocaleString()}
                  </td>
                  {/* (7) 단위 당 중량 - 자동표출 */}
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 align-middle whitespace-nowrap'>
                    {item.weightPerUnit}
                  </td>
                  {/* (8) '단위 당 중량'의 단위 - 자동표출 */}
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 align-middle whitespace-nowrap'>
                    kg/{item.salesUnit}
                  </td>
                  {/* (9) 환산합계 (kg) - 자동계산 (월별 kg 생산량 합계 = totalWeight와 동일) */} 
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 text-right align-middle whitespace-nowrap'>
                    {totalWeight.toLocaleString()} 
                  </td>
                  {/* (10) 월별 생산량 - 입력 */}
                  {item.monthlyData.map((monthData) => (
                    <td
                      key={monthData.month}
                      className='border border-gray-300 px-1 py-1 align-middle whitespace-nowrap'
                    >
                      <input
                        type='number'
                        value={monthData.weightTotal || ''}
                        onChange={(e) =>
                          handleMonthlyDataChange(
                            item.productId,
                            monthData.month,
                            e.target.value
                          )
                        }
                        className='w-full px-1 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 text-right'
                        placeholder='0'
                        min='0'
                        step='0.01'
                      />
                    </td>
                  ))}
                  {/* (11) 파일첨부 */}
                  <td className='border border-gray-300 px-2 py-2 align-middle whitespace-nowrap'>
                    <div className='flex flex-col items-center space-y-1'>
                      <label className='cursor-pointer'>
                        <input
                          type='file'
                          className='hidden'
                          onChange={(e) =>
                            handleFileChange(
                              item.productId,
                              e.target.files?.[0] || null
                            )
                          }
                        />
                        <FaUpload className='text-blue-500 hover:text-blue-700' />
                      </label>
                      {item.attachedFile && (
                        <span className='text-xs text-gray-600 truncate max-w-[80px]'>
                          {item.attachedFile.name}
                        </span>
                      )}
                    </div>
                  </td>
                  {/* 비고 */}
                  <td className='border border-gray-300 px-1 py-1 align-middle whitespace-nowrap'>
                    <input
                      type='text'
                      value={item.remarks}
                      onChange={(e) =>
                        handleRemarksChange(item.productId, e.target.value)
                      }
                      className='w-full px-1 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500'
                      placeholder='비고 입력'
                    />
                  </td>
                </tr>
              );
            })}
            {/* 총계 행 시작 */}
            <tr className="bg-blue-50 font-semibold">
              <td colSpan={8} className="border border-gray-300 px-2 py-2 text-sm text-center align-middle whitespace-nowrap">
                총계
              </td>
              <td className="border border-gray-300 px-2 py-2 text-sm text-right align-middle whitespace-nowrap">
                {productionInputData
                  .reduce((sum, item) => sum + item.monthlyData.reduce((mSum, mData) => mSum + mData.weightTotal, 0), 0)
                  .toLocaleString()}
              </td>
              {Array.from({ length: 12 }, (_, i) => {
                const monthlyTotal = productionInputData.reduce((sum, item) => {
                  const monthData = item.monthlyData.find(m => m.month === i + 1);
                  return sum + (monthData ? monthData.weightTotal : 0);
                }, 0);
                return (
                  <td key={`total-month-${i + 1}`} className="border border-gray-300 px-1 py-2 text-sm text-right align-middle whitespace-nowrap">
                    {monthlyTotal.toLocaleString()}
                  </td>
                );
              })}
              <td className="border border-gray-300 px-2 py-2 align-middle whitespace-nowrap"></td> 
              <td className="border border-gray-300 px-1 py-1 align-middle whitespace-nowrap"></td> 
            </tr>
            {/* 총계 행 끝 */}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 하단 집계 테이블 렌더링
  const renderSummaryTable = () => {
    const totalWeight = productionSummaryData.reduce(
      (sum, item) => sum + item.weightTotalSum,
      0
    );
    const totalQuantity = productionSummaryData.reduce(
      (sum, item) => sum + item.quantityTotalSum,
      0
    );

    return (
      <div>

        <div className='overflow-x-auto'>
          <table className='min-w-full border-collapse border border-gray-300'>
            <thead className='bg-blue-100'>
              <tr>
                <th className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm'>
                  (1)
                  <br />
                  단위공정
                </th>
                <th className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm'>
                  (2)
                  <br />
                  제품명
                </th>
                <th className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm'>
                  (3)
                  <br />
                  제품 생산량 중량 합계 (kg)
                </th>
                <th className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm'>
                  (4)
                  <br />
                  제품 생산량 중량 비율 (%)
                </th>
                <th className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm'>
                  (5)
                  <br />
                  제품생산량 수량 합계 (EA)
                </th>
                <th className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm'>
                  (6)
                  <br />
                  제품 생산량 수량 비율 (%)
                </th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {productionSummaryData.map((item, index) => (
                <tr key={index} className='hover:bg-gray-50'>
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50'>
                    {item.unitProcessName}
                  </td>
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50'>
                    {item.productName}
                  </td>
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 text-right'>
                    {item.weightTotalSum.toLocaleString()}
                  </td>
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 text-right'>
                    {item.weightRatio.toFixed(1)}%
                  </td>
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 text-right'>
                    {Math.round(item.quantityTotalSum).toLocaleString()}
                  </td>
                  <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 text-right'>
                    {item.quantityRatio.toFixed(1)}%
                  </td>
                </tr>
              ))}

              {/* 총계 행 */}
              <tr className='bg-blue-50 font-semibold'>
                <td
                  colSpan={2}
                  className='border border-gray-300 px-2 py-2 text-sm text-center'
                >
                  총계 (합산)
                </td>
                <td className='border border-gray-300 px-2 py-2 text-sm text-right'>
                  {totalWeight.toLocaleString()}
                </td>
                <td className='border border-gray-300 px-2 py-2 text-sm text-right'>
                  100%
                </td>
                <td className='border border-gray-300 px-2 py-2 text-sm text-right'>
                  {Math.round(totalQuantity).toLocaleString()}
                </td>
                <td className='border border-gray-300 px-2 py-2 text-sm text-right'>
                  100%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 모바일 렌더링
  const renderMobileView = () => {
    // 전체 총계 계산 (renderSummaryTable에서 사용된 로직과 유사하게)
    const overallTotalWeight = productionSummaryData.reduce(
      (sum, item) => sum + item.weightTotalSum,
      0
    );
    const overallTotalQuantity = productionSummaryData.reduce(
      (sum, item) => sum + item.quantityTotalSum,
      0
    );

    return (
    <div className='space-y-6'>
      {/* 입력 섹션 */}
      <div>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          제품 생산량 입력
        </h3>
        <div className='space-y-4'>
          {productionInputData.map((item) => (
            <div
              key={item.productId}
              className='border rounded-lg p-4 bg-white shadow-sm'
            >
              <div className='mb-3'>
                <h4 className='font-semibold text-gray-800'>
                  {item.productName}
                </h4>
                <p className='text-sm text-gray-600'>
                  {item.classification} | {item.modelName}
                </p>
                <p className='text-sm text-gray-600'>{item.processName}</p>
              </div>

              <div className='grid grid-cols-3 gap-2 mb-3'>
                {item.monthlyData.map((monthData) => (
                  <div key={monthData.month} className='text-center'>
                    <label className='block text-xs text-gray-500 mb-1'>
                      {monthData.month}월
                    </label>
                    <input
                      type='number'
                      value={monthData.weightTotal || ''}
                      onChange={(e) =>
                        handleMonthlyDataChange(
                          item.productId,
                          monthData.month,
                          e.target.value
                        )
                      }
                      className='w-full px-2 py-1 text-xs border border-gray-300 rounded text-center focus:ring-1 focus:ring-blue-500'
                      placeholder='0'
                      min='0'
                      step='0.01'
                    />
                  </div>
                ))}
              </div>

              <div className='grid grid-cols-2 gap-2 mt-3'>
                <div>
                  <label className='block text-xs text-gray-500 mb-1'>
                    파일첨부
                  </label>
                  <input
                    type='file'
                    onChange={(e) =>
                      handleFileChange(
                        item.productId,
                        e.target.files?.[0] || null
                      )
                    }
                    className='w-full text-xs'
                  />
                </div>
                <div>
                  <label className='block text-xs text-gray-500 mb-1'>
                    비고
                  </label>
                  <input
                    type='text'
                    value={item.remarks}
                    onChange={(e) =>
                      handleRemarksChange(item.productId, e.target.value)
                    }
                    className='w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500'
                    placeholder='비고 입력'
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 집계 섹션 */}
      <div>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          생산량 집계
        </h3>
        <div className='space-y-3'>
          {productionSummaryData.map((item, index) => (
            <div key={index} className='border rounded-lg p-4 bg-gray-50'>
              <div className='flex justify-between items-start'>
                <div>
                  <h4 className='font-semibold text-gray-800'>
                    {item.productName}
                  </h4>
                  <p className='text-sm text-gray-600'>
                    {item.unitProcessName}
                  </p>
                </div>
                <div className='text-right text-sm'>
                  <div className='text-gray-600'>
                    중량: {item.weightTotalSum.toLocaleString()} kg (
                    {item.weightRatio.toFixed(1)}%)
                  </div>
                  <div className='text-gray-600'>
                    수량: {Math.round(item.quantityTotalSum).toLocaleString()}{' '}
                    EA ({item.quantityRatio.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* 전체 총계 추가 */} 
          {productionSummaryData.length > 0 && (
            <div className='border rounded-lg p-4 bg-blue-100 mt-4 shadow'>
              <h4 className='font-semibold text-gray-800 mb-2 text-center'>
                전체 총계
              </h4>
              <div className='text-center text-sm space-y-1'>
                <div className='text-gray-700'>
                  총 중량 합계: {overallTotalWeight.toLocaleString()} kg
                </div>
                <div className='text-gray-700'>
                  총 수량 합계: {Math.round(overallTotalQuantity).toLocaleString()} EA
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )};

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>1. 제품생산량</h2>
        <button
          onClick={handleSave}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center text-sm'
        >
          <FaSave className='mr-2' />
          저장
        </button>
      </div>

      {/* 안내 문구 */}
      <div className='mb-6 space-y-2'>
        <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
          <p className='text-green-700 text-sm'>
            단위공정 별로 생산량 합산 값과 전체 중 비율을 계산하여 보여줍니다.
          </p>
          <p className='text-green-700 text-sm mt-1'>
            이후 제품 생산량으로 할당할 때 제품 생산량 합계 값이 활용됩니다.
          </p>
        </div>
      </div>

      {/* 반응형 렌더링 */}
      <div className='hidden lg:block space-y-8'>
        {renderInputTable()}
        {renderSummaryTable()}
      </div>

      <div className='lg:hidden'>{renderMobileView()}</div>
    </div>
  );
};

export default ProductProductionTabContent;
