import { cn, toPrecision } from "next-common/utils";
import Tooltip from "../tooltip";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import BigNumber from "bignumber.js";
import ValueDisplay from "../valueDisplay";

export default function PostListVoteMark({ data }) {
  const { decimals, symbol } = useChainSettings();
  const vote = data?.vote;

  if (isNil(vote)) {
    return null;
  }

  let items;
  if (vote.isSplitAbstain) {
    items = [
      {
        label: "Aye",
        value: `${toPrecision(vote.ayeBalance, decimals)} ${symbol}`,
      },
      {
        label: "Nay",
        value: `${toPrecision(vote.nayBalance, decimals)} ${symbol}`,
      },
      !isNil(vote.abstainBalance) && {
        label: "Abstain",
        value: `${toPrecision(vote.abstainBalance, decimals)} ${symbol}`,
      },
    ].filter(Boolean);
  } else {
    const delegations = data?.delegations;
    const selfTotal = BigNumber(vote.balance).times(vote.conviction).toString();
    const delegationsVotes = delegations?.votes || 0;
    const total = BigNumber.sum(delegationsVotes, selfTotal);

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
          vote?.aye && "bg-green500",
          vote?.aye === false && "bg-red500",
          vote?.isSplitAbstain && "bg-neutral500",
        )}
      />
    </Tooltip>
  );
}
