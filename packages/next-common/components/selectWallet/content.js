import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { PageTitleContainer } from "../styled/containers/titleContainer";
import { newErrorToast } from "../../store/reducers/toastSlice";
import PrimaryButton from "../buttons/primaryButton";
import WalletAddressSelect from "../login/walletAddressSelect";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import getStorageAddressInfo from "next-common/utils/getStorageAddressInfo";
import { CACHE_KEY } from "next-common/utils/constants";

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
  const { connect: connectWallet } = useConnectedAccountContext();
  const lastConnectedAddress = getStorageAddressInfo(
    CACHE_KEY.lastConnectedAddress,
  );

  const doConnectAddress = async () => {
    if (!selectedAccount?.address) {
      dispatch(newErrorToast("Please select an account"));
      return;
    }

    connectWallet({
      name: selectedAccount.name,
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
          lastUsedAddress={lastConnectedAddress?.address}
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
