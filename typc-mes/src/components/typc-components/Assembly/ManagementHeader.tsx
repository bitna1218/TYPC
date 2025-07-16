import React from 'react';
import { ChevronLeft, ChevronDown, User } from 'lucide-react';

interface ManagementHeaderProps {
  completeAssembly: () => void;
  setShowCalendar: (show: boolean) => void;
  selectedDate: string;
  getCurrentDate: () => string;
  username: string;
}

const ManagementHeader: React.FC<ManagementHeaderProps> = ({
  completeAssembly,
  setShowCalendar,
  selectedDate,
  getCurrentDate,
  username
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === todayStr;
  const displayDate = isToday
    ? getCurrentDate()
    : new Date(selectedDate).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });

  return (
    <div className="bg-green-600 text-white p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={completeAssembly}>
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-base font-semibold">조립 진행</h1>
        </div>
        <div className="flex items-center gap-2">
          <User size={16} />
          <span className="text-sm font-medium">{username}</span>
          <ChevronDown size={12} />
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowCalendar(true);
            }}
            className="text-xs bg-green-700 px-3 py-2 rounded hover:bg-green-800 cursor-pointer"
            type="button"
          >
            {displayDate}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagementHeader;
