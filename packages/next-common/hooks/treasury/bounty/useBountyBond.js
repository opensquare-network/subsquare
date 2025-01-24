import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import BigNumber from "bignumber.js";

export default function useBountyBond(title) {
  const api = useContextApi();
  const bountyDepositBase =
    api?.consts?.bounties?.bountyDepositBase?.toNumber();
  const dataDepositPerByte =
    api?.consts?.bounties?.dataDepositPerByte?.toNumber();

  const [bond, setBond] = useState(bountyDepositBase || 0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!bountyDepositBase || !dataDepositPerByte) {
      return;
    }

    setBond(calculateBountyBond(title, bountyDepositBase, dataDepositPerByte));
    setIsLoading(false);
  }, [title, bountyDepositBase, dataDepositPerByte]);

  return { bond, isLoading };
}

function calculateBountyBond(title, depositBase, depositPerByte) {
  return new BigNumber(depositPerByte)
    .times(countUtf8Bytes(title))
    .plus(depositBase)
    .toString();
}

function countUtf8Bytes(str) {
  return new Blob([str]).size;
}
