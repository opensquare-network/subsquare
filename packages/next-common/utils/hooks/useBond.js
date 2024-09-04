import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";

export default function useBond({
  treasuryPallet = "treasury",
  proposalValue,
}) {
  const api = useContextApi();
  const [bondPercentage, setBondPercentage] = useState();
  const [bondMaximum, setBondMaximum] = useState();
  const [bondMinimum, setBondMinimum] = useState();

  useEffect(() => {
    if (api) {
      setBondPercentage(api.consts[treasuryPallet]?.proposalBond?.toJSON());
      setBondMaximum(api.consts[treasuryPallet]?.proposalBondMaximum?.toJSON());
      setBondMinimum(api.consts[treasuryPallet]?.proposalBondMinimum?.toJSON());
    }
  }, [api, treasuryPallet]);

  const value = new BigNumber(proposalValue);
  let bond = value.times(bondPercentage / 1000000);

  if (bondMaximum) {
    bond = BigNumber.min(bond, bondMaximum);
  }

  if (bondMinimum) {
    bond = bond.isNaN()
      ? new BigNumber(bondMinimum)
      : BigNumber.max(bond, bondMinimum);
  }

  return bond.isNaN() ? new BigNumber(0) : bond;
}
