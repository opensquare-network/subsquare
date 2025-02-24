import { omit } from "lodash-es";
import { useRouter } from "next/router";
import { createContext, useCallback, useContext } from "react";

const UnVotedOnlyContext = createContext();

export default UnVotedOnlyContext;

export function UnVotedOnlyProvider({ children }) {
  const router = useRouter();
  const unVotedOnly = router.query.unvoted === "true";

  const setUnVotedOnly = useCallback(
    (isOn) => {
      router.push(
        {
          query: isOn
            ? {
                ...router.query,
                unvoted: "true",
              }
            : omit(router.query, ["unvoted"]),
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  return (
    <UnVotedOnlyContext.Provider value={{ unVotedOnly, setUnVotedOnly }}>
      {children}
    </UnVotedOnlyContext.Provider>
  );
}

export function useUnVotedOnlyContext() {
  return useContext(UnVotedOnlyContext);
}
