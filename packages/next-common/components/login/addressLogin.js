import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { newErrorToast } from "../../store/reducers/toastSlice";
import PrimaryButton from "next-common/lib/button/primary";
import { useChain } from "../../context/chain";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import WalletAddressSelect from "./walletAddressSelect";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { encodeAddressToChain } from "next-common/services/address";
import {
  LoginResult,
  setLoginResult,
} from "next-common/store/reducers/userSlice";
import Terms from "./terms";

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

export default function AddressLogin({ setView }) {
  const chain = useChain();
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState();
  const [selectedWallet, setSelectWallet] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [web3Error, setWeb3Error] = useState();
  const dispatch = useDispatch();
  const { closeLoginPopup } = useLoginPopup();
  const { lastConnectedAccount, connect: connectAccount } =
    useConnectedAccountContext();

  const doWeb3Login = async () => {
    if (!selectedAccount?.address) {
      dispatch(newErrorToast("Please select an account"));
      return;
    }

    setIsLoading(true);
    try {
      const address = encodeAddressToChain(selectedAccount.address, chain);
      const accountInfo = {
        address,
        wallet: selectedWallet,
      };
      await connectAccount(accountInfo);
      dispatch(setLoginResult(LoginResult.Connected));

      closeLoginPopup();
    } catch (e) {
      dispatch(newErrorToast(e.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <WalletAddressSelect
        wallet={wallet}
        setWallet={setWallet}
        selectedWallet={selectedWallet}
        setSelectWallet={setSelectWallet}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        web3Error={web3Error}
        setWeb3Error={setWeb3Error}
        lastUsedAddress={lastConnectedAccount?.address}
      />
      <ButtonWrapper>
        {selectedWallet && (
          <PrimaryButton
            className="w-full"
            loading={isLoading}
            onClick={doWeb3Login}
            disabled={!selectedAccount}
          >
            Next
          </PrimaryButton>
        )}
        <div className="text14Medium text-center text-textSecondary">
          Login with{" "}
          <span
            className="text-theme500"
            role="button"
            onClick={() => {
              setView("account");
            }}
          >
            account
          </span>
        </div>
      </ButtonWrapper>
      <Terms />
    </div>
  );
}
