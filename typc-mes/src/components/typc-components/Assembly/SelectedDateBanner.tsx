// components/SelectedDateBanner.tsx
import React from 'react';

interface SelectedDateBannerProps {
  selectedDate: string;
  orderCount: number;
}

const SelectedDateBanner: React.FC<SelectedDateBannerProps> = ({ selectedDate, orderCount }) => {
  const formattedDate = new Date(selectedDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
      <h3 className="text-sm font-semibold text-blue-800">
        {formattedDate} 조립 주문
      </h3>
      <p className="text-xs text-blue-600">
        {orderCount}건의 주문이 있습니다.
      </p>
    </div>
  );
};

export default SelectedDateBanner;
