import { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import PrimaryButton from "next-common/lib/button/primary";
import WalletAddressSelect from "./walletAddressSelect";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { setConnectPopupView } from "next-common/store/reducers/connectPopupSlice";
import { useWeb3Login } from "next-common/hooks/connect/web3Login";
import { CONNECT_POPUP_VIEWS } from "next-common/utils/constants";

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

export default function AddressLogin() {
  const [wallet, setWallet] = useState();
  const [selectedWallet, setSelectWallet] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [web3Error, setWeb3Error] = useState();
  const dispatch = useDispatch();
  const { lastConnectedAccount } = useConnectedAccountContext();
  const [web3Login, isLoading] = useWeb3Login();

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
            onClick={() => {
              web3Login({
                account: selectedAccount,
                wallet: selectedWallet,
              });
            }}
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
              dispatch(setConnectPopupView(CONNECT_POPUP_VIEWS.ACCOUNT));
            }}
          >
            account
          </span>
        </div>
      </ButtonWrapper>
    </div>
  );
}
