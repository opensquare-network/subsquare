import ListLayout from "next-common/components/layout/ListLayout";
import PreImagesList from "next-common/components/preImages/preImagesList";
import usePreimageHashes from "next-common/hooks/usePreimageHashes";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import PreImagesFooter from "next-common/components/preImages/footer";

export default function PreimagesPage() {
  const title = "Preimages";
  const seoInfo = { title, desc: title };

  const hashes = usePreimageHashes();

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description="Preimage can be submitted and stored on-chain against the hash later, upon the proposal's dispatch."
      summaryFooter={<PreImagesFooter />}
    >
      <PreImagesList data={hashes} />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
