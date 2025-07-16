import React from 'react';
import { Camera } from 'lucide-react';

const PhotoUploadSection: React.FC = ({}) => {

  return (
    <div className="bg-white rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">조립 사진</h3>
        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
          />
          <button
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700"
          >
            <Camera size={18} />
            사진 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadSection;