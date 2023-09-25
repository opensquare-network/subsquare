import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { PageTitleContainer } from "../styled/containers/titleContainer";
import { newErrorToast } from "../../store/reducers/toastSlice";
import PrimaryButton from "../buttons/primaryButton";
import WalletAddressSelect from "../login/walletAddressSelect";
import {
  useConnectedAddress,
  useSetConnectedAddress,
} from "next-common/context/connectedAddress";

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
  const connectedAddress = useConnectedAddress();
  const setConnectedAddress = useSetConnectedAddress();

  const doConnectAddress = async () => {
    if (!selectedAccount?.address) {
      dispatch(newErrorToast("Please select an account"));
      return;
    }

    setConnectedAddress({
      address: selectedAccount.address,
      extensionName: selectedAccount.meta?.source || selectedWallet,
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
          lastUsedAddress={connectedAddress?.address}
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
