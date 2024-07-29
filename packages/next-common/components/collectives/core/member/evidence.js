import FieldLoading from "next-common/components/icons/fieldLoading";
import { textEllipsis } from "next-common/utils";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import Tooltip from "next-common/components/tooltip";
import CoreFellowshipMemberInfoWrapper from "next-common/components/collectives/core/member/infoWrapper";
import CoreFellowshipMemberInfoTitle from "next-common/components/collectives/core/member/title";
import useSubCoreFellowshipEvidence from "next-common/hooks/collectives/useSubCoreFellowshipEvidence";
import { getCidByEvidence } from "next-common/utils/collective/getCidByEvidence";

export default function CoreFellowshipMemberEvidence({
  address,
  pallet = "fellowshipCore",
}) {
  const { loading, wish, evidence } = useSubCoreFellowshipEvidence(
    address,
    pallet,
  );

  let content = <span className="text-textTertiary">-</span>;

  if (loading) {
    content = <FieldLoading size={16} />;
  } else if (evidence) {
    const cid = getCidByEvidence(evidence);
    content = (
      <div className="flex gap-[8px]">
        <Tooltip content="Wish">
          <span className="text-textPrimary capitalize">{wish}</span>
        </Tooltip>
        <a
          className="cursor-pointer text-sapphire500"
          target="_blank"
          rel="noreferrer"
          href={getIpfsLink(cid)}
        >
          {textEllipsis(cid, 4, 4)}
        </a>
      </div>
    );
  }

  return (
    <CoreFellowshipMemberInfoWrapper>
      <CoreFellowshipMemberInfoTitle className="mb-0.5">
        Evidence
      </CoreFellowshipMemberInfoTitle>
      <div className="flex text12Medium">{content}</div>
    </CoreFellowshipMemberInfoWrapper>
  );
}
