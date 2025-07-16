'use client';

import { cn } from '@/utils/ui';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export const TOASTIFY_CONTAINER_ID = 'toastify_container';

export default function ToastifyContainer() {
  const [showClearButton, setShowClearButton] = useState(false);

  // 전체 삭제 버튼 표시 여부 업데이트
  useEffect(() => {
    toast.onChange((toastItem) => {
      if (toastItem.status === 'added') {
        const containerDiv = window.document.querySelector(
          `#${TOASTIFY_CONTAINER_ID} .Toastify__toast-container`,
        );
        const childrenCount = containerDiv?.children.length;
        if (!childrenCount) {
          return;
        }
        if (childrenCount > 3) {
          setShowClearButton(true);
        } else {
          setShowClearButton(false);
        }
      }
    });
  }, []);

  const clearAllToasts = () => {
    toast.dismiss();
    setShowClearButton(false);
  };
  return (
    <>
      {showClearButton && (
        <button
          onClick={clearAllToasts}
          className="fixed right-4 top-4 z-[60] rounded-md border bg-white px-2 py-1 text-black hover:bg-gray-100"
        >
          {'모든 메세지 읽음 처리'}
        </button>
      )}
      <ToastContainer
        autoClose={3000}
        newestOnTop
        className={cn(showClearButton && 'translate-y-10 transition-transform')}
        containerId={TOASTIFY_CONTAINER_ID}
        closeOnClick
      />
    </>
  );
}
