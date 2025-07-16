import { FaPlus, FaTrash } from 'react-icons/fa';

interface BusinessSiteTableControlsProps {
  selectedCount: number;
  totalSitesCount: number;
  onAdd: () => void;
  onDelete: () => void;
}

export default function BusinessSiteTableControls({
  selectedCount,
  totalSitesCount,
  onAdd,
  onDelete,
}: BusinessSiteTableControlsProps) {
  const canDelete = selectedCount > 0 && totalSitesCount > 1;

  return (
    <div className="flex flex-col items-stretch space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-x-2 sm:space-y-0">
      <button
        className="flex items-center justify-center rounded bg-blue-100 px-4 py-2 text-blue-800 hover:bg-blue-200"
        onClick={onAdd}
      >
        <FaPlus className="mr-1" /> 추가
      </button>
      <button
        className={`flex items-center justify-center rounded px-4 py-2 ${
          canDelete
            ? 'bg-red-100 text-red-800 hover:bg-red-200'
            : 'cursor-not-allowed bg-gray-100 text-gray-400'
        }`}
        onClick={canDelete ? onDelete : undefined}
        disabled={!canDelete}
      >
        <FaTrash className="mr-1" /> 삭제
        {selectedCount > 0 ? `(${selectedCount})` : ''}
      </button>
    </div>
  );
} 