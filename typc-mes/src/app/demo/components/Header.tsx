'use client';

import { FaGlobe } from 'react-icons/fa';
import { MdQuestionMark, MdSettings, MdExitToApp } from 'react-icons/md';
import { useAppStore } from '../store';
import Link from 'next/link';

interface HeaderProps {
  selectedProgram?: string;
  selectedYear?: string | null;
}

export default function Header({
  selectedProgram: propProgram,
  selectedYear: propYear,
}: HeaderProps) {
  // Zustand 상태 또는 props에서 값을 가져옴 (props가 우선)
  const storeProgram = useAppStore((state) => state.selectedProgram);
  const storeYear = useAppStore((state) => state.selectedYear);

  const selectedProgram = propProgram || storeProgram;
  const selectedYear = propYear !== undefined ? propYear : storeYear;

  const getProgramColor = (program: string): string => {
    const colorMap: Record<string, string> = {
      common: 'blue',
      ocf: 'purple',
      pcf: 'teal',
      cbam: 'orange',
    };

    return colorMap[program] || 'blue';
  };

  const getProgramName = (program: string): string => {
    const nameMap: Record<string, string> = {
      common: '공통기준정보',
      ocf: 'OCF',
      pcf: 'PCF',
      cbam: 'CBAM',
    };

    return nameMap[program] || '공통기준정보';
  };

  const getBadgeStyles = (program: string): string => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      teal: 'bg-teal-100 text-teal-800',
      orange: 'bg-orange-100 text-orange-800',
    };

    const color = getProgramColor(program);
    return `px-3 py-1 ${colorMap[color]} rounded-full text-sm font-medium`;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow">
      <div className="w-full px-6">
        <div className="flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex items-center">
              <FaGlobe className="mr-4 h-10 w-10 text-blue-500" />
              <h1 className="hidden text-xl font-bold text-gray-800 md:block">
                3View 탄소관리 종합 솔루션
              </h1>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            {selectedProgram && (
              <span className={getBadgeStyles(selectedProgram)}>
                {getProgramName(selectedProgram)}
              </span>
            )}
            {selectedYear && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {selectedYear}
              </span>
            )}
            <div className="tooltip header-tooltip">
              <button className="hidden rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none md:block">
                <MdQuestionMark className="h-6 w-6 text-gray-600" />
              </button>
              <span className="tooltip-text">도움말</span>
            </div>
            <div className="tooltip header-tooltip">
              <button className="hidden rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none md:block">
                <MdSettings className="h-6 w-6 text-gray-600" />
              </button>
              <span className="tooltip-text">설정</span>
            </div>
            <div className="tooltip header-tooltip">
              <button className="rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none">
                <MdExitToApp className="h-6 w-6 text-gray-600" />
              </button>
              <span className="tooltip-text">로그아웃</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
