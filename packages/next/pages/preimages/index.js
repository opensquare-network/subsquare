import ListLayout from "next-common/components/layout/ListLayout";
import PreImagesListFromServer from "next-common/components/preImages/preImagesFromServer";
import PreImagesList from "next-common/components/preImages/preImagesList";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import PreImagesFooter from "next-common/components/preImages/footer";
import { PapiProvider } from "next-common/context/papi";
import { useChainSettings } from "next-common/context/chain";
import { hasPreimagesGraphQL } from "next-common/utils/env/preimage";

export default function PreimagesPage() {
  const title = "Preimages";
  const seoInfo = { title, desc: title };
  const { enablePapi } = useChainSettings();
  const content = hasPreimagesGraphQL() ? (
    <PreImagesListFromServer />
  ) : (
    <PreImagesList />
  );

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description="Preimage can be submitted and stored on-chain against the hash later, upon the proposal's dispatch."
      summaryFooter={<PreImagesFooter />}
    >
      {enablePapi ? <PapiProvider>{content}</PapiProvider> : content}
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
