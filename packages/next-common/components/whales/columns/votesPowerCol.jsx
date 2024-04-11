import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import ValueDisplay from "../../valueDisplay";
import Tooltip from "../../tooltip";
import BigNumber from "bignumber.js";
import { map, max } from "lodash-es";
import { Conviction } from "next-common/utils/referendumCommon";
import { toPrecision } from "next-common/utils";

const LOCK = Math.max(...Object.values(Conviction));

export const votesPowerCol = {
  name: "Votes Power",
  width: 160,
  className: "text-right",
  cellRender(data) {
    const { symbol, decimals } = getChainSettings(CHAIN);

    const tracksDelegations = data.tracksDelegations || [];
    const delegations = map(tracksDelegations, "delegationVotes");
    const delegation = max(delegations);

    const balance = BigNumber(data.balance).multipliedBy(LOCK).toNumber();

    return (
      <Tooltip
        content={
          <div>
            <div>
              Balance:{" "}
              <ValueDisplay
                className="[&_.value-display-symbol]:text-inherit"
                showTooltip={false}
                value={toPrecision(balance, decimals)}
                symbol={symbol}
              />
            </div>
            <div>
              Delegations:{" "}
              <ValueDisplay
                className="[&_.value-display-symbol]:text-inherit"
                showTooltip={false}
                value={toPrecision(delegation, decimals)}
                symbol={symbol}
              />
            </div>
          </div>
        }
      >
        <ValueDisplay
          showTooltip={false}
          value={toPrecision(data.maxVotes, decimals)}
          symbol={symbol}
        />
      </Tooltip>
    );
  },
};
