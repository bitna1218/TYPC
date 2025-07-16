import React from 'react';
import { X } from 'lucide-react';
import { AssemblyOrder } from '../../../types/typc-types/types';

interface CalendarModalProps {
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  selectedDate: string;
  handleDateSelect: (date: string) => void;
  generateCalendar: () => (number | null)[];
  getOrdersByDate: (date: string) => AssemblyOrder[];
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  showCalendar,
  setShowCalendar,
  selectedDate,
  handleDateSelect,
  generateCalendar,
  getOrdersByDate,
}) => {
  if (!showCalendar) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 m-4 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">날짜 선택</h3>
          <button
            onClick={() => setShowCalendar(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="text-center text-sm font-medium text-gray-700 mb-2">
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day} className="p-2 font-medium text-gray-600">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {generateCalendar().map((day, index) => {
              if (day === null) return <div key={index} className="p-2"></div>;
              
              const date = new Date();
              date.setDate(day);
              const dateString = date.toISOString().split('T')[0];
              const isToday = dateString === new Date().toISOString().split('T')[0];
              const isSelected = dateString === selectedDate;
              const hasOrders = getOrdersByDate(dateString).length > 0;
              
              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(dateString)}
                  className={`p-2 text-sm rounded transition-colors ${
                    isSelected 
                      ? 'bg-green-600 text-white' 
                      : isToday 
                        ? 'bg-green-100 text-green-800 font-medium'
                        : hasOrders
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          : 'hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-600 rounded"></div>
              <span>선택된 날짜</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-100 rounded"></div>
              <span>오늘</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};