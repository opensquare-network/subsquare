// packages/next-common/components/myvotes/referenda/normalizeVote.js
// packages/next-common/components/myvotes/democracy/normalize.js

import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import {
  Conviction,
  convictionToLockXNumber,
} from "next-common/utils/referendumCommon";
import ValueDisplay from "../../valueDisplay";

export function getMyVoteMarkReferendaItems(myVote, chainSettings) {
  const { vote } = myVote || {};

  if (!vote) {
    return null;
  }

  let items;

  if (vote.isSplit || vote.isSplitAbstain) {
    items = getSplitOrSplitAbstainItems(myVote, chainSettings);
  } else {
    items = getStandardItems(myVote, chainSettings);
  }

  return items;
}

function getSplitOrSplitAbstainItems(myVote, chainSettings) {
  const { decimals, symbol } = chainSettings;
  const conviction = convictionToLockXNumber(Conviction.None);
  const { vote } = myVote;

  return [
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
}

function getStandardItems(myVote, chainSettings) {
  const { decimals, symbol } = chainSettings;
  const { vote, delegations, isDelegating } = myVote;

  const conviction = convictionToLockXNumber(vote.conviction);
  const selfTotal = BigNumber(vote.balance).times(conviction).toString();
  const delegationsVotes = delegations?.votes || 0;
  const hasDelegations = BigNumber(delegationsVotes).gt(0);
  const total = BigNumber.sum(delegationsVotes, selfTotal).toString();

  return [
    {
      label: "Vote",
      value: (
        <>
          {vote?.aye === false ? "Nay" : "Aye"}
          {isDelegating && "(Delegated)"}
        </>
      ),
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
    hasDelegations && {
      label: "Delegations",
      value: (
        <ValueDisplay
          value={toPrecision(delegationsVotes, decimals)}
          symbol={symbol}
        />
      ),
    },
  ].filter(Boolean);
}
