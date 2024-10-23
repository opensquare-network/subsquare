import { createStateContext } from "react-use";
import { usePageProps } from "next-common/context/page";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useEffect } from "react";

const [useCoretimeConfiguration, Provider] = createStateContext({});

function DataUpdater({ children }) {
  const [, setConfiguration] = useCoretimeConfiguration();
  const { result: option } = useSubStorage("broker", "configuration");

  useEffect(() => {
    if (option?.isSome) {
      setConfiguration(option.unwrap().toJSON());
    }
  }, [option]);

  return children;
}

export function CoretimeConfigurationProvider({ children }) {
  const { configuration } = usePageProps();

  return (
    <Provider initialValue={configuration}>
      <DataUpdater>
        {children}
      </DataUpdater>
    </Provider>
  );
}
