import { useSelector } from "react-redux";
import {
  profileIdentityDepositSelector,
  profileIdentitySubsDepositSelector,
  profileIdentitySubsSelector,
  profileMainIdentityNameSelector,
} from "next-common/store/reducers/profile/deposits/identity";
import { getIdentityDepositData } from "next-common/hooks/useMyIdentityDeposit";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

export default function useProfileIdentityDepositsData() {
  const address = useProfileAddress();
  const mainIdentityName = useSelector(profileMainIdentityNameSelector);
  const identityDeposit = useSelector(profileIdentityDepositSelector);
  const subsDeposit = useSelector(profileIdentitySubsDepositSelector);
  const subs = useSelector(profileIdentitySubsSelector);

  return getIdentityDepositData(
    address,
    mainIdentityName,
    identityDeposit,
    subsDeposit,
    subs,
  );
}
