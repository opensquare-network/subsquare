import {
  myIdentityDepositSelector,
  myIdentitySubsCountSelector,
  myIdentitySubsDepositSelector,
  myIdentitySubsSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myIdentityDeposits";
import { useSelector } from "react-redux";

export default function useMyIdentityDeposit() {
  const identityDeposit = useSelector(myIdentityDepositSelector);
  const subsDeposit = useSelector(myIdentitySubsDepositSelector);
  const subsCount = useSelector(myIdentitySubsCountSelector);
  const subs = useSelector(myIdentitySubsSelector);

  let totalDeposit = 0n;
  let depositsCount = 0;

  const bnIdentityDeposit = BigInt(identityDeposit || 0);
  const bnSubsDeposit = BigInt(subsDeposit || 0);

  if (bnIdentityDeposit) {
    totalDeposit += bnIdentityDeposit;
    depositsCount += 1;
  }

  if (bnSubsDeposit) {
    totalDeposit += bnSubsDeposit;
    depositsCount += subsCount;
  }

  return {
    totalDeposit: totalDeposit.toString(),
    depositsCount,
    subs,
  };
}
