import { IpfsEvidenceRawContent } from "next-common/components/collectives/core/evidenceContent";
import EvidenceLayout from "next-common/components/layout/evidenceLayout";
import PageProvider, { usePageProperties } from "next-common/context/page";
import { WishBar } from "./fellowshipMember/wishBar";

export default function EvidencePage(props) {
  return (
    <PageProvider pageProperties={props}>
      <EvidenceLayout
        seoInfo={{
          title: props.detail?.title,
          desc: props.detail?.title,
        }}
      >
        <EvidencePageImpl />
      </EvidenceLayout>
    </PageProvider>
  );
}

function EvidencePageImpl() {
  const { detail, fellowshipMembers = [] } = usePageProperties() || {};

  if (!detail) {
    return null;
  }

  const activeMember = fellowshipMembers.find(
    (member) => member.address === detail.who,
  );

  return (
    <div className="flex flex-col gap-y-6">
      <WishBar
        wish={detail.wish}
        activeMember={activeMember}
        address={detail.who}
      />
      <IpfsEvidenceRawContent value={detail.content} />
    </div>
  );
}
