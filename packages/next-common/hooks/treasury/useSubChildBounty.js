import useApi from "../../utils/hooks/useApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setChildBounty } from "../../store/reducers/childBountySlice";

export default function useSubChildBounty(parentBountyId, childBountyId) {
  const api = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !api.query.childBounties) {
      return;
    }

    let unsub;
    api.query.childBounties.childBounties(parentBountyId, childBountyId, (meta) => {
      if (meta.isSome) {
        const unwrapped = meta.unwrap();
        dispatch(setChildBounty(unwrapped.toJSON()));
      } else {
        dispatch(setChildBounty(null));
      }
    }).then(result => {
      unsub = result;
    });

    return () => {
      if (unsub) {
        unsub();
        dispatch(setChildBounty(null));
      }
    };
  }, [api, parentBountyId, childBountyId]);
}
