import useApi from "next-common/utils/hooks/useApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fellowshipCoreMembersTriggerSelector,
  setFellowshipCoreMembers,
} from "next-common/store/reducers/fellowship/core";
import { isSameAddress } from "next-common/utils";

export default function useFetchFellowshipCoreMembers(collectiveMembers) {
  const api = useApi();
  const trigger = useSelector(fellowshipCoreMembersTriggerSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !api.query.fellowshipCore) {
      return;
    }

    api.query.fellowshipCore.member.entries().then((entries) => {
      const members = entries.map(([storageKey, memberStatus]) => {
        const member = storageKey.args[0].toString();
        return {
          member,
          rank: collectiveMembers.find((m) => isSameAddress(m.address, member))
            ?.rank,
          status: memberStatus.toJSON(),
        };
      });
      dispatch(setFellowshipCoreMembers(members));
    });
  }, [api, trigger]);
}
