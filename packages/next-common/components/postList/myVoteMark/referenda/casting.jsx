import BigNumber from "bignumber.js";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";
import ValueDisplay from "../../../valueDisplay";
import PostListMyVoteMarkTemplate from "../template";

export default function PostListMyReferendaStandardCastingVoteMark({
  vote,
  delegations,
}) {
  const { decimals, symbol } = useChainSettings();

  const conviction = convictionToLockXNumber(vote.conviction);
  const selfTotal = BigNumber(vote.balance).times(conviction).toString();
  const delegationsVotes = delegations?.votes || 0;
  const total = BigNumber.sum(delegationsVotes, selfTotal).toString();

  const items = [
    {
      label: "Vote",
      value: `${vote?.aye === false ? "Nay" : "Aye"}`,
    },
    {
      label: "Total",
      value: (
        <ValueDisplay value={toPrecision(total, decimals)} symbol={symbol} />
      ),
    },
    {
      label: "Self",
      value: (
        <>
          <ValueDisplay
            value={toPrecision(selfTotal, decimals)}
            symbol={symbol}
          />
          (
          <ValueDisplay
            value={toPrecision(vote.balance, decimals)}
            symbol={symbol}
          />
          *{conviction}x)
        </>
      ),
    },
    {
      label: "Delegations",
      value: (
        <ValueDisplay
          value={toPrecision(delegationsVotes, decimals)}
          symbol={symbol}
        />
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
