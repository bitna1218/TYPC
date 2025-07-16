interface PageHeaderProps {
  selectedProgram: string;
}

export default function PageHeader({ selectedProgram }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col items-start justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex flex-col items-start lg:flex-row lg:items-center">
          <h2 className="text-2xl font-bold text-gray-800">사업장</h2>
          <div className="mt-2 flex items-center text-sm text-gray-500 lg:ml-4 lg:mt-0">
            <span>
              {selectedProgram === 'common' ? '공통기준정보' : selectedProgram}
            </span>
            <span className="mx-2">&gt;</span>
            <span>사업장 정보</span>
            <span className="mx-2">&gt;</span>
            <span className="font-medium text-blue-600">사업장</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
            * 표시는 필수 항목
          </div>
        </div>
      </div>
    </div>
  );
} 