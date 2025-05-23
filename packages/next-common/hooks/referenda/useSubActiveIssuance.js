import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setReferendaInActive,
  setReferendaIssuance,
} from "../../store/reducers/referenda/issuance";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export default function useSubActiveIssuance() {
  const api = useConditionalContextApi();
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
