import ListLayout from "next-common/components/layout/ListLayout";
import PreImagesList from "next-common/components/preImages/preImagesList";
import usePreimageHashs from "next-common/hooks/usePreimageHashs";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import PreImagesFooter from "next-common/components/preImages/footer";

export default function PreimagesPage() {
  const title = "Preimages";
  const seoInfo = { title, desc: title };

  const hashs = usePreimageHashs();

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description="Preimage can be submitted and stored on-chain against the hash later, upon the proposal's dispatch."
      summaryFooter={<PreImagesFooter />}
    >
      <PreImagesList data={hashs} />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
