import useRelatedReferenda from "next-common/hooks/fellowship/useRelatedReferenda";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { createContext, useContext } from "react";

const MyApproveReferendaContext = createContext();

const methods = ["approve"];

export default function MyApproveReferendaProvider({ children }) {
  const address = useRealAddress();
  const { relatedReferenda: myApproveReferenda, isLoading } =
    useRelatedReferenda(address, methods);

  return (
    <MyApproveReferendaContext.Provider
      value={{ myApproveReferenda, isLoading }}
    >
      {children}
    </MyApproveReferendaContext.Provider>
  );
}

export function useContextMyApproveReferenda() {
  return useContext(MyApproveReferendaContext);
}
