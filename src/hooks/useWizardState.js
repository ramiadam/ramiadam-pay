import { useState, useCallback } from 'react';
import { WIZARD_STEPS } from '../utils/constants.js';

/**
 * Wizard navigation state.
 * completedSteps is a Set — not persisted (intentional: wizard resets on refresh).
 */
export function useWizardState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set([0]));

  const totalSteps = WIZARD_STEPS.length;

  function canGoTo(n) {
    if (n < 0 || n >= totalSteps) return false;
    if (n === 0) return true;
    // Can go to next step after the last completed one
    const maxCompleted = completedSteps.size > 0 ? Math.max(...completedSteps) : 0;
    return n <= maxCompleted + 1;
  }

  const completeStep = useCallback((stepIndex) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(stepIndex);
      return next;
    });
  }, []);

  const goTo = useCallback((n) => {
    setCurrentStep(n);
  }, []);

  const goNext = useCallback(() => {
    setCurrentStep((cur) => {
      const next = Math.min(cur + 1, totalSteps - 1);
      return next;
    });
  }, [totalSteps]);

  const goPrev = useCallback(() => {
    setCurrentStep((cur) => Math.max(cur - 1, 0));
  }, []);

  return {
    currentStep,
    completedSteps,
    totalSteps,
    canGoTo,
    completeStep,
    goTo,
    goNext,
    goPrev,
  };
}
