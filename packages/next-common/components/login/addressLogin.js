import { useState } from "react";
import styled from "styled-components";
import PrimaryButton from "next-common/lib/button/primary";
import WalletAddressSelect from "./walletAddressSelect";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

export default function AddressLogin() {
  const [selectedWallet, setSelectedWallet] = useState();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [web3Error, setWeb3Error] = useState();
  const { lastConnectedAccount } = useConnectedAccountContext();
  const [web3Login, isLoading] = useWeb3Login();

  return (
    <div className="space-y-6">
      <WalletAddressSelect
        selectedWallet={selectedWallet}
        setSelectedWallet={setSelectedWallet}
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
                wallet: selectedWallet?.extensionName,
              });
            }}
            disabled={!selectedAccount}
          >
            Next
          </PrimaryButton>
        )}
      </ButtonWrapper>
    </div>
  );
}
