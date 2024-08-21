import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setFellowshipSalaryStatus } from "next-common/store/reducers/fellowship/salary";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubFellowshipSalaryStats(
  pallet = "fellowshipSalary",
) {
  const dispatch = useDispatch();

  const callback = useCallback(
    (rawOptional) => {
      if (rawOptional.isSome) {
        const json = rawOptional.unwrap().toJSON();
        dispatch(setFellowshipSalaryStatus(json));
      }
    },
    [dispatch],
  );

  useSubStorage(pallet, "status", [], callback);
}
