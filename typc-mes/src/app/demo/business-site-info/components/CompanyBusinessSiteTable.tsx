import StatusButton from './StatusButton';
import { StepStatus } from '../types';

interface CompanyBusinessSiteTableProps {
  companyName: string;
  businessInfoStatus: StepStatus;
  manufacturingProcessStatus: StepStatus;
  utilityFacilityStatus: StepStatus;
  onBusinessInfoClick: () => void;
  onManufacturingProcessClick: () => void;
  onUtilityFacilityClick: () => void;
}

export default function CompanyBusinessSiteTable({
  companyName,
  businessInfoStatus,
  manufacturingProcessStatus,
  utilityFacilityStatus,
  onBusinessInfoClick,
  onManufacturingProcessClick,
  onUtilityFacilityClick,
}: CompanyBusinessSiteTableProps) {
  return (
    <>
      {/* 데스크톱 테이블 */}
      <div className="hidden overflow-hidden rounded-lg border lg:block">
        <div className="grid grid-cols-12 bg-blue-200 px-4 py-3 text-center font-medium">
          <div className="col-span-1">순번</div>
          <div className="col-span-3">
            사업장명<span className="text-red-500">*</span>
          </div>
          <div className="col-span-3">사업장 정보 작성</div>
          <div className="col-span-3">제조공정 데이터</div>
          <div className="col-span-2">유틸리티시설 데이터</div>
        </div>

        <div className="grid grid-cols-12 items-center border-t bg-white px-4 py-3 text-center">
          <div className="col-span-1">1</div>
          <div className="col-span-3 px-2">
            <div className="rounded bg-gray-100 px-3 py-2 text-gray-800">
              {companyName}
            </div>
          </div>
          <div className="col-span-3 flex justify-center">
            <StatusButton
              status={businessInfoStatus}
              onClick={onBusinessInfoClick}
            />
          </div>
          <div className="col-span-3 flex justify-center">
            <StatusButton
              status={manufacturingProcessStatus}
              onClick={onManufacturingProcessClick}
              lockedMessage={manufacturingProcessStatus === 'locked' ? '사업장 정보 작성이 완료되어야 합니다.' : undefined}
            />
          </div>
          <div className="col-span-2 flex justify-center">
            <StatusButton
              status={utilityFacilityStatus}
              onClick={onUtilityFacilityClick}
              lockedMessage={utilityFacilityStatus === 'locked' ? 
                (businessInfoStatus !== 'completed' ? '사업장 정보 작성이 완료되어야 합니다.' : '제조공정 데이터 작성이 완료되어야 합니다.') 
                : undefined}
            />
          </div>
        </div>
      </div>

      {/* 모바일 카드 */}
      <div className="space-y-4 lg:hidden">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">순번: 1</span>
          </div>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              사업장명<span className="text-red-500">*</span>
            </label>
            <div className="rounded bg-gray-100 px-3 py-2 text-gray-800">
              {companyName}
            </div>
          </div>

          <div className="space-y-3">
                         <div>
               <label className="mb-2 block text-sm font-medium text-gray-700">
                 사업장 정보 작성
               </label>
               <StatusButton
                 status={businessInfoStatus}
                 onClick={onBusinessInfoClick}
               />
             </div>

             <div>
               <label className="mb-2 block text-sm font-medium text-gray-700">
                 제조공정 데이터
               </label>
               <StatusButton
                 status={manufacturingProcessStatus}
                 onClick={onManufacturingProcessClick}
                 lockedMessage={manufacturingProcessStatus === 'locked' ? '사업장 정보 작성이 완료되어야 합니다.' : undefined}
               />
             </div>

             <div>
               <label className="mb-2 block text-sm font-medium text-gray-700">
                 유틸리티시설 데이터
               </label>
               <StatusButton
                 status={utilityFacilityStatus}
                 onClick={onUtilityFacilityClick}
                 lockedMessage={utilityFacilityStatus === 'locked' ? 
                   (businessInfoStatus !== 'completed' ? '사업장 정보 작성이 완료되어야 합니다.' : '제조공정 데이터 작성이 완료되어야 합니다.') 
                   : undefined}
               />
             </div>
          </div>
        </div>
      </div>
    </>
  );
} 