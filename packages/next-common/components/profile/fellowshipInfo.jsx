import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { useFellowshipMemberRank } from "next-common/hooks/fellowship/useFellowshipMemberRank";
import { CommonTag } from "../tags/state/styled";
import { getRankColor } from "next-common/utils/fellowship/getRankColor";

function FellowshipInfoImpl({ address }) {
  const fellowshipRank = useFellowshipMemberRank(address);

  if (isNil(fellowshipRank)) {
    return null;
  }

  return (
    <div className="flex items-center my-2">
      <CommonTag
        className="py-1"
        style={{
          color: getRankColor(fellowshipRank),
          backgroundColor: getRankColor(fellowshipRank, 0.1),
        }}
      >
        Fellowship #{fellowshipRank}
      </CommonTag>
    </div>
  );
}

export default function FellowshipInfo({ address }) {
  const { modules } = useChainSettings();
  if (!modules.fellowship) {
    return null;
  }

  return <FellowshipInfoImpl address={address} />;
}
