import ListLayout from "next-common/components/layout/ListLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import Whitelist from "next-common/components/whitelist";

export default function PreimagesPage() {
  const title = "Whitelist";
  const seoInfo = { title, desc: title };

  return (
    <ListLayout seoInfo={seoInfo} title={title} description="Whitelisted calls">
      <Whitelist />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
