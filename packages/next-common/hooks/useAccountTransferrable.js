import useSubSystemAccount from "./useSubSystemAccount";
import calcTransferable from "next-common/utils/account/transferable";

export default function useAccountTransferrable(api, address) {
  const { account, isLoading } = useSubSystemAccount(api, address);
  if (isLoading || !api) {
    return {
      transferrable: 0,
      isLoading: true,
    };
  }

  const existentialDeposit = api.consts.balances?.existentialDeposit.toJSON() || 0;
  return {
    transferrable: calcTransferable(account.data.toJSON(), existentialDeposit),
    isLoading: false,
  };
}
