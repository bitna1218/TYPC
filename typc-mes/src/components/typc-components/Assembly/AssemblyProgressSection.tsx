import React from 'react';
import { Trash2, Edit } from 'lucide-react';
import { PartData, CustomComponent, PartsInventory } from '@/types/typc-types/types';

interface AssemblyProgressSectionProps {
  timerState: 'ready' | 'running' | 'paused' | 'completed';
  assemblyProgress: Record<string, PartData>;
  customComponents: Record<string, CustomComponent>;
  partsInventory: PartsInventory;
  handleCheck: (componentId: string, checked: boolean) => void;
  handleBrandChange: (componentId: string, brand: string) => void;
  handlePartChange: (componentId: string, part: string) => void;
  handleRemoveComponent: (componentId: string) => void;
}

const AssemblyProgressSection: React.FC<AssemblyProgressSectionProps> = ({
  timerState,
  assemblyProgress,
  customComponents,
  partsInventory,
  handleCheck,
  handleBrandChange,
  handlePartChange,
  handleRemoveComponent
}) => {
  return (
    <div className="space-y-2">
      {/* 기본 부품들 */}
      {Object.entries(assemblyProgress).map(([component, data]) => (
        <div key={component} className={`bg-white rounded-lg border-l-4 p-3 ${
          data.checked ? 'border-l-green-500 bg-green-50' : 'border-l-gray-300'
        } ${timerState === 'ready' ? 'opacity-50' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-900">{component}</h4>
              {data.checked && <span className="text-xs text-green-600 font-medium">✓ 완료</span>}
            </div>
            <div className="flex items-center gap-2">
              <Edit size={14} className={timerState === 'ready' ? 'text-gray-400' : 'text-blue-600'} />
              <input
                type="checkbox"
                checked={data.checked}
                onChange={(e) => handleCheck(component, e.target.checked)}
                disabled={timerState === 'ready' || !data.part}
                className="w-4 h-4"
              />
            </div>
          </div>

          {timerState !== 'ready' && (
            <div className="space-y-2">
              <select
                value={data.brand}
                onChange={(e) => handleBrandChange(component, e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500"
              >
                <option value="">브랜드 선택</option>
                {partsInventory[component] && Object.keys(partsInventory[component]).map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>

              <select
                value={data.part}
                onChange={(e) => handlePartChange(component, e.target.value)}
                disabled={!data.brand}
                className="w-full px-2 py-2 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">부품 선택</option>
                {data.brand && partsInventory[component]?.[data.brand]?.map(part => (
                  <option key={part} value={part}>{part}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      ))}

      {/* 커스텀 부품들 */}
      {Object.entries(customComponents).map(([componentKey, data]) => (
        <div key={componentKey} className={`bg-white rounded-lg border-l-4 p-3 ${
          data.checked ? 'border-l-green-500 bg-green-50' : 'border-l-orange-300'
        } ${timerState === 'ready' ? 'opacity-50' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-900">{data.displayName}</h4>
              <span className="text-xs text-orange-600 bg-orange-100 px-1 rounded">{data.category1}</span>
              {data.checked && <span className="text-xs text-green-600 font-medium">✓ 완료</span>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRemoveComponent(componentKey)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
              <input
                type="checkbox"
                checked={data.checked}
                onChange={(e) => handleCheck(componentKey, e.target.checked)}
                disabled={timerState === 'ready'}
                className="w-4 h-4"
              />
            </div>
          </div>

          {timerState !== 'ready' && (
            <div className="text-xs text-gray-500">
              {data.category1} → {data.category2} → {data.category3}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AssemblyProgressSection;
