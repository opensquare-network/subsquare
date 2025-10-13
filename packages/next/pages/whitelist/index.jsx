import ListLayout from "next-common/components/layout/ListLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import Whitelist from "next-common/components/whiteList";

export default function PreimagesPage() {
  const title = "Whitelist";
  const seoInfo = { title, desc: title };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={
        'Polkadot OpenGov allows the Technical Fellowship to authorize an origin known as "Whitelisted-Caller" to execute with Root-level privileges for calls approved by the Fellowship (currently only level-three fellows and above can vote for whitelist calls). Note that the fellowship cannot unanimously change the network parameters, conduct rescues or move assets. The whitelisted proposals still have to go through the whole life cycle of an OpenGov referendum and can only be enacted when the referendum passes successfully.'
      }
    >
      <Whitelist />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
