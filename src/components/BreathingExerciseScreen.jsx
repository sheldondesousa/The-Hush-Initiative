import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { trackBreathingExercise } from '../services/analytics';

export default function BreathingExerciseScreen() {
  const navigate = useNavigate();
  const { type } = useParams();
  const location = useLocation();
  const cyclesFromInfo = location.state?.cycles || 5;
  const { currentUser } = useAuth();

  const [isExercising, setIsExercising] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [timer, setTimer] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [filledSquares, setFilledSquares] = useState([]);

  // Color palette for squares
  const colors = {
    top: ['#746DB6', '#AD88C6', '#E1AFD1', '#F7D6EC'],
    right: ['#FFE6E6', '#F7D6EC', '#E1AFD1', '#AD88C6'],
    bottom: ['#746DB6', '#AD88C6', '#E1AFD1', '#F7D6EC'],
    left: ['#FFE6E6', '#F7D6EC', '#E1AFD1', '#AD88C6']
  };

  // Breathing animation cycle effect
  useEffect(() => {
    if (!isExercising) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        const nextTimer = prevTimer + 1;

        // INHALE: Fill top row (0-3 seconds, squares 0-3)
        if (breathingPhase === 'inhale') {
          if (nextTimer <= 4) {
            setFilledSquares(prev => {
              const newFilled = [...prev];
              if (nextTimer > 0 && !newFilled.includes(nextTimer - 1)) {
                newFilled.push(nextTimer - 1);
              }
              return newFilled;
            });
            if (nextTimer === 4) {
              setBreathingPhase('hold1');
              return 0;
            }
            return nextTimer;
          }
        // HOLD 1: Fill right column (0-3 seconds, squares 4-7)
        } else if (breathingPhase === 'hold1') {
          if (nextTimer <= 4) {
            setFilledSquares(prev => {
              const newFilled = [...prev];
              const squareIndex = 4 + nextTimer - 1;
              if (nextTimer > 0 && !newFilled.includes(squareIndex)) {
                newFilled.push(squareIndex);
              }
              return newFilled;
            });
            if (nextTimer === 4) {
              setBreathingPhase('exhale');
              return 0;
            }
            return nextTimer;
          }
        // EXHALE: Fill bottom row (0-3 seconds, squares 8-11)
        } else if (breathingPhase === 'exhale') {
          if (nextTimer <= 4) {
            setFilledSquares(prev => {
              const newFilled = [...prev];
              const squareIndex = 8 + nextTimer - 1;
              if (nextTimer > 0 && !newFilled.includes(squareIndex)) {
                newFilled.push(squareIndex);
              }
              return newFilled;
            });
            if (nextTimer === 4) {
              setBreathingPhase('hold2');
              return 0;
            }
            return nextTimer;
          }
        // HOLD 2: Fill left column (0-3 seconds, squares 12-15)
        } else if (breathingPhase === 'hold2') {
          if (nextTimer <= 4) {
            setFilledSquares(prev => {
              const newFilled = [...prev];
              const squareIndex = 12 + nextTimer - 1;
              if (nextTimer > 0 && !newFilled.includes(squareIndex)) {
                newFilled.push(squareIndex);
              }
              return newFilled;
            });
            if (nextTimer === 4) {
              // Cycle completed
              const nextCycle = currentCycle + 1;
              if (nextCycle >= cyclesFromInfo) {
                // Reached target cycles, stop the exercise
                const userId = currentUser?.uid;
                trackBreathingExercise(type, 'complete', userId, {
                  completedCycles: nextCycle,
                  totalCycles: cyclesFromInfo
                });
                setIsExercising(false);
                setCurrentCycle(0);
                setBreathingPhase('inhale');
                setTimer(0);
                setFilledSquares([]);
                return 0;
              } else {
                // Continue to next cycle
                setCurrentCycle(nextCycle);
                setBreathingPhase('inhale');
                setFilledSquares([]);
                return 0;
              }
            }
            return nextTimer;
          }
        }
        return prevTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isExercising, breathingPhase, currentCycle, cyclesFromInfo, currentUser, type]);

  // Get square color based on its position
  const getSquareColor = (index) => {
    if (index < 4) {
      // Top row
      return colors.top[index];
    } else if (index < 8) {
      // Right column
      return colors.right[index - 4];
    } else if (index < 12) {
      // Bottom row
      return colors.bottom[index - 8];
    } else {
      // Left column
      return colors.left[index - 12];
    }
  };

  // Get text and animation for current phase
  const getPhaseText = () => {
    if (breathingPhase === 'inhale') {
      return 'Breathe In';
    } else if (breathingPhase === 'exhale') {
      return 'Breathe Out';
    } else {
      return 'HOLD';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #F4F9FD, #C3DBEA)' }}>
      <style>{`
        @keyframes magnify {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes pulseMagnify {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        .magnify-enter {
          animation: magnify 0.5s ease-out forwards;
        }
        .pulse-hold {
          animation: pulseMagnify 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-[430px] h-[932px] bg-white flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/breathe/${type}/info`)}
            className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            <span className="text-lg">Back</span>
          </button>

          <h3 className="text-xl font-semibold text-black text-center flex-1 px-4">
            Box Breathing
          </h3>

          <div className="w-20"></div>
        </div>

        {/* Exercise Animation Area */}
        <div className="flex-1 bg-white rounded-lg flex flex-col items-center justify-center p-4">
          {/* Square Border Animation */}
          <div className="flex-1 flex items-center justify-center w-full relative">
            <div className="relative" style={{ width: '340px', height: '340px' }}>
              {/* Top Row */}
              <div className="absolute top-0 left-0 right-0 flex justify-between">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={`top-${i}`}
                    className="transition-all duration-300 ease-linear"
                    style={{
                      width: '70px',
                      height: '70px',
                      backgroundColor: filledSquares.includes(i) ? getSquareColor(i) : '#E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                ))}
              </div>

              {/* Right Column */}
              <div className="absolute top-0 right-0 bottom-0 flex flex-col justify-between">
                {[4, 5, 6, 7].map((i) => (
                  <div
                    key={`right-${i}`}
                    className="transition-all duration-300 ease-linear"
                    style={{
                      width: '70px',
                      height: '70px',
                      backgroundColor: filledSquares.includes(i) ? getSquareColor(i) : '#E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                ))}
              </div>

              {/* Bottom Row */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                {[8, 9, 10, 11].map((i) => (
                  <div
                    key={`bottom-${i}`}
                    className="transition-all duration-300 ease-linear"
                    style={{
                      width: '70px',
                      height: '70px',
                      backgroundColor: filledSquares.includes(i) ? getSquareColor(i) : '#E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                ))}
              </div>

              {/* Left Column */}
              <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-between">
                {[12, 13, 14, 15].map((i) => (
                  <div
                    key={`left-${i}`}
                    className="transition-all duration-300 ease-linear"
                    style={{
                      width: '70px',
                      height: '70px',
                      backgroundColor: filledSquares.includes(i) ? getSquareColor(i) : '#E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                ))}
              </div>

              {/* Center Text Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  key={breathingPhase}
                  className={`text-3xl font-bold text-gray-900 ${
                    (breathingPhase === 'hold1' || breathingPhase === 'hold2') ? 'pulse-hold' : 'magnify-enter'
                  }`}
                >
                  {getPhaseText()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col py-6 gap-6">
          {/* Progress Display */}
          {isExercising && (
            <div className="text-center">
              <span className="text-sm text-gray-600 font-medium">
                Cycle {currentCycle + 1} of {cyclesFromInfo}
              </span>
            </div>
          )}

          {/* Start/Stop Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                const userId = currentUser?.uid;
                if (!isExercising) {
                  setIsExercising(true);
                  setBreathingPhase('inhale');
                  setTimer(0);
                  setCurrentCycle(0);
                  setFilledSquares([]);
                  trackBreathingExercise(type, 'start', userId, { cycles: cyclesFromInfo });
                } else {
                  setIsExercising(false);
                  setBreathingPhase('inhale');
                  setTimer(0);
                  setCurrentCycle(0);
                  setFilledSquares([]);
                  trackBreathingExercise(type, 'stop', userId, { currentCycle, totalCycles: cyclesFromInfo });
                }
              }}
              className="px-12 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-lg"
            >
              {isExercising ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
