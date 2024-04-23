import { useContextApi } from "next-common/context/api";
import { useDispatch, useSelector } from "react-redux";
import { fellowshipCoreMembersTriggerSelector } from "next-common/store/reducers/fellowship/core";
import { useEffect } from "react";
import { setFellowshipCollectiveMembers } from "next-common/store/reducers/fellowship/collective";

function normalizeCollectiveMembers(collectiveEntries = []) {
  let members = [];
  for (const [storageKey, record] of collectiveEntries) {
    const address = storageKey.args[0].toString();
    if (!record.isSome) {
      continue;
    }
    const rank = record.unwrap().rank.toNumber();
    members.push({ address, rank });
  }

  return members;
}

export default function useFetchFellowshipMembers() {
  const api = useContextApi();
  const trigger = useSelector(fellowshipCoreMembersTriggerSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api?.query?.fellowshipCollective?.members) {
      return;
    }

    api.query.fellowshipCollective.members
      .entries()
      .then((collectiveEntries) => {
        const collectiveMembers = normalizeCollectiveMembers(collectiveEntries);
        dispatch(setFellowshipCollectiveMembers(collectiveMembers));
      });
  }, [api, trigger]);
}
