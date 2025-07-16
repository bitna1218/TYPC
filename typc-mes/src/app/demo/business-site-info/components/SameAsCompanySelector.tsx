interface SameAsCompanySelectorProps {
  isSameAsCompany: boolean;
  onToggle: (value: boolean) => void;
}

export default function SameAsCompanySelector({
  isSameAsCompany,
  onToggle,
}: SameAsCompanySelectorProps) {
  return (
    <div className="mb-6 flex items-center font-medium text-blue-700">
      <span className="text-lg">✓</span>
      <span className="ml-2">법인과 사업장이 동일한가요?</span>

      <div className="ml-6 flex items-center space-x-6">
        <label className="inline-flex cursor-pointer items-center">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-blue-600"
            name="sameAsCompany"
            checked={isSameAsCompany}
            onChange={() => onToggle(true)}
          />
          <span className="ml-2">예</span>
        </label>
        <label className="inline-flex cursor-pointer items-center">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-blue-600"
            name="sameAsCompany"
            checked={!isSameAsCompany}
            onChange={() => onToggle(false)}
          />
          <span className="ml-2">아니오</span>
        </label>
      </div>
    </div>
  );
} 