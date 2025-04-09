import { getServerSidePropsWithTracks } from "next-common/services/serverSide/serverSidePropsWithTracks";
import { DataMultisig } from "next-common/components/data";
import DataTabsProvider from "next-common/components/data/context/tabs";

export default function MultisigPage() {
  return (
    <DataTabsProvider>
      <DataMultisig />
    </DataTabsProvider>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
