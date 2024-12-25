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

export function getMyVoteMarkReferendaItems(vote, delegations, chainSettings) {
  const { decimals, symbol } = chainSettings;

  let items;

  if (vote.isSplit || vote.isSplitAbstain) {
    const conviction = convictionToLockXNumber(Conviction.None);

    items = [
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
    ].filter(Boolean);
  } else {
    const conviction = convictionToLockXNumber(vote.conviction);
    const selfTotal = BigNumber(vote.balance).times(conviction).toString();
    const delegationsVotes = delegations?.votes || 0;
    const total = BigNumber.sum(delegationsVotes, selfTotal).toString();

    items = [
      {
        label: "Vote",
        value: vote?.aye === false ? "Nay" : "Aye",
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
      !isNil(delegations) && {
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

  return items;
}
