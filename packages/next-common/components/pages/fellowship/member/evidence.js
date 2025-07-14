import { IpfsEvidenceContent } from "next-common/components/collectives/core/evidenceContent";
import EvidenceLayout from "next-common/components/layout/evidenceLayout";
import PageProvider, { usePageProperties } from "next-common/context/page";

export default function EvidencePage(props) {
  return (
    <PageProvider pageProperties={props}>
      <EvidenceLayout>
        <EvidencePageImpl />
      </EvidenceLayout>
    </PageProvider>
  );
}

function EvidencePageImpl() {
  const pageProps = usePageProperties();

  if (pageProps.cid) {
    return <EvidenceCid cid={pageProps.cid} />;
  }

  return <div>123123</div>;
}

function EvidenceCid({ cid }) {
  return <IpfsEvidenceContent cid={cid} />;
}
