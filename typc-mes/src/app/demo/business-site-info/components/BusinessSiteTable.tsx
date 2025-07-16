import { FaCheck } from 'react-icons/fa';
import StatusButton from './StatusButton';
import { BusinessSite } from '../types';

interface BusinessSiteTableProps {
  businessSites: BusinessSite[];
  onToggleSelection: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onBusinessInfoClick: (id: string) => void;
  onManufacturingProcessClick: (id: string) => void;
  onUtilityFacilityClick: (id: string) => void;
}

export default function BusinessSiteTable({
  businessSites,
  onToggleSelection,
  onUpdateName,
  onBusinessInfoClick,
  onManufacturingProcessClick,
  onUtilityFacilityClick,
}: BusinessSiteTableProps) {
  return (
    <>
      {/* 데스크톱 테이블 */}
      <div className="hidden overflow-hidden rounded-lg border lg:block">
        <div className="grid grid-cols-12 bg-blue-200 px-4 py-3 text-center font-medium">
          <div className="col-span-2">순번</div>
          <div className="col-span-3">
            사업장명<span className="text-red-500">*</span>
          </div>
          <div className="col-span-2">사업장 정보</div>
          <div className="col-span-3">제조공정 데이터</div>
          <div className="col-span-2">유틸리티시설 데이터</div>
        </div>

      {businessSites.map((site, index) => (
        <div
          key={site.id}
          className={`grid grid-cols-12 items-center border-t bg-white px-4 py-3 text-center ${
            site.isSelected ? 'bg-blue-50' : ''
          }`}
        >
          <div className="col-span-2 grid grid-cols-3 items-center">
            <div className="col-span-1 flex items-center justify-center">
              {businessSites.length > 1 && (
                <div
                  className="inline-flex cursor-pointer items-center justify-center"
                  onClick={() => onToggleSelection(site.id)}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border ${
                      site.isSelected
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-400 bg-white'
                    }`}
                  >
                    {site.isSelected && (
                      <FaCheck className="text-xs text-white" />
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="col-span-2">{index + 1}</div>
          </div>
          <div className="col-span-3 px-2">
            <input
              type="text"
              className={`w-full px-3 py-2 ${
                site.isSelected ? 'bg-blue-50' : 'bg-yellow-100'
              } rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={site.name}
              placeholder="사업장명 작성"
              onChange={(e) => onUpdateName(site.id, e.target.value)}
            />
          </div>
          <div className="col-span-2 flex justify-center">
            <StatusButton
              status={site.businessInfoStatus}
              onClick={() => onBusinessInfoClick(site.id)}
            />
          </div>
          <div className="col-span-3 flex justify-center">
            <StatusButton
              status={site.manufacturingProcessStatus}
              onClick={() => onManufacturingProcessClick(site.id)}
              lockedMessage={site.manufacturingProcessStatus === 'locked' ? '사업장 정보 작성이 완료되어야 합니다.' : undefined}
            />
          </div>
          <div className="col-span-2 flex justify-center">
            <StatusButton
              status={site.utilityFacilityStatus}
              onClick={() => onUtilityFacilityClick(site.id)}
              lockedMessage={site.utilityFacilityStatus === 'locked' ? 
                (site.businessInfoStatus !== 'completed' ? '사업장 정보 작성이 완료되어야 합니다.' : '제조공정 데이터 작성이 완료되어야 합니다.') 
                : undefined}
            />
          </div>
        </div>
      ))}
      </div>

      {/* 모바일 카드 */}
      <div className="space-y-4 lg:hidden">
        {businessSites.map((site, index) => (
          <div
            key={site.id}
            className={`rounded-lg border bg-white p-4 shadow-sm ${
              site.isSelected ? 'border-blue-300 bg-blue-50' : ''
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">순번: {index + 1}</span>
              {businessSites.length > 1 && (
                <div
                  className="inline-flex cursor-pointer items-center justify-center"
                  onClick={() => onToggleSelection(site.id)}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border ${
                      site.isSelected
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-400 bg-white'
                    }`}
                  >
                    {site.isSelected && (
                      <FaCheck className="text-xs text-white" />
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                사업장명<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 ${
                  site.isSelected ? 'bg-blue-50' : 'bg-yellow-100'
                } rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={site.name}
                placeholder="사업장명 작성"
                onChange={(e) => onUpdateName(site.id, e.target.value)}
              />
            </div>

            <div className="space-y-3">
                             <div>
                 <label className="mb-2 block text-sm font-medium text-gray-700">
                   사업장 정보
                 </label>
                 <StatusButton
                   status={site.businessInfoStatus}
                   onClick={() => onBusinessInfoClick(site.id)}
                 />
               </div>

               <div>
                 <label className="mb-2 block text-sm font-medium text-gray-700">
                   제조공정 데이터
                 </label>
                 <StatusButton
                   status={site.manufacturingProcessStatus}
                   onClick={() => onManufacturingProcessClick(site.id)}
                   lockedMessage={site.manufacturingProcessStatus === 'locked' ? '사업장 정보 작성이 완료되어야 합니다.' : undefined}
                 />
               </div>

               <div>
                 <label className="mb-2 block text-sm font-medium text-gray-700">
                   유틸리티시설 데이터
                 </label>
                 <StatusButton
                   status={site.utilityFacilityStatus}
                   onClick={() => onUtilityFacilityClick(site.id)}
                   lockedMessage={site.utilityFacilityStatus === 'locked' ? 
                     (site.businessInfoStatus !== 'completed' ? '사업장 정보 작성이 완료되어야 합니다.' : '제조공정 데이터 작성이 완료되어야 합니다.') 
                     : undefined}
                 />
               </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
} 