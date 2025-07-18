import React from 'react';
import { Clock, Play, Pause, Square} from 'lucide-react';

type AssemblyTimerSectionProps = {
  timerState: 'ready' | 'running' | 'paused' | 'completed';
   handleStart: () => void;
   handlePause: () => void;
   handleResume: () => void;
   handleComplete: () => void;
}


const AssemblyTimerSection: React.FC<AssemblyTimerSectionProps> = ({timerState, handleStart, handlePause, handleResume, handleComplete}) => {
  
// 준비중
  if (timerState === 'ready') {
    return (
      <div className={`rounded-lg p-4 mb-3 bg-green-50 border border-green-200`}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock size={16} className={'text-green-600'} />
            <h3 className={`text-sm font-semibold text-green-800`}>
              조립 시간 측정
            </h3>
          </div>

          <button
              onClick={handleStart}
              className="flex items-center gap-3 px-8 py-5 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 mx-auto shadow-lg"
          >
              <Play size={24} />조립 시작하기
          </button>

        </div>
      </div>
    );
  }

  //조립중
  if (timerState === 'running') {
    return (
      <div className={`rounded-lg p-4 mb-3 bg-blue-50 border border-blue-200`}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock size={16} className={'text-blue-600'} />
            <h3 className={`text-sm font-semibold text-blue-800`}>
              조립 진행 중...
            </h3>
          </div>

          <div>
            <div className={`text-3xl font-mono font-bold mb-2 text-blue-600`}>
              타이머시간
            </div>
            <p className="text-xs text-gray-600 mb-3">
                시작: 현재시간
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-5 py-3 bg-orange-500 text-white rounded-lg text-base font-medium hover:bg-orange-600"
              >
                <Pause size={18} />
                일시정지
              </button>
              <button
                onClick={handleComplete}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg text-base font-medium 
                  bg-gray-300 text-gray-500 cursor-not-allowed`}
              >
                <Square size={18} />
                조립완료
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  //일시정지
  if (timerState === 'paused') {
    return (
      <div className={`rounded-lg p-4 mb-3 bg-orange-50 border border-orange-200`}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock size={16} className={'text-orange-600'} />
            <h3 className={`text-sm font-semibold text-orange-800`}>
              조립 일시정지
            </h3>
          </div>

          <div>
            <div className={`text-3xl font-mono font-bold mb-2 text-orange-600`}>
              타이머시간<span className="text-sm ml-2">(정지됨)</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
                시작: 현재시간
            </p>
            <div className="flex items-center justify-center gap-3">

                  <button
                    onClick={handleResume}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700"
                  >
                    <Play size={18} />
                    재개하기
                  </button>
                  {/* <button
                  onClick={handleComplete}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg text-base font-medium 
                    bg-gray-300 text-gray-500 cursor-not-allowed`}
                  >
                    <Square size={18} />
                    조립완료
                  </button> */}
               
            </div>
            <p className="text-xs text-orange-600 mt-2">💡 휴식 시간은 측정에서 제외됩니다</p>
          </div>

        </div>
      </div>
    );
  }

};

export default AssemblyTimerSection;
