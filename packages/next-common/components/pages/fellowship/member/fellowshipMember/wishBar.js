import FellowshipRank from "next-common/components/fellowship/rank";
import { AddressUser } from "next-common/components/user";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";

export function WishBar({ wish, activeMember, address }) {
  if (!["Promotion", "Retention"].includes(wish)) {
    return null;
  }

  return (
    <GreyPanel className="px-4 py-[0.675rem] flex items-center justify-center">
      <AddressUser add={address} />
      {"Promotion" === wish ? (
        <span className="text14Medium text-textSecondary inline-block mx-2 whitespace-nowrap">
          wishes to get promoted
        </span>
      ) : (
        <>
          <span className="text14Medium text-textSecondary inline-block mx-2 whitespace-nowrap">
            wishes to retain at rank
          </span>
          <FellowshipRank rank={activeMember?.rank} />
        </>
      )}
    </GreyPanel>
  );
}
