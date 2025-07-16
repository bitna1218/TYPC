import React from 'react';
import { ChevronLeft, ChevronDown, User } from 'lucide-react';

type ManagementHeaderProps = {
  backToList: () => void;
  username: string;
  selectedDate: string;
};

const ManagementHeader: React.FC<ManagementHeaderProps> = ({backToList, username, selectedDate}) => {

  // 날짜 표시할 때
  const [year, month, day] = selectedDate.split('-');
  const displayDate = `${month}/${day}`;

  return (
    <div className="bg-green-600 text-white p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={backToList} >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-base font-semibold">조립 진행</h1>
        </div>
        <div className="flex items-center gap-2">
          <User size={16} />
          <span className="text-sm font-medium">{username}</span>
          <ChevronDown size={12} />
          <button 
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