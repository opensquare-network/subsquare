import { createContext, useContext, useState } from "react";

export const FellowshipEvidenceContext = createContext({
  who: "",
  content: "",
});

export default function FellowshipEvidenceProvider({
  who,
  content: contentProp,
  children,
}) {
  const [content, setContent] = useState(contentProp);
  return (
    <FellowshipEvidenceContext.Provider value={{ who, content, setContent }}>
      {children}
    </FellowshipEvidenceContext.Provider>
  );
}

export function useFellowshipEvidence() {
  return useContext(FellowshipEvidenceContext);
}
