import { getServerSidePropsWithTracks } from "next-common/services/serverSide/serverSidePropsWithTracks";
import { DataRecovery } from "next-common/components/data";
import DataTabsProvider from "next-common/components/data/context/tabs";

export default function RecoveryPage() {
  return (
    <DataTabsProvider>
      <DataRecovery />
    </DataTabsProvider>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
