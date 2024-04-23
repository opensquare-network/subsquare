import { useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import { useDispatch } from "react-redux";
import { setFellowshipSalaryStatus } from "next-common/store/reducers/fellowship/salary";

export default function useSubFellowshipSalaryStats() {
  const api = useContextApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !api.query?.fellowshipSalary?.status) {
      return;
    }

    let unsub;
    api.query.fellowshipSalary
      .status((rawOptional) => {
        if (rawOptional.isNone) {
          return;
        }

        const json = rawOptional.unwrap().toJSON();
        dispatch(setFellowshipSalaryStatus(json));
      })
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api]);
}
