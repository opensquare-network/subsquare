// packages/next-common/components/myvotes/referenda/normalizeVote.js
// packages/next-common/components/myvotes/democracy/normalize.js

import { cn, toPrecision } from "next-common/utils";
import Tooltip from "../tooltip";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import BigNumber from "bignumber.js";
import ValueDisplay from "../valueDisplay";
import {
  Conviction,
  convictionToLockXNumber,
} from "next-common/utils/referendumCommon";
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";

export default function PostListMyVoteMark({ data }) {
  const chainSettings = useChainSettings();
  const { vote, delegations } = data?.myVote || {};
  const type = useListPageType();

  if (isNil(vote)) {
    return null;
  }

  let items;
  if (type === listPageCategory.FELLOWSHIP_REFERENDA) {
    items = getFellowshipReferendaItems(vote);
  } else if (type === listPageCategory.REFERENDA) {
    items = getReferendaItems(vote, delegations, chainSettings);
  }

  if (isNil(items)) {
    return null;
  }

  return (
    <Tooltip
      className="p-1"
      content={
        items?.length && (
          <div>
            {items?.map((item) => (
              <div key={item.label}>
                {item.label}: {item.value}
              </div>
            ))}
          </div>
        )
      }
    >
      <div
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          (vote.aye || vote.isAye) && "bg-green500",
          (vote.aye === false || vote.isAye === false) && "bg-red500",
          (vote.isSplit || vote.isSplitAbstain) && "bg-neutral500",
        )}
      />
    </Tooltip>
  );
}

function getReferendaItems(vote, delegations, chainSettings) {
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
    const selfTotal = BigNumber(vote.balance).times(vote.conviction).toString();
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
            *{vote.conviction}x)
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

function getFellowshipReferendaItems(vote) {
  return [
    {
      label: "Vote",
      value: vote?.isAye === false ? "Nay" : "Aye",
    },
    {
      label: "Votes",
      value: vote.votes,
    },
  ];
}
