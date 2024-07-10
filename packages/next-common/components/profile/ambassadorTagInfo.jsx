import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { CommonTag } from "../tags/state/styled";
import { getRankColor } from "next-common/utils/fellowship/getRankColor";
import { useFellowshipMemberRank } from "next-common/hooks/fellowship/useFellowshipMemberRank";

function AmbassadorTagInfoImpl({ address }) {
  const rank = useFellowshipMemberRank(address, "ambassadorCollective");

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
        Ambassador #{rank}
      </CommonTag>
    </div>
  );
}

export default function AmbassadorTagInfo({ address }) {
  const { modules } = useChainSettings();
  if (!modules.ambassador) {
    return null;
  }

  return <AmbassadorTagInfoImpl address={address} />;
}
