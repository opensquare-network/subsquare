import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function useQueryExistentialDeposit() {
  const api = useContextApi();
  const dispatch = useDispatch();
  const [existentialDeposit, setExistentialDeposit] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    console.log("api", api)
    if (api.consts.balances?.existentialDeposit) {
      setExistentialDeposit(api.consts.balances?.existentialDeposit.toNumber());
    }
  }, [api, dispatch]);

  return existentialDeposit;
}
