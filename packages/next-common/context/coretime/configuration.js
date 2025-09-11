import { createStateContext } from "react-use";
import { usePageProps } from "next-common/context/page";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useEffect } from "react";

const [useSharedCoretimeConfiguration, Provider] = createStateContext({});

function DataUpdater({ children }) {
  const [, setConfiguration] = useSharedCoretimeConfiguration();
  const { result: option } = useSubStorage("broker", "configuration");

  useEffect(() => {
    if (option?.isSome) {
      setConfiguration(option.unwrap().toJSON());
    }
  }, [option, setConfiguration]);

  return children;
}

export function CoretimeConfigurationProvider({ children }) {
  const { coretimeSale } = usePageProps();

  return (
    <Provider initialValue={coretimeSale?.configuration}>
      <DataUpdater>{children}</DataUpdater>
    </Provider>
  );
}

export default function useCoretimeConfiguration() {
  const [configuration] = useSharedCoretimeConfiguration();
  return configuration;
}
