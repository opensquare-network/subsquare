import ListLayout from "next-common/components/layout/ListLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import Whitelist from "next-common/components/whitelist";
import { RelayChainApiProvider } from "next-common/context/relayChain";

export default function PreimagesPage() {
  const title = "Whitelist";
  const seoInfo = { title, desc: title };

  return (
    <ListLayout seoInfo={seoInfo} title={title} description="Whitelisted calls">
      <RelayChainApiProvider>
        <Whitelist />
      </RelayChainApiProvider>
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
