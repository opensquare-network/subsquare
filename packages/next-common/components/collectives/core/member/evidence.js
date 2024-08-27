import FieldLoading from "next-common/components/icons/fieldLoading";
import Tooltip from "next-common/components/tooltip";
import CoreFellowshipMemberInfoWrapper from "next-common/components/collectives/core/member/infoWrapper";
import CoreFellowshipMemberInfoTitle from "next-common/components/collectives/core/member/title";
import useSubCoreFellowshipEvidence from "next-common/hooks/collectives/useSubCoreFellowshipEvidence";
import { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import AvatarAndAddress from "./avatarAndAddress";
import FellowshipRank from "next-common/components/fellowship/rank";
import FellowshipEvidenceContent from "../evidenceContent";

export default function CoreFellowshipMemberEvidence({
  member,
  pallet = "fellowshipCore",
}) {
  const { address, rank } = member || {};
  const { isActive } = member?.status || {};

  const [detailOpen, setDetailOpen] = useState(false);

  const { loading, wish, evidence } = useSubCoreFellowshipEvidence(
    address,
    pallet,
  );

  let content = <span className="text-textTertiary">-</span>;

  if (loading) {
    content = <FieldLoading size={16} />;
  } else if (evidence) {
    content = (
      <div className="flex gap-[8px]">
        <Tooltip content="Wish">
          <span className="text-textPrimary capitalize">{wish}</span>
        </Tooltip>
        <span
          role="button"
          className="text-theme500"
          onClick={() => {
            setDetailOpen(true);
          }}
        >
          View Detail
        </span>
      </div>
    );
  }

  return (
    <>
      <CoreFellowshipMemberInfoWrapper>
        <CoreFellowshipMemberInfoTitle className="mb-0.5">
          Evidence
        </CoreFellowshipMemberInfoTitle>
        <div className="flex text12Medium">{content}</div>
      </CoreFellowshipMemberInfoWrapper>

      {detailOpen && (
        <Popup
          title="Evidence Detail"
          className="w-[800px] max-w-full"
          onClose={() => {
            setDetailOpen(false);
          }}
        >
          <div>
            <div className="mt-3">
              <div className="flex justify-between">
                <AvatarAndAddress address={address} isActive={isActive} />
                <FellowshipRank rank={rank} />
              </div>
            </div>
          </div>

          <hr />

          <FellowshipEvidenceContent wish={wish} evidence={evidence} />
        </Popup>
      )}
    </>
  );
}
