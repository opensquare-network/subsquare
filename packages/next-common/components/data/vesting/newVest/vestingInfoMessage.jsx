import { InfoMessage } from "next-common/components/setting/styled";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue, toPrecision } from "next-common/utils";
import useUnlockDuration from "./useUnlockDuration";

export default function VestingInfoMessage({
  targetAddress,
  lockedAmount,
  perBlock,
  startingBlock,
}) {
  const { decimals, symbol } = useChainSettings();
  const { unlockDuration, blockTimeSeconds } = useUnlockDuration(
    lockedAmount,
    perBlock,
  );

  const isValid =
    targetAddress &&
    lockedAmount &&
    perBlock &&
    startingBlock &&
    unlockDuration;

  if (!isValid) {
    return null;
  }

  return (
    <InfoMessage className="flex flex-col gap-1 !items-start">
      <span>
        The funds will be transferred immediately, but locked in the target
        account.
      </span>
      <span>
        It will take {unlockDuration} to fully unlock, with{" "}
        {toPrecision(checkInputValue(perBlock, decimals, "perBlock"), decimals)}{" "}
        {symbol} unlocked per block ({blockTimeSeconds}s).
      </span>
    </InfoMessage>
  );
}
