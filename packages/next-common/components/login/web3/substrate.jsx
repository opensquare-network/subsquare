import { SystemLoading } from "@osn/icons/subsquare";
import { find, some } from "lodash-es";
import AddressSelect from "next-common/components/addressSelect";
import WalletSubstrateOptions from "next-common/components/wallet/options/substrate";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useSubstrateAccounts } from "next-common/hooks/connect/useSubstrateAccounts";
import { useSubstrateWallets } from "next-common/hooks/connect/useSubstrateWallets";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";
import PrimaryButton from "next-common/lib/button/primary";
import { useCallback, useEffect, useState } from "react";
import LoginAddressNotDetectedMessage from "../addressNotDetectedMessage";
import { Label } from "../styled";

export default function LoginWeb3Substrate() {
  const { allWallets } = useSubstrateWallets();
  const [unknownWallet, setUnknownWallet] = useState();
  const [selectedWallet, setSelectedWallet] = useState();
  const [selectedAccount, setSelectedAccount] = useState();
  const { accounts, loading } = useSubstrateAccounts({
    wallet: selectedWallet,
  });
  const [web3Login, web3Loading] = useWeb3Login();
  const { lastConnectedAccount } = useConnectedAccountContext();

  useEffect(() => {
    setSelectedAccount(null);

    if (accounts?.length) {
      if (lastConnectedAccount?.address) {
        const account = find(accounts, {
          address: lastConnectedAccount?.address,
        });

        if (account) {
          setSelectedAccount(account);
          return;
        }
      }

      setSelectedAccount(accounts[0]);
    }
  }, [accounts, lastConnectedAccount?.address, selectedWallet]);

  const onSelectAccount = useCallback(
    async (account) => {
      setSelectedAccount(account);

      if (!some(allWallets, { extensionName: selectedWallet?.extensionName })) {
        const extensionDapp = await import("@polkadot/extension-dapp");
        await extensionDapp.web3Enable("subsquare");
        const injector = await extensionDapp.web3FromSource(
          account.meta?.source,
        );
        setUnknownWallet(injector);
      }
    },
    [allWallets, selectedWallet?.extensionName],
  );

  return (
    <div className="space-y-6">
      <WalletSubstrateOptions
        selectedWallet={selectedWallet}
        onSelect={setSelectedWallet}
      />

      {loading ? (
        <div className="flex items-center justify-center w-full">
          <SystemLoading className="w-5 h-5 text-textDisabled" />
        </div>
      ) : (
        selectedWallet && (
          <div>
            <Label>Choose linked address</Label>
            <AddressSelect
              accounts={accounts}
              selectedAccount={selectedAccount}
              onSelect={onSelectAccount}
            />
          </div>
        )
      )}

      {selectedWallet && (
        <div className="mt-3">
          <PrimaryButton
            className="w-full"
            loading={web3Loading}
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
        </div>
      )}

      {unknownWallet && accounts?.length === 0 && (
        <LoginAddressNotDetectedMessage />
      )}
    </div>
  );
}
