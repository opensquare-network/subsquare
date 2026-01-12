import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue } from "next-common/utils";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import BigNumber from "bignumber.js";

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

export default function useVestedTransferForm(transferrable) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const { decimals } = useChainSettings();

  const [targetAddress, setTargetAddress] = useState("");
  const [lockedAmount, setLockedAmount] = useState("");
  const [startingBlock, setStartingBlock] = useState("");
  const [perBlock, setPerBlock] = useState("");

  const getTxFunc = useCallback(() => {
    const bnLockedAmount = checkInputValue(lockedAmount, decimals, "amount");
    const bnTransferrable = new BigNumber(transferrable || 0);
    if (bnTransferrable.lt(bnLockedAmount)) {
      dispatch(newErrorToast("Insufficient balance"));
      return;
    }

    const schedule = buildSchedule(
      lockedAmount,
      perBlock,
      startingBlock,
      decimals,
    );
    return api.tx.vesting.vestedTransfer(targetAddress, schedule);
  }, [
    api,
    targetAddress,
    lockedAmount,
    startingBlock,
    perBlock,
    decimals,
    transferrable,
    dispatch,
  ]);

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
      return "Please input amount";
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
