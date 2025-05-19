import { isNil, upperFirst } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { useFellowshipMemberRank } from "next-common/hooks/fellowship/useFellowshipMemberRank";
import { CommonTag } from "../tags/state/styled";
import { getRankColor } from "next-common/utils/fellowship/getRankColor";

function FellowshipTagInfoImpl({ address, pallet, type }) {
  const rank = useFellowshipMemberRank(address, pallet);

  if (isNil(rank)) {
    return null;
  }

  return (
    <CommonTag
      className="py-1"
      style={{
        color: getRankColor(rank),
        backgroundColor: getRankColor(rank, 0.1),
      }}
    >
      {upperFirst(type)} #{rank}
    </CommonTag>
  );
}

export default function FellowshipTagInfo({
  address,
  pallet = "fellowshipCollective",
  type = "fellowship",
}) {
  const { modules } = useChainSettings();
  if (!modules[type]) {
    return null;
  }

  return (
    <FellowshipTagInfoImpl address={address} pallet={pallet} type={type} />
  );
}
