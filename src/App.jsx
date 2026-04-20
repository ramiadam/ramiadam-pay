import { useState, useEffect, useCallback } from 'react';
import './moyasar-overrides.css';
import styles from './App.module.css';

import { Topbar } from './components/layout/Topbar.jsx';
import { ProgressBar } from './components/layout/ProgressBar.jsx';

import { Step00Welcome } from './steps/Step00Welcome.jsx';
import { Step01ApiKeys } from './steps/Step01ApiKeys.jsx';
import { Step02CardPayment } from './steps/Step02CardPayment.jsx';
import { Step03ApplePay } from './steps/Step03ApplePay.jsx';
import { Step04AuthorizeOnly } from './steps/Step04AuthorizeOnly.jsx';
import { Step05SaveCardToken } from './steps/Step05SaveCardToken.jsx';
import { Step06SamsungPay } from './steps/Step06SamsungPay.jsx';
import { Step07StcPay } from './steps/Step07StcPay.jsx';

import { useWizardState } from './hooks/useWizardState.js';
import { useConfig } from './hooks/useConfig.js';
import { useSecretKey } from './hooks/useSecretKey.js';
import { usePaymentResult } from './hooks/usePaymentResult.js';
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

  // Sync theme to DOM and localStorage whenever it changes
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

  return (
    <div className={styles.app}>
      <Topbar
        theme={theme}
        onToggleTheme={toggleTheme}
      />
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
            config={config}
            updateConfig={updateConfig}
            secretKey={secretKey}
            result={result}
            setResult={setResult}
            onComplete={makeCompleteStep(2)}
          />
        )}
        {wizard.currentStep === 3 && (
          <Step03ApplePay
            config={config}
            updateConfig={updateConfig}
            secretKey={secretKey}
            setResult={setResult}
            onComplete={makeCompleteStep(3)}
          />
        )}
        {wizard.currentStep === 4 && (
          <Step04AuthorizeOnly
            config={config}
            updateConfig={updateConfig}
            secretKey={secretKey}
            setResult={setResult}
            onComplete={makeCompleteStep(4)}
          />
        )}
        {wizard.currentStep === 5 && (
          <Step05SaveCardToken
            config={config}
            updateConfig={updateConfig}
            secretKey={secretKey}
            result={result}
            setResult={setResult}
            onComplete={makeCompleteStep(5)}
          />
        )}
        {wizard.currentStep === 6 && (
          <Step06SamsungPay
            config={config}
            updateConfig={updateConfig}
            secretKey={secretKey}
            setResult={setResult}
            onComplete={makeCompleteStep(6)}
          />
        )}
        {wizard.currentStep === 7 && (
          <Step07StcPay
            config={config}
            updateConfig={updateConfig}
            secretKey={secretKey}
            setResult={setResult}
            onComplete={makeCompleteStep(7)}
          />
        )}
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} Rami Adam &nbsp;·&nbsp; RTB v2
      </footer>
    </div>
  );
}
