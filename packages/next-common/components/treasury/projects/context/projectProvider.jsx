import { createContext, useContext, useState } from "react";

export const PRICE_TYPE = {
  FIAT_AT_SUBMISSION: "fiatAtSubmission",
  FIAT_AT_FINAL: "fiatAtFinal",
};

const ProjectContext = createContext(null);

export default function ProjectProvider({ children }) {
  const [priceType, setPriceType] = useState(PRICE_TYPE.FIAT_AT_SUBMISSION);

  return (
    <ProjectContext.Provider value={{ priceType, setPriceType }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  return useContext(ProjectContext);
}

export function usePriceType() {
  const { priceType, setPriceType } = useProjectContext();
  return { priceType, setPriceType };
}
