interface NavigationButtonsProps {
  onPrevious: () => void;
}

export default function NavigationButtons({
  onPrevious,
}: NavigationButtonsProps) {
  return (
    <div className="mt-8 flex justify-between">
      <button
        type="button"
        className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={onPrevious}
      >
        이전
      </button>
    </div>
  );
} 