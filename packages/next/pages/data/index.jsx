import Data from "next-common/components/data";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide/serverSidePropsWithTracks";

export default function DataPage() {
  return <Data />;
}

export const getServerSideProps = getServerSidePropsWithTracks;
