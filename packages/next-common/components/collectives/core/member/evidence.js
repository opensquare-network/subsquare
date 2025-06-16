import FieldLoading from "next-common/components/icons/fieldLoading";
import Tooltip from "next-common/components/tooltip";
import CoreFellowshipMemberInfoWrapper from "next-common/components/collectives/core/member/infoWrapper";
import CoreFellowshipMemberInfoTitle from "next-common/components/collectives/core/member/title";
import useSubCoreFellowshipEvidence from "next-common/hooks/collectives/useSubCoreFellowshipEvidence";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const EvidenceDetailPopup = dynamicPopup(() => import("./evidenceDetailPopup"));
export default EvidenceDetailPopup;

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
