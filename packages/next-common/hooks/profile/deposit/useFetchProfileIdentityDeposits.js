import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import useSubscribeIdentityDeposit from "next-common/hooks/account/deposit/fetch/identity";
import {
  setProfileIdentityAddress,
  setProfileIdentityDeposit,
  setProfileIdentityDisplayName,
  setProfileSubs,
  setProfileSubsDeposits,
} from "next-common/store/reducers/profile/deposits/identity";

export default function useSubProfileIdentityDeposits() {
  const address = useProfileAddress();
  const dispatch = useDispatch();

  const { identityName, identityDeposit, subsDeposit, subs } =
    useSubscribeIdentityDeposit(address);

  const prevIdentityName = useRef(identityName);
  const prevIdentityDeposit = useRef(identityDeposit);
  const prevSubsDeposit = useRef(subsDeposit);
  const prevSubs = useRef(subs);

  useEffect(() => {
    dispatch(setProfileIdentityAddress(address));

    if (prevIdentityName.current !== identityName) {
      dispatch(setProfileIdentityDisplayName(identityName));
      prevIdentityName.current = identityName;
    }

    if (prevIdentityDeposit.current !== identityDeposit) {
      dispatch(setProfileIdentityDeposit(identityDeposit));
      prevIdentityDeposit.current = identityDeposit;
    }

    if (prevSubsDeposit.current !== subsDeposit) {
      dispatch(setProfileSubsDeposits(subsDeposit));
      prevSubsDeposit.current = subsDeposit;
    }

    if (prevSubs.current !== subs) {
      dispatch(setProfileSubs(subs));
      prevSubs.current = subs;
    }
  }, [identityName, identityDeposit, subsDeposit, subs, address, dispatch]);
}
