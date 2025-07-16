import React from 'react';
import { X } from 'lucide-react';

type CalendarModalProps = {
  onClose: () => void;
  onSelectDate: (date: string) => void;
  selectedDate: string;
};


// 캘린더 생성
const generateCalendar = (): (number | null)[] => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const calendar: (number | null)[] = [];
    
    // 빈 칸 추가 (월 시작 전)
    for (let i = 0; i < startDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }
    
    return calendar;
};

const getDateButtonClass = (isSelected: boolean, isToday: boolean) => {
  if (isSelected) return 'bg-green-600 text-white font-semibold';
  if (isToday) return 'bg-green-100 text-green-800 font-medium';
  return 'hover:bg-gray-100';
};

const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작이라 +1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // "YYYY-MM-DD"
};


const CalendarModal: React.FC<CalendarModalProps> = ({onClose,onSelectDate,selectedDate}) => {

// 캘린더 날짜 선택 
const handleDateSelect = (date: string): void => {
    onSelectDate(date);
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 m-4 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">날짜 선택</h3>
          <button
            onClick={onClose}
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
              
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();

                const date = new Date(currentYear, currentMonth, day);
                const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;


                const isToday = dateString === getLocalDateString(new Date());
                const isSelected = dateString === selectedDate;

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(dateString)}
                  className={`p-2 text-sm rounded transition-colors ${getDateButtonClass(isSelected, isToday)}`}
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

export default CalendarModal;