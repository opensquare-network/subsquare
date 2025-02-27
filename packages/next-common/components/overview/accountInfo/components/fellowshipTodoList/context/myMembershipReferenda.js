import useRelatedReferenda from "next-common/hooks/fellowship/useRelatedReferenda";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { createContext, useContext } from "react";

const MyMembershipReferendaContext = createContext();

const methods = ["approve", "promote", "promoteFast"];

export default function MyMembershipReferendaProvider({ children }) {
  const address = useRealAddress();
  const { relatedReferenda: myMembershipReferenda, isLoading } =
    useRelatedReferenda(address, methods);

  return (
    <MyMembershipReferendaContext.Provider
      value={{ myMembershipReferenda, isLoading }}
    >
      {children}
    </MyMembershipReferendaContext.Provider>
  );
}

export function useContextMyMembershipReferenda() {
  return useContext(MyMembershipReferendaContext);
}
