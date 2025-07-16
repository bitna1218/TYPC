import React from 'react';
import { Clock, Play, Pause, Square } from 'lucide-react';


const AssemblyTimerSection: React.FC = ({}) => {
  return (
    <div className={`rounded-lg p-4 mb-3 bg-green-50 border border-green-200`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock size={16} className={'text-green-600'} />
          <h3 className={`text-sm font-semibold text-green-800`}>
            조립 시간 측정
          </h3>
        </div>

        <button
            className="flex items-center gap-3 px-8 py-5 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 mx-auto shadow-lg"
        >
            <Play size={24} />조립 시작하기
        </button>

      </div>
    </div>
  );
};

export default AssemblyTimerSection;
