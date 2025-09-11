import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useSalaryFellowshipPallet } from "next-common/context/collectives/collectives";

export default function useSalaryFellowshipPeriods() {
  const api = useContextApi();
  const [registrationPeriod, setRegistrationPeriod] = useState();
  const [payoutPeriod, setPayoutPeriod] = useState();
  const pallet = useSalaryFellowshipPallet();

  useEffect(() => {
    if (!api) {
      return;
    }

    if (api.consts[pallet]?.registrationPeriod) {
      setRegistrationPeriod(api.consts[pallet].registrationPeriod.toNumber());
    }
    if (api.consts[pallet]?.payoutPeriod) {
      setPayoutPeriod(api.consts[pallet].payoutPeriod.toNumber());
    }
  }, [api, pallet]);

  return {
    registrationPeriod,
    payoutPeriod,
  };
}
