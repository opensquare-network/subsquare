import { toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import ValueDisplay from "../../valueDisplay";
import Tooltip from "../../tooltip";
import { filter } from "lodash-es";
import Track from "../../referenda/track/trackTag";
import BigNumber from "bignumber.js";
import Chains from "next-common/utils/consts/chains";
import chains from "next-common/utils/consts/chains";

function getWhaleThreshold() {
  const { decimals: dotDecimals } = getChainSettings(chains.polkadot);
  const { decimals: ksmDecimals } = getChainSettings(chains.kusama);

  return {
    [Chains.polkadot]: 1000000 * Math.pow(10, dotDecimals),
    [Chains.kusama]: 10000 * Math.pow(10, ksmDecimals),
  }[CHAIN];
}

export const tracksCol = {
  name: "Tracks",
  width: 120,
  className: "text-right",
  cellRender(data) {
    const { symbol, decimals } = getChainSettings(CHAIN);
    const { balance = 0, tracksDelegations = [] } = data;
    const selfMaxVotesBn = new BigNumber(balance).multipliedBy(6);
    const whaleThreshold = getWhaleThreshold();
    const whaleTracks = filter(tracksDelegations || [], (d) => {
      if (d.isDelegating) {
        return false;
      }

      return selfMaxVotesBn.plus(d.delegationVotes).gte(whaleThreshold);
    });

    const tooltipTracks = filter(tracksDelegations || [], (d) => {
      return (
        d.isDelegating ||
        selfMaxVotesBn.plus(d.delegationVotes).gte(whaleThreshold)
      );
    });

    return (
      <Tooltip
        content={
          <ul className="text12Medium">
            {tooltipTracks.map((d) => (
              <li key={d.trackId}>
                <Track
                  id={d.trackId}
                  className="bg-transparent p-0 text-inherit"
                />
                {": "}
                {d.isDelegating ? (
                  "Delegating"
                ) : (
                  <ValueDisplay
                    className="[&_.value-display-symbol]:text-inherit"
                    value={toPrecision(
                      selfMaxVotesBn.plus(d.delegationVotes),
                      decimals,
                    )}
                    symbol={symbol}
                  />
                )}
              </li>
            ))}
          </ul>
        }
      >
        <span>{whaleTracks.length}</span>
      </Tooltip>
    );
  },
};
