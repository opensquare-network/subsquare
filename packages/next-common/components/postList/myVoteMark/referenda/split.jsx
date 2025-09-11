import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import {
  Conviction,
  convictionToLockXNumber,
} from "next-common/utils/referendumCommon";
import ValueDisplay from "../../../valueDisplay";
import PostListMyVoteMarkTemplate from "../template";

export default function PostListMyReferendaSplitVoteMark({ vote }) {
  const { decimals, symbol } = useChainSettings();
  const conviction = convictionToLockXNumber(Conviction.None);

  const items = [
    {
      label: "Vote",
      value: vote.isSplitAbstain ? "SplitAbstain" : "Split",
    },
    {
      label: "Aye",
      value: (
        <ValueDisplay
          value={toPrecision(
            BigNumber(vote.ayeBalance).times(conviction),
            decimals,
          )}
          symbol={symbol}
        />
      ),
    },
    {
      label: "Nay",
      value: (
        <ValueDisplay
          value={toPrecision(
            BigNumber(vote.nayBalance).times(conviction),
            decimals,
          )}
          symbol={symbol}
        />
      ),
    },
    !isNil(vote.abstainBalance) && {
      label: "Abstain",
      value: (
        <ValueDisplay
          value={toPrecision(
            BigNumber(vote.abstainBalance).times(conviction),
            decimals,
          )}
          symbol={symbol}
        />
      ),
    },
  ];

  return (
    <PostListMyVoteMarkTemplate
      items={items}
      isSplit={vote.isSplit}
      isSplitAbstain={vote.isSplitAbstain}
    />
  );
}
