import useSubSystemAccount from "./useSubSystemAccount";

export default function useAccountTransferrable(api, address) {
  const { account, isLoading } = useSubSystemAccount(api, address);
  if (isLoading) {
    return {
      transferrable: 0,
      isLoading: true,
    };
  }

  const { free, frozen } = account.data;
  return {
    transferrable: free.toNumber() - frozen.toNumber(),
    isLoading: false,
  };
}
