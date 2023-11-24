import ListLayout from "next-common/components/layout/ListLayout";
import PreImagesList from "next-common/components/preImages/preImagesList";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";

export default function PreimagesPage() {
  const title = "Preimages";
  const seoInfo = { title, desc: title };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description="Preimage can be submitted and stored on-chain against the hash later, upon the proposal's dispatch."
    >
      <PreImagesList />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
