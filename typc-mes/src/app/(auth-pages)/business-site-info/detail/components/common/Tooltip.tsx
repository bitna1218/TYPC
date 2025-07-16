'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  theme?: 'dark' | 'light' | 'blue';
  maxWidth?: number;
  delay?: number; // 툴팁 표시 지연 시간 (ms)
}

const Tooltip: React.FC<TooltipProps> = ({ 
  text, 
  children, 
  position = 'top', 
  className,
  theme = 'dark',
  maxWidth = 640,
  delay = 500
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 테마별 스타일 정의
  const getThemeClasses = useCallback(() => {
    if (className) return className;
    
    switch (theme) {
      case 'light':
        return 'bg-white text-gray-800 border border-gray-200 shadow-lg';
      case 'blue':
        return 'bg-blue-600 text-white border border-blue-700';
      case 'dark':
      default:
        return 'bg-gray-900 text-white border border-gray-700';
    }
  }, [theme, className]);

  // 화살표 스타일 생성
  const getArrowClasses = useCallback(() => {
    const baseArrow = 'absolute w-2 h-2 transform rotate-45';
    
    switch (theme) {
      case 'light':
        return `${baseArrow} bg-white border-gray-200`;
      case 'blue':
        return `${baseArrow} bg-blue-600 border-blue-700`;
      case 'dark':
      default:
        return `${baseArrow} bg-gray-900 border-gray-700`;
    }
  }, [theme]);

  const getPositionClasses = useCallback(() => {
    let top = '0px';
    let left = '0px';
    let arrowTop = '0px';
    let arrowLeft = '0px';
    let arrowClasses = '';
    const gap = 12; // 화살표를 고려한 간격

    if (childRef.current && tooltipRef.current) {
      const childRect = childRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      switch (position) {
        case 'bottom':
          top = `${childRect.height + gap}px`;
          left = `${(childRect.width - tooltipRect.width) / 2}px`;
          arrowTop = '-4px';
          arrowLeft = `${tooltipRect.width / 2 - 4}px`;
          arrowClasses = 'border-b border-r';
          break;
        case 'left':
          top = `${(childRect.height - tooltipRect.height) / 2}px`;
          left = `${-tooltipRect.width - gap}px`;
          arrowTop = `${tooltipRect.height / 2 - 4}px`;
          arrowLeft = `${tooltipRect.width - 4}px`;
          arrowClasses = 'border-l border-b';
          break;
        case 'right':
          top = `${(childRect.height - tooltipRect.height) / 2}px`;
          left = `${childRect.width + gap}px`;
          arrowTop = `${tooltipRect.height / 2 - 4}px`;
          arrowLeft = '-4px';
          arrowClasses = 'border-r border-t';
          break;
        case 'top':
        default:
          top = `${-tooltipRect.height - gap}px`;
          left = `${(childRect.width - tooltipRect.width) / 2}px`;
          arrowTop = `${tooltipRect.height - 4}px`;
          arrowLeft = `${tooltipRect.width / 2 - 4}px`;
          arrowClasses = 'border-t border-l';
          break;
      }
    }
    
    return { 
      tooltip: { top, left }, 
      arrow: { top: arrowTop, left: arrowLeft, classes: arrowClasses }
    };
  }, [position]);

  const [dynamicStyles, setDynamicStyles] = useState<{
    tooltip: { top: string; left: string };
    arrow: { top: string; left: string; classes: string };
  }>({
    tooltip: { top: '0px', left: '0px' },
    arrow: { top: '0px', left: '0px', classes: '' }
  });

  useEffect(() => {
    if (shouldShow) {
      setDynamicStyles(getPositionClasses());
    }
  }, [shouldShow, text, getPositionClasses]);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setShouldShow(true);
      // 약간의 지연 후 애니메이션 시작
      setTimeout(() => setIsVisible(true), 10);
    }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsVisible(false);
    // 애니메이션 종료 후 DOM에서 제거
    setTimeout(() => setShouldShow(false), 150);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 텍스트를 문단별로 분리하여 처리
  const formatText = useCallback((text: string) => {
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => (
      <div key={pIndex} className={pIndex > 0 ? 'mt-3' : ''}>
        {paragraph.split('\n').map((line, lIndex, arr) => (
          <React.Fragment key={lIndex}>
            {line}
            {lIndex < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    ));
  }, []);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      ref={childRef}
    >
      {children}
      {shouldShow && (
        <div 
          ref={tooltipRef}
          className={`
            absolute z-50 px-4 py-3 text-sm leading-relaxed rounded-lg shadow-xl
            backdrop-blur-sm transition-all duration-150 ease-out
            ${getThemeClasses()}
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            break-words whitespace-normal text-left
          `}
          style={{
            width: '100%',
            maxWidth: `${maxWidth}px`,
            minWidth: '250px',
            ...dynamicStyles.tooltip
          }}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          {/* 화살표 */}
          <div
            className={`${getArrowClasses()} ${dynamicStyles.arrow.classes}`}
            style={{
              top: dynamicStyles.arrow.top,
              left: dynamicStyles.arrow.left
            }}
          />
          
          {/* 툴팁 내용 */}
          <div className="relative z-10">
            {formatText(text)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;