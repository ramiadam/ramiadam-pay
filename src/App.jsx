import { useState, useEffect, useCallback } from 'react';
import './moyasar-overrides.css';
import styles from './App.module.css';

import { Topbar } from './components/layout/Topbar.jsx';
import { ProgressBar } from './components/layout/ProgressBar.jsx';

import { Step00Welcome } from './steps/Step00Welcome.jsx';
import { Step01ApiKeys } from './steps/Step01ApiKeys.jsx';
import { Step02CardPayment } from './steps/Step02CardPayment.jsx';
import { Step03SaveCardToken } from './steps/Step03SaveCardToken.jsx';
import { Step04AuthorizeOnly } from './steps/Step04AuthorizeOnly.jsx';
import { Step05ApplePay } from './steps/Step05ApplePay.jsx';
import { Step06SamsungPay } from './steps/Step06SamsungPay.jsx';
import { Step07StcPay } from './steps/Step07StcPay.jsx';
import { Step08Done } from './steps/Step08Done.jsx';

import { useWizardState } from './hooks/useWizardState.js';
import { useConfig } from './hooks/useConfig.js';
import { useSecretKey } from './hooks/useSecretKey.js';
import { usePaymentResult } from './hooks/usePaymentResult.js';
import { isLiveKey } from './utils/keyValidation.js';
import { K } from './utils/constants.js';

function getInitialTheme() {
  return localStorage.getItem(K.theme) ?? 'dark';
}

export default function App() {
  const wizard = useWizardState();
  const { config, updateConfig } = useConfig();
  const { secretKey, setSecretKey } = useSecretKey();
  const { result, setResult } = usePaymentResult();
  const [theme, setTheme] = useState(getInitialTheme);

  const isLive = isLiveKey(config.publishable_key) || isLiveKey(secretKey);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(K.theme, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  function makeCompleteStep(stepIndex) {
    return () => {
      wizard.completeStep(stepIndex);
      wizard.goTo(stepIndex + 1);
    };
  }

  const paymentStepProps = { config, updateConfig, secretKey, setResult, isLive };

  return (
    <div className={styles.app}>
      <Topbar theme={theme} onToggleTheme={toggleTheme} isLive={isLive} />
      <ProgressBar
        currentStep={wizard.currentStep}
        completedSteps={wizard.completedSteps}
        canGoTo={wizard.canGoTo}
        onGoTo={wizard.goTo}
      />

      <main className={styles.main} id="main-content">
        {wizard.currentStep === 0 && (
          <Step00Welcome onStart={makeCompleteStep(0)} />
        )}
        {wizard.currentStep === 1 && (
          <Step01ApiKeys
            config={config}
            updateConfig={updateConfig}
            secretKey={secretKey}
            setSecretKey={setSecretKey}
            onComplete={makeCompleteStep(1)}
          />
        )}
        {wizard.currentStep === 2 && (
          <Step02CardPayment
            {...paymentStepProps}
            result={result}
            onComplete={makeCompleteStep(2)}
          />
        )}
        {wizard.currentStep === 3 && (
          <Step03SaveCardToken
            {...paymentStepProps}
            result={result}
            onComplete={makeCompleteStep(3)}
          />
        )}
        {wizard.currentStep === 4 && (
          <Step04AuthorizeOnly
            {...paymentStepProps}
            onComplete={makeCompleteStep(4)}
          />
        )}
        {wizard.currentStep === 5 && (
          <Step05ApplePay
            {...paymentStepProps}
            onComplete={makeCompleteStep(5)}
          />
        )}
        {wizard.currentStep === 6 && (
          <Step06SamsungPay
            {...paymentStepProps}
            onComplete={makeCompleteStep(6)}
          />
        )}
        {wizard.currentStep === 7 && (
          <Step07StcPay
            {...paymentStepProps}
            onComplete={makeCompleteStep(7)}
          />
        )}
        {wizard.currentStep === 8 && (
          <Step08Done
            completedSteps={wizard.completedSteps}
            onGoTo={wizard.goTo}
          />
        )}
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} Rami Adam &nbsp;·&nbsp; RTB v3
      </footer>
    </div>
  );
}
