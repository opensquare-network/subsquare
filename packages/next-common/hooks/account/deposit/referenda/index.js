import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import queryAddressDeposits from "next-common/hooks/account/deposit/referenda/deposits";

export default function useFetchMyReferendaDeposits() {
  const realAddress = useRealAddress();
  const api = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !realAddress || !api.query?.referenda) {
      return;
    }

    queryAddressDeposits(api, realAddress).then((data) => {
      console.log("data", data);
    });
  }, [api, realAddress, dispatch]);
}
