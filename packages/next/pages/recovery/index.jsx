import { getServerSidePropsWithTracks } from "next-common/services/serverSide/serverSidePropsWithTracks";
import { DataRecovery } from "next-common/components/data";
import DataTabsProvider from "next-common/components/data/context/tabs";
import { RelayChainApiProvider } from "next-common/context/relayChain";

export default function RecoveryPage() {
  return (
    <RelayChainApiProvider>
      <DataTabsProvider>
        <DataRecovery />
      </DataTabsProvider>
    </RelayChainApiProvider>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
