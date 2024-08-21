import { useContextApi } from "next-common/context/api";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fellowshipCollectiveMembersTriggerSelector,
  setFellowshipCollectiveMembers,
} from "next-common/store/reducers/fellowship/collective";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";

export default function useFetchFellowshipMembers() {
  const api = useContextApi();
  const trigger = useSelector(fellowshipCollectiveMembersTriggerSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api?.query?.fellowshipCollective?.members) {
      return;
    }

    api.query.fellowshipCollective.members
      .entries()
      .then((collectiveEntries) => {
        const collectiveMembers =
          normalizeRankedCollectiveEntries(collectiveEntries);
        dispatch(setFellowshipCollectiveMembers(collectiveMembers));
      });
  }, [api, trigger]);
}
