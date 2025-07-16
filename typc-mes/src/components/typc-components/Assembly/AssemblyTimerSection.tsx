import React from 'react';
import { Clock, Play, Pause, Square } from 'lucide-react';

interface AssemblyTimerSectionProps {
  timerState: 'ready' | 'running' | 'paused' | 'completed';
  elapsedTime: number;
  startTime: Date | null;
  handleStart: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleComplete: () => void;
  isAllCompleted: () => boolean;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const formatStartTime = (startTime: Date): string => {
  return startTime.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const AssemblyTimerSection: React.FC<AssemblyTimerSectionProps> = ({
  timerState,
  elapsedTime,
  startTime,
  handleStart,
  handlePause,
  handleResume,
  handleComplete,
  isAllCompleted
}) => {
  return (
    <div className={`rounded-lg p-4 mb-3 ${
      timerState === 'ready' ? 'bg-green-50 border border-green-200' :
      timerState === 'running' ? 'bg-blue-50 border border-blue-200' :
      timerState === 'paused' ? 'bg-orange-50 border border-orange-200' :
      'bg-purple-50 border border-purple-200'
    }`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock size={16} className={
            timerState === 'ready' ? 'text-green-600' :
            timerState === 'running' ? 'text-blue-600' :
            timerState === 'paused' ? 'text-orange-600' :
            'text-purple-600'
          } />
          <h3 className={`text-sm font-semibold ${
            timerState === 'ready' ? 'text-green-800' :
            timerState === 'running' ? 'text-blue-800' :
            timerState === 'paused' ? 'text-orange-800' :
            'text-purple-800'
          }`}>
            {timerState === 'ready' ? '조립 시간 측정' :
             timerState === 'running' ? '조립 진행 중...' :
             timerState === 'paused' ? '조립 일시정지' :
             '조립 완료'}
          </h3>
        </div>

        {timerState === 'ready' ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-3 px-8 py-5 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 mx-auto shadow-lg"
          >
            <Play size={24} />
            조립 시작하기
          </button>
        ) : (
          <div>
            <div className={`text-3xl font-mono font-bold mb-2 ${
              timerState === 'running' ? 'text-blue-600' :
              timerState === 'paused' ? 'text-orange-600' :
              'text-purple-600'
            }`}>
              {formatTime(elapsedTime)}
              {timerState === 'paused' && <span className="text-sm ml-2">(정지됨)</span>}
            </div>

            {startTime && (
              <p className="text-xs text-gray-600 mb-3">
                시작: {formatStartTime(startTime)}
              </p>
            )}

            <div className="flex items-center justify-center gap-3">
              {timerState === 'running' && (
                <>
                  <button
                    onClick={handlePause}
                    className="flex items-center gap-2 px-5 py-3 bg-orange-500 text-white rounded-lg text-base font-medium hover:bg-orange-600"
                  >
                    <Pause size={18} />
                    일시정지
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={!isAllCompleted()}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg text-base font-medium ${
                      isAllCompleted() 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Square size={18} />
                    조립완료
                  </button>
                </>
              )}

              {timerState === 'paused' && (
                <>
                  <button
                    onClick={handleResume}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700"
                  >
                    <Play size={18} />
                    재개하기
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={!isAllCompleted()}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg text-base font-medium ${
                      isAllCompleted() 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Square size={18} />
                    조립완료
                  </button>
                </>
              )}
            </div>

            {timerState === 'paused' && (
              <p className="text-xs text-orange-600 mt-2">💡 휴식 시간은 측정에서 제외됩니다</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssemblyTimerSection;
