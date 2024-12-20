import { cn, toPrecision } from "next-common/utils";
import Tooltip from "../tooltip";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import BigNumber from "bignumber.js";

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
    const selfTotal = BigNumber(vote.balance).times(vote.conviction).toString();

    items = [
      {
        label: "Vote",
        value: vote?.aye === false ? "Nay" : "Aye",
      },
      {
        label: "Total",
        value: "TODO",
      },
      {
        label: "Self",
        value: `${Number(
          toPrecision(selfTotal, decimals),
        ).toLocaleString()} ${symbol} (${Number(
          toPrecision(vote.balance, decimals),
        ).toLocaleString()} ${symbol}*${vote.conviction}x)`,
      },
      {
        label: "Delegations",
        value: "TODO",
      },
    ];
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
