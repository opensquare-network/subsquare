import FellowshipRank from "next-common/components/fellowship/rank";
import FellowshipEvidenceContent from "../../evidenceContent";
import Avatar from "next-common/components/avatar";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import AddressUser from "next-common/components/user/addressUser";
import EvidenceVoteBar from "./evidenctVoteBar";

export default function EvidenceContent({ address, rank, wish, evidence }) {
  const { section } = useCollectivesContext();
  return (
    <>
      <section className="flex-1 flex-grow-[2] flex-shrink-0 sm:min-w-[418px] flex flex-col ">
        <section className="flex-1 sm:overflow-y-auto space-y-4 p-6">
          <div className="max-w-[826px] mx-auto">
            <header className="p-2.5 bg-neutral200 flex justify-center items-center text14Medium space-x-1">
              <Avatar address={address} size={20} />
              <AddressUser
                add={address}
                showAvatar={false}
                className="text14Medium text-textPrimary [&_.identity]:!font-semibold pl-1"
                link={`/${section}`}
              />
              <span className="text-textSecondary">
                wishes to retain at rank
              </span>
              <FellowshipRank rank={rank} />
            </header>
            <FellowshipEvidenceContent wish={wish} evidence={evidence} />
          </div>
        </section>
        <div className="hidden sm:block p-6 pt-4 relative bottom-0 bg-neutral100 w-full border-neutral300 border-t z-[1]">
          <div className="max-w-[826px] mx-auto">
            <EvidenceVoteBar address={address} wish={wish} />
          </div>
        </div>
      </section>
    </>
  );
}
