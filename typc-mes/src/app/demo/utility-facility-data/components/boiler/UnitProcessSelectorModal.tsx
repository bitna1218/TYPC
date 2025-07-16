'use client';

import React, { useState, useMemo } from 'react';
import {
  FaSearch,
  FaTimes,
  FaCheck,
  FaList,
  FaCheckSquare,
  FaSquare,
  FaMinusSquare,
} from 'react-icons/fa';

interface UnitProcess {
  id: string;
  name: string;
  processGroup: string;
}

interface UnitProcessSelectorModalProps {
  show: boolean;
  unitProcesses: UnitProcess[];
  selectedProcesses: string[];
  onToggleProcess: (processId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

type TabType = 'all' | string; // 'all' 또는 그룹명

const UnitProcessSelectorModal: React.FC<UnitProcessSelectorModalProps> = ({
  show,
  unitProcesses,
  selectedProcesses,
  onToggleProcess,
  onSelectAll,
  onDeselectAll,
  onConfirm,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 공정 그룹별 분류
  const processGroups = useMemo(() => {
    return unitProcesses.reduce(
      (groups, process) => {
        const group = process.processGroup;
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(process);
        return groups;
      },
      {} as Record<string, UnitProcess[]>,
    );
  }, [unitProcesses]);

  // 현재 탭의 공정들 가져오기
  const currentTabProcesses = useMemo(() => {
    if (activeTab === 'all') {
      return unitProcesses;
    }
    return processGroups[activeTab] || [];
  }, [activeTab, unitProcesses, processGroups]);

  // 검색 필터링 적용
  const filteredProcesses = useMemo(() => {
    if (!searchTerm.trim()) {
      return currentTabProcesses;
    }
    return currentTabProcesses.filter((process) =>
      process.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [currentTabProcesses, searchTerm]);

  // 탭별 선택 통계
  const getTabStats = (tabKey: TabType) => {
    const tabProcesses = tabKey === 'all' ? unitProcesses : processGroups[tabKey] || [];
    const selectedCount = tabProcesses.filter((process) =>
      selectedProcesses.includes(process.id),
    ).length;
    return { total: tabProcesses.length, selected: selectedCount };
  };

  // 현재 탭의 전체 선택/해제
  const handleTabSelectAll = () => {
    currentTabProcesses.forEach((process) => {
      if (!selectedProcesses.includes(process.id)) {
        onToggleProcess(process.id);
      }
    });
  };

  const handleTabDeselectAll = () => {
    currentTabProcesses.forEach((process) => {
      if (selectedProcesses.includes(process.id)) {
        onToggleProcess(process.id);
      }
    });
  };

  // 현재 탭의 선택 상태 확인
  const getCurrentTabSelectStatus = () => {
    const currentStats = getTabStats(activeTab);
    if (currentStats.selected === 0) return 'none';
    if (currentStats.selected === currentStats.total) return 'all';
    return 'partial';
  };

  // 탭 색상 정의
  const getTabColor = (groupName: string) => {
    const colors = {
      '중합공정': 'border-blue-500 bg-blue-50 text-blue-700',
      '분해공정': 'border-green-500 bg-green-50 text-green-700',
      '방향족공정': 'border-purple-500 bg-purple-50 text-purple-700',
      default: 'border-gray-500 bg-gray-50 text-gray-700',
    };
    return colors[groupName as keyof typeof colors] || colors.default;
  };

  // 선택 상태 아이콘
  const SelectionIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'all':
        return <FaCheckSquare className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <FaMinusSquare className="h-4 w-4 text-yellow-600" />;
      default:
        return <FaSquare className="h-4 w-4 text-gray-400" />;
    }
  };

  if (!show) return null;

  const groupNames = Object.keys(processGroups);
  const currentTabSelectStatus = getCurrentTabSelectStatus();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-lg bg-white shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <FaList className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">
              보일러 할당 단위공정 선택
            </span>
          </div>
          <button
            onClick={onCancel}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200 bg-gray-50 px-4">
          <nav className="flex space-x-1 overflow-x-auto" aria-label="Tabs">
            {/* 전체 탭 */}
            <button
              onClick={() => setActiveTab('all')}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'border-blue-500 bg-white text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              전체
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                {getTabStats('all').selected}/{getTabStats('all').total}
              </span>
            </button>

            {/* 그룹별 탭 */}
            {groupNames.map((groupName) => {
              const stats = getTabStats(groupName);
              const isActive = activeTab === groupName;

              return (
                <button
                  key={groupName}
                  onClick={() => setActiveTab(groupName)}
                  className={`flex items-center whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? `border-blue-500 bg-white text-blue-600`
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className={`mr-2 h-2 w-2 rounded-full ${isActive ? getTabColor(groupName).split(' ')[0].replace('border-', 'bg-') : 'bg-gray-400'}`} />
                  {groupName}
                  <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {stats.selected}/{stats.total}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 검색 및 컨트롤 영역 */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* 검색바 */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`${activeTab === 'all' ? '전체' : activeTab} 단위공정 검색...`}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* 컨트롤 버튼 */}
            <div className="flex items-center space-x-2">
              <div className="mr-4 text-sm text-gray-600">
                <span className="font-medium">{filteredProcesses.length}개 표시</span>
                {searchTerm && (
                  <span className="ml-1 text-gray-500">
                    / {currentTabProcesses.length}개 중
                  </span>
                )}
              </div>

              <button
                onClick={handleTabSelectAll}
                disabled={currentTabSelectStatus === 'all'}
                className="flex items-center rounded-md bg-blue-100 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <SelectionIcon status="all" />
                <span className="ml-1">전체 선택</span>
              </button>

              <button
                onClick={handleTabDeselectAll}
                disabled={currentTabSelectStatus === 'none'}
                className="flex items-center rounded-md bg-red-100 px-3 py-1.5 text-sm text-red-700 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <SelectionIcon status="none" />
                <span className="ml-1">전체 해제</span>
              </button>

              {currentTabSelectStatus === 'partial' && (
                <button
                  onClick={() => {
                    if (getCurrentTabSelectStatus() === 'partial') {
                      handleTabSelectAll();
                    }
                  }}
                  className="flex items-center rounded-md bg-yellow-100 px-3 py-1.5 text-sm text-yellow-700 hover:bg-yellow-200"
                >
                  <SelectionIcon status="partial" />
                  <span className="ml-1">나머지 선택</span>
                </button>
              )}
            </div>
          </div>

          {/* 선택 반전 및 전체 관련 액션 (전체 탭일 때만) */}
          {activeTab === 'all' && (
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    unitProcesses.forEach((process) => {
                      onToggleProcess(process.id);
                    });
                  }}
                  className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
                >
                  선택 반전
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={onSelectAll}
                  className="rounded-md bg-blue-100 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-200"
                >
                  모든 공정 선택
                </button>
                <button
                  onClick={onDeselectAll}
                  className="rounded-md bg-red-100 px-3 py-1.5 text-sm text-red-700 hover:bg-red-200"
                >
                  모든 공정 해제
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 단위공정 목록 */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredProcesses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FaSearch className="mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {searchTerm ? '검색 결과가 없습니다' : '선택 가능한 단위공정이 없습니다'}
              </h3>
              <p className="text-sm text-gray-500">
                {searchTerm ? (
                  <>
                    &quot;<span className="font-medium">{searchTerm}</span>&quot;에 해당하는
                    단위공정을 찾을 수 없습니다
                  </>
                ) : (
                  '다른 탭을 선택해보세요'
                )}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                >
                  검색어 지우기
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProcesses.map((process) => {
                const isSelected = selectedProcesses.includes(process.id);

                return (
                  <div
                    key={process.id}
                    className={`group relative rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-blue-300 bg-blue-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={`process-${process.id}`}
                        checked={isSelected}
                        onChange={() => onToggleProcess(process.id)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`process-${process.id}`}
                          className="block cursor-pointer"
                        >
                          <div className="font-medium text-gray-900 group-hover:text-blue-600">
                            {process.name}
                          </div>
                          {activeTab === 'all' && (
                            <div className="mt-1 text-xs text-gray-500">
                              {process.processGroup}
                            </div>
                          )}
                        </label>
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <FaCheck className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 하단 상태 및 버튼 */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-gray-600">
                <span className="font-medium">총 선택:</span>{' '}
                <span className="font-bold text-blue-600">
                  {selectedProcesses.length}개
                </span>{' '}
                / {unitProcesses.length}개
              </div>

              {activeTab !== 'all' && (
                <div className="text-gray-600">
                  <span className="font-medium">{activeTab}:</span>{' '}
                  <span className="font-bold text-green-600">
                    {getTabStats(activeTab).selected}개
                  </span>{' '}
                  / {getTabStats(activeTab).total}개
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={onConfirm}
                disabled={selectedProcesses.length === 0}
                className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                확인 ({selectedProcesses.length}개)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitProcessSelectorModal;
