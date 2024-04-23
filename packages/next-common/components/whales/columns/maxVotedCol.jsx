import { toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import ValueDisplay from "../../valueDisplay";

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
