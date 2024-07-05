import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fellowshipCoreMembersTriggerSelector,
  setFellowshipCoreMembers,
} from "next-common/store/reducers/fellowship/core";
import { isSameAddress } from "next-common/utils";
import { setFellowshipCollectiveMembers } from "next-common/store/reducers/fellowship/collective";
import { useContextApi } from "next-common/context/api";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";

export default function useFetchFellowshipCoreMembers() {
  const api = useContextApi();
  const trigger = useSelector(fellowshipCoreMembersTriggerSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !api ||
      !api.query.fellowshipCore?.member ||
      !api.query.fellowshipCollective?.members
    ) {
      return;
    }

    Promise.all([
      api.query.fellowshipCollective?.members.entries(),
      api.query.fellowshipCore.member.entries(),
    ]).then(([collectiveEntries, coreEntries]) => {
      const collectiveMembers =
        normalizeRankedCollectiveEntries(collectiveEntries);
      dispatch(setFellowshipCollectiveMembers(collectiveMembers));

      const members = coreEntries.map(([storageKey, memberStatus]) => {
        const address = storageKey.args[0].toString();
        return {
          address,
          rank: collectiveMembers.find((m) => isSameAddress(m.address, address))
            ?.rank,
          status: memberStatus.toJSON(),
        };
      });

      dispatch(setFellowshipCoreMembers(members));
    });
  }, [api, trigger]);
}
