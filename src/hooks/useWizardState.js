import { useState, useCallback } from 'react';
import { WIZARD_STEPS, K } from '../utils/constants.js';

// Read and consume the 3DS return-step once at module load.
// Stored by PaymentFormMount before Moyasar.init, consumed here on page reload.
function consumeReturnStep() {
  const raw = localStorage.getItem(K.returnStep);
  if (!raw) return null;
  localStorage.removeItem(K.returnStep);
  const n = parseInt(raw, 10);
  return (!isNaN(n) && n >= 1 && n < WIZARD_STEPS.length) ? n : null;
}
const RETURN_STEP = consumeReturnStep();

/**
 * Wizard navigation state.
 * On a 3DS redirect return, restores currentStep + completedSteps from localStorage.
 */
export function useWizardState() {
  const [currentStep, setCurrentStep] = useState(RETURN_STEP ?? 0);
  const [completedSteps, setCompletedSteps] = useState(() => {
    if (RETURN_STEP != null) {
      const s = new Set();
      for (let i = 0; i <= RETURN_STEP; i++) s.add(i);
      return s;
    }
    return new Set([0]);
  });

  const totalSteps = WIZARD_STEPS.length;

  function canGoTo(n) {
    if (n < 0 || n >= totalSteps) return false;
    if (n <= 1) return true;
    // Steps 2–8 require API Keys (step 1) to be complete
    return completedSteps.has(1);
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
