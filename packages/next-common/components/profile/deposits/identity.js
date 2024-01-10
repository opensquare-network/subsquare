import { useSelector } from "react-redux";
import {
  profileIdentityDepositSelector,
  profileIdentitySubsDepositSelector,
  profileIdentitySubsSelector,
  profileMainIdentityNameSelector,
} from "next-common/store/reducers/profile/deposits/identity";
import { getIdentityDepositData } from "next-common/hooks/useMyIdentityDeposit";

export default function useProfileIdentityDepositsData() {
  const mainIdentityName = useSelector(profileMainIdentityNameSelector);
  const identityDeposit = useSelector(profileIdentityDepositSelector);
  const subsDeposit = useSelector(profileIdentitySubsDepositSelector);
  const subs = useSelector(profileIdentitySubsSelector);

  return getIdentityDepositData(
    mainIdentityName,
    identityDeposit,
    subsDeposit,
    subs,
  );
}
