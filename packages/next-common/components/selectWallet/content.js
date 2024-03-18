import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { PageTitleContainer } from "../styled/containers/titleContainer";
import { newErrorToast } from "../../store/reducers/toastSlice";
import PrimaryButton from "next-common/lib/button/primary";
import WalletAddressSelect from "../login/walletAddressSelect";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

export default function SelectWalletContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState();
  const [selectedWallet, setSelectWallet] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const dispatch = useDispatch();
  const { lastConnectedAccount, connect: connectAccount } =
    useConnectedAccountContext();

  const doConnectAddress = async () => {
    if (!selectedAccount?.address) {
      dispatch(newErrorToast("Please select an account"));
      return;
    }

    setIsLoading(true);
    try {
      await connectAccount({
        address: selectedAccount.address,
        wallet: selectedAccount.meta?.source || selectedWallet,
      });
    } catch (e) {
      dispatch(newErrorToast(e.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitleContainer>Select Wallet</PageTitleContainer>

      <div className="space-y-6">
        <WalletAddressSelect
          wallet={wallet}
          setWallet={setWallet}
          selectedWallet={selectedWallet}
          setSelectWallet={setSelectWallet}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          lastUsedAddress={lastConnectedAccount?.address}
        />

        <ButtonWrapper>
          {selectedWallet && (
            <PrimaryButton
              isFill
              isLoading={isLoading}
              onClick={doConnectAddress}
              disabled={!selectedAccount}
            >
              Next
            </PrimaryButton>
          )}
        </ButtonWrapper>
      </div>
    </div>
  );
}
