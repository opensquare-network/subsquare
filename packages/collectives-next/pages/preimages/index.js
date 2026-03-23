import ListLayout from "next-common/components/layout/ListLayout";
import PreImagesList from "next-common/components/preImages/preImagesList";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import PreImagesFooter from "next-common/components/preImages/footer";
import { PapiProvider } from "next-common/context/papi";

export default function PreimagesPage() {
  const title = "Preimages";
  const seoInfo = { title, desc: title };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description="Preimage can be submitted and stored on-chain against the hash later, upon the proposal's dispatch."
      summaryFooter={<PreImagesFooter />}
    >
      <PapiProvider>
        <PreImagesList />
      </PapiProvider>
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
