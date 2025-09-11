import ListLayout from "next-common/components/layout/ListLayout";
import PreImagesList from "next-common/components/preImages/preImagesList";
import PreImagesFooter from "next-common/components/preImages/footer";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

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
      <PreImagesList />
    </ListLayout>
  );
}

export const getServerSideProps = serverSidePropsWithSummary;
