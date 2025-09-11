import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useLoginPopup } from "../useLoginPopup";
import { useDispatch } from "react-redux";
import { encodeAddressToChain } from "next-common/services/address";
import {
  LoginResult,
  setLoginResult,
} from "next-common/store/reducers/userSlice";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useAsyncFn } from "react-use";
import { useChain } from "next-common/context/chain";

export function useWeb3Login() {
  const chain = useChain();
  const dispatch = useDispatch();
  const { closeLoginPopup } = useLoginPopup();
  const { connect: connectAccount } = useConnectedAccountContext();

  const [state, web3Login] = useAsyncFn(
    async ({ account, wallet }) => {
      if (!account?.address) {
        dispatch(newErrorToast("Please select an account"));
        return;
      }

      try {
        const address = encodeAddressToChain(account.address, chain);
        const accountInfo = {
          address,
          evmAddress: account.evmAddress,
          wallet,
        };
        await connectAccount(accountInfo);
        dispatch(setLoginResult(LoginResult.Connected));

        closeLoginPopup();
      } catch (e) {
        dispatch(newErrorToast(e.message));
      }
    },
    [chain, connectAccount],
  );

  return [web3Login, state.loading];
}
