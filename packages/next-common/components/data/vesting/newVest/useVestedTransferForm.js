import { useCallback, useMemo, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue } from "next-common/utils";

function buildSchedule(lockedAmount, perBlock, startingBlock, decimals) {
  const bnLockedAmount = checkInputValue(
    lockedAmount,
    decimals,
    "locked amount",
  );
  const bnPerBlock = checkInputValue(perBlock, decimals, "per block amount");

  return {
    locked: bnLockedAmount.toString(),
    perBlock: bnPerBlock.toString(),
    startingBlock: parseInt(startingBlock),
  };
}

export default function useVestedTransferForm() {
  const api = useContextApi();
  const { decimals } = useChainSettings();

  const [targetAddress, setTargetAddress] = useState("");
  const [lockedAmount, setLockedAmount] = useState("");
  const [startingBlock, setStartingBlock] = useState("");
  const [perBlock, setPerBlock] = useState("");

  const getTxFunc = useCallback(() => {
    const schedule = buildSchedule(
      lockedAmount,
      perBlock,
      startingBlock,
      decimals,
    );
    return api.tx.vesting.vestedTransfer(targetAddress, schedule);
  }, [api, targetAddress, lockedAmount, startingBlock, perBlock, decimals]);

  const getEstimateTxFunc = useCallback(() => {
    if (
      !api ||
      !targetAddress ||
      !lockedAmount ||
      !startingBlock ||
      !perBlock
    ) {
      return;
    }

    try {
      const schedule = buildSchedule(
        lockedAmount,
        perBlock,
        startingBlock,
        decimals,
      );
      return api.tx.vesting.vestedTransfer(targetAddress, schedule);
    } catch {
      return;
    }
  }, [api, targetAddress, lockedAmount, startingBlock, perBlock, decimals]);

  const disabledReason = useMemo(() => {
    if (!api) {
      return "Chain network is not connected yet";
    }
    if (!targetAddress) {
      return "Please input a target address";
    }
    if (!lockedAmount) {
      return "Please input locked amount";
    }
    if (!perBlock) {
      return "Please input per block amount";
    }
    if (!startingBlock) {
      return "Please input starting height";
    }

    try {
      buildSchedule(lockedAmount, perBlock, startingBlock, decimals);
      return null;
    } catch (e) {
      return e.message;
    }
  }, [api, targetAddress, lockedAmount, startingBlock, perBlock, decimals]);

  return {
    targetAddress,
    setTargetAddress,
    lockedAmount,
    setLockedAmount,
    startingBlock,
    setStartingBlock,
    perBlock,
    setPerBlock,
    getTxFunc,
    getEstimateTxFunc,
    disabledReason,
  };
}
