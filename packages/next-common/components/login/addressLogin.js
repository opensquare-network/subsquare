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
  const [unknownWallet, setUnknownWallet] = useState();
  const [selectedWallet, setSelectedWallet] = useState();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { lastConnectedAccount } = useConnectedAccountContext();
  const [web3Login, isLoading] = useWeb3Login();

  return (
    <div className="space-y-6">
      <WalletAddressSelect
        unknownWallet={unknownWallet}
        setUnknownWallet={setUnknownWallet}
        selectedWallet={selectedWallet}
        setSelectedWallet={setSelectedWallet}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
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
