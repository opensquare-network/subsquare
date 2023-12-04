import {
  myIdentityDepositSelector,
  myIdentitySubsCountSelector,
  myIdentitySubsDepositSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myIdentityDeposits";
import { useSelector } from "react-redux";

export default function useMyIdentityDeposit() {
  const identityDeposit = useSelector(myIdentityDepositSelector);
  const subsDeposit = useSelector(myIdentitySubsDepositSelector);
  const subsCount = useSelector(myIdentitySubsCountSelector);

  let totalDeposit = 0n;
  let depositsCount = 0;

  if (identityDeposit) {
    totalDeposit += identityDeposit;
    depositsCount += 1;
  }

  if (subsDeposit) {
    totalDeposit += subsDeposit;
    depositsCount += subsCount;
  }
  console.log({
    totalDeposit,
    depositsCount,
    identityDeposit,
    subsDeposit,
    subsCount,
  });

  return {
    totalDeposit,
    depositsCount,
  };
}
