import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
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

  useEffect(() => {
    dispatch(setProfileIdentityAddress(address));
    dispatch(setProfileIdentityDisplayName(identityName));
    dispatch(setProfileIdentityDeposit(identityDeposit));
    dispatch(setProfileSubsDeposits(subsDeposit));
    dispatch(setProfileSubs(subs));
  }, [identityName, identityDeposit, subsDeposit, subs, dispatch, address]);
}
