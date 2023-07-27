import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CountDown from "./countDown";
import {
  abbreviateBigNumber,
  estimateBlocksTime,
  toPrecision,
} from "../../utils";
import useApi from "../../utils/hooks/useApi";
import useTreasuryFree from "../../utils/hooks/useTreasuryFree";
import useTreasuryBurn from "../../utils/hooks/useTreasuryBurn";
import {
  blockTimeSelector,
  latestHeightSelector,
} from "../../store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import { useIsMountedBool } from "../../utils/hooks/useIsMounted";
import { useChainSettings } from "../../context/chain";
import Summary from "./v2/base";
import clsx from "clsx";

export default function TreasurySummary() {
  const [summary, setSummary] = useState({});
  const api = useApi();
  const node = useChainSettings();
  const blockTime = useSelector(blockTimeSelector);
  const blockHeight = useSelector(latestHeightSelector);

  const decimals = node?.decimals;
  const symbol = node?.symbol;

  const free = useTreasuryFree(api);
  const nextBurn = useTreasuryBurn(api, free);
  const isMounted = useIsMountedBool();

  useEffect(() => {
    if (api?.consts?.treasury?.spendPeriod && blockHeight) {
      const spendPeriod = api.consts.treasury.spendPeriod.toNumber();
      const goneBlocks = new BigNumber(blockHeight).mod(spendPeriod).toNumber();
      const progress = new BigNumber(goneBlocks)
        .div(spendPeriod)
        .multipliedBy(100)
        .toNumber();
      const TimeArray = estimateBlocksTime(spendPeriod - goneBlocks, blockTime);
      if (isMounted()) {
        setSummary({
          progress,
          spendPeriod: TimeArray,
          totalPeriod: ["/"].concat(estimateBlocksTime(spendPeriod, blockTime)),
        });
      }
    }
  }, [api, blockHeight]);

  return (
    <Summary
      items={[
        {
          title: "Available",
          content: (
            <>
              <span>{abbreviateBigNumber(toPrecision(free, decimals))}</span>
              <span className="unit upper">{symbol}</span>
            </>
          ),
        },
        {
          title: "Next Burn",
          content: (
            <>
              <span>
                {abbreviateBigNumber(toPrecision(nextBurn, decimals))}
              </span>
              <span className="unit upper">{symbol}</span>
            </>
          ),
        },
        {
          title: "Spend Period",
          content: (
            <>
              {(summary?.spendPeriod || []).map((item, index) => (
                <span className={index % 2 === 1 ? "unit" : ""} key={index}>
                  {item}
                </span>
              ))}
              {(summary?.totalPeriod || []).map((item, index) => (
                <span
                  className={clsx(
                    index % 2 === 1 ? "unit total" : "total",
                    "max-sm:hidden",
                  )}
                  key={index}
                >
                  {item}
                </span>
              ))}
            </>
          ),
          suffix: (
            <div className="flex max-sm:hidden">
              <CountDown percent={summary?.progress ?? 0} />
            </div>
          ),
        },
      ]}
    />
  );
}
