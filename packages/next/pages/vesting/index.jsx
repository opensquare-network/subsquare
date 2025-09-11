import { getServerSidePropsWithTracks } from "next-common/services/serverSide/serverSidePropsWithTracks";
import { DataVesting } from "next-common/components/data";
import DataTabsProvider from "next-common/components/data/context/tabs";

export default function VestingPage() {
  return (
    <DataTabsProvider>
      <DataVesting />
    </DataTabsProvider>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
