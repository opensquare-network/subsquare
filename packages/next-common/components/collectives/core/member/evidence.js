import FieldLoading from "next-common/components/icons/fieldLoading";
import Tooltip from "next-common/components/tooltip";
import CoreFellowshipMemberInfoWrapper from "next-common/components/collectives/core/member/infoWrapper";
import CoreFellowshipMemberInfoTitle from "next-common/components/collectives/core/member/title";
import useSubCoreFellowshipEvidence from "next-common/hooks/collectives/useSubCoreFellowshipEvidence";
import { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import FellowshipRank from "next-common/components/fellowship/rank";
import FellowshipEvidenceContent from "../evidenceContent";
import Avatar from "next-common/components/avatar";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import AddressUser from "next-common/components/user/addressUser";
import CommentEditor from "next-common/components/comment/editor";
import Divider from "next-common/components/styled/layout/divider";

export function CoreFellowshipMemberEvidenceContent({
  member,
  isLoading,
  wish,
  evidence,
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  const { address, rank } = member || {};
  const { isActive } = member?.status || {};

  let content = <span className="text-textTertiary">-</span>;

  if (isLoading) {
    content = <FieldLoading size={16} />;
  } else if (evidence) {
    content = (
      <>
        <Tooltip content="Wish">
          <span className="text-textPrimary capitalize">{wish}</span>
        </Tooltip>
        <span
          role="button"
          className="text-theme500 text12Medium inline-flex items-center"
          onClick={() => {
            setDetailOpen(true);
          }}
        >
          Evidence
        </span>
      </>
    );
  }

  return (
    <>
      {content}
      {detailOpen && (
        <EvidenceDetailPopup
          address={address}
          rank={rank}
          isActive={isActive}
          wish={wish}
          evidence={evidence}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  );
}

export default function EvidenceDetailPopup({
  address,
  rank,
  wish,
  evidence,
  onClose,
}) {
  return (
    <Popup
      title={"Evidence Detail"}
      className="h-full w-full !m-0 space-y-0 p-0 !rounded-none flex flex-col !shadow-none !border-none"
      headerClass="p-6 border-b border-neutral300"
      onClose={onClose}
    >
      <main className=" w-full h-full overflow-y-auto md:overflow-y-hidden  flex flex-col sm:flex-row ">
        <section className="flex-1 flex-grow-[2] flex-shrink-0 md:min-w-[418px] p-6  sm:overflow-y-auto">
          <div className="max-w-[826px] mx-auto ">
            <EvidenceContent
              address={address}
              rank={rank}
              wish={wish}
              evidence={evidence}
            />
          </div>
        </section>
        <Divider className="hidden sm:block !h-full w-[1px]" />
        <aside className="flex-1 flex-shrink-0 md:min-w-[470px] sm:overflow-y-auto p-6 ">
          <div className="max-w-[910px] mx-auto flex flex-col">
            <h2 className="text14Bold text-textPrimary">Discussion</h2>
            <div className="h-[600px] flex-shrink-0 pt-6">sdsdsds</div>
            <CommentEditor />
          </div>
        </aside>
      </main>
    </Popup>
  );
}

const EvidenceContent = ({ address, rank, wish, evidence }) => {
  const { section } = useCollectivesContext();
  return (
    <>
      <header className="p-2.5 bg-neutral200 mb-4 flex justify-center items-center text14Medium space-x-1">
        <Avatar address={address} size={20} />
        <AddressUser
          add={address}
          showAvatar={false}
          className="text14Medium text-textPrimary [&_.identity]:!font-semibold pl-1"
          link={`/${section}`}
        />
        <span className="text-textSecondary">wishes to retain at rank</span>
        <FellowshipRank rank={rank} />
      </header>
      <FellowshipEvidenceContent wish={wish} evidence={evidence} />
    </>
  );
};

export function CoreFellowshipMemberEvidence({
  member,
  pallet = "fellowshipCore",
}) {
  const { address } = member || {};
  const { loading, wish, evidence } = useSubCoreFellowshipEvidence(
    address,
    pallet,
  );

  return (
    <>
      <CoreFellowshipMemberInfoWrapper>
        <CoreFellowshipMemberInfoTitle className="mb-0.5">
          Wish
        </CoreFellowshipMemberInfoTitle>
        <div className="flex text12Medium gap-[8px]">
          <CoreFellowshipMemberEvidenceContent
            member={member}
            isLoading={loading}
            wish={wish}
            evidence={evidence}
          />
        </div>
      </CoreFellowshipMemberInfoWrapper>
    </>
  );
}
