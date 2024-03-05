import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useFellowshipSalaryPeriods() {
  const api = useContextApi();
  const [registrationPeriod, setRegistrationPeriod] = useState();
  const [payoutPeriod, setPayoutPeriod] = useState();

  useEffect(() => {
    if (!api) {
      return;
    }

    if (api.consts.fellowshipSalary?.registrationPeriod) {
      setRegistrationPeriod(
        api.consts.fellowshipSalary.registrationPeriod.toNumber(),
      );
    }
    if (api.consts.fellowshipSalary?.payoutPeriod) {
      setPayoutPeriod(api.consts.fellowshipSalary.payoutPeriod.toNumber());
    }
  }, [api]);

  return {
    registrationPeriod,
    payoutPeriod,
  };
}
