import { useContextApi } from "next-common/context/api";
import { useDispatch, useSelector } from "react-redux";
import { ambassadorCollectiveMembersTriggerSelector } from "next-common/store/reducers/ambassador/collective";
import { useEffect } from "react";
import { setFellowshipCollectiveMembers } from "next-common/store/reducers/fellowship/collective";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";

export default function useFetchAmbassadorCollectiveMembers() {
  const api = useContextApi();
  const trigger = useSelector(ambassadorCollectiveMembersTriggerSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api?.query?.ambassadorCollective?.members) {
      return;
    }

    api.query.ambassadorCollective.members
      .entries()
      .then((collectiveEntries) => {
        const collectiveMembers =
          normalizeRankedCollectiveEntries(collectiveEntries);
        dispatch(setFellowshipCollectiveMembers(collectiveMembers));
      });
  }, [api, trigger]);
}
