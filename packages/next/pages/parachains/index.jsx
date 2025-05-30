import { getServerSidePropsWithTracks } from "next-common/services/serverSide/serverSidePropsWithTracks";
import { DataParachain } from "next-common/components/data";
import DataTabsProvider from "next-common/components/data/context/tabs";

export default function ParachainPage() {
  return (
    <DataTabsProvider>
      <DataParachain />
    </DataTabsProvider>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
