import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";

export default function useFellowshipSalaryPeriods() {
  const api = useApi();
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
