import { useContextApi } from "next-common/context/api";
import { useDispatch, useSelector } from "react-redux";
import {
  ambassadorCoreMembersTriggerSelector,
  setAmbassadorCoreMembers,
} from "next-common/store/reducers/ambassador/core";
import { useEffect } from "react";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";
import { isSameAddress } from "next-common/utils";
import { setAmbassadorCollectiveMembers } from "next-common/store/reducers/ambassador/collective";

export default function useFetchAmbassadorCoreMembers() {
  const api = useContextApi();
  const trigger = useSelector(ambassadorCoreMembersTriggerSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !api ||
      !api.query.ambassadorCore?.member ||
      !api.query.ambassadorCollective?.members
    ) {
      return;
    }

    Promise.all([
      api.query.ambassadorCollective?.members.entries(),
      api.query.ambassadorCore.member.entries(),
    ]).then(([collectiveEntries, coreEntries]) => {
      const collectiveMembers =
        normalizeRankedCollectiveEntries(collectiveEntries);
      dispatch(setAmbassadorCollectiveMembers(collectiveMembers));

      const members = coreEntries.map(([storageKey, memberStatus]) => {
        const address = storageKey.args[0].toString();
        return {
          address,
          rank: collectiveMembers.find((m) => isSameAddress(m.address, address))
            ?.rank,
          status: memberStatus.toJSON(),
        };
      });

      dispatch(setAmbassadorCoreMembers(members));
    });
  }, [api, trigger]);
}
