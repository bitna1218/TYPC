import { StepStatus, BusinessSite } from '../types';

interface TestControlsProps {
  businessSites: BusinessSite[];
  onUpdateSiteStatus: (
    siteId: string,
    field: keyof Pick<
      BusinessSite,
      | 'businessInfoStatus'
      | 'manufacturingProcessStatus'
      | 'utilityFacilityStatus'
    >,
    status: StepStatus,
  ) => void;
  companyBusinessSiteStatus: {
    businessInfoStatus: StepStatus;
    manufacturingProcessStatus: StepStatus;
    utilityFacilityStatus: StepStatus;
  };
  onUpdateCompanyStatus: (field: string, status: StepStatus) => void;
  isSameAsCompany: boolean;
}

export default function TestControls({
  businessSites,
  onUpdateSiteStatus,
  companyBusinessSiteStatus,
  onUpdateCompanyStatus,
  isSameAsCompany,
}: TestControlsProps) {
  const statusOptions: StepStatus[] = [
    'available',
    'in-progress',
    'completed',
    'locked',
  ];

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="mb-6 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-4">
      <h3 className="mb-3 text-lg font-bold text-orange-800">
        🔧 개발 테스트 컨트롤(테스트용)
      </h3>

      {isSameAsCompany ? (
        <div className="space-y-3">
          <h4 className="font-medium text-orange-700">법인 사업장 상태 변경</h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                사업장 정보
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={companyBusinessSiteStatus.businessInfoStatus}
                onChange={(e) =>
                  onUpdateCompanyStatus(
                    'businessInfoStatus',
                    e.target.value as StepStatus,
                  )
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                제조공정 데이터
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={companyBusinessSiteStatus.manufacturingProcessStatus}
                onChange={(e) =>
                  onUpdateCompanyStatus(
                    'manufacturingProcessStatus',
                    e.target.value as StepStatus,
                  )
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                유틸리티시설 데이터
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={companyBusinessSiteStatus.utilityFacilityStatus}
                onChange={(e) =>
                  onUpdateCompanyStatus(
                    'utilityFacilityStatus',
                    e.target.value as StepStatus,
                  )
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="font-medium text-orange-700">사업장별 상태 변경</h4>
          {businessSites.map((site, index) => (
            <div
              key={site.id}
              className="rounded border border-orange-200 bg-white p-3"
            >
              <h5 className="mb-2 font-medium text-gray-800">
                {site.name || `사업장 ${index + 1}`}
              </h5>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    사업장 정보
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={site.businessInfoStatus}
                    onChange={(e) =>
                      onUpdateSiteStatus(
                        site.id,
                        'businessInfoStatus',
                        e.target.value as StepStatus,
                      )
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    제조공정 데이터
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={site.manufacturingProcessStatus}
                    onChange={(e) =>
                      onUpdateSiteStatus(
                        site.id,
                        'manufacturingProcessStatus',
                        e.target.value as StepStatus,
                      )
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    유틸리티시설 데이터
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={site.utilityFacilityStatus}
                    onChange={(e) =>
                      onUpdateSiteStatus(
                        site.id,
                        'utilityFacilityStatus',
                        e.target.value as StepStatus,
                      )
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
