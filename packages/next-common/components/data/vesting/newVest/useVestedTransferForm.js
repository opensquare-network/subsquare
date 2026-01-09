import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
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
  const dispatch = useDispatch();
  const api = useContextApi();
  const { decimals } = useChainSettings();

  const [targetAddress, setTargetAddress] = useState("");
  const [lockedAmount, setLockedAmount] = useState("");
  const [startingBlock, setStartingBlock] = useState("");
  const [perBlock, setPerBlock] = useState("");

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const getTxFunc = useCallback(() => {
    if (!api) {
      showErrorToast("Chain network is not connected yet");
      return;
    }

    if (!targetAddress) {
      showErrorToast("Please input a target address");
      return;
    }

    if (!lockedAmount) {
      showErrorToast("Please input locked amount");
      return;
    }

    if (!startingBlock) {
      showErrorToast("Please input starting block");
      return;
    }

    if (!perBlock) {
      showErrorToast("Please input per block amount");
      return;
    }

    let schedule;
    try {
      schedule = buildSchedule(lockedAmount, perBlock, startingBlock, decimals);
    } catch (e) {
      showErrorToast(e.message);
      return;
    }

    return api.tx.vesting.vestedTransfer(targetAddress, schedule);
  }, [
    api,
    targetAddress,
    lockedAmount,
    startingBlock,
    perBlock,
    decimals,
    showErrorToast,
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

    let schedule;
    try {
      schedule = buildSchedule(lockedAmount, perBlock, startingBlock, decimals);
    } catch {
      return;
    }

    return api.tx.vesting.vestedTransfer(targetAddress, schedule);
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
    if (!startingBlock) {
      return "Please input starting block";
    }
    if (!perBlock) {
      return "Please input per block amount";
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
