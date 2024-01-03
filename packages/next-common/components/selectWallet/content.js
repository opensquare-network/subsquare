import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { PageTitleContainer } from "../styled/containers/titleContainer";
import { newErrorToast } from "../../store/reducers/toastSlice";
import PrimaryButton from "../buttons/primaryButton";
import WalletAddressSelect from "../login/walletAddressSelect";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

export default function SelectWalletContent() {
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

    await connectAccount({
      address: selectedAccount.address,
      wallet: selectedAccount.meta?.source || selectedWallet,
    });
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
