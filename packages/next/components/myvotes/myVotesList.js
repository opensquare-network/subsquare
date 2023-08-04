import { Title } from "./styled";
import OpenGovVotes from "./openGovVotes";
import DemocracyVotes from "./democracyVotes";
import { Referenda } from "next-common/components/profile/votingHistory/common";
// import RemoveAllExpiredButton from "./removeAllExpiredButton";

export default function MyVotesList({ votes, moduleTabIndex }) {
  return (
    <>
      <div className="flex justify-between md:items-center max-md:flex-col gap-[12px]">
        <div className="flex gap-[8px]">
          <Title>On-chain Votes</Title>
          <span className="text-textTertiary">{votes?.length || 0}</span>
        </div>
        {/* <div>
          <RemoveAllExpiredButton
            votes={votes}
            isGov2={moduleTabIndex === Referenda}
          />
        </div> */}
      </div>
      {moduleTabIndex === Referenda ? (
        <OpenGovVotes votes={votes} />
      ) : (
        <DemocracyVotes votes={votes} />
      )}
    </>
  );
}
