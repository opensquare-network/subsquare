import { getServerSidePropsWithTracks } from "next-common/services/serverSide/serverSidePropsWithTracks";
import { DataProxies } from "next-common/components/data";
import DataTabsProvider from "next-common/components/data/context/tabs";

export default function ProxiesPage() {
  return (
    <DataTabsProvider>
      <DataProxies />
    </DataTabsProvider>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
