import { Title } from "./styled";
import ResponsiveVotes from "./responsiveVotes";
// import RemoveAllExpiredButton from "./removeAllExpiredButton";

export default function MyVotesList({ votes }) {
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
          />
        </div> */}
      </div>
      <ResponsiveVotes votes={votes} />
    </>
  );
}
