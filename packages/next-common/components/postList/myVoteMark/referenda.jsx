// packages/next-common/components/myvotes/referenda/normalizeVote.js
// packages/next-common/components/myvotes/democracy/normalize.js

import BigNumber from "bignumber.js";
import { find, isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import {
  myReferendaDelegationsSelector,
  myReferendaVotingSelector,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { toPrecision } from "next-common/utils";
import {
  Conviction,
  convictionToLockXNumber,
} from "next-common/utils/referendumCommon";
import { useSelector } from "react-redux";
import ValueDisplay from "../../valueDisplay";
import PostListMyVoteMarkTemplate from "./template";

export default function PostListMyReferendaVoteMark({ data }) {
  const voting = useSelector(myReferendaVotingSelector);
  const delegations = useSelector(myReferendaDelegationsSelector);

  if (!voting.length) {
    return null;
  }

  const trackVoting = find(voting, { trackId: data.track });
  if (!trackVoting) {
    return null;
  }

  const isDelegating = trackVoting?.isDelegating;

  const votes = isDelegating ? trackVoting?.delegatedVotes : trackVoting?.votes;
  if (!votes?.length) {
    return null;
  }

  const vote = find(votes, { referendumIndex: data.referendumIndex })?.vote;
  if (!vote) {
    return null;
  }

  if (vote.isSplit || vote.isSplitAbstain) {
    return <PostListMyReferendaSplitVoteMark vote={vote} />;
  }

  if (isDelegating) {
    return <PostListMyReferendaStandardDelegating vote={vote} />;
  } else {
    return (
      <PostListMyReferendaStandardCasting
        vote={vote}
        delegations={delegations}
      />
    );
  }
}

export function PostListMyReferendaSplitVoteMark({ vote }) {
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

export function PostListMyReferendaStandardCasting({ vote, delegations }) {
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

export function PostListMyReferendaStandardDelegating({ vote }) {
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
