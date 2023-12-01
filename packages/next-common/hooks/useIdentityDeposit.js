import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";

export default function useIdentityDeposit(address) {
  const api = useApi();
  const [identity] = useCall(api?.query?.identity?.identityOf, [address]);
  const [subs] = useCall(api?.query?.identity?.subsOf, [address]);

  let deposit = 0n;
  if (subs) {
    deposit += subs[0]?.toBigInt() || 0n;
  }
  if (identity && !identity.isNone) {
    deposit += identity.value.deposit?.toBigInt() || 0n;
  }

  return deposit;
}
