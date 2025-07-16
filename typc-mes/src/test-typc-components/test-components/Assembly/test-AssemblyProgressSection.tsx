import React from 'react';
import { Edit } from 'lucide-react';
import { partsInventoryData } from '@/test-typc-components/test-data/test-partsInventoryData';

const AssemblyProgressSection: React.FC = ({}) => {
  return (
    <div className="space-y-2">

{Object.entries(partsInventoryData).map(([category, brands]) => (
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
};

export default AssemblyProgressSection;
