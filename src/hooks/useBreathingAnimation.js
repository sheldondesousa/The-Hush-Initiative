// Custom hook for breathing animation calculations
export const useBreathingAnimation = ({
  breathingPhase,
  timer,
  isExercising,
  exerciseCompleted,
  animationReady,
  coherentBreathTime
}) => {

  // Get circle size based on breathing phase and timer for Box Breathing
  const getCircleSize = () => {
    // Timer 0-4: 5 size values
    const sizes = {
      0: 100,
      1: 160,
      2: 220,
      3: 280,
      4: 340
    };

    if (breathingPhase === 'inhale' || breathingPhase === 'exhale') {
      return sizes[timer];
    } else {
      return sizes[4 - timer];
    }
  };

  // Get number of circles to display based on phase and timer for Box Breathing
  const getVisibleCircleCount = () => {
    if (breathingPhase === 'inhale') {
      return timer;
    } else if (breathingPhase === 'hold1' || breathingPhase === 'transitionAfterInhale' || breathingPhase === 'transitionAfterHold1') {
      return 4;
    } else if (breathingPhase === 'exhale') {
      return 5 - timer;
    } else if (breathingPhase === 'hold2' || breathingPhase === 'transitionAfterExhale' || breathingPhase === 'transitionAfterHold2') {
      return 1;
    }
    return 1;
  };

  // Get visible circle count for 4-7-8 breathing
  const getVisibleCircleCount478 = () => {
    if (!isExercising || !animationReady) return 0;

    if (breathingPhase === 'inhale') {
      return timer * 2;
    } else if (breathingPhase === 'hold1') {
      return 8;
    } else if (breathingPhase === 'exhale') {
      return timer;
    }

    return 0;
  };

  // Get circle data for 4-7-8 breathing
  const getCirclesData478 = () => {
    const circleCount = getVisibleCircleCount478();

    const sizes = [100, 140, 180, 220, 260, 300, 340, 360];
    const colors = [
      'rgba(116, 105, 182, 1.0)',
      'rgba(116, 105, 182, 0.9)',
      'rgba(173, 136, 198, 0.8)',
      'rgba(173, 136, 198, 0.7)',
      'rgba(225, 175, 209, 0.6)',
      'rgba(225, 175, 209, 0.5)',
      'rgba(246, 208, 234, 0.4)',
      'rgba(246, 208, 234, 0.3)'
    ];
    const blurs = [20, 21, 22, 23, 24, 25, 26, 27];

    const circles = [];
    for (let i = 0; i < circleCount; i++) {
      circles.push({
        size: sizes[i],
        color: colors[i],
        blur: blurs[i],
        key: i
      });
    }

    return circles.reverse();
  };

  // Get data for all circles to render for Box Breathing
  const getCirclesData = () => {
    const circleCount = getVisibleCircleCount();
    const sizes = [160, 220, 280, 340];
    const colors = [
      'rgba(6, 122, 195, 1.0)',
      'rgba(6, 122, 195, 0.75)',
      'rgba(6, 122, 195, 0.5)',
      'rgba(6, 122, 195, 0.25)'
    ];
    const blurs = [20, 22, 24, 26];

    const circles = [];
    for (let i = 0; i < circleCount; i++) {
      circles.push({
        size: sizes[i],
        color: colors[i],
        blur: blurs[i],
        key: i
      });
    }

    return circles.reverse();
  };

  // Get smooth circle data for Coherent Breathing (customizable)
  const getCoherentCircleSize = () => {
    if (!isExercising || exerciseCompleted) return 0;

    const maxTimer = coherentBreathTime * 10;
    const progress = timer / maxTimer;
    const minSize = 0;
    const maxSize = 340;

    const easeProgress = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const currentSize = minSize + (maxSize - minSize) * easeProgress;

    return currentSize;
  };

  // Get smooth circle size for 4-7-8 Breathing
  const get478CircleSize = () => {
    if (!isExercising || !animationReady) return 0;

    const minSize = 0;
    const maxSize = 340;

    if (breathingPhase === 'inhale') {
      const seconds = timer / 10;
      const progress = seconds / 4;
      return minSize + (maxSize - minSize) * progress;
    } else if (breathingPhase === 'hold1') {
      return maxSize;
    } else if (breathingPhase === 'exhale') {
      const seconds = timer / 10;
      const progress = seconds / 8;
      return minSize + (maxSize - minSize) * progress;
    }

    return minSize;
  };

  // Get smooth circle size for Humming Bee
  const getHummingBeeCircleSize = () => {
    if (!isExercising) return 100;

    const minSize = 100;
    const maxSize = 340;

    if (breathingPhase === 'inhale') {
      const seconds = timer / 10;
      const progress = seconds / 4;
      return minSize + (maxSize - minSize) * progress;
    } else if (breathingPhase === 'exhale') {
      const seconds = timer / 10;
      const progress = seconds / 8;
      return minSize + (maxSize - minSize) * progress;
    }

    return minSize;
  };

  // Get orb position for Box Breathing (moves along square path)
  const getBoxBreathingOrbPosition = (timeOffset = 0) => {
    if (!isExercising) return { x: 0, y: 0 };

    const squareSize = 280;
    let adjustedTimer = timer - timeOffset;
    let currentPhase = breathingPhase;

    if (adjustedTimer < 0) {
      adjustedTimer = 4 + adjustedTimer;
      if (currentPhase === 'inhale') currentPhase = 'hold2';
      else if (currentPhase === 'hold1') currentPhase = 'inhale';
      else if (currentPhase === 'exhale') currentPhase = 'hold1';
      else if (currentPhase === 'hold2') currentPhase = 'exhale';
    }

    const progress = Math.min(adjustedTimer / 4, 1);

    if (currentPhase === 'inhale') {
      return {
        x: squareSize * progress,
        y: 0
      };
    } else if (currentPhase === 'hold1') {
      return {
        x: squareSize,
        y: squareSize * progress
      };
    } else if (currentPhase === 'exhale') {
      return {
        x: squareSize * (1 - progress),
        y: squareSize
      };
    } else if (currentPhase === 'hold2') {
      return {
        x: 0,
        y: squareSize * (1 - progress)
      };
    }

    return { x: 0, y: 0 };
  };

  // Get green circle indicator position for Box Breathing
  const getBoxBreathingIndicatorPosition = () => {
    const size = 280;
    const radius = 12;
    const centerOffset = 144;
    const halfSize = size / 2;

    if (breathingPhase === 'hold1' || breathingPhase === 'hold2') {
      const progress = timer / 4;
      const perimeter = (size - 2 * radius) * 4;
      const distance = progress * perimeter;
      const sideLength = size - 2 * radius;

      if (distance <= sideLength) {
        return {
          x: centerOffset - halfSize + radius + distance,
          y: centerOffset - halfSize + radius
        };
      } else if (distance <= 2 * sideLength) {
        const sideProgress = distance - sideLength;
        return {
          x: centerOffset + halfSize - radius,
          y: centerOffset - halfSize + radius + sideProgress
        };
      } else if (distance <= 3 * sideLength) {
        const sideProgress = distance - 2 * sideLength;
        return {
          x: centerOffset + halfSize - radius - sideProgress,
          y: centerOffset + halfSize - radius
        };
      } else {
        const sideProgress = distance - 3 * sideLength;
        return {
          x: centerOffset - halfSize + radius,
          y: centerOffset + halfSize - radius - sideProgress
        };
      }
    }

    return { x: centerOffset, y: centerOffset };
  };

  // Get circular progress data for Physiological Sigh (clock-based animation)
  const getPhysiologicalCircleProgress = () => {
    if (!isExercising || exerciseCompleted) return { progress1: 0, progress2: 0 };

    if (breathingPhase === 'inhale') {
      if (timer <= 29) {
        const progress = ((timer + 1) / 30) * 0.75;
        return { progress1: progress, progress2: 0 };
      } else {
        const progress = ((timer - 29) / 10) * 0.25;
        return { progress1: 0.75, progress2: progress };
      }
    } else if (breathingPhase === 'hold1') {
      return { progress1: 0.75, progress2: 0.25 };
    } else if (breathingPhase === 'exhale') {
      if (timer > 59) {
        const progress2 = ((timer - 59) / 20) * 0.25;
        return { progress1: 0.75, progress2: progress2 };
      } else {
        const progress1 = ((timer + 1) / 60) * 0.75;
        return { progress1: progress1, progress2: 0 };
      }
    } else if (breathingPhase === 'hold2') {
      return { progress1: 0, progress2: 0 };
    }

    return { progress1: 0, progress2: 0 };
  };

  return {
    getCircleSize,
    getVisibleCircleCount,
    getVisibleCircleCount478,
    getCirclesData478,
    getCirclesData,
    getCoherentCircleSize,
    get478CircleSize,
    getHummingBeeCircleSize,
    getBoxBreathingOrbPosition,
    getBoxBreathingIndicatorPosition,
    getPhysiologicalCircleProgress
  };
};
