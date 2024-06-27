import FieldLoading from "next-common/components/icons/fieldLoading";
import FellowshipMemberInfoTitle from "./title";
import { textEllipsis } from "next-common/utils";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import { create as createDigest } from "multiformats/hashes/digest";
import { CID } from "multiformats";
import { hexToU8a } from "@polkadot/util";
import Tooltip from "next-common/components/tooltip";
import { useSubFellowshipCoreMemberEvidence } from "next-common/hooks/fellowship/core/useSubFellowshipCoreMemberEvidence";
import CoreFellowshipMemberInfoWrapper from "next-common/components/collectives/core/member/infoWrapper";

export default function FellowshipCoreMemberEvidence({ address }) {
  const { loading, wish, evidence } =
    useSubFellowshipCoreMemberEvidence(address);

  let content = <span className="text-textTertiary">-</span>;

  if (loading) {
    content = <FieldLoading size={16} />;
  } else if (evidence) {
    const SHA_256_CODE = 0x12;
    const cid = CID.createV0(createDigest(SHA_256_CODE, hexToU8a(evidence)))
      .toV1()
      .toString();
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
      <FellowshipMemberInfoTitle>Evidence</FellowshipMemberInfoTitle>
      <div className="flex text12Medium">{content}</div>
    </CoreFellowshipMemberInfoWrapper>
  );
}
