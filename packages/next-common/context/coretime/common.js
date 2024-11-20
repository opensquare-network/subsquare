import { CoretimeConfigurationProvider } from "next-common/context/coretime/configuration";
import { CoretimeStatusProvider } from "next-common/context/coretime/status";

export default function CoretimeCommonProvider({ children }) {
  return (
    <CoretimeConfigurationProvider>
      <CoretimeStatusProvider>
        {children}
      </CoretimeStatusProvider>
    </CoretimeConfigurationProvider>
  );
}
