import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { PageTitleContainer } from "../styled/containers/titleContainer";
import { newErrorToast } from "../../store/reducers/toastSlice";
import PrimaryButton from "../buttons/primaryButton";
import { CACHE_KEY } from "../../utils/constants";
import SelectWalletAddress from "../login/selectWalletAddress";
import { useSetConnectedWallet } from "next-common/context/connectedWallet";

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

function rememberConnectAddress(address) {
  localStorage.setItem(CACHE_KEY.lastLoginAddress, address);
}

function rememberConnectExtension(address) {
  localStorage.setItem(CACHE_KEY.lastLoginExtension, address);
}

export default function SelectWalletContent() {
  const [wallet, setWallet] = useState();
  const [selectedWallet, setSelectWallet] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const dispatch = useDispatch();
  const setConnectedWallet = useSetConnectedWallet();

  const doSelectWallet = async () => {
    if (!selectedAccount?.address) {
      dispatch(newErrorToast("Please select an account"));
      return;
    }

    setConnectedWallet(selectedAccount.address);
    rememberConnectAddress(selectedAccount.address);
    rememberConnectExtension(selectedAccount.meta?.source || selectedWallet);
  };

  return (
    <div className="space-y-6">
      <PageTitleContainer>Select Wallet</PageTitleContainer>

      <div className="space-y-6">
        <SelectWalletAddress
          wallet={wallet}
          setWallet={setWallet}
          selectedWallet={selectedWallet}
          setSelectWallet={setSelectWallet}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          lastUsedAddress={localStorage.getItem(CACHE_KEY.lastLoginAddress)}
        />

        <ButtonWrapper>
          {selectedWallet && (
            <PrimaryButton
              isFill
              onClick={doSelectWallet}
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
