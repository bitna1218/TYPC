import {
  FaBuilding,
  // FaCheck,
  // FaClock,
  // FaIndustry,
  FaPen,
  FaTrash,
} from 'react-icons/fa6';
import { YearData } from './CorpYearlyList';
import { useState } from 'react';
import DeleteConfirmModal from '@/components/modal/DeleteConfirmModal';
import { DateTime } from 'luxon';
import { addZStringOnTimeString } from '@/utils/time';
import { dummyUser } from '@/data/dummy';
// import { FaCalendarAlt } from 'react-icons/fa';

type Props = {
  yearData: YearData;
  onClickEdit: (yearData: YearData) => void;
  onDelete: (yearData: YearData) => void;
};
export default function YearCorpCard({
  yearData,
  onClickEdit,
  onDelete,
}: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 상태별 색상 및 아이콘
  // const getStatusDisplay = (
  //   status: 'completed' | 'in-progress' | 'not-started',
  // ) => {
  //   switch (status) {
  //     case 'completed':
  //       return {
  //         color: 'text-green-600 bg-green-50',
  //         icon: <FaCheck className="h-3 w-3" />,
  //         text: '작성완료',
  //       };
  //     case 'in-progress':
  //       return {
  //         color: 'text-blue-600 bg-blue-50',
  //         icon: <FaClock className="h-3 w-3" />,
  //         text: '작성중',
  //       };
  //     case 'not-started':
  //       return {
  //         color: 'text-gray-500 bg-gray-50',
  //         icon: <FaCalendarAlt className="h-3 w-3" />,
  //         text: '미작성',
  //       };
  //   }
  // };

  // const statusDisplay = getStatusDisplay(yearData.status);

  const formattedLastModified = yearData.lastModified
    ? DateTime.fromISO(addZStringOnTimeString(yearData.lastModified))
        .setZone(dummyUser.timezone)
        .toFormat('yyyy.MM.dd HH:mm')
    : '';

  return (
    <div className="rounded-lg bg-white p-4 shadow transition-all duration-200 hover:shadow-md">
      {/* 헤더 */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <h4 className="text-xl font-bold text-gray-800">{yearData.year}</h4>
          {/* <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusDisplay.color}`}
          >
            {statusDisplay.icon}
            <span className="ml-1">{statusDisplay.text}</span>
          </span> */}
        </div>

        {/* 삭제 버튼 */}
        <button
          className="p-1 text-gray-400 transition-colors hover:text-red-500"
          onClick={() => {
            setShowDeleteModal(true);
          }}
          title="삭제"
        >
          <FaTrash className="h-4 w-4" />
        </button>
      </div>

      {/* 상세 정보 */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <FaBuilding className="mr-2 h-4 w-4" />
          <span>법인명: {yearData.corporationName}</span>
        </div>
        {/* <div className="flex items-center text-sm text-gray-600">
          <FaIndustry className="mr-2 h-4 w-4" />
          <span>사업장 수: {yearData.siteCount}개</span>
        </div> */}
        <div className="flex items-center text-sm text-gray-600">
          <span>업종: {yearData.industry}</span>
        </div>
        {yearData.lastModified && (
          <p className="mt-2 text-xs text-gray-500">
            최종 수정: {formattedLastModified}
          </p>
        )}
      </div>
      {/* 액션 버튼 */}
      <div className="flex space-x-2">
        <button
          className="flex flex-1 items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700"
          onClick={() => onClickEdit(yearData)}
        >
          <FaPen className="mr-1 h-3 w-3" />
          수정
        </button>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(yearData);
          setShowDeleteModal(false);
        }}
        year={yearData.year.toString()}
      />
    </div>
  );
}
