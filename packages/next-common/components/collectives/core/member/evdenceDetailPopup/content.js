import FellowshipRank from "next-common/components/fellowship/rank";
import FellowshipEvidenceContent from "../../evidenceContent";
import Avatar from "next-common/components/avatar";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import AddressUser from "next-common/components/user/addressUser";
import { VoteBar } from "next-common/components/pages/fellowship/member/fellowshipMember/wishDetail";
import Divider from "next-common/components/styled/layout/divider";

export default function EvidenceContent({ address, rank, wish, evidence }) {
  const { section } = useCollectivesContext();
  return (
    <>
      <div className="max-w-[826px] mx-auto  space-y-4">
        <header className="p-2.5 bg-neutral200 flex justify-center items-center text14Medium space-x-1">
          <Avatar address={address} size={20} />
          <AddressUser
            add={address}
            showAvatar={false}
            className="text14Medium text-textPrimary [&_.identity]:!font-semibold pl-1"
            link={`/${section}`}
          />
          <span className="text-textSecondary">wishes to retain at rank</span>
          <FellowshipRank rank={rank} />
        </header>
        <VoteBar address={address} wish={wish} />
        <Divider />
        <FellowshipEvidenceContent wish={wish} evidence={evidence} />
      </div>
    </>
  );
}
