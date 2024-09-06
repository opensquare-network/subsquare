import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setReferendaInActive,
  setReferendaIssuance,
} from "../../store/reducers/referenda/issuance";
import { useContextApi } from "next-common/context/api";

export default function useSubActiveIssuance() {
  const api = useContextApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query.balances.totalIssuance((issuance) => {
      dispatch(setReferendaIssuance(issuance.toString()));
    });

    api.query.balances.inactiveIssuance((inactive) => {
      dispatch(setReferendaInActive(inactive.toString()));
    });
  }, [api, dispatch]);
}
