import { createContext, useContext } from "react";
import useMyJudgementRequest from "../hooks/useMyJudgementRequest";

const JudgementContext = createContext(null);

export default JudgementContext;

export function JudgementContextProvider({ children }) {
  const {
    value: myJudgementRequest,
    loading: isLoadingMyJudgementRequest,
    fetch: fetchMyJudgementRequest,
  } = useMyJudgementRequest();

  return (
    <JudgementContext.Provider
      value={{
        myJudgementRequest,
        isLoadingMyJudgementRequest,
        fetchMyJudgementRequest,
      }}
    >
      {children}
    </JudgementContext.Provider>
  );
}

export function useJudgementContext() {
  return useContext(JudgementContext);
}
