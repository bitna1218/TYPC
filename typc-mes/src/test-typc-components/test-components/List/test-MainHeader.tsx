'use client';

import React from 'react';
import { User, ChevronDown } from 'lucide-react';

type MainHeaderProps = {
  onOpenCalendar: () => void;
  selectedDate: string;
};


const MainHeader: React.FC<MainHeaderProps> = ({ onOpenCalendar, selectedDate }) => {
  
    // 날짜 표시할 때
    const [year, month, day] = selectedDate.split('-');
    const displayDate = `${month}/${day}`;

    return (
    <div className="bg-green-600 text-white p-3">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">실시간 조립 관리</h1>
        <div className="flex items-center gap-2">
          <User size={16} />
          <span className="text-sm font-medium">김주현</span>
          <ChevronDown size={12} />
          <button 
            onClick={onOpenCalendar}
            className="text-sm bg-green-700 px-3 py-2 rounded hover:bg-green-800 cursor-pointer"
          >
            {displayDate}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainHeader;