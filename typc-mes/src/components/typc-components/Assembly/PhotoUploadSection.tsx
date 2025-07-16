import React from 'react';
import { Camera, X } from 'lucide-react';

interface Photo {
  id: number;
  url: string;
  name: string;
}

interface PhotoUploadSectionProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedPhotos: Photo[];
  removePhoto: (id: number) => void;
}

const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  fileInputRef,
  handlePhotoUpload,
  uploadedPhotos,
  removePhoto,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">조립 사진</h3>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700"
          >
            <Camera size={18} />
            사진 추가
          </button>
        </div>
      </div>
      
      {uploadedPhotos.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {uploadedPhotos.map(photo => (
            <div key={photo.id} className="relative">
              <img 
                src={photo.url} 
                alt={photo.name}
                className="w-full h-20 object-cover rounded border"
              />
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 text-center py-4">업로드된 사진이 없습니다</p>
      )}
    </div>
  );
};

export default PhotoUploadSection;