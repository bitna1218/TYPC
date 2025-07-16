import React from 'react';
import { User, ChevronDown } from 'lucide-react';

interface MainHeaderProps {
  selectedDate: string;
  setShowCalendar: (show: boolean) => void;
  getCurrentDate: () => string;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  selectedDate,
  setShowCalendar,
  getCurrentDate,
}) => {
  return (
    <div className="bg-green-600 text-white p-3">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">실시간 조립 관리</h1>
        <div className="flex items-center gap-2">
          <User size={16} />
          <span className="text-sm font-medium">김주현</span>
          <ChevronDown size={12} />
          <button 
            onClick={() => setShowCalendar(true)}
            className="text-sm bg-green-700 px-3 py-2 rounded hover:bg-green-800 cursor-pointer"
          >
            {selectedDate === new Date().toISOString().split('T')[0] ? getCurrentDate() : 
             (() => {
               const date = new Date(selectedDate);
               const month = date.getMonth() + 1;
               const day = date.getDate();
               return `${month}/${day}`;
             })()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;