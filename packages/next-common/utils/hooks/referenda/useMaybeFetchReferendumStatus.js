import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  referendumStatusSelector,
  setReferendumStatus,
} from "../../../store/reducers/referendumSlice";

export default function useMaybeFetchReferendumStatus(referendum) {
  const dispatch = useDispatch();
  const referendumStatus = useSelector(referendumStatusSelector);

  useEffect(() => {
    dispatch(
      setReferendumStatus(
        referendum?.status || referendum?.info?.ongoing || referendum?.meta,
      ),
    );
  }, [dispatch, referendum]);

  return referendumStatus;
}
