import { Title } from "./styled";
import OpenGovVotes from "./openGovVotes";
import DemocracyVotes from "./democracyVotes";
import { OpenGov } from "next-common/components/profile/votingHistory/common";

export default function MyVotesList({ votes, moduleTabIndex }) {
  return (
    <>
      <div className="flex justify-between md:items-center max-md:flex-col gap-[12px]">
        <Title>On-chain Votes</Title>
      </div>
      {moduleTabIndex === OpenGov ? (
        <OpenGovVotes votes={votes} />
      ) : (
        <DemocracyVotes votes={votes} />
      )}
    </>
  );
}
