import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { CommonTag } from "../tags/state/styled";
import { getRankColor } from "next-common/utils/fellowship/getRankColor";
import { useAmbassadorMemberRank } from "next-common/hooks/ambassador/useAmbassadorMemberRank";

function AmbassadorTagInfoImpl({ address }) {
  const ambassadorRank = useAmbassadorMemberRank(address);

  if (isNil(ambassadorRank)) {
    return null;
  }

  return (
    <div className="flex items-center my-2">
      <CommonTag
        className="py-1"
        style={{
          color: getRankColor(ambassadorRank),
          backgroundColor: getRankColor(ambassadorRank, 0.1),
        }}
      >
        Ambassador #{ambassadorRank}
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
