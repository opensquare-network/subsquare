import { createStateContext } from "react-use";
import { usePageProps } from "next-common/context/page";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useEffect } from "react";

const [useCoretimeStatus, Provider] = createStateContext({});

function DataUpdater({ children }) {
  const [, setStatus] = useCoretimeStatus();
  const { result: option } = useSubStorage("broker", "status");

  useEffect(() => {
    if (option?.isSome) {
      setStatus(option.unwrap().toJSON());
    }
  }, [option]);

  return children;
}

export function CoretimeStatusProvider({ children }) {
  const { status } = usePageProps();
  return (
    <Provider initialValue={status}>
      <DataUpdater>
        {children}
      </DataUpdater>
    </Provider>
  );
}
