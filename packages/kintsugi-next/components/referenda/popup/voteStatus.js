import VoteStatusBox from "next-common/components/popup/voteStatusBox";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useDecimals, useVoteSymbol } from "next-common/context/chain";

export default function VoteStatus({ addressVote }) {
  const decimals = useDecimals();
  const voteSymbol = useVoteSymbol();
  return (
    <VoteStatusBox aye={addressVote?.aye}>
      <ValueDisplay
        value={toPrecision(addressVote?.balance, decimals)}
        symbol={voteSymbol}
      />
    </VoteStatusBox>
  );
}
