import { useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import { useDispatch } from "react-redux";
import { setAmbassadorSalaryStatus } from "next-common/store/reducers/ambassador/salary";

export default function useSubAmbassadorSalaryStats() {
  const api = useContextApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !api.query?.ambassadorSalary?.status) {
      return;
    }

    let unsub;
    api.query.ambassadorSalary
      .status((rawOptional) => {
        if (rawOptional.isNone) {
          return;
        }

        const json = rawOptional.unwrap().toJSON();
        dispatch(setAmbassadorSalaryStatus(json));
      })
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api]);
}
