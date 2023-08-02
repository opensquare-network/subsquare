import { Title } from "./styled";
import OpenGovVotes from "./openGovVotes";

export default function MyVotesList({ votes }) {
  return (
    <>
      <div className="flex justify-between md:items-center max-md:flex-col gap-[12px]">
        <Title>On-chain Votes</Title>
      </div>
      <OpenGovVotes votes={votes} />
    </>
  );
}
