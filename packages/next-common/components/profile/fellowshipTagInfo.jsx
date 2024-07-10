import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { useFellowshipMemberRank } from "next-common/hooks/fellowship/useFellowshipMemberRank";
import { CommonTag } from "../tags/state/styled";
import { getRankColor } from "next-common/utils/fellowship/getRankColor";

function FellowshipTagInfoImpl({ address }) {
  const rank = useFellowshipMemberRank(address);

  if (isNil(rank)) {
    return null;
  }

  return (
    <div className="flex items-center my-2">
      <CommonTag
        className="py-1"
        style={{
          color: getRankColor(rank),
          backgroundColor: getRankColor(rank, 0.1),
        }}
      >
        Fellowship #{rank}
      </CommonTag>
    </div>
  );
}

export default function FellowshipTagInfo({ address }) {
  const { modules } = useChainSettings();
  if (!modules.fellowship) {
    return null;
  }

  return <FellowshipTagInfoImpl address={address} />;
}
