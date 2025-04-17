import { useState, useMemo, createContext, useContext } from "react";

const StepContainerContext = createContext();

export default StepContainerContext;

export function StepContainerProvider({ children, list = [] }) {
  const [steps, setSteps] = useState(list);

  const currentStep = useMemo(() => {
    return steps.length > 0 ? steps[steps.length - 1] : null;
  }, [steps]);

  const goBack = () => {
    if (steps.length <= 1) {
      closeAll();
      return;
    }
    setSteps((prevSteps) => prevSteps.slice(0, -1));
  };

  const goNext = (step) => {
    if (!step) return;
    setSteps((prevSteps) => [...prevSteps, step]);
  };

  const closeAll = () => {
    setSteps([]);
  };

  return (
    <StepContainerContext.Provider
      value={{
        currentStep,
        steps,
        goBack,
        goNext,
        closeAll,
        hasPrevious: steps.length > 1,
        isFirstStep: steps.length === 1,
      }}
    >
      {children}
    </StepContainerContext.Provider>
  );
}

export function useStepContainer() {
  const context = useContext(StepContainerContext);
  return context || {};
}
