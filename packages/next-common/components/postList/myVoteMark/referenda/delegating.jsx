import BigNumber from "bignumber.js";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";
import ValueDisplay from "../../../valueDisplay";
import PostListMyVoteMarkTemplate from "../template";

export default function PostListMyReferendaStandardDelegatingVoteMark({
  vote,
}) {
  const { decimals, symbol } = useChainSettings();

  const conviction = convictionToLockXNumber(vote.conviction);
  const votes = BigNumber(vote.balance).times(conviction).toString();

  const items = [
    {
      label: "Vote",
      value: `${vote?.aye === false ? "Nay" : "Aye"}(Delegated)`,
    },
    {
      label: "Votes",
      value: (
        <>
          <ValueDisplay value={toPrecision(votes, decimals)} symbol={symbol} />
          (
          <ValueDisplay
            value={toPrecision(vote.balance, decimals)}
            symbol={symbol}
          />
          *{conviction}x)
        </>
      ),
    },
  ];

  return (
    <PostListMyVoteMarkTemplate
      items={items}
      isAye={vote.aye === true}
      isNay={vote.aye === false}
    />
  );
}
