'use client';

import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';

interface BuildingItem {
  id: number;
  name: string;
  isProductionRelated: boolean | null;
}

export interface BuildingsData {
  buildings: BuildingItem[];
}

interface BusinessLocationQuestionnaireProps {
  className?: string;
  onDataChange?: (getData: () => BuildingsData) => void;
}

export default function BusinessLocationQuestionnaire({
  className = '',
  onDataChange,
}: BusinessLocationQuestionnaireProps) {
  const [buildings, setBuildings] = useState<BuildingItem[]>([
    { id: 1, name: '', isProductionRelated: null },
  ]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(() => ({
        buildings,
      }));
    }
  }, [buildings, onDataChange]);

  // 건물명 변경 핸들러
  const handleBuildingNameChange = (id: number, name: string) => {
    setBuildings(
      buildings.map((building) =>
        building.id === id ? { ...building, name } : building
      )
    );
  };

  // 생산 관련 유무 변경 핸들러
  const handleProductionRelatedChange = (id: number, isRelated: boolean) => {
    setBuildings(
      buildings.map((building) =>
        building.id === id
          ? { ...building, isProductionRelated: isRelated }
          : building
      )
    );
  };

  // 건물 추가 핸들러
  const handleAddBuilding = () => {
    const newId =
      buildings.length > 0 ? Math.max(...buildings.map((b) => b.id)) + 1 : 1;
    setBuildings([
      ...buildings,
      { id: newId, name: '', isProductionRelated: null },
    ]);
  };

  // 선택한 건물 삭제 핸들러
  const handleDeleteBuilding = (id: number) => {
    if (buildings.length > 1) {
      setBuildings(buildings.filter((building) => building.id !== id));
    } else {
      alert('최소 1개 이상의 건물 정보가 필요합니다.');
    }
  };

  return (
    <div className={`p-6 ${className}`}>
      <div className='mb-4'>
        <div className='bg-gray-200 p-3 mt-2 text-sm text-gray-700 rounded'>
          건축물대장에 등록된 건물명을 기준으로 공장동, 행정동, 식당 등 모든
          건물을 작성합니다.
        </div>
      </div>

      <div className='mt-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2'>
          <div className='flex items-center'>
            <span className='text-blue-600 mr-2'>✓</span>
            <span className='text-blue-700 font-medium'>건물목록</span>
          </div>
          <button
            type='button'
            className='px-3 py-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none flex items-center self-end sm:self-auto'
            onClick={handleAddBuilding}
          >
            <FaPlus className='mr-2' size={14} />
            <span>건물 추가</span>
          </button>
        </div>

        {/* 건물 목록 테이블 */}
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-blue-50 border border-gray-300'>
            <thead>
              <tr className='bg-blue-100'>
                <th className='hidden md:table-cell py-3 px-4 text-center border-r border-gray-300 w-20 whitespace-nowrap'>
                  순번
                </th>
                <th className='py-3 px-4 text-center border-r border-gray-300'>
                  건물명<span className='text-red-500'>*</span>
                </th>
                <th className='py-3 px-4 text-center border-r border-gray-300 w-28 whitespace-nowrap'>
                  생산 유무<span className='text-red-500'>*</span>
                </th>
                <th className='py-3 px-4 text-center w-16 whitespace-nowrap'>
                  삭제
                </th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((building, index) => (
                <tr key={building.id} className='border-t border-gray-300'>
                  <td className='hidden md:table-cell py-3 px-4 text-center border-r border-gray-300'>
                    {index + 1}
                  </td>
                  <td className='py-3 px-4 border-r border-gray-300'>
                    <input
                      type='text'
                      className='w-full px-4 py-2 border border-gray-300 rounded-md'
                      value={building.name}
                      onChange={(e) =>
                        handleBuildingNameChange(building.id, e.target.value)
                      }
                      placeholder='건물명 입력'
                    />
                  </td>
                  <td className='py-3 px-4 text-center border-r border-gray-300'>
                    <div className='flex justify-center'>
                      <label className='flex items-center cursor-pointer'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 text-blue-600 rounded'
                          checked={building.isProductionRelated === true}
                          onChange={(e) =>
                            handleProductionRelatedChange(
                              building.id,
                              e.target.checked
                            )
                          }
                        />
                      </label>
                    </div>
                  </td>
                  <td className='py-3 px-4 text-center'>
                    <button
                      type='button'
                      className='text-red-600 hover:text-red-800 focus:outline-none'
                      onClick={() => handleDeleteBuilding(building.id)}
                      title='삭제'
                      aria-label='삭제'
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {buildings.length === 0 && (
          <div className='text-center py-4 text-gray-500'>
            등록된 건물이 없습니다. 건물을 추가해주세요.
          </div>
        )}
      </div>
    </div>
  );
}
