import {
  myIdentityDepositSelector,
  myIdentitySubsDepositSelector,
  myIdentitySubsSelector,
  myMainIdentityNameSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myIdentityDeposits";
import { useSelector } from "react-redux";

export function getIdentityDepositData(
  mainIdentityName,
  identityDeposit,
  subsDeposit,
  subs,
) {
  const subsCount = subs?.length || 0;

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
    mainIdentityName,
    identityDeposit,
    totalDeposit: totalDeposit.toString(),
    depositsCount,
    subs,
    averageSubDeposit: subsCount
      ? (bnSubsDeposit / BigInt(subsCount)).toString()
      : "0",
  };
}

export default function useMyIdentityDeposit() {
  const mainIdentityName = useSelector(myMainIdentityNameSelector);
  const identityDeposit = useSelector(myIdentityDepositSelector);
  const subsDeposit = useSelector(myIdentitySubsDepositSelector);
  const subs = useSelector(myIdentitySubsSelector);

  return getIdentityDepositData(
    mainIdentityName,
    identityDeposit,
    subsDeposit,
    subs,
  );
}
