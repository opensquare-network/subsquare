import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";

export const CoreMembersContext = createContext({});

function useFellowshipCoreMembers() {
  const api = useContextApi();
  const corePallet = useCoreFellowshipPallet();
  const [trigger, setTrigger] = useState(0);
  const fetch = useCallback(() => setTrigger((prev) => prev + 1), []);
  const { value: coreEntries, loaded } = useCall(
    api?.query[corePallet]?.member?.entries,
    [],
    { trigger },
  );
  const members = useMemo(
    () =>
      (coreEntries || []).map(([storageKey, memberStatus]) => {
        const address = storageKey.args[0].toString();
        return {
          address,
          status: memberStatus.toJSON(),
        };
      }),
    [coreEntries],
  );

  return { members, fetch, isLoading: !loaded };
}

export default function CoreMembersProvider({ children }) {
  const { members, isLoading, fetch } = useFellowshipCoreMembers();

  return (
    <CoreMembersContext.Provider
      value={{
        members,
        isLoading,
        fetch,
      }}
    >
      {children}
    </CoreMembersContext.Provider>
  );
}

export function useContextCoreMembers() {
  return useContext(CoreMembersContext);
}
