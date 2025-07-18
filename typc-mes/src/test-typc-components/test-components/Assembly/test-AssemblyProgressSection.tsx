import React from 'react';
import { Edit } from 'lucide-react';
import { partsInventoryData } from '@/test-typc-components/test-data/test-partsInventoryData';

type AssemblyProgressSectionProps = {
  timerState: 'ready' | 'running' | 'paused' | 'completed';
}

const AssemblyProgressSection: React.FC<AssemblyProgressSectionProps> = ({timerState}) => {

  //준비중(비활성)
  if (timerState === 'ready') {
  return (
    <div className="space-y-2">
      {Object.entries(partsInventoryData).map(([category]) => (
        <div key={category} className={`bg-white rounded-lg border-l-4 p-3 border-l-gray-300 opacity-50`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-900">{category}</h4>
            </div>
            <div className="flex items-center gap-2">
              <Edit size={14} className={'text-gray-400'} />
              <input
                disabled
                type="checkbox"
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  }


  //조립중(활성)
  return (

    <div className="space-y-2">
      {Object.entries(partsInventoryData).map(([category]) => (
        <div key={category} className={`bg-white rounded-lg border-l-4 p-3 border-l-gray-300`}>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-900">{category}</h4>
            </div>
            <div className="flex items-center gap-2">
              <Edit size={14} className={'text-blue-600'} />
              <input
                disabled
                type="checkbox"
                className="w-4 h-4"
              />
            </div>
          </div>


          <div className="space-y-2">
            <select
              className="w-full px-2 py-2 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="">브랜드 선택</option>
            </select>
            <select
              disabled
              className="w-full px-2 py-2 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">부품 선택</option>
            </select>
          </div>

        </div>
      ))}
    </div>

  );

};

export default AssemblyProgressSection;
