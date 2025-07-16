import React from 'react';


const SelectedDateBanner: React.FC = ({ }) => {


  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
      <h3 className="text-sm font-semibold text-blue-800">
         조립 주문
      </h3>
      <p className="text-xs text-blue-600">
        건의 주문이 있습니다.
      </p>
    </div>
  );
};

export default SelectedDateBanner;
