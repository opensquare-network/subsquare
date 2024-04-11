import { toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import ValueDisplay from "../../valueDisplay";
import Tooltip from "../../tooltip";
import { filter } from "lodash-es";
import Track from "../../referenda/track/trackTag";

export const tracksCol = {
  name: "Tracks",
  width: 120,
  className: "text-right",
  cellRender(data) {
    const { symbol, decimals } = getChainSettings(CHAIN);

    const delegations = filter(
      data.tracksDelegations || [],
      (d) => Number(d.delegationVotes) > 0,
    );

    return (
      <Tooltip
        content={
          !!delegations.length && (
            <ul className="text12Medium">
              {delegations.map((d) => (
                <li key={d.trackId}>
                  <Track
                    id={d.trackId}
                    className="bg-transparent p-0 text-inherit"
                  />{" "}
                  <ValueDisplay
                    className="[&_.value-display-symbol]:text-inherit"
                    value={toPrecision(d.delegationVotes, decimals)}
                    symbol={symbol}
                  />
                </li>
              ))}
            </ul>
          )
        }
      >
        <span>{delegations.length}</span>
      </Tooltip>
    );
  },
};
