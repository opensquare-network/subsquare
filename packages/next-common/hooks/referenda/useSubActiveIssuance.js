import { useEffect } from "react";
import useApi from "../../utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { setReferendaInActive, setReferendaIssuance } from "../../store/reducers/referenda/issuance";

export default function useSubActiveIssuance() {
  const api = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query.balances.totalIssuance(issuance => {
      dispatch(setReferendaIssuance(issuance.toString()));
    });

    api.query.balances.inactiveIssuance(inactive => {
      dispatch(setReferendaInActive(inactive.toString()));
    });
  }, [api]);
}
