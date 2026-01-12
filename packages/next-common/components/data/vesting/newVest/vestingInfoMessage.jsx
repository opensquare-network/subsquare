import { InfoMessage } from "next-common/components/setting/styled";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue, toPrecision } from "next-common/utils";
import useUnlockDuration from "./useUnlockDuration";
import useVestingStatus, { VestingStatus } from "./useVestingStatus";

function VestingStatusMessage({ vestingStatus, symbol, decimals }) {
  if (!vestingStatus) {
    return null;
  }

  const { available, locked, status } = vestingStatus;
  const availableDisplay = toPrecision(available, decimals);
  const lockedDisplay = toPrecision(locked, decimals);

  if (status === VestingStatus.FULLY_UNLOCKED) {
    return (
      <span>
        All {availableDisplay} {symbol} will be immediately available.
      </span>
    );
  }

  if (status === VestingStatus.NOT_STARTED) {
    return (
      <span>
        0 {symbol} available, {lockedDisplay} {symbol} locked (vesting not
        started yet).
      </span>
    );
  }

  // partial
  return (
    <span>
      {availableDisplay} {symbol} immediately available, {lockedDisplay}{" "}
      {symbol} locked.
    </span>
  );
}

function RemainingDurationMessage({
  vestingStatus,
  perBlockDisplay,
  symbol,
  blockTimeSeconds,
}) {
  if (!vestingStatus || vestingStatus.status === VestingStatus.FULLY_UNLOCKED) {
    return null;
  }

  const { remainingDuration } = vestingStatus;
  if (!remainingDuration) {
    return null;
  }

  return (
    <span>
      It will take {remainingDuration} to fully unlock, with {perBlockDisplay}{" "}
      {symbol} unlocked per block ({blockTimeSeconds}s).
    </span>
  );
}

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
  const vestingStatus = useVestingStatus(lockedAmount, perBlock, startingBlock);

  const isValid =
    targetAddress &&
    lockedAmount &&
    perBlock &&
    startingBlock &&
    unlockDuration;

  if (!isValid) {
    return null;
  }

  const perBlockDisplay = toPrecision(
    checkInputValue(perBlock, decimals, "perBlock"),
    decimals,
  );

  return (
    <InfoMessage className="flex flex-col gap-1 !items-start">
      <VestingStatusMessage
        vestingStatus={vestingStatus}
        symbol={symbol}
        decimals={decimals}
      />
      <RemainingDurationMessage
        vestingStatus={vestingStatus}
        perBlockDisplay={perBlockDisplay}
        symbol={symbol}
        blockTimeSeconds={blockTimeSeconds}
      />
    </InfoMessage>
  );
}
