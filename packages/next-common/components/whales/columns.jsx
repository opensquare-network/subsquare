import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import { toPercentage, toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import AddressUser from "../user/addressUser";
import ValueDisplay from "../valueDisplay";
import { cn } from "next-common/utils";
import Tooltip from "../tooltip";

export const addressCol = {
  name: "Address",
  cellRender(data) {
    return <AddressUser linkToVotesPage add={data.address} />;
  },
};

export const votesPowerCol = {
  name: "Votes Power",
  width: 160,
  className: "text-right",
  cellRender(data) {
    const { symbol, decimals } = getChainSettings(CHAIN);

    return (
      <ValueDisplay
        value={toPrecision(data.maxVotes, decimals)}
        symbol={symbol}
      />
    );
  },
};

export const tracksCol = {
  name: "Tracks",
  width: 120,
  className: "text-right",
  cellRender() {
    return 1;
  },
};

export const maxVotedCol = {
  name: "Max Voted",
  width: 160,
  className: "text-right",
  cellRender(data) {
    const { symbol, decimals } = getChainSettings(CHAIN);

    return (
      <ValueDisplay
        value={toPrecision(data.maxVoted, decimals)}
        symbol={symbol}
      />
    );
  },
};

export const ayeNayCol = {
  name: "Aye/Nay",
  width: 200,
  className: "text-right",
  cellRender(data) {
    return (
      <div className="inline-flex items-center">
        <span className="w-12 mr-2">{data.ayeCount}</span>
        <SystemVoteAye className="inline w-5 h-5" />
        <span className="w-12 mr-2">{data.nayCount}</span>
        <SystemVoteNay className="inline w-5 h-5" />
      </div>
    );
  },
};

export const participationCol = {
  name: "Participation",
  width: 120,
  className: "text-right",
  cellRender(data) {
    return toPercentage(1 - data.participationRate, 1).toFixed(1) + "%";
  },
};

export const winRateCol = {
  name: "Win Rate",
  width: 120,
  className: "text-right",
  cellRender(data) {
    const p = toPercentage(data.winVotes / data.votesCount, 1);

    return (
      <Tooltip content={`Win/Participate: ${p}/100`}>
        <span
          className={cn(
            p <= 33 && "text-red500",
            p > 33 && p <= 66 && "text-orange500",
            p > 66 && "text-green500",
          )}
        >
          {p.toFixed(1)}%
        </span>
      </Tooltip>
    );
  },
};
